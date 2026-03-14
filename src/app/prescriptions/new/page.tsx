"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AIInteraction {
  medication1: string;
  medication2: string;
  severity: "high" | "medium" | "low";
  warning: string;
  mechanism: string;
}

interface AIAlternative {
  name: string;
  reason: string;
}

interface AIResult {
  interactions: AIInteraction[];
  alternatives: AIAlternative[];
  overallRisk: "safe" | "low" | "medium" | "high";
  clinicalSummary: string;
  fallback?: boolean;
}

function NewPrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient");

  const [formData, setFormData] = useState({
    patient_id: preselectedPatient || "",
    medication_id: "",
    dose: "",
    frequency: "",
    duration: "",
    notes: "",
    pharmacy: "",
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [, setSelectedPatient] = useState<any>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [{ data: patientsData }, { data: medsData }] = await Promise.all([
        supabase.from("patients").select("id, name, dob, email").eq("doctor_id", session.user.id).order("name"),
        supabase.from("medications").select("*").order("name"),
      ]);

      setPatients(patientsData || []);
      setMedications(medsData || []);

      if (preselectedPatient && patientsData) {
        const p = patientsData.find((x: any) => x.id === preselectedPatient);
        if (p) setSelectedPatient(p);
      }
    };
    fetchData();
  }, [preselectedPatient]);

  const runAICheck = async (medicationName: string, patientId: string) => {
    setAiResult(null);
    setAiLoading(true);

    const supabase = createClient();

    // Get patient's active medications
    const { data: activePrescriptions } = await supabase
      .from("prescriptions")
      .select("medications(name)")
      .eq("patient_id", patientId)
      .eq("status", "active");

    const existingMeds = (activePrescriptions || [])
      .map((p: any) => p.medications?.name)
      .filter(Boolean);

    // Get patient info for AI context
    const patient = patients.find((p) => p.id === patientId);
    const age = patient?.dob
      ? Math.floor((Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    try {
      const response = await fetch("/api/check-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newMedication: medicationName,
          existingMedications: existingMeds,
          patientAge: age,
          patientName: patient?.name,
        }),
      });

      if (!response.ok) throw new Error("AI check failed");
      const result: AIResult = await response.json();
      setAiResult(result);
    } catch {
      setAiResult({
        interactions: [],
        alternatives: [],
        overallRisk: "safe",
        clinicalSummary: "AI analysis unavailable. Please use clinical judgment.",
        fallback: true,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleMedicationChange = async (medicationId: string) => {
    setFormData({ ...formData, medication_id: medicationId });
    setAiResult(null);
    const med = medications.find((m) => m.id === medicationId);
    setSelectedMedication(med || null);
    if (med && formData.patient_id) {
      await runAICheck(med.name, formData.patient_id);
    }
  };

  const handlePatientChange = async (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient || null);
    setFormData({ ...formData, patient_id: patientId, medication_id: "" });
    setAiResult(null);
    setSelectedMedication(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    const { data: prescription, error: insertError } = await supabase
      .from("prescriptions")
      .insert({
        doctor_id: session.user.id,
        patient_id: formData.patient_id,
        medication_id: formData.medication_id,
        dose: formData.dose,
        frequency: formData.frequency,
        duration: formData.duration || null,
        notes: formData.notes || null,
        pharmacy: formData.pharmacy || null,
        status: "active",
      })
      .select()
      .single();

    if (insertError) { setError(insertError.message); setLoading(false); return; }

    // Save medication history
    await supabase.from("medication_history").insert({
      patient_id: formData.patient_id,
      prescription_id: prescription.id,
      start_date: new Date().toISOString().split("T")[0],
    });

    // Save AI-detected alerts
    if (aiResult?.interactions && aiResult.interactions.length > 0) {
      const alertInserts = aiResult.interactions.map((ix) => ({
        prescription_id: prescription.id,
        message: ix.warning,
        severity: ix.severity,
      }));
      await supabase.from("alerts").insert(alertInserts);
    }

    router.push(`/patients/${formData.patient_id}`);
  };

  const riskColors = {
    safe: "bg-green-50 border-green-200 text-green-800",
    low: "bg-blue-50 border-blue-200 text-blue-800",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-800",
    high: "bg-red-50 border-red-200 text-red-800",
  };

  const severityBadge = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/prescriptions" className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to prescriptions</span>
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Prescription</h1>
              <p className="text-xs text-purple-600 font-medium">AI-Powered Drug Interaction Analysis</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Powered by Llama 3.3-70B — real-time clinical interaction analysis
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient */}
            <div>
              <label className="label" htmlFor="patient">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                id="patient"
                value={formData.patient_id}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Medication */}
            <div>
              <label className="label" htmlFor="medication">
                Medication <span className="text-red-500">*</span>
              </label>
              <select
                id="medication"
                value={formData.medication_id}
                onChange={(e) => handleMedicationChange(e.target.value)}
                className="input-field"
                required
                disabled={!formData.patient_id}
              >
                <option value="">{formData.patient_id ? "Select a medication" : "Select a patient first"}</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} {med.dosage ? `(${med.dosage})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Medication info */}
            {selectedMedication && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800">{selectedMedication.name}</p>
                {selectedMedication.description && (
                  <p className="text-xs text-blue-600 mt-1">{selectedMedication.description}</p>
                )}
              </div>
            )}

            {/* AI Analysis */}
            {aiLoading && (
              <div className="border border-purple-200 bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-purple-400 border-t-purple-700 rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-purple-800">
                      AI analyzing drug interactions...
                    </p>
                    <p className="text-xs text-purple-600 mt-0.5">
                      Llama 3.3-70B is reviewing {selectedMedication?.name} against patient&apos;s medications
                    </p>
                  </div>
                </div>
              </div>
            )}

            {aiResult && !aiLoading && (
              <div className="space-y-3">
                {/* Overall risk banner */}
                <div className={`border rounded-xl p-4 ${riskColors[aiResult.overallRisk]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={aiResult.overallRisk === "safe"
                            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          }
                        />
                      </svg>
                      <span className="text-sm font-bold uppercase tracking-wide">
                        AI Assessment: {aiResult.overallRisk === "safe" ? "No Interactions Found" : `${aiResult.overallRisk} Risk`}
                      </span>
                    </div>
                    <span className="text-xs bg-white bg-opacity-60 px-2 py-0.5 rounded-full font-medium">
                      Llama 3.3-70B
                    </span>
                  </div>
                  <p className="text-sm">{aiResult.clinicalSummary}</p>
                </div>

                {/* Individual interactions */}
                {aiResult.interactions.map((ix, i) => (
                  <div key={i} className={`border rounded-lg p-4 ${
                    ix.severity === "high" ? "bg-red-50 border-red-200" :
                    ix.severity === "medium" ? "bg-yellow-50 border-yellow-200" :
                    "bg-blue-50 border-blue-200"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-800">
                          {ix.medication1} + {ix.medication2}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${severityBadge[ix.severity]}`}>
                        {ix.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{ix.warning}</p>
                    {ix.mechanism && (
                      <p className="text-xs text-gray-500 mt-1 italic">Mechanism: {ix.mechanism}</p>
                    )}
                  </div>
                ))}

                {/* AI-suggested alternatives */}
                {aiResult.alternatives && aiResult.alternatives.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-purple-800 mb-2 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI-Suggested Alternatives</span>
                    </p>
                    <div className="space-y-2">
                      {aiResult.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex-shrink-0 mt-0.5">
                            {alt.name}
                          </span>
                          <span className="text-xs text-purple-700">{alt.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dose & Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="dose">
                  Dose <span className="text-red-500">*</span>
                </label>
                <input
                  id="dose"
                  type="text"
                  value={formData.dose}
                  onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="frequency">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                  <option value="Once weekly">Once weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="duration">Duration</label>
              <input
                id="duration"
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                placeholder="e.g., 7 days, 2 weeks, 1 month"
              />
            </div>

            <div>
              <label className="label" htmlFor="pharmacy">Pharmacy</label>
              <input
                id="pharmacy"
                type="text"
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                className="input-field"
                placeholder="e.g., City Pharmacy, CVS on Main St"
              />
            </div>

            <div>
              <label className="label" htmlFor="notes">Notes / Instructions</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Take with food, avoid grapefruit juice..."
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading || aiLoading}
                className="btn-primary flex-1 py-3"
              >
                {loading ? "Creating prescription..." : "Create Prescription"}
              </button>
              <Link href="/prescriptions" className="btn-secondary py-3 px-6">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewPrescriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <NewPrescriptionForm />
    </Suspense>
  );
}

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const [{ data: patientsData }, { data: medsData }] = await Promise.all([
        supabase.from("patients").select("id, name, dob, email, allergies").eq("doctor_id", session.user.id).order("name"),
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

    const { data: activePrescriptions } = await supabase
      .from("prescriptions")
      .select("medications(name)")
      .eq("patient_id", patientId)
      .eq("status", "active");

    const existingMeds = (activePrescriptions || [])
      .map((p: any) => p.medications?.name)
      .filter(Boolean);

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
          patientAllergies: patient?.allergies ? patient.allergies.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

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

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    await supabase.from("medication_history").insert({
      patient_id: formData.patient_id,
      prescription_id: prescription.id,
      start_date: new Date().toISOString().split("T")[0],
    });

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
    safe: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
    low: "border-sky-400/20 bg-sky-500/10 text-sky-100",
    medium: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    high: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  };

  const severityBadge = {
    high: "bg-rose-400/15 text-rose-200 ring-1 ring-rose-400/20",
    medium: "bg-amber-400/15 text-amber-100 ring-1 ring-amber-400/20",
    low: "bg-sky-400/15 text-sky-100 ring-1 ring-sky-400/20",
  };

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/prescriptions" className="back-link mb-6 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to prescriptions
        </Link>

        <div className="card">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300 ring-1 ring-violet-400/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="eyebrow mb-2 text-violet-300/80">AI-assisted prescribing</p>
              <h1 className="page-title">New Prescription</h1>
              <p className="mt-1 text-sm text-slate-400">
                Real-time clinical interaction analysis while you prescribe.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="patient">
                Patient <span className="text-rose-300">*</span>
              </label>
              <select id="patient" value={formData.patient_id} onChange={(e) => handlePatientChange(e.target.value)} className="input-field" required>
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="medication">
                Medication <span className="text-rose-300">*</span>
              </label>
              <select id="medication" value={formData.medication_id} onChange={(e) => handleMedicationChange(e.target.value)} className="input-field" required disabled={!formData.patient_id}>
                <option value="">{formData.patient_id ? "Select a medication" : "Select a patient first"}</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} {med.dosage ? `(${med.dosage})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedMedication && (
              <div className="rounded-2xl border border-sky-400/15 bg-sky-500/8 p-4">
                <p className="text-sm font-semibold text-sky-100">{selectedMedication.name}</p>
                {selectedMedication.description && (
                  <p className="mt-1 text-xs text-slate-300">{selectedMedication.description}</p>
                )}
              </div>
            )}

            {aiLoading && (
              <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-violet-100">AI analyzing drug interactions...</p>
                    <p className="mt-0.5 text-xs text-violet-200/80">
                      Reviewing {selectedMedication?.name} against the patient&apos;s active medications
                    </p>
                  </div>
                </div>
              </div>
            )}

            {aiResult && !aiLoading && (
              <div className="space-y-3">
                <div className={`rounded-2xl border p-4 ${riskColors[aiResult.overallRisk]}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={aiResult.overallRisk === "safe" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
                      </svg>
                      <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                        {aiResult.overallRisk === "safe" ? "No interactions found" : `${aiResult.overallRisk} risk`}
                      </span>
                    </div>
                    <span className="rounded-full bg-black/15 px-2.5 py-1 text-xs font-medium text-current">
                      Llama 3.3-70B
                    </span>
                  </div>
                  <p className="text-sm">{aiResult.clinicalSummary}</p>
                </div>

                {aiResult.interactions.map((ix, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 ${
                      ix.severity === "high"
                        ? "border-rose-400/20 bg-rose-500/10"
                        : ix.severity === "medium"
                          ? "border-amber-400/20 bg-amber-500/10"
                          : "border-sky-400/20 bg-sky-500/10"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-100">
                          {ix.medication1} + {ix.medication2}
                        </span>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${severityBadge[ix.severity]}`}>
                        {ix.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{ix.warning}</p>
                    {ix.mechanism && (
                      <p className="mt-1 text-xs italic text-slate-400">Mechanism: {ix.mechanism}</p>
                    )}
                  </div>
                ))}

                {aiResult.alternatives && aiResult.alternatives.length > 0 && (
                  <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI-Suggested Alternatives
                    </p>
                    <div className="space-y-2">
                      {aiResult.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="rounded-full bg-violet-400/15 px-2.5 py-1 text-xs font-medium text-violet-100 ring-1 ring-violet-400/20">
                            {alt.name}
                          </span>
                          <span className="text-xs text-slate-300">{alt.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="dose">
                  Dose <span className="text-rose-300">*</span>
                </label>
                <input id="dose" type="text" value={formData.dose} onChange={(e) => setFormData({ ...formData, dose: e.target.value })} className="input-field" placeholder="e.g., 500mg" required />
              </div>
              <div>
                <label className="label" htmlFor="frequency">
                  Frequency <span className="text-rose-300">*</span>
                </label>
                <select id="frequency" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} className="input-field" required>
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
              <input id="duration" type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input-field" placeholder="e.g., 7 days, 2 weeks, 1 month" />
            </div>

            <div>
              <label className="label" htmlFor="pharmacy">Pharmacy</label>
              <input id="pharmacy" type="text" value={formData.pharmacy} onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })} className="input-field" placeholder="e.g., City Pharmacy, CVS on Main St" />
            </div>

            <div>
              <label className="label" htmlFor="notes">Notes / Instructions</label>
              <textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-field min-h-28" rows={4} placeholder="Take with food, avoid grapefruit juice..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading || aiLoading} className="btn-primary flex-1 py-3">
                {loading ? "Creating prescription..." : "Create Prescription"}
              </button>
              <Link href="/prescriptions" className="btn-secondary px-6 py-3">
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
    <Suspense
      fallback={
        <div className="app-shell flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-sky-300/20 border-t-sky-300 animate-spin" />
        </div>
      }
    >
      <NewPrescriptionForm />
    </Suspense>
  );
}

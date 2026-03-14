import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function PatientMedicationsPage() {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "patient") redirect("/dashboard");

  const { data: patientRecord } = await supabase
    .from("patients")
    .select("*")
    .eq("email", user.email)
    .single();

  let prescriptions: any[] = [];

  if (patientRecord) {
    const { data } = await supabase
      .from("prescriptions")
      .select("*, medications(name, dosage, description, interaction_notes)")
      .eq("patient_id", patientRecord.id)
      .order("created_at", { ascending: false });

    prescriptions = data || [];
  }

  const active = prescriptions.filter((p) => p.status === "active");
  const past = prescriptions.filter((p) => p.status !== "active");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="patient" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Medications</h1>
          <p className="text-slate-500 text-sm mt-1">
            All your prescriptions and medication history
          </p>
        </div>

        {/* Not linked state */}
        {!patientRecord && (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Account not linked</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Your account hasn&apos;t been linked to a patient record yet. Please contact your doctor to get set up.
            </p>
          </div>
        )}

        {patientRecord && (
          <>
            {/* Active medications */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-base font-bold text-slate-900">Active Medications</h2>
                <span className="badge-active">{active.length} active</span>
              </div>

              {active.length > 0 ? (
                <div className="space-y-4">
                  {active.map((rx: any) => (
                    <div
                      key={rx.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-100 transition-all duration-200"
                    >
                      {/* Gradient header stripe */}
                      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                      <div className="p-6">
                        {/* Top row: name + badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                {rx.medications?.name}
                              </h3>
                              {rx.medications?.dosage && (
                                <p className="text-sm text-slate-500 mt-0.5">
                                  Standard dose: {rx.medications.dosage}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="badge-active">Active</span>
                        </div>

                        {/* Detail grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-xl mb-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              Prescribed Dose
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{rx.dose}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              Frequency
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{rx.frequency}</p>
                          </div>
                          {rx.duration && (
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Duration
                              </p>
                              <p className="text-sm font-semibold text-slate-800">{rx.duration}</p>
                            </div>
                          )}
                          {rx.pharmacy && (
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Pharmacy
                              </p>
                              <p className="text-sm font-semibold text-slate-800">{rx.pharmacy}</p>
                            </div>
                          )}
                        </div>

                        {rx.notes && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                              Instructions
                            </p>
                            <p className="text-sm text-slate-700">{rx.notes}</p>
                          </div>
                        )}

                        {rx.medications?.description && (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              About this medication
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {rx.medications.description}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-slate-400 mt-4">
                          Prescribed on {new Date(rx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No active medications</p>
                  <p className="text-xs text-slate-400 mt-1">You currently have no active prescriptions.</p>
                </div>
              )}
            </div>

            {/* Past medications history */}
            {past.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-base font-bold text-slate-900">Medication History</h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {past.length} records
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Medication</th>
                          <th>Dose</th>
                          <th>Frequency</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {past.map((rx: any) => (
                          <tr key={rx.id}>
                            <td>
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                  {rx.medications?.name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="text-sm text-slate-600">{rx.dose}</span>
                            </td>
                            <td>
                              <span className="text-sm text-slate-600">{rx.frequency}</span>
                            </td>
                            <td>
                              <span className={
                                rx.status === "completed"
                                  ? "badge-completed"
                                  : "badge-cancelled"
                              }>
                                {rx.status}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm text-slate-500">
                                {new Date(rx.created_at).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

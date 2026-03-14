import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div className="app-shell">
      <Navbar role="patient" userName={profile.full_name} />

      <main className="page-container space-y-8">
        <div>
          <p className="eyebrow mb-2 text-emerald-300/75">Medication center</p>
          <h1 className="page-title">My Medications</h1>
          <p className="page-copy mt-1">All your prescriptions and medication history</p>
        </div>

        {!patientRecord && (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-amber-400/12 text-amber-200 ring-1 ring-amber-400/20">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Account not linked</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Your account has not been linked to a patient record yet. Please contact your doctor.
            </p>
          </div>
        )}

        {patientRecord && (
          <>
            <div>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">Active Medications</h2>
                <span className="badge-active">{active.length} active</span>
              </div>

              {active.length > 0 ? (
                <div className="space-y-4">
                  {active.map((rx: any) => (
                    <div key={rx.id} className="card">
                      <div className="mb-5 flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{rx.medications?.name}</h3>
                            {rx.medications?.dosage && (
                              <p className="mt-1 text-sm text-slate-400">
                                Standard dose: {rx.medications.dosage}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="badge-active">Active</span>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-4 rounded-[24px] border border-white/5 bg-white/[0.03] p-4 sm:grid-cols-4">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Dose
                          </p>
                          <p className="text-sm font-semibold text-slate-100">{rx.dose}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Frequency
                          </p>
                          <p className="text-sm font-semibold text-slate-100">{rx.frequency}</p>
                        </div>
                        {rx.duration && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Duration
                            </p>
                            <p className="text-sm font-semibold text-slate-100">{rx.duration}</p>
                          </div>
                        )}
                        {rx.pharmacy && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Pharmacy
                            </p>
                            <p className="text-sm font-semibold text-slate-100">{rx.pharmacy}</p>
                          </div>
                        )}
                      </div>

                      {rx.notes && (
                        <div className="mb-4 rounded-2xl border border-sky-400/15 bg-sky-500/8 p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
                            Instructions
                          </p>
                          <p className="text-sm text-slate-200">{rx.notes}</p>
                        </div>
                      )}

                      {rx.medications?.description && (
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            About this medication
                          </p>
                          <p className="text-sm leading-relaxed text-slate-300">
                            {rx.medications.description}
                          </p>
                        </div>
                      )}

                      <p className="mt-4 text-xs text-slate-500">
                        Prescribed on {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">No active medications</p>
                  <p className="mt-1 text-xs text-slate-500">You currently have no active prescriptions.</p>
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">Medication History</h2>
                  <span className="badge-completed">{past.length} records</span>
                </div>

                <div className="card overflow-hidden p-0">
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
                                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/8 text-slate-400 ring-1 ring-white/10">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-slate-200">
                                  {rx.medications?.name}
                                </span>
                              </div>
                            </td>
                            <td><span className="text-sm text-slate-300">{rx.dose}</span></td>
                            <td><span className="text-sm text-slate-300">{rx.frequency}</span></td>
                            <td>
                              <span className={rx.status === "completed" ? "badge-completed" : "badge-cancelled"}>
                                {rx.status}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm text-slate-400">
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
      <Footer />
    </div>
  );
}

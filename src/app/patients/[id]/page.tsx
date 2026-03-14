import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrescriptionStatusUpdate from "@/components/PrescriptionStatusUpdate";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const avatarColors = [
  "from-sky-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-rose-500 to-rose-600",
  "from-amber-500 to-amber-600",
  "from-indigo-500 to-indigo-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "doctor") redirect("/patient/dashboard");

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("doctor_id", user.id)
    .single();

  if (!patient) notFound();

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("*, medications(name, dosage, description)")
    .eq("patient_id", id)
    .order("created_at", { ascending: false });

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .in("prescription_id", (prescriptions || []).map((p: any) => p.id))
    .order("created_at", { ascending: false });

  const age = patient.dob
    ? Math.floor(
        (new Date().getTime() - new Date(patient.dob).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  const avatarGradient = avatarColors[patient.name.charCodeAt(0) % avatarColors.length];
  const initials = getInitials(patient.name);
  const activeRx = prescriptions?.filter((p: any) => p.status === "active").length ?? 0;

  return (
    <div className="app-shell">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="page-container">
        <Link href="/patients" className="back-link mb-6 group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to patients
        </Link>

        <div className="profile-hero mb-6 overflow-hidden rounded-[30px] border border-white/10 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
          <div className={`relative h-28 bg-gradient-to-r ${avatarGradient}`}>
            <div className="absolute inset-0 opacity-25">
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute bottom-0 left-12 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-12 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className={`flex h-24 w-24 items-center justify-center rounded-[28px] border-4 border-slate-950 bg-gradient-to-br ${avatarGradient} text-2xl font-semibold text-white shadow-[0_20px_45px_rgba(2,6,23,0.45)]`}>
                  {initials}
                </div>
                <div className="mb-1">
                  <p className="eyebrow mb-2">Patient profile</p>
                  <h1 className="text-3xl font-semibold text-white">{patient.name}</h1>
                  {age && (
                    <p className="mt-1 text-sm text-slate-400">
                      {age} years old · DOB: {new Date(patient.dob).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <Link href={`/prescriptions/new?patient=${patient.id}`} className="btn-primary self-start sm:self-auto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Prescription
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-200">{patient.email || "Not provided"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-200">{patient.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Patient Since</p>
                <p className="text-sm font-medium text-slate-200">{new Date(patient.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Total Rx</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-200">{prescriptions?.length || 0}</p>
                  {activeRx > 0 && <span className="badge-active">{activeRx} active</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Allergies</p>
                {patient.allergies ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.split(',').map((a: string) => a.trim()).filter(Boolean).map((allergy: string) => (
                      <span key={allergy} className="text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">{allergy}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">None on file</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Treatment history</p>
                <h2 className="text-lg font-semibold text-white">Prescription History</h2>
              </div>
              <span className="text-xs text-slate-500">{prescriptions?.length || 0} total</span>
            </div>

            {prescriptions && prescriptions.length > 0 ? (
              prescriptions.map((rx: any) => (
                <div key={rx.id} className="card">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        rx.status === "active"
                          ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20"
                          : rx.status === "completed"
                            ? "bg-white/8 text-slate-300 ring-1 ring-white/10"
                            : "bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/20"
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rx.medications?.name}</p>
                        <p className="mt-0.5 text-sm text-slate-400">
                          {rx.dose} · {rx.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={
                          rx.status === "active"
                            ? "badge-active"
                            : rx.status === "completed"
                              ? "badge-completed"
                              : "badge-cancelled"
                        }
                      >
                        {rx.status}
                      </span>
                      <p className="text-xs text-slate-500">{new Date(rx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {(rx.duration || rx.pharmacy) && (
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:grid-cols-3">
                      {rx.duration && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Duration</p>
                          <p className="mt-1 text-sm text-slate-300">{rx.duration}</p>
                        </div>
                      )}
                      {rx.pharmacy && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Pharmacy</p>
                          <p className="mt-1 text-sm text-slate-300">{rx.pharmacy}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {rx.notes && <p className="mt-4 text-xs italic text-slate-500">{rx.notes}</p>}
                  <PrescriptionStatusUpdate prescriptionId={rx.id} currentStatus={rx.status} />
                </div>
              ))
            ) : (
              <div className="card flex flex-col items-center justify-center py-14 text-center">
                <svg className="mb-3 h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">No prescriptions for this patient</p>
                <Link href={`/prescriptions/new?patient=${patient.id}`} className="btn-primary mt-4 text-sm">
                  Create first prescription
                </Link>
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Safety flags</p>
                <h2 className="text-lg font-semibold text-white">Interaction Alerts</h2>
              </div>
              {(alerts?.length ?? 0) > 0 && <span className="badge-cancelled">{alerts?.length}</span>}
            </div>

            {alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl border px-4 py-4 ${
                      alert.severity === "high"
                        ? "border-rose-400/20 bg-rose-500/10"
                        : alert.severity === "medium"
                          ? "border-amber-400/20 bg-amber-500/10"
                          : "border-sky-400/20 bg-sky-500/10"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-rose-400"
                          : alert.severity === "medium"
                            ? "bg-amber-300"
                            : "bg-sky-300"
                      }`} />
                      <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                        alert.severity === "high"
                          ? "text-rose-200"
                          : alert.severity === "medium"
                            ? "text-amber-100"
                            : "text-sky-100"
                      }`}>
                        {alert.severity} risk
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">All clear</p>
                <p className="mt-1 text-xs text-slate-500">No interaction alerts</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function PatientDashboardPage() {
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

  let activeMeds: any[] = [];
  let recentPrescriptions: any[] = [];

  if (patientRecord) {
    const [{ data: active }, { data: recent }] = await Promise.all([
      supabase
        .from("prescriptions")
        .select("*, medications(name, dosage, description)")
        .eq("patient_id", patientRecord.id)
        .eq("status", "active"),
      supabase
        .from("prescriptions")
        .select("*, medications(name, dosage)")
        .eq("patient_id", patientRecord.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    activeMeds = active || [];
    recentPrescriptions = recent || [];
  }

  const firstName = profile.full_name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-shell">
      <Navbar role="patient" userName={profile.full_name} />

      <main className="page-container space-y-8">
        <div className="patient-hero relative overflow-hidden rounded-[30px] border border-white/10 p-6 sm:p-8 shadow-[0_28px_90px_rgba(2,6,23,0.5)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3 text-emerald-300/80">Your treatment overview</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                {greeting}, {firstName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Track your current medications, prescription history, and active treatment plan in
                one place.
              </p>
            </div>
            <Link href="/patient/medications" className="btn-secondary self-start sm:self-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              View Medications
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="stat-card">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              {activeMeds.length > 0 && <span className="badge-active">{activeMeds.length} active</span>}
            </div>
            <p className="text-4xl font-semibold text-white">{activeMeds.length}</p>
            <p className="mt-1 text-sm text-slate-400">Active medications in your current plan</p>
            <Link href="/patient/medications" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              View medications
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="stat-card">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="badge-completed">History</span>
            </div>
            <p className="text-4xl font-semibold text-white">{recentPrescriptions.length}</p>
            <p className="mt-1 text-sm text-slate-400">Prescriptions recorded on your account</p>
            <p className="mt-5 text-sm text-slate-500">Complete medication history in your portal.</p>
          </div>
        </div>

        {activeMeds.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2 text-emerald-300/75">Current treatment</p>
                <h2 className="text-lg font-semibold text-white">Current medications</h2>
              </div>
              <Link href="/patient/medications" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeMeds.map((rx: any) => (
                <div key={rx.id} className="card">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <span className="badge-active">Active</span>
                  </div>

                  <h3 className="text-base font-semibold text-white">{rx.medications?.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {rx.dose} · {rx.frequency}
                  </p>

                  {rx.duration && (
                    <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
                      {rx.duration}
                    </div>
                  )}

                  {rx.notes && <p className="mt-3 text-xs italic text-slate-500">{rx.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="mb-5">
            <p className="eyebrow mb-2 text-emerald-300/75">Medication timeline</p>
            <h2 className="text-lg font-semibold text-white">Recent prescriptions</h2>
            <p className="text-xs text-slate-500">Last 5 prescriptions on your account</p>
          </div>

          {recentPrescriptions.length > 0 ? (
            <div className="space-y-2">
              {recentPrescriptions.map((rx: any) => (
                <div
                  key={rx.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 hover:border-emerald-400/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      rx.status === "active" ? "bg-emerald-400/15 text-emerald-300" : "bg-white/8 text-slate-400"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{rx.medications?.name}</p>
                      <p className="text-xs text-slate-500">
                        {rx.dose} · {rx.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
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
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(rx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-300">No prescriptions found</p>
              {!patientRecord && (
                <p className="mt-2 max-w-xs text-xs text-slate-500">
                  Your account is not linked to a patient record yet. Please contact your doctor.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

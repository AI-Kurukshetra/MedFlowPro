import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RefillApproval from "@/components/RefillApproval";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "doctor") redirect("/patient/dashboard");

  const [
    { count: patientCount },
    { count: activePrescriptionCount },
    { data: recentPrescriptions },
    { data: recentAlerts },
    { data: pendingRefills },
  ] = await Promise.all([
    supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", user.id),
    supabase
      .from("prescriptions")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", user.id)
      .eq("status", "active"),
    supabase
      .from("prescriptions")
      .select("*, patients(name), medications(name)")
      .eq("doctor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("alerts")
      .select("*, prescriptions(*, patients(name), medications(name))")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("refill_requests")
      .select("*, prescriptions(*, patients(name), medications(name))")
      .eq("doctor_id", user.id)
      .eq("status", "pending")
      .order("requested_at", { ascending: false }),
  ]);

  const firstName = profile.full_name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-shell">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="page-container space-y-8">
        <div className="dashboard-hero relative overflow-hidden rounded-[30px] border border-white/10 p-6 sm:p-8 shadow-[0_28px_90px_rgba(2,6,23,0.5)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 right-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">Today&apos;s clinical command center</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                {greeting}, Dr. {firstName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Review live medication activity, patient volume, and safety alerts before the next
                prescription round.
              </p>
            </div>
            <Link href="/prescriptions/new" className="btn-primary self-start sm:self-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Prescription
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="stat-card">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                Patient base
              </span>
            </div>
            <p className="text-4xl font-semibold text-white">{patientCount || 0}</p>
            <p className="mt-1 text-sm text-slate-400">Registered patients under your care</p>
            <Link href="/patients" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200">
              View all patients
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="stat-card">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="badge-active">Live</span>
            </div>
            <p className="text-4xl font-semibold text-white">{activePrescriptionCount || 0}</p>
            <p className="mt-1 text-sm text-slate-400">Active prescriptions currently monitored</p>
            <Link href="/prescriptions" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200">
              View prescriptions
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="stat-card">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <span className={recentAlerts?.length ? "badge-cancelled" : "badge-active"}>
                {recentAlerts?.length ? "Attention" : "Stable"}
              </span>
            </div>
            <p className="text-4xl font-semibold text-white">{recentAlerts?.length || 0}</p>
            <p className="mt-1 text-sm text-slate-400">Recent interaction alerts requiring review</p>
            <p className="mt-5 text-sm text-slate-500">AI-backed checks on newly issued medication plans.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Prescription activity</p>
                <h2 className="text-lg font-semibold text-white">Recent prescriptions</h2>
                <p className="text-xs text-slate-500">Last 5 prescriptions issued</p>
              </div>
              <Link href="/prescriptions/new" className="btn-secondary text-xs">
                New
              </Link>
            </div>

            {recentPrescriptions && recentPrescriptions.length > 0 ? (
              <div className="space-y-2">
                {recentPrescriptions.map((rx: any) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 hover:border-sky-400/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sm font-semibold text-sky-200">
                        {rx.patients?.name?.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{rx.patients?.name}</p>
                        <p className="text-xs text-slate-500">
                          {rx.medications?.name} · {rx.dose}
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
                <svg className="mb-4 h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-sm text-slate-400">No prescriptions yet</p>
                <Link href="/prescriptions/new" className="btn-primary mt-4 text-sm">
                  Issue first prescription
                </Link>
              </div>
            )}
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2">Safety monitoring</p>
                <h2 className="text-lg font-semibold text-white">Drug interaction alerts</h2>
                <p className="text-xs text-slate-500">AI-generated flags for medication conflicts</p>
              </div>
              {(recentAlerts?.length ?? 0) > 0 && (
                <span className="badge-cancelled">{recentAlerts?.length} active</span>
              )}
            </div>

            {recentAlerts && recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert: any) => (
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
                      <span
                        className={`h-2 w-2 rounded-full ${
                          alert.severity === "high"
                            ? "bg-rose-400"
                            : alert.severity === "medium"
                              ? "bg-amber-300"
                              : "bg-sky-300"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                          alert.severity === "high"
                            ? "text-rose-200"
                            : alert.severity === "medium"
                              ? "text-amber-100"
                              : "text-sky-100"
                        }`}
                      >
                        {alert.severity} risk
                      </span>
                      <span className="text-xs text-slate-500">
                        {alert.prescriptions?.patients?.name}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-emerald-400/20 bg-emerald-500/8 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-emerald-100">All clear</p>
                <p className="mt-1 text-xs text-emerald-200/70">No drug interaction alerts detected</p>
              </div>
            )}
          </div>
        </div>

        <RefillApproval requests={pendingRefills || []} />

        <div>
          <p className="eyebrow mb-4">Quick actions</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/patients/new" className="card-hover flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Add patient</p>
                <p className="text-xs text-slate-500">Register a new patient profile</p>
              </div>
            </Link>

            <Link href="/prescriptions/new" className="card-hover flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">New prescription</p>
                <p className="text-xs text-slate-500">Issue AI-assisted treatment</p>
              </div>
            </Link>

            <Link href="/patients" className="card-hover flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/12 text-violet-300 ring-1 ring-violet-400/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">View records</p>
                <p className="text-xs text-slate-500">Review patient medication history</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

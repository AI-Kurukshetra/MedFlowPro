import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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

  // Fetch stats
  const [
    { count: patientCount },
    { count: activePrescriptionCount },
    { data: recentPrescriptions },
    { data: recentAlerts },
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
  ]);

  const firstName = profile.full_name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero welcome strip */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 overflow-hidden shadow-lg">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 right-24 w-36 h-36 bg-indigo-500/20 rounded-full pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                {greeting},
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Dr. {firstName} 👋
              </h1>
              <p className="text-blue-200 mt-1.5 text-sm">
                Here&apos;s your practice overview for today
              </p>
            </div>
            <Link
              href="/prescriptions/new"
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Prescription
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Patients */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{patientCount || 0}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Registered Patients</p>
            <Link
              href="/patients"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-4 group"
            >
              View all patients
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Active prescriptions */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200/60">Live</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{activePrescriptionCount || 0}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Active Prescriptions</p>
            <Link
              href="/prescriptions"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-4 group"
            >
              View prescriptions
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Alerts */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              {(recentAlerts?.length ?? 0) > 0 ? (
                <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full ring-1 ring-red-200/60">
                  Attention
                </span>
              ) : (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200/60">
                  Clear
                </span>
              )}
            </div>
            <p className="text-4xl font-bold text-slate-900">{recentAlerts?.length || 0}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Interaction Alerts</p>
            <p className="text-sm text-slate-400 mt-4">Recent drug interactions</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Prescriptions */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Prescriptions</h2>
                <p className="text-xs text-slate-400 mt-0.5">Last 5 issued</p>
              </div>
              <Link
                href="/prescriptions/new"
                className="btn-primary text-xs py-1.5 px-3 h-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </Link>
            </div>

            {recentPrescriptions && recentPrescriptions.length > 0 ? (
              <div className="space-y-1">
                {recentPrescriptions.map((rx: any) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-xs">
                          {rx.patients?.name?.charAt(0) ?? "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {rx.patients?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {rx.medications?.name} &middot; {rx.dose}
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
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">No prescriptions yet</p>
                <Link href="/prescriptions/new" className="btn-primary text-xs mt-3 py-1.5 px-3 h-auto">
                  Issue first prescription
                </Link>
              </div>
            )}
          </div>

          {/* Drug Interaction Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Drug Interaction Alerts</h2>
                <p className="text-xs text-slate-400 mt-0.5">AI-generated safety flags</p>
              </div>
              {(recentAlerts?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {recentAlerts?.length} active
                </span>
              )}
            </div>

            {recentAlerts && recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl p-4 pl-5 relative overflow-hidden border ${
                      alert.severity === "high"
                        ? "bg-red-50 border-red-100"
                        : alert.severity === "medium"
                        ? "bg-amber-50 border-amber-100"
                        : "bg-blue-50 border-blue-100"
                    }`}
                  >
                    {/* Left color bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`} />

                    <div className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          alert.severity === "high"
                            ? "text-red-500"
                            : alert.severity === "medium"
                            ? "text-amber-500"
                            : "text-blue-500"
                        }`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold uppercase tracking-wide ${
                            alert.severity === "high"
                              ? "text-red-700"
                              : alert.severity === "medium"
                              ? "text-amber-700"
                              : "text-blue-700"
                          }`}>
                            {alert.severity} risk
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            &mdash; {alert.prescriptions?.patients?.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">All clear</p>
                <p className="text-xs text-slate-400 mt-1">No drug interaction alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/patients/new"
              className="card-hover flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Add Patient</p>
                <p className="text-xs text-slate-400 mt-0.5">Register a new patient</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/prescriptions/new"
              className="card-hover flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">New Prescription</p>
                <p className="text-xs text-slate-400 mt-0.5">Issue an e-prescription</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/patients"
              className="card-hover flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">View Records</p>
                <p className="text-xs text-slate-400 mt-0.5">Patient medication history</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 ml-auto group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

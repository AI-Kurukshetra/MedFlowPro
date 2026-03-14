import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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

  // Find the patient record linked to this user's email
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
    <div className="min-h-screen bg-slate-50">
      <Navbar role="patient" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Greeting banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 p-6 sm:p-8 overflow-hidden shadow-lg">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 right-24 w-36 h-36 bg-teal-500/20 rounded-full pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-emerald-200 text-sm font-medium mb-1">{greeting},</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{firstName} 👋</h1>
              <p className="text-emerald-200 mt-1.5 text-sm">
                Your medication overview and recent prescriptions
              </p>
            </div>
            <Link
              href="/patient/medications"
              className="self-start sm:self-auto inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              View Medications
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Active medications */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              {activeMeds.length > 0 && (
                <span className="badge-active">{activeMeds.length} active</span>
              )}
            </div>
            <p className="text-4xl font-bold text-slate-900">{activeMeds.length}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Active Medications</p>
            <Link
              href="/patient/medications"
              className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-semibold mt-4 group"
            >
              View medications
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Total prescriptions */}
          <div className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">History</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{recentPrescriptions.length}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Prescriptions</p>
            <p className="text-sm text-slate-400 mt-4">Complete prescription history</p>
          </div>
        </div>

        {/* Active medication cards */}
        {activeMeds.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Current Medications</h2>
              <Link
                href="/patient/medications"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMeds.map((rx: any) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all duration-200"
                >
                  {/* Card header stripe */}
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-emerald-600" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <span className="badge-active">Active</span>
                    </div>

                    <h3 className="font-bold text-slate-900">{rx.medications?.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {rx.dose} &middot; {rx.frequency}
                    </p>

                    {rx.duration && (
                      <div className="mt-3 pt-3 border-t border-slate-50">
                        <p className="text-xs text-slate-400">{rx.duration}</p>
                      </div>
                    )}

                    {rx.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-slate-500 italic">{rx.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent prescriptions list */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Prescriptions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 5 prescriptions</p>
            </div>
          </div>

          {recentPrescriptions.length > 0 ? (
            <div className="space-y-1">
              {recentPrescriptions.map((rx: any) => (
                <div
                  key={rx.id}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      rx.status === "active" ? "bg-emerald-100" : "bg-slate-100"
                    }`}>
                      <svg className={`w-4 h-4 ${
                        rx.status === "active" ? "text-emerald-600" : "text-slate-400"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{rx.medications?.name}</p>
                      <p className="text-xs text-slate-400">{rx.dose} &middot; {rx.frequency}</p>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-600">No prescriptions found</p>
              {!patientRecord && (
                <p className="text-xs mt-2 text-slate-400 max-w-xs">
                  Your account is not yet linked to a patient record. Please contact your doctor.
                </p>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

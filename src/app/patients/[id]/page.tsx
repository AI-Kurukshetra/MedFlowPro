import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const avatarColors = [
  "from-blue-500 to-blue-600",
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
    .in(
      "prescription_id",
      (prescriptions || []).map((p: any) => p.id)
    )
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
    <div className="min-h-screen bg-slate-50">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to patients
        </Link>

        {/* Patient header card with gradient top */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          {/* Gradient header strip */}
          <div className={`h-24 bg-gradient-to-r ${avatarGradient} relative`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full" />
              <div className="absolute -bottom-12 left-12 w-32 h-32 bg-white rounded-full" />
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar overlapping header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
              <div className="flex items-end gap-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-lg border-4 border-white flex-shrink-0`}>
                  <span className="text-white font-bold text-2xl">{initials}</span>
                </div>
                <div className="mb-1">
                  <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                  {age && (
                    <p className="text-sm text-slate-500">
                      {age} years old &middot; DOB: {new Date(patient.dob).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={`/prescriptions/new?patient=${patient.id}`}
                className="btn-primary text-sm py-2 px-4 self-start sm:self-auto mb-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Prescription
              </Link>
            </div>

            {/* Patient info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-slate-800 font-medium">{patient.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-slate-800 font-medium">{patient.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient Since</p>
                <p className="text-sm text-slate-800 font-medium">
                  {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Rx</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-800 font-medium">{prescriptions?.length || 0}</p>
                  {activeRx > 0 && (
                    <span className="badge-active">{activeRx} active</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescription history */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Prescription History</h2>
              <span className="text-xs text-slate-400">{prescriptions?.length || 0} total</span>
            </div>

            {prescriptions && prescriptions.length > 0 ? (
              prescriptions.map((rx: any) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-slate-200 hover:shadow transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        rx.status === "active"
                          ? "bg-emerald-100"
                          : rx.status === "completed"
                          ? "bg-slate-100"
                          : "bg-red-100"
                      }`}>
                        <svg className={`w-5 h-5 ${
                          rx.status === "active"
                            ? "text-emerald-600"
                            : rx.status === "completed"
                            ? "text-slate-400"
                            : "text-red-500"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{rx.medications?.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {rx.dose} &middot; {rx.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={
                        rx.status === "active"
                          ? "badge-active"
                          : rx.status === "completed"
                          ? "badge-completed"
                          : "badge-cancelled"
                      }>
                        {rx.status}
                      </span>
                      <p className="text-xs text-slate-400">
                        {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Detail grid */}
                  {(rx.duration || rx.pharmacy) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-50">
                      {rx.duration && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</p>
                          <p className="text-sm text-slate-700 mt-0.5">{rx.duration}</p>
                        </div>
                      )}
                      {rx.pharmacy && (
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pharmacy</p>
                          <p className="text-sm text-slate-700 mt-0.5">{rx.pharmacy}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {rx.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-50">
                      <p className="text-xs text-slate-600 italic">{rx.notes}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-14 text-slate-300">
                <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">No prescriptions for this patient</p>
                <Link
                  href={`/prescriptions/new?patient=${patient.id}`}
                  className="btn-primary text-xs mt-3 py-1.5 px-3"
                >
                  Create first prescription
                </Link>
              </div>
            )}
          </div>

          {/* Alerts sidebar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Interaction Alerts</h2>
              {(alerts?.length ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {alerts?.length}
                </span>
              )}
            </div>

            {alerts && alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl p-4 relative overflow-hidden border ${
                      alert.severity === "high"
                        ? "bg-red-50 border-red-100"
                        : alert.severity === "medium"
                        ? "bg-amber-50 border-amber-100"
                        : "bg-blue-50 border-blue-100"
                    }`}
                  >
                    {/* Left color bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`} />

                    <div className="pl-2">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className={`w-3.5 h-3.5 flex-shrink-0 ${
                          alert.severity === "high"
                            ? "text-red-500"
                            : alert.severity === "medium"
                            ? "text-amber-500"
                            : "text-blue-500"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className={`text-xs font-bold uppercase tracking-wide ${
                          alert.severity === "high"
                            ? "text-red-700"
                            : alert.severity === "medium"
                            ? "text-amber-700"
                            : "text-blue-700"
                        }`}>
                          {alert.severity} risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">All clear</p>
                <p className="text-xs text-slate-400 mt-1">No interaction alerts</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

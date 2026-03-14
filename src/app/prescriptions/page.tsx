import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function PrescriptionsPage() {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "doctor") redirect("/patient/dashboard");

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("*, patients(name), medications(name, dosage)")
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false });

  const statusCounts = {
    active: prescriptions?.filter((p: any) => p.status === "active").length || 0,
    completed: prescriptions?.filter((p: any) => p.status === "completed").length || 0,
    cancelled: prescriptions?.filter((p: any) => p.status === "cancelled").length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
            <p className="text-slate-500 text-sm mt-1">
              {prescriptions?.length || 0} total prescription{(prescriptions?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/prescriptions/new" className="btn-primary text-sm py-2 px-4 self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Prescription
          </Link>
        </div>

        {/* Status summary pills */}
        <div className="grid grid-cols-3 gap-4">
          {/* Active */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{statusCounts.active}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Active</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{statusCounts.completed}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Completed</p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{statusCounts.cancelled}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Table */}
        {prescriptions && prescriptions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Medication</th>
                    <th>Dose &amp; Frequency</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx: any) => (
                    <tr key={rx.id}>
                      {/* Patient */}
                      <td>
                        <Link
                          href={`/patients/${rx.patient_id}`}
                          className="inline-flex items-center gap-2 group"
                        >
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 font-bold text-xs">
                              {rx.patients?.name?.charAt(0) ?? "?"}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                            {rx.patients?.name}
                          </span>
                        </Link>
                      </td>

                      {/* Medication */}
                      <td>
                        <p className="text-sm font-semibold text-slate-800">{rx.medications?.name}</p>
                        {rx.medications?.dosage && (
                          <p className="text-xs text-slate-400 mt-0.5">{rx.medications.dosage}</p>
                        )}
                      </td>

                      {/* Dose + frequency */}
                      <td>
                        <p className="text-sm text-slate-700">{rx.dose}</p>
                        <p className="text-xs text-slate-400">{rx.frequency}</p>
                      </td>

                      {/* Duration */}
                      <td>
                        <span className="text-sm text-slate-600">{rx.duration || "—"}</span>
                      </td>

                      {/* Status badge */}
                      <td>
                        <span className={
                          rx.status === "active"
                            ? "badge-active"
                            : rx.status === "completed"
                            ? "badge-completed"
                            : "badge-cancelled"
                        }>
                          {rx.status}
                        </span>
                      </td>

                      {/* Date */}
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
        ) : (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No prescriptions yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              Create your first e-prescription with AI-powered drug interaction checking.
            </p>
            <Link href="/prescriptions/new" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create prescription
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

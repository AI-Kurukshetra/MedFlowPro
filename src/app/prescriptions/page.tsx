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
    <div className="app-shell">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="page-container space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Medication orders</p>
            <h1 className="page-title">Prescriptions</h1>
            <p className="page-copy mt-1">
              {prescriptions?.length || 0} total prescription{(prescriptions?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/prescriptions/new" className="btn-primary self-start sm:self-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Prescription
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="stat-card flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">{statusCounts.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-slate-300 ring-1 ring-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">{statusCounts.completed}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">{statusCounts.cancelled}</p>
              <p className="text-xs text-slate-500">Cancelled</p>
            </div>
          </div>
        </div>

        {prescriptions && prescriptions.length > 0 ? (
          <div className="card overflow-hidden p-0">
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
                      <td>
                        <Link href={`/patients/${rx.patient_id}`} className="inline-flex items-center gap-2 group">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/15 text-xs font-semibold text-sky-200 ring-1 ring-sky-400/20">
                            {rx.patients?.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-semibold text-sky-300 group-hover:text-sky-200">
                            {rx.patients?.name}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <p className="text-sm font-semibold text-slate-100">{rx.medications?.name}</p>
                        {rx.medications?.dosage && (
                          <p className="mt-0.5 text-xs text-slate-500">{rx.medications.dosage}</p>
                        )}
                      </td>
                      <td>
                        <p className="text-sm text-slate-300">{rx.dose}</p>
                        <p className="text-xs text-slate-500">{rx.frequency}</p>
                      </td>
                      <td>
                        <span className="text-sm text-slate-400">{rx.duration || "—"}</span>
                      </td>
                      <td>
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
        ) : (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/5 text-slate-600 ring-1 ring-white/10">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">No prescriptions yet</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Create your first AI-assisted prescription with interaction analysis.
            </p>
            <Link href="/prescriptions/new" className="btn-primary mt-6">
              Create prescription
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

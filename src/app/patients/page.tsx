import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

const avatarColors = [
  "bg-sky-400/15 text-sky-200 ring-1 ring-sky-400/20",
  "bg-violet-400/15 text-violet-200 ring-1 ring-violet-400/20",
  "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/20",
  "bg-amber-400/15 text-amber-100 ring-1 ring-amber-400/20",
  "bg-rose-400/15 text-rose-200 ring-1 ring-rose-400/20",
  "bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-400/20",
  "bg-teal-400/15 text-teal-200 ring-1 ring-teal-400/20",
  "bg-orange-400/15 text-orange-100 ring-1 ring-orange-400/20",
];

function getAge(dob: string | null): number | null {
  if (!dob) return null;
  return Math.floor(
    (new Date().getTime() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PatientsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "doctor") redirect("/patient/dashboard");

  const { data: patients } = await supabase
    .from("patients")
    .select("*, prescriptions(count)")
    .eq("doctor_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="app-shell">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="page-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Patient registry</p>
            <h1 className="page-title">Patients</h1>
            <p className="page-copy mt-1">
              {patients?.length || 0} registered patient{(patients?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search patients..." className="input-field h-10 w-60 pl-9" readOnly />
            </div>
            <Link href="/patients/new" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Patient
            </Link>
          </div>
        </div>

        {patients && patients.length > 0 ? (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Contact</th>
                    <th>Prescriptions</th>
                    <th>Registered</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient: any, i: number) => {
                    const colorClass = avatarColors[i % avatarColors.length];
                    const age = getAge(patient.dob);
                    const rxCount = patient.prescriptions?.[0]?.count ?? 0;

                    return (
                      <tr key={patient.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${colorClass}`}>
                              {getInitials(patient.name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-100">{patient.name}</p>
                              {patient.email && (
                                <p className="mt-0.5 text-xs text-slate-500">{patient.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          {age !== null ? (
                            <span className="text-sm font-medium text-slate-300">{age} yrs</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td>
                          <p className="text-sm text-slate-300">{patient.email || "—"}</p>
                          {patient.phone && <p className="text-xs text-slate-500">{patient.phone}</p>}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              rxCount > 0
                                ? "bg-sky-400/12 text-sky-200 ring-1 ring-sky-400/20"
                                : "bg-white/5 text-slate-400 ring-1 ring-white/10"
                            }`}
                          >
                            {rxCount} Rx
                          </span>
                        </td>
                        <td>
                          <p className="text-sm text-slate-400">
                            {new Date(patient.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="text-right">
                          <Link href={`/patients/${patient.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200">
                            View
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/5 text-slate-600 ring-1 ring-white/10">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-400 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.3)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">No patients yet</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Start by adding your first patient to manage prescriptions and medication history.
            </p>
            <Link href="/patients/new" className="btn-primary mt-6">
              Add your first patient
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

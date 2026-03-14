import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

// Color palette for avatar backgrounds (deterministic by index)
const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
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
    <div className="min-h-screen bg-slate-50">
      <Navbar role="doctor" userName={profile.full_name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
            <p className="text-slate-500 text-sm mt-1">
              {patients?.length || 0} registered patient{(patients?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Visual-only search */}
            <div className="relative hidden sm:block">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search patients..."
                className="input-field pl-9 w-56 h-9 text-sm"
                readOnly
              />
            </div>
            <Link href="/patients/new" className="btn-primary text-sm py-2 px-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Patient
            </Link>
          </div>
        </div>

        {patients && patients.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                        {/* Name + avatar */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${colorClass}`}>
                              {getInitials(patient.name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {patient.name}
                              </p>
                              {patient.email && (
                                <p className="text-xs text-slate-400 mt-0.5">{patient.email}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Age */}
                        <td>
                          {age !== null ? (
                            <span className="text-sm text-slate-700 font-medium">{age} yrs</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Contact */}
                        <td>
                          <p className="text-sm text-slate-600">{patient.email || "—"}</p>
                          {patient.phone && (
                            <p className="text-xs text-slate-400">{patient.phone}</p>
                          )}
                        </td>

                        {/* Prescription count */}
                        <td>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            rxCount > 0
                              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {rxCount} Rx
                          </span>
                        </td>

                        {/* Date added */}
                        <td>
                          <p className="text-sm text-slate-500">
                            {new Date(patient.created_at).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="text-right">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
                          >
                            View
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          /* Empty state */
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            {/* Illustration-like SVG */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">No patients yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              Get started by adding your first patient to manage their prescriptions and medical history.
            </p>
            <Link href="/patients/new" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add your first patient
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

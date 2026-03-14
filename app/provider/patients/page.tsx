import { createSupabaseServerClient } from "@/lib/supabase/server";

const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-"];

export default async function ProviderPatientsPage() {
  const supabase = createSupabaseServerClient();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, age, gender")
    .order("full_name", { ascending: true });

  const patientList = patients ?? [];

  const { data: conditions } = await supabase
    .from("conditions")
    .select("patient_id, condition_name")
    .in("patient_id", patientList.map((patient) => patient.id));

  const { data: allergies } = await supabase
    .from("allergies")
    .select("patient_id, allergy_name")
    .in("patient_id", patientList.map((patient) => patient.id));

  const conditionMap = (conditions ?? []).reduce<Record<string, string[]>>((acc, row) => {
    acc[row.patient_id] = acc[row.patient_id] ?? [];
    acc[row.patient_id].push(row.condition_name);
    return acc;
  }, {});

  const allergyCount = (allergies ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.patient_id] = (acc[row.patient_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2>Patients</h2>
        <p>Review patient profiles, conditions, and medication context.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patientList.map((patient, index) => {
          const dobYear = patient.age ? new Date().getFullYear() - patient.age : "-";
          const tags = conditionMap[patient.id] ?? [];
          const allergyTotal = allergyCount[patient.id] ?? 0;
          const initials = patient.full_name
            .split(" ")
            .map((part: string) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={patient.id} className="card space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{patient.full_name}</p>
                  <p className="text-xs text-slate-500">Gender: {patient.gender ?? "-"} · DOB: {dobYear}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-700">Active Rx</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Allergies: {allergyTotal}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Status: Active</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Blood group: {bloodGroups[index % bloodGroups.length]}</span>
                <span>Patient ID: {patient.id.slice(0, 6)}...</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.length ? (
                  tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No conditions recorded</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

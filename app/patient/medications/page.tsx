import { createSupabaseServerClient } from "@/lib/supabase/server";
import { firstOf } from "@/utils/relations";

const nextDoseTimes = ["8:00 AM", "12:00 PM", "6:00 PM"];

export default async function PatientMedicationsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, full_name")
    .eq("user_id", user?.id ?? "")
    .single();

  const { data: history } = await supabase
    .from("medication_history")
    .select("id, status, refill_status, medications(drug_name)")
    .eq("patient_id", patient?.id ?? "");

  const historyRows = (history ?? []) as any[];

  return (
    <div className="space-y-6">
      <div>
        <h2>My Medications</h2>
        <p>Track daily medications and adherence.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {historyRows.map((item, index) => {
          const medName = firstOf(item.medications)?.drug_name;

          return (
            <div key={item.id} className="card space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">{medName ?? "Medication"}</h3>
              <p className="text-sm text-slate-500">Next dose: {nextDoseTimes[index % nextDoseTimes.length]}</p>
              <p className="text-sm text-slate-500">Refills remaining: 2</p>
              <p className="text-sm text-slate-500">Pharmacy: MedFlow Pharmacy</p>
              <p className="text-xs text-patient-700">Status: {item.status ?? "current"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

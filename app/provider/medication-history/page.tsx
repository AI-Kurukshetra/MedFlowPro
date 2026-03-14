import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MedicationHistoryPanel } from "@/components/provider/MedicationHistoryPanel";
import { firstOf } from "@/utils/relations";

export default async function ProviderMedicationHistoryPage() {
  const supabase = createSupabaseServerClient();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  const { data: history } = await supabase
    .from("medication_history")
    .select("id, patient_id, status, refill_status, medications(drug_name)")
    .order("created_at", { ascending: false });

  const historyItems = ((history ?? []) as any[]).map((item) => ({
    id: item.id,
    patient_id: item.patient_id,
    status: item.status ?? "current",
    refill_status: item.refill_status ?? null,
    medication: firstOf(item.medications)?.drug_name ?? "Medication"
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2>Medication History</h2>
        <p>Track patient medication adherence and refill progress.</p>
      </div>
      <MedicationHistoryPanel patients={patients ?? []} history={historyItems} />
    </div>
  );
}

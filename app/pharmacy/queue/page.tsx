import { createSupabaseServerClient } from "@/lib/supabase/server";
import { QueueTable } from "@/components/pharmacy/QueueTable";
import { firstOf } from "@/utils/relations";

export default async function PharmacyQueuePage() {
  const supabase = createSupabaseServerClient();
  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, status, patients(full_name), prescription_items(medications(drug_name))")
    .eq("status", "sent")
    .order("created_at", { ascending: true });

  const queue = ((prescriptions ?? []) as any[]).map((rx) => ({
    id: rx.id,
    status: rx.status ?? "sent",
    patient: firstOf(rx.patients)?.full_name ?? "Patient",
    medication: firstOf(rx.prescription_items?.[0]?.medications)?.drug_name ?? "Medication"
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2>Rx Queue</h2>
        <p>Fill or reject incoming prescriptions.</p>
      </div>
      <QueueTable initialQueue={queue} />
    </div>
  );
}

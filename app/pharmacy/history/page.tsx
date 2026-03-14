import { createSupabaseServerClient } from "@/lib/supabase/server";
import { firstOf } from "@/utils/relations";

export default async function PharmacyHistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, status, patients(full_name), prescription_items(medications(drug_name))")
    .in("status", ["filled", "cancelled"])
    .order("updated_at", { ascending: false })
    .limit(10);

  const rows = (prescriptions ?? []) as any[];

  return (
    <div className="space-y-6">
      <div>
        <h2>Fill History</h2>
        <p>Recent fulfilled prescriptions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((rx) => {
          const patientName = firstOf(rx.patients)?.full_name;
          const medName = firstOf(rx.prescription_items?.[0]?.medications)?.drug_name;

          return (
            <div key={rx.id} className="card">
              <p className="text-sm font-semibold text-slate-900">{patientName ?? "Patient"}</p>
              <p className="text-xs text-slate-500">{medName ?? "Medication"}</p>
              <p className="text-xs text-pharmacy-700">Status: {rx.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

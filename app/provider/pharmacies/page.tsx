import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

const statuses = ["active", "retail", "hospital"];

export default async function ProviderPharmaciesPage() {
  const supabase = createSupabaseServerClient();
  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, pharmacy_name, address, city, state, phone, operating_hours")
    .order("pharmacy_name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2>Pharmacies</h2>
        <p>Route prescriptions to trusted pharmacy partners.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(pharmacies ?? []).map((pharmacy, index) => (
          <div key={pharmacy.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{pharmacy.pharmacy_name}</h3>
              <Badge variant="default">{statuses[index % statuses.length]}</Badge>
            </div>
            <p className="text-sm text-slate-500">{pharmacy.address}, {pharmacy.city}, {pharmacy.state}</p>
            <p className="text-sm text-slate-500">Phone: {pharmacy.phone}</p>
            <p className="text-xs text-slate-400">Hours: {pharmacy.operating_hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
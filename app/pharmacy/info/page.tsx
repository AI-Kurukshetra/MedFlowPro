import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PharmacyInfoPage() {
  const supabase = createSupabaseServerClient();
  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("pharmacy_name, address, city, state, phone, operating_hours")
    .limit(1);

  const pharmacy = pharmacies?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h2>Pharmacy Info</h2>
        <p>Operational details and contact information.</p>
      </div>
      <div className="card space-y-2">
        <p className="text-sm font-semibold text-slate-900">{pharmacy?.pharmacy_name ?? "MedFlow Pharmacy"}</p>
        <p className="text-sm text-slate-500">{pharmacy?.address} {pharmacy?.city} {pharmacy?.state}</p>
        <p className="text-sm text-slate-500">Phone: {pharmacy?.phone}</p>
        <p className="text-xs text-slate-400">Hours: {pharmacy?.operating_hours}</p>
      </div>
    </div>
  );
}
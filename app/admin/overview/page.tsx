import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/StatCard";

export default async function AdminOverviewPage() {
  const supabase = createSupabaseServerClient();
  const [{ count: users }, { count: providers }, { count: pharmacies }] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("providers").select("id", { count: "exact", head: true }),
    supabase.from("pharmacies").select("id", { count: "exact", head: true })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2>Admin Overview</h2>
        <p>Operational metrics across the platform.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={`${users ?? 0}`} helper="Active accounts" />
        <StatCard title="Providers" value={`${providers ?? 0}`} helper="Verified" />
        <StatCard title="Pharmacies" value={`${pharmacies ?? 0}`} helper="Networked" />
      </div>
    </div>
  );
}
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { firstOf } from "@/utils/relations";

export default async function ProviderDashboardPage() {
  const supabase = createSupabaseServerClient();

  const [{ count: prescriptionCount }, { count: patientCount }, { count: interactionCount }] =
    await Promise.all([
      supabase.from("prescriptions").select("id", { count: "exact", head: true }),
      supabase.from("patients").select("id", { count: "exact", head: true }),
      supabase.from("drug_interactions").select("id", { count: "exact", head: true })
    ]);

  const { data: recentPatients } = await supabase
    .from("patients")
    .select("full_name, risk_level")
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: recentPrescriptions } = await supabase
    .from("prescriptions")
    .select("id, status, created_at, patients(full_name), prescription_items(medications(drug_name))")
    .order("created_at", { ascending: false })
    .limit(4);

  const prescriptionRows = (recentPrescriptions ?? []) as any[];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Provider Dashboard</h1>
          <p>Track prescribing activity, alerts, and patient safety signals.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/provider/patients">
            <Button variant="outline">View Patients</Button>
          </Link>
          <Link href="/provider/prescriptions">
            <Button>Create Prescription</Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatCard title="Active Prescriptions" value={`${prescriptionCount ?? 0}`} helper="Last 30 days" trend="+8%" />
        <StatCard
          title="Patients Monitored"
          value={`${patientCount ?? 0}`}
          helper="Current panel"
          trend="12 care gaps"
          accent="warning"
        />
        <StatCard
          title="Interaction Alerts"
          value={`${interactionCount ?? 0}`}
          helper="Rules configured"
          trend="2 high risk"
          accent="critical"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Patients</h3>
            <Link href="/provider/patients" className="text-sm font-semibold text-primary-600">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(recentPatients ?? []).map((patient) => (
              <div key={patient.full_name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{patient.full_name}</p>
                  <p className="text-xs text-slate-500">Risk level: {patient.risk_level}</p>
                </div>
                <Badge variant="neutral">Active</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Prescriptions</h3>
            <Link href="/provider/prescriptions" className="text-sm font-semibold text-primary-600">
              Open composer
            </Link>
          </div>
          <div className="space-y-3">
            {prescriptionRows.map((rx) => {
              const patientName = firstOf(rx.patients)?.full_name;
              const medName = firstOf(rx.prescription_items?.[0]?.medications)?.drug_name;

              return (
                <div key={rx.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{patientName ?? "Patient"}</p>
                    <p className="text-xs text-slate-500">{medName ?? "Medication"}</p>
                  </div>
                  <Badge variant="default">{rx.status ?? "sent"}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            href="/provider/prescriptions"
            className="rounded-xl bg-primary-50 p-4 text-sm font-semibold text-primary-700"
          >
            Create Prescription
          </Link>
          <Link
            href="/provider/pharmacies"
            className="rounded-xl bg-primary-50 p-4 text-sm font-semibold text-primary-700"
          >
            Route to Pharmacy
          </Link>
          <Link
            href="/provider/medication-history"
            className="rounded-xl bg-primary-50 p-4 text-sm font-semibold text-primary-700"
          >
            Review History
          </Link>
        </div>
      </section>
    </div>
  );
}

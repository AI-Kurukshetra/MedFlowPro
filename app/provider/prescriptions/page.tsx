import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrescriptionComposer } from "@/components/prescriptions/PrescriptionComposer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMedications, mockPatients, mockPharmacies } from "@/lib/data";
import { firstOf } from "@/utils/relations";

const statusVariant: Record<string, "default" | "warning" | "success" | "critical" | "neutral"> = {
  pending: "warning",
  sent: "default",
  filled: "success",
  cancelled: "critical"
};

export default async function ProviderPrescriptionsPage() {
  const supabase = createSupabaseServerClient();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, age, gender, risk_level")
    .order("full_name", { ascending: true });

  const { data: medications } = await supabase
    .from("medications")
    .select("id, drug_name, generic_name, strength, route")
    .order("drug_name", { ascending: true });

  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, pharmacy_name, address, city, state, phone")
    .order("pharmacy_name", { ascending: true });

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, status, created_at, prescription_items(dosage, frequency, medications(drug_name)), patients(full_name)")
    .order("created_at", { ascending: false })
    .limit(20);

  const prescriptionRows = (prescriptions ?? []) as any[];

  return (
    <div className="space-y-8">
      <div>
        <h2>Prescription Composer</h2>
        <p>Create prescriptions with AI-guided safety checks.</p>
      </div>
      <PrescriptionComposer
        patients={patients ?? mockPatients}
        medications={medications ?? mockMedications}
        pharmacies={pharmacies ?? mockPharmacies}
      />

      <div>
        <h2>Prescriptions</h2>
        <p>Track status and manage sends.</p>
      </div>
      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rx ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptionRows.map((rx) => {
              const item = rx.prescription_items?.[0];
              const status = rx.status ?? "pending";
              const patientName = firstOf(rx.patients)?.full_name;
              const medName = firstOf(item?.medications)?.drug_name;

              return (
                <TableRow key={rx.id}>
                  <TableCell className="font-medium">{rx.id.slice(0, 6)}...</TableCell>
                  <TableCell>{patientName ?? "Patient"}</TableCell>
                  <TableCell>{medName ?? "Medication"}</TableCell>
                  <TableCell>{item?.dosage ?? "-"}</TableCell>
                  <TableCell>{item?.frequency ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[status] ?? "neutral"}>{status}</Badge>
                  </TableCell>
                  <TableCell>{rx.created_at ? new Date(rx.created_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminMedicationsPage() {
  const supabase = createSupabaseServerClient();
  const { data: meds } = await supabase
    .from("medications")
    .select("id, drug_name, strength, route")
    .order("drug_name", { ascending: true })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h2>Medications</h2>
        <p>Manage medication catalog.</p>
      </div>
      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Drug</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Route</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(meds ?? []).map((med) => (
              <TableRow key={med.id}>
                <TableCell>{med.id.slice(0, 6)}...</TableCell>
                <TableCell>{med.drug_name}</TableCell>
                <TableCell>{med.strength}</TableCell>
                <TableCell>{med.route}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminPharmaciesPage() {
  const supabase = createSupabaseServerClient();
  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, pharmacy_name, city, state, phone")
    .order("pharmacy_name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2>Pharmacies</h2>
        <p>Manage network pharmacy locations.</p>
      </div>
      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pharmacies ?? []).map((pharmacy) => (
              <TableRow key={pharmacy.id}>
                <TableCell>{pharmacy.id.slice(0, 6)}...</TableCell>
                <TableCell>{pharmacy.pharmacy_name}</TableCell>
                <TableCell>{pharmacy.city}</TableCell>
                <TableCell>{pharmacy.state}</TableCell>
                <TableCell>{pharmacy.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
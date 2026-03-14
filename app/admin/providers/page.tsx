import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { firstOf } from "@/utils/relations";

export default async function AdminProvidersPage() {
  const supabase = createSupabaseServerClient();
  const { data: providers } = await supabase
    .from("providers")
    .select("id, npi, specialty, users(email)")
    .order("created_at", { ascending: false });

  const providerRows = (providers ?? []) as any[];

  return (
    <div className="space-y-6">
      <div>
        <h2>Providers</h2>
        <p>Review provider profiles and identifiers.</p>
      </div>
      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>NPI</TableHead>
              <TableHead>Specialty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providerRows.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.id.slice(0, 6)}...</TableCell>
                <TableCell>{firstOf(provider.users)?.email ?? "-"}</TableCell>
                <TableCell>{provider.npi ?? "-"}</TableCell>
                <TableCell>{provider.specialty ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

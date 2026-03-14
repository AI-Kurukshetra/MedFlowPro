import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminInteractionsPage() {
  const supabase = createSupabaseServerClient();
  const { data: interactions } = await supabase
    .from("drug_interactions")
    .select("id, warning, severity, interaction_kind")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h2>Interactions</h2>
        <p>Review interaction rules and severity.</p>
      </div>
      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Warning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(interactions ?? []).map((interaction) => (
              <TableRow key={interaction.id}>
                <TableCell>{interaction.id.slice(0, 6)}...</TableCell>
                <TableCell>{interaction.interaction_kind}</TableCell>
                <TableCell>{interaction.severity}</TableCell>
                <TableCell>{interaction.warning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
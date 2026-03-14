import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MedicationCardProps {
  name: string;
  dosage: string;
  route: string;
  status: "Current" | "Past" | "Refill Due";
}

const statusVariant = {
  "Current": "success",
  "Past": "neutral",
  "Refill Due": "warning"
} as const;

export function MedicationCard({ name, dosage, route, status }: MedicationCardProps) {
  return (
    <Card className="surface-card">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">{name}</p>
            <p className="text-sm text-slate-500">{dosage} · {route}</p>
          </div>
          <Badge variant={statusVariant[status]}>{status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

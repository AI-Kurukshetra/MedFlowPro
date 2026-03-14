import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PatientCardProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: "Low" | "Medium" | "High";
  conditions: string[];
}

const riskVariant = {
  Low: "success",
  Medium: "warning",
  High: "critical"
} as const;

export function PatientCard({ id, name, age, gender, riskLevel, conditions }: PatientCardProps) {
  return (
    <Card className="surface-card">
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">{name}</p>
            <p className="text-sm text-slate-500">
              {age} yrs · {gender}
            </p>
          </div>
          <Badge variant={riskVariant[riskLevel]}>{riskLevel} risk</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {conditions.slice(0, 3).map((condition) => (
            <Badge key={condition} variant="neutral">
              {condition}
            </Badge>
          ))}
          {conditions.length > 3 && (
            <Badge variant="neutral">+{conditions.length - 3} more</Badge>
          )}
        </div>
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
          href={`/patients/${id}`}
        >
          View profile ?
        </Link>
      </CardContent>
    </Card>
  );
}

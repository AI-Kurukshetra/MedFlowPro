import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DrugInteractionAlertProps {
  title: string;
  description: string;
  severity: "low" | "moderate" | "high";
}

const severityVariant = {
  low: "default",
  moderate: "warning",
  high: "critical"
} as const;

export function DrugInteractionAlert({ title, description, severity }: DrugInteractionAlertProps) {
  return (
    <Alert variant={severityVariant[severity]}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}


interface InteractionAlertProps {
  title: string;
  description: string;
  severity: "low" | "moderate" | "high";
}

const severityStyles = {
  low: "border-primary-100 bg-primary-50/50 text-primary-700",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-rose-200 bg-rose-50 text-rose-700"
} as const;

export function InteractionAlert({ title, description, severity }: InteractionAlertProps) {
  return (
    <div className={`rounded-xl border p-3 text-xs ${severityStyles[severity]}`}>
      <p className="font-semibold">{title}</p>
      <p>{description}</p>
    </div>
  );
}
interface AISuggestionCardProps {
  name: string;
  dosage: string;
  reason: string;
}

export function AISuggestionCard({ name, dosage, reason }: AISuggestionCardProps) {
  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-3">
      <p className="text-sm font-semibold text-slate-900">{name}</p>
      <p className="text-xs text-primary-700">Suggested dosage: {dosage}</p>
      <p className="mt-1 text-xs text-slate-500">{reason}</p>
    </div>
  );
}
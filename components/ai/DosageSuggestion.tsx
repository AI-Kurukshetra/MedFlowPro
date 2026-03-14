interface DosageSuggestionProps {
  medication: string;
  dosage: string;
}

export function DosageSuggestion({ medication, dosage }: DosageSuggestionProps) {
  return (
    <div className="rounded-xl border border-primary-100 bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold text-primary-700">Dosage Suggestion</p>
      <p className="text-sm font-semibold text-slate-900">{medication}</p>
      <p className="text-xs text-slate-500">{dosage}</p>
    </div>
  );
}
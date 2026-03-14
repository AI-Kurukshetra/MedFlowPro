interface AIExplanationProps {
  title: string;
  bullets: string[];
}

export function AIExplanation({ title, bullets }: AIExplanationProps) {
  return (
    <div className="rounded-xl bg-white/80 p-3">
      <p className="text-xs font-semibold text-slate-900">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
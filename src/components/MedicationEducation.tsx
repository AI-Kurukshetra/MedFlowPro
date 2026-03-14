"use client";
import { useState } from "react";

interface Education {
  whatIsIt: string;
  howToTake: string;
  commonSideEffects: string[];
  whatToAvoid: string;
  whenToCallDoctor: string;
}

interface Props {
  medicationName: string;
  dose: string;
  frequency: string;
}

export default function MedicationEducation({ medicationName, dose, frequency }: Props) {
  const [open, setOpen] = useState(false);
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(false);

  const loadEducation = async () => {
    if (education) { setOpen(!open); return; }
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/medication-education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationName, dose, frequency }),
      });
      if (res.ok) setEducation(await res.json());
    } catch {}
    setLoading(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)]">
      <button
        onClick={loadEducation}
        className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
      >
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {open ? "Hide" : "Learn about this medication"} (AI)
      </button>

      {open && (
        <div className="mt-3">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              Generating patient guide...
            </div>
          ) : education ? (
            <div className="space-y-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">What is it?</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{education.whatIsIt}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">How to take it</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{education.howToTake}</p>
              </div>
              {education.commonSideEffects?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Common side effects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {education.commonSideEffects.map((se) => (
                      <span key={se} className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{se}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">What to avoid</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{education.whatToAvoid}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">When to call your doctor</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{education.whenToCallDoctor}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-400">Could not load education content.</p>
          )}
        </div>
      )}
    </div>
  );
}

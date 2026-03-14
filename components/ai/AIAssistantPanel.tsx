"use client";

import { useEffect, useState } from "react";
import { AISuggestionCard } from "@/components/ai/AISuggestionCard";
import { InteractionAlert } from "@/components/ai/InteractionAlert";
import { DosageSuggestion } from "@/components/ai/DosageSuggestion";
import { AIExplanation } from "@/components/ai/AIExplanation";

interface AIAssistantPanelProps {
  patientId: string;
  condition: string;
  selectedMedicationIds: string[];
}

type AIResponse = {
  profile: {
    allergies: string[];
    currentMedications: { id: string; drug_name: string }[];
    conditions: string[];
    riskFlags: string[];
  };
  suggestions: { name: string; dosage: string; reason: string }[];
  warnings: { title: string; description: string; severity: "low" | "moderate" | "high" }[];
  dosageRecommendation: string;
  selectedMedication: string;
};

export function AIAssistantPanel({ patientId, condition, selectedMedicationIds }: AIAssistantPanelProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch("/api/ai/prescribing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, condition, selectedMedicationIds })
    })
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, [patientId, condition, selectedMedicationIds.join(",")]);

  return (
    <aside className="space-y-4 rounded-xl bg-white p-5 shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">AI Prescribing Assistant</h3>
        <p className="text-xs text-slate-500">
          AI suggestions are for clinical decision support only. Providers must verify prescriptions before issuing.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Analyzing patient profile...</p>}

      {data && (
        <>
          <AIExplanation
            title="Patient Safety Snapshot"
            bullets={[
              `Allergies: ${data.profile.allergies.join(", ") || "None recorded"}`,
              `Active meds: ${data.profile.currentMedications.map((med) => med.drug_name).join(", ") || "None"}`,
              `Risk flags: ${data.profile.riskFlags.join(", ") || "No elevated risk"}`
            ]}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Recommendations</h4>
            {data.suggestions.length ? (
              data.suggestions.map((suggestion) => (
                <AISuggestionCard
                  key={suggestion.name}
                  name={suggestion.name}
                  dosage={suggestion.dosage}
                  reason={suggestion.reason}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">Select a condition to see recommendations.</p>
            )}
          </div>

          {data.dosageRecommendation && (
            <DosageSuggestion
              medication={data.selectedMedication}
              dosage={data.dosageRecommendation}
            />
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Interaction Alerts</h4>
            {data.warnings.length ? (
              data.warnings.map((warning, index) => (
                <InteractionAlert
                  key={`${warning.title}-${index}`}
                  title={warning.title}
                  description={warning.description}
                  severity={warning.severity}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">No interaction warnings detected.</p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
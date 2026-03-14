export type MedicationInfo = {
  id: string;
  drug_name: string;
  strength?: string | null;
  route?: string | null;
};

export type PatientProfile = {
  allergies: string[];
  currentMedications: MedicationInfo[];
  conditions: string[];
};

export type AISuggestion = {
  medicationId?: string;
  name: string;
  dosage: string;
  reason: string;
};

export type AIWarning = {
  title: string;
  description: string;
  severity: "low" | "moderate" | "high";
};

const conditionRules: Record<string, string[]> = {
  infection: ["Amoxicillin", "Azithromycin", "Ciprofloxacin"],
  hypertension: ["Lisinopril", "Amlodipine", "Losartan"],
  diabetes: ["Metformin", "Sitagliptin", "Dapagliflozin"],
  asthma: ["Albuterol", "Budesonide", "Montelukast"],
  depression: ["Sertraline", "Escitalopram", "Duloxetine"],
  pain: ["Ibuprofen", "Naproxen", "Meloxicam"]
};

const dosageMap: Record<string, string> = {
  Amoxicillin: "500mg twice daily for 7 days",
  Azithromycin: "500mg day 1, then 250mg daily x 4 days",
  Ciprofloxacin: "500mg twice daily for 7 days",
  Lisinopril: "10mg once daily",
  Amlodipine: "5mg once daily",
  Losartan: "50mg once daily",
  Metformin: "500mg twice daily with meals",
  Sitagliptin: "100mg once daily",
  Dapagliflozin: "10mg once daily",
  Albuterol: "2 puffs every 4-6 hours as needed",
  Budesonide: "180mcg twice daily",
  Montelukast: "10mg nightly",
  Sertraline: "50mg once daily",
  Escitalopram: "10mg once daily",
  Duloxetine: "30mg once daily",
  Ibuprofen: "400mg every 6-8 hours",
  Naproxen: "500mg twice daily",
  Meloxicam: "7.5mg once daily"
};

export function analyzePatientProfile(allergies: string[], currentMedications: MedicationInfo[], conditions: string[]) {
  const riskFlags = [] as string[];
  if (allergies.length >= 2) riskFlags.push("Multiple allergy history");
  if (currentMedications.length >= 4) riskFlags.push("Polypharmacy risk");
  if (conditions.length >= 3) riskFlags.push("Complex condition profile");

  return {
    allergies,
    currentMedications,
    conditions,
    riskFlags
  };
}

export function suggestMedications(condition: string, medications: MedicationInfo[]) {
  const normalized = condition.toLowerCase();
  const matchedRule = Object.keys(conditionRules).find((key) => normalized.includes(key));
  const candidates = matchedRule ? conditionRules[matchedRule] : [];

  return candidates
    .map((name) => {
      const medication = medications.find((med) => med.drug_name.toLowerCase() === name.toLowerCase());
      return {
        medicationId: medication?.id,
        name,
        dosage: dosageMap[name] ?? "Standard dosing per guidelines",
        reason:
          matchedRule
            ? `${name} is commonly used for ${matchedRule} and aligns with typical first-line therapy.`
            : `${name} is frequently prescribed for this condition.`
      };
    })
    .filter((item) => Boolean(item.name));
}

export function generateDosageRecommendation(medicationName: string) {
  return dosageMap[medicationName] ?? "Refer to standard dosing guidance.";
}

export function checkInteractions(
  selectedMedicationIds: string[],
  interactions: {
    medication_id_1: string | null;
    medication_id_2: string | null;
    interaction_kind: string | null;
    allergy_name: string | null;
    warning: string;
    severity: "low" | "moderate" | "high";
  }[],
  allergies: string[],
  currentMedications: MedicationInfo[]
) {
  const warnings: AIWarning[] = [];
  const selectedSet = new Set(selectedMedicationIds);
  const currentIds = new Set(currentMedications.map((med) => med.id));

  if ([...selectedSet].some((id) => currentIds.has(id))) {
    warnings.push({
      title: "Duplicate medication",
      description: "Selected medication already appears in the active medication list.",
      severity: "moderate"
    });
  }

  interactions.forEach((interaction) => {
    if (interaction.interaction_kind === "drug_allergy" && interaction.allergy_name) {
      if (allergies.map((a) => a.toLowerCase()).includes(interaction.allergy_name.toLowerCase())) {
        warnings.push({
          title: "Allergy conflict",
          description: interaction.warning,
          severity: interaction.severity
        });
      }
      return;
    }

    const hit1 = interaction.medication_id_1 && selectedSet.has(interaction.medication_id_1);
    const hit2 = interaction.medication_id_2 && selectedSet.has(interaction.medication_id_2);
    if (hit1 && hit2) {
      warnings.push({
        title: "Potential interaction detected",
        description: interaction.warning,
        severity: interaction.severity
      });
    }
  });

  return warnings;
}
import { DrugInteraction } from "@/types";

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    medication1: "Aspirin",
    medication2: "Ibuprofen",
    warning:
      "Warning: Aspirin and Ibuprofen combination may increase bleeding risk and reduce the effectiveness of Aspirin.",
    severity: "high",
  },
  {
    medication1: "Metformin",
    medication2: "Alcohol",
    warning:
      "Warning: Metformin combined with alcohol increases the risk of lactic acidosis.",
    severity: "high",
  },
  {
    medication1: "Amoxicillin",
    medication2: "Metformin",
    warning:
      "Caution: Amoxicillin may interact with Metformin. Monitor blood glucose levels closely.",
    severity: "medium",
  },
  {
    medication1: "Aspirin",
    medication2: "Paracetamol",
    warning:
      "Caution: Taking Aspirin and Paracetamol together may increase the risk of side effects.",
    severity: "low",
  },
  {
    medication1: "Ibuprofen",
    medication2: "Metformin",
    warning:
      "Caution: Ibuprofen may affect kidney function and alter Metformin clearance.",
    severity: "medium",
  },
];

export function checkInteractions(
  newMedication: string,
  existingMedications: string[]
): DrugInteraction[] {
  const interactions: DrugInteraction[] = [];

  for (const existing of existingMedications) {
    for (const interaction of DRUG_INTERACTIONS) {
      const match =
        (interaction.medication1.toLowerCase() ===
          newMedication.toLowerCase() &&
          interaction.medication2.toLowerCase() === existing.toLowerCase()) ||
        (interaction.medication2.toLowerCase() ===
          newMedication.toLowerCase() &&
          interaction.medication1.toLowerCase() === existing.toLowerCase());

      if (match) {
        interactions.push(interaction);
      }
    }
  }

  return interactions;
}

export function getSuggestedAlternatives(medicationName: string): string[] {
  const alternatives: Record<string, string[]> = {
    Aspirin: ["Clopidogrel", "Ticagrelor", "Warfarin"],
    Ibuprofen: ["Naproxen", "Celecoxib", "Diclofenac"],
    Metformin: ["Glipizide", "Sitagliptin", "Empagliflozin"],
    Amoxicillin: ["Azithromycin", "Doxycycline", "Cephalexin"],
    Paracetamol: ["Tramadol", "Codeine", "Celecoxib"],
  };

  return alternatives[medicationName] || ["Consult with pharmacist for alternatives"];
}

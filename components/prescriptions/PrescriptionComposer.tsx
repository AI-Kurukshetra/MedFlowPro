"use client";

import { useState } from "react";
import type { PatientSummary, MedicationSummary, PharmacySummary } from "@/types";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";
import { Badge } from "@/components/ui/badge";
import { AIAssistantPanel } from "@/components/ai/AIAssistantPanel";

interface PrescriptionComposerProps {
  patients: PatientSummary[];
  medications: MedicationSummary[];
  pharmacies: PharmacySummary[];
}

const conditionOptions = [
  "Bacterial Infection",
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Depression",
  "Pain"
];

export function PrescriptionComposer({ patients, medications, pharmacies }: PrescriptionComposerProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<string[]>([]);
  const selectedPatient = patients.find((patient) => patient.id === patientId);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Select Patient</label>
              <select
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name} - {patient.age} yrs
                  </option>
                ))}
              </select>
              {selectedPatient && (
                <p className="mt-2 text-xs text-slate-500">Risk level: {selectedPatient.risk_level}</p>
              )}
            </div>
            <Badge variant="neutral">Step 1 - Patient</Badge>
          </div>
        </div>

        <PrescriptionForm
          patientId={patientId}
          medications={medications}
          pharmacies={pharmacies}
          condition={condition}
          conditionOptions={conditionOptions}
          onConditionChange={setCondition}
          onItemsChange={(items) => setSelectedMedicationIds(items.map((item) => item.medication_id))}
        />
      </div>

      <AIAssistantPanel
        patientId={patientId}
        condition={condition}
        selectedMedicationIds={selectedMedicationIds}
      />
    </div>
  );
}
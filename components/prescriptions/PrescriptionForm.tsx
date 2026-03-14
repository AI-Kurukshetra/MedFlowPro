"use client";

import { useEffect, useState, useTransition } from "react";
import { MedicationSummary, PharmacySummary, InteractionWarning } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DrugInteractionAlert } from "@/components/prescriptions/DrugInteractionAlert";
import { createPrescriptionAction, checkInteractionsAction } from "@/app/actions/prescriptions";

interface PrescriptionFormProps {
  patientId: string;
  medications: MedicationSummary[];
  pharmacies: PharmacySummary[];
  condition: string;
  conditionOptions: string[];
  onConditionChange: (value: string) => void;
  onItemsChange?: (items: ItemState[]) => void;
}

type ItemState = {
  medication_id: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

export function PrescriptionForm({
  patientId,
  medications,
  pharmacies,
  condition,
  conditionOptions,
  onConditionChange,
  onItemsChange
}: PrescriptionFormProps) {
  const [items, setItems] = useState<ItemState[]>([
    {
      medication_id: medications[0]?.id ?? "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }
  ]);
  const [pharmacyId, setPharmacyId] = useState(pharmacies[0]?.id ?? "");
  const [warnings, setWarnings] = useState<InteractionWarning[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const updateItem = (index: number, key: keyof ItemState, value: string) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        medication_id: medications[0]?.id ?? "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
      }
    ]);
  };

  const checkInteractions = () => {
    startTransition(async () => {
      const result = await checkInteractionsAction({
        patientId,
        medicationIds: items.map((item) => item.medication_id).filter(Boolean)
      });
      setWarnings(result);
    });
  };

  const submitPrescription = () => {
    if (!window.confirm("Send this prescription to the selected pharmacy?")) {
      return;
    }

    startTransition(async () => {
      setStatusMessage(null);
      const response = await createPrescriptionAction({
        patientId,
        pharmacyId,
        items
      });
      setStatusMessage(response.message);
      if (response.success) {
        setWarnings([]);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-4 shadow-md">
        <label className="text-xs font-semibold text-slate-500">Condition / Diagnosis</label>
        <select
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={condition}
          onChange={(event) => onConditionChange(event.target.value)}
        >
          {conditionOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-5"
          >
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Drug Name</label>
              <select
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={item.medication_id}
                onChange={(event) => updateItem(index, "medication_id", event.target.value)}
              >
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.drug_name} {med.strength}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Dosage</label>
              <Input
                value={item.dosage}
                onChange={(event) => updateItem(index, "dosage", event.target.value)}
                placeholder="e.g. 10 mg"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Frequency</label>
              <Input
                value={item.frequency}
                onChange={(event) => updateItem(index, "frequency", event.target.value)}
                placeholder="e.g. Twice daily"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Duration</label>
              <Input
                value={item.duration}
                onChange={(event) => updateItem(index, "duration", event.target.value)}
                placeholder="e.g. 14 days"
              />
            </div>
            <div className="md:col-span-5">
              <label className="text-xs font-semibold text-slate-500">Instructions</label>
              <Input
                value={item.instructions}
                onChange={(event) => updateItem(index, "instructions", event.target.value)}
                placeholder="Take with food"
              />
            </div>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addItem}>
          Add Medication
        </Button>
      </div>

      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-500">Select Pharmacy</label>
          <select
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={pharmacyId}
            onChange={(event) => setPharmacyId(event.target.value)}
          >
            {pharmacies.map((pharmacy) => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.pharmacy_name} - {pharmacy.city}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <Button variant="outline" onClick={checkInteractions} disabled={isPending}>
            Check Interactions
          </Button>
          <Button onClick={submitPrescription} disabled={isPending}>
            Send Prescription
          </Button>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((warning) => (
            <DrugInteractionAlert
              key={warning.id}
              title={warning.title}
              description={warning.description}
              severity={warning.severity}
            />
          ))}
        </div>
      )}

      {statusMessage && (
        <p className="text-sm font-semibold text-primary-700">{statusMessage}</p>
      )}
    </div>
  );
}
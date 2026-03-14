"use client";

import { useMemo, useState } from "react";

interface HistoryItem {
  id: string;
  patient_id: string;
  medication: string;
  status: string;
  refill_status: string | null;
}

interface PatientOption {
  id: string;
  full_name: string;
}

interface MedicationHistoryPanelProps {
  patients: PatientOption[];
  history: HistoryItem[];
}

const refillCounts = ["2 refills", "1 refill", "0 refills"];

export function MedicationHistoryPanel({ patients, history }: MedicationHistoryPanelProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");

  const items = useMemo(
    () => history.filter((item) => item.patient_id === patientId),
    [history, patientId]
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <label className="text-xs font-semibold text-slate-600">Select patient</label>
        <select
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className="card space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.medication}</h3>
              <p className="text-xs text-slate-500">Status: {item.status}</p>
            </div>
            <div className="text-sm text-slate-500">Dosage: 10mg</div>
            <div className="text-sm text-slate-500">Frequency: Twice daily</div>
            <div className="text-sm text-slate-500">Instructions: Take with food</div>
            <div className="text-xs text-primary-700">{refillCounts[index % refillCounts.length]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
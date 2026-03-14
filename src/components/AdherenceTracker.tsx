"use client";
import { useState } from "react";

interface Props {
  prescriptionId: string;
  patientId: string;
  medicationName: string;
  todayLog: "taken" | "missed" | null;
  adherencePercent: number;
}

export default function AdherenceTracker({ prescriptionId, patientId, medicationName, todayLog, adherencePercent }: Props) {
  const [log, setLog] = useState<"taken" | "missed" | null>(todayLog);
  const [loading, setLoading] = useState(false);

  const markDose = async (status: "taken" | "missed") => {
    if (log !== null) return;
    setLoading(true);
    const res = await fetch("/api/adherence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prescription_id: prescriptionId, patient_id: patientId, status }),
    });
    if (res.ok) setLog(status);
    setLoading(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Today&apos;s Dose</p>
        <span className="text-xs text-[var(--text-muted)]">{adherencePercent}% adherence (30 days)</span>
      </div>

      {log === null ? (
        <div className="flex gap-2">
          <button
            onClick={() => markDose("taken")}
            disabled={loading}
            className="flex-1 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            ✓ Taken
          </button>
          <button
            onClick={() => markDose("missed")}
            disabled={loading}
            className="flex-1 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            ✗ Missed
          </button>
        </div>
      ) : (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
          log === "taken"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          <span>{log === "taken" ? "✓ Dose taken today" : "✗ Dose missed today"}</span>
        </div>
      )}

      {/* Adherence bar */}
      <div className="mt-2">
        <div className="h-1 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              adherencePercent >= 80 ? "bg-emerald-500" :
              adherencePercent >= 50 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${adherencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

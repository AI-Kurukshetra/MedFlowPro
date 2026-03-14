"use client";
import { useState } from "react";

interface Props {
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  hasPendingRefill: boolean;
}

export default function RefillRequestButton({ prescriptionId, patientId, doctorId, medicationName, hasPendingRefill }: Props) {
  const [sent, setSent] = useState(hasPendingRefill);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestRefill = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/refill-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prescription_id: prescriptionId, patient_id: patientId, doctor_id: doctorId }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to send request");
    else setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Refill request pending
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={requestRefill}
        disabled={loading}
        className="text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> : null}
        Request Refill
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

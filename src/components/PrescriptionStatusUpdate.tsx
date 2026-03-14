"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  prescriptionId: string;
  currentStatus: string;
}

export default function PrescriptionStatusUpdate({ prescriptionId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/prescriptions/${prescriptionId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  if (currentStatus !== "active") return null;

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
      <span className="text-xs text-[var(--text-muted)]">Update status:</span>
      <button
        onClick={() => updateStatus("completed")}
        disabled={loading}
        className="text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        Mark Completed
      </button>
      <button
        onClick={() => updateStatus("cancelled")}
        disabled={loading}
        className="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      {loading && <span className="w-3 h-3 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />}
    </div>
  );
}

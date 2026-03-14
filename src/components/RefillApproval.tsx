"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RefillRequest {
  id: string;
  prescription_id: string;
  status: string;
  patient_notes: string | null;
  requested_at: string;
  prescriptions: {
    patients: { name: string } | null;
    medications: { name: string } | null;
  } | null;
}

interface Props {
  requests: RefillRequest[];
}

export default function RefillApproval({ requests: initialRequests }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState<string | null>(null);

  const respond = async (id: string, status: "approved" | "denied") => {
    setLoading(id);
    await fetch("/api/refill-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setLoading(null);
    router.refresh();
  };

  if (requests.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Refill Requests</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Pending patient refill requests</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {requests.length} pending
        </span>
      </div>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {req.prescriptions?.patients?.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {req.prescriptions?.medications?.name} · {new Date(req.requested_at).toLocaleDateString()}
              </p>
              {req.patient_notes && (
                <p className="text-xs text-[var(--text-secondary)] italic mt-1">&quot;{req.patient_notes}&quot;</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => respond(req.id, "approved")}
                disabled={loading === req.id}
                className="text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => respond(req.id, "denied")}
                disabled={loading === req.id}
                className="text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

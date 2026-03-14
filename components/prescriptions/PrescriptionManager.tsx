"use client";

import { useState, useTransition } from "react";
import { updatePrescriptionAction, cancelPrescriptionAction } from "@/app/actions/prescriptions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type PrescriptionRow = {
  id: string;
  patient: string;
  medication: string;
  pharmacy: string;
  status: string;
  notes: string | null;
  updated_at: string | null;
};

interface PrescriptionManagerProps {
  initialPrescriptions: PrescriptionRow[];
}

const statusOptions = ["draft", "sent", "filled", "cancelled"];

export function PrescriptionManager({ initialPrescriptions }: PrescriptionManagerProps) {
  const [rows, setRows] = useState<PrescriptionRow[]>(initialPrescriptions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: "sent", notes: "" });
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!editingId) return;
    startTransition(async () => {
      const result = await updatePrescriptionAction({
        id: editingId,
        status: editForm.status,
        notes: editForm.notes
      });
      if (result.success && result.prescription) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === editingId
              ? { ...row, status: result.prescription.status, notes: result.prescription.notes }
              : row
          )
        );
        setEditingId(null);
      }
    });
  };

  const handleCancel = (id: string) => {
    if (!window.confirm("Cancel this prescription?")) return;
    startTransition(async () => {
      const result = await cancelPrescriptionAction(id);
      if (result.success) {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: "cancelled" } : row)));
      }
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">Prescription Management</h3>
      <div className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.patient}</TableCell>
                <TableCell>{row.medication}</TableCell>
                <TableCell>{row.pharmacy}</TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <select
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    row.status
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <Input value={editForm.notes ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                  ) : (
                    row.notes ?? "-"
                  )}
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  {editingId === row.id ? (
                    <>
                      <Button size="sm" onClick={handleUpdate} disabled={isPending}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(row.id);
                          setEditForm({ status: row.status, notes: row.notes ?? "" });
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCancel(row.id)}>
                        Cancel Rx
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
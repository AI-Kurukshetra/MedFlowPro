"use client";

import { useState, useTransition } from "react";
import { createPatientAction, updatePatientAction, deletePatientAction } from "@/app/actions/patients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PatientRow = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  contact?: string | null;
  medical_history?: string | null;
};

interface PatientManagerProps {
  initialPatients: PatientRow[];
}

export function PatientManager({ initialPatients }: PatientManagerProps) {
  const [patients, setPatients] = useState<PatientRow[]>(initialPatients);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    contact: "",
    medical_history: "",
    allergies: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(form);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createPatientAction({
        full_name: form.full_name,
        age: Number(form.age || 0),
        gender: form.gender,
        contact: form.contact,
        medical_history: form.medical_history,
        allergies: form.allergies
      });
      if (result.success && result.patient) {
        setPatients((prev) => [result.patient as PatientRow, ...prev]);
        setForm({ full_name: "", age: "", gender: "", contact: "", medical_history: "", allergies: "" });
      }
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    startTransition(async () => {
      const result = await updatePatientAction({
        id: editingId,
        full_name: editForm.full_name,
        age: Number(editForm.age || 0),
        gender: editForm.gender,
        contact: editForm.contact,
        medical_history: editForm.medical_history,
        allergies: editForm.allergies
      });
      if (result.success && result.patient) {
        setPatients((prev) => prev.map((row) => (row.id === editingId ? (result.patient as PatientRow) : row)));
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this patient?")) return;
    startTransition(async () => {
      const result = await deletePatientAction(id);
      if (result.success) {
        setPatients((prev) => prev.filter((row) => row.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-slate-900">Add Patient</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <Input placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
          <Input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <Input placeholder="Medical history" value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} />
          <Input placeholder="Allergies (comma separated)" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
        </div>
        <div className="mt-4">
          <Button onClick={handleCreate} disabled={isPending}>Create Patient</Button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-slate-900">Patients</h3>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Medical History</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    {editingId === patient.id ? (
                      <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                    ) : (
                      patient.full_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === patient.id ? (
                      <Input value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
                    ) : (
                      patient.age
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === patient.id ? (
                      <Input value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })} />
                    ) : (
                      patient.gender
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === patient.id ? (
                      <Input value={editForm.contact ?? ""} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} />
                    ) : (
                      patient.contact ?? "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === patient.id ? (
                      <Input value={editForm.medical_history ?? ""} onChange={(e) => setEditForm({ ...editForm, medical_history: e.target.value })} />
                    ) : (
                      patient.medical_history ?? "-"
                    )}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {editingId === patient.id ? (
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
                            setEditingId(patient.id);
                            setEditForm({
                              full_name: patient.full_name,
                              age: String(patient.age ?? ""),
                              gender: patient.gender ?? "",
                              contact: patient.contact ?? "",
                              medical_history: patient.medical_history ?? "",
                              allergies: ""
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(patient.id)}>Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
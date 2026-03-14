"use client";

import { useState, useTransition } from "react";
import type { StaffMember } from "@/types";
import { createStaffAction, updateStaffAction, deleteStaffAction } from "@/app/actions/staff";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roles = ["staff", "provider", "admin"];
const statuses = ["active", "inactive"];

interface StaffManagerProps {
  initialStaff: StaffMember[];
}

export function StaffManager({ initialStaff }: StaffManagerProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "staff",
    department: "",
    status: "active"
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(form);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createStaffAction(form);
      if (result.success && result.staff) {
        setStaff((prev) => [result.staff as StaffMember, ...prev]);
        setForm({ full_name: "", email: "", role: "staff", department: "", status: "active" });
      }
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    startTransition(async () => {
      const result = await updateStaffAction({ id: editingId, ...editForm });
      if (result.success && result.staff) {
        setStaff((prev) => prev.map((row) => (row.id === editingId ? (result.staff as StaffMember) : row)));
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this staff member?")) return;
    startTransition(async () => {
      const result = await deleteStaffAction(id);
      if (result.success) {
        setStaff((prev) => prev.filter((row) => row.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-slate-900">Add Staff</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <Input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <Button onClick={handleCreate} disabled={isPending}>Create Staff</Button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-slate-900">Staff Directory</h3>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                    ) : (
                      member.full_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                    ) : (
                      member.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <select
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      member.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <Input value={editForm.department ?? ""} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
                    ) : (
                      member.department ?? "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === member.id ? (
                      <select
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      member.status
                    )}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {editingId === member.id ? (
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
                            setEditingId(member.id);
                            setEditForm({
                              full_name: member.full_name,
                              email: member.email,
                              role: member.role,
                              department: member.department ?? "",
                              status: member.status
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(member.id)}>Delete</Button>
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
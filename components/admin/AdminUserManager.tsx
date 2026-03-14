"use client";

import { useState, useTransition } from "react";
import { createUserAction, assignRoleAction, deactivateUserAction } from "@/app/actions/admin-users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminUserRow {
  id: string;
  email: string;
}

interface AdminUserManagerProps {
  initialUsers: AdminUserRow[];
}

const roles = ["provider", "patient", "pharmacy", "admin", "staff"];

export function AdminUserManager({ initialUsers }: AdminUserManagerProps) {
  const [users, setUsers] = useState<AdminUserRow[]>(initialUsers);
  const [form, setForm] = useState({ email: "", password: "", role: "provider" });
  const [roleForm, setRoleForm] = useState({ userId: "", role: "provider" });
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createUserAction(form);
      if (result.success && result.user) {
        setUsers((prev) => [{ id: result.user.id, email: result.user.email ?? form.email }, ...prev]);
        setForm({ email: "", password: "", role: "provider" });
      }
    });
  };

  const handleAssignRole = () => {
    startTransition(async () => {
      await assignRoleAction({ userId: roleForm.userId, role: roleForm.role });
    });
  };

  const handleDeactivate = (userId: string) => {
    startTransition(async () => {
      await deactivateUserAction(userId);
    });
  };

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Create User</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <Button onClick={handleCreate} disabled={isPending}>Create User</Button>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Assign Role</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="User ID" value={roleForm.userId} onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })} />
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={roleForm.role}
            onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <Button onClick={handleAssignRole} disabled={isPending}>Assign Role</Button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-xs text-slate-500">{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => handleDeactivate(user.id)} disabled={isPending}>
                    Deactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
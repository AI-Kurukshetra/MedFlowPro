import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminUserManager } from "@/components/admin/AdminUserManager";

export default async function AdminUsersPage() {
  const adminClient = createSupabaseAdminClient();
  const { data } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 100 });
  const users = (data?.users ?? []).map((user) => ({ id: user.id, email: user.email ?? "" }));

  return (
    <div className="space-y-6">
      <div>
        <h2>Users</h2>
        <p>Create users, assign roles, and manage access.</p>
      </div>
      <AdminUserManager initialUsers={users} />
    </div>
  );
}
import { redirect } from "next/navigation";
import { getUserAndRoles, hasRole } from "@/lib/auth/roles";
import { AdminShell } from "@/components/layout/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getUserAndRoles();
  if (!user) {
    redirect("/login");
  }
  if (!hasRole(roles, ["admin"])) {
    redirect("/login");
  }

  return <AdminShell userEmail={user.email ?? undefined}>{children}</AdminShell>;
}
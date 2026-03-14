import { redirect } from "next/navigation";
import { getUserAndRoles, hasRole } from "@/lib/auth/roles";
import { ProviderShell } from "@/components/layout/ProviderShell";

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getUserAndRoles();
  if (!user) {
    redirect("/login");
  }
  if (!hasRole(roles, ["provider", "admin", "staff"])) {
    redirect("/login");
  }

  return <ProviderShell userEmail={user.email ?? undefined}>{children}</ProviderShell>;
}
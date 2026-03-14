import { redirect } from "next/navigation";
import { getUserAndRoles, hasRole } from "@/lib/auth/roles";
import { PharmacyShell } from "@/components/layout/PharmacyShell";

export default async function PharmacyLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getUserAndRoles();
  if (!user) {
    redirect("/login");
  }
  if (!hasRole(roles, ["pharmacy"])) {
    redirect("/login");
  }

  return <PharmacyShell userEmail={user.email ?? undefined}>{children}</PharmacyShell>;
}
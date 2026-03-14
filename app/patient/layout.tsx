import { redirect } from "next/navigation";
import { getUserAndRoles, hasRole } from "@/lib/auth/roles";
import { PatientShell } from "@/components/layout/PatientShell";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getUserAndRoles();
  if (!user) {
    redirect("/login");
  }
  if (!hasRole(roles, ["patient"])) {
    redirect("/login");
  }

  return <PatientShell userEmail={user.email ?? undefined}>{children}</PatientShell>;
}
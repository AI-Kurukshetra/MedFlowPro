import { redirect } from "next/navigation";
import { getUserAndRoles } from "@/lib/auth/roles";
import { getRedirectForRoles } from "@/lib/auth/redirect";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getUserAndRoles();

  if (user) {
    redirect(getRedirectForRoles(roles));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      {children}
    </div>
  );
}
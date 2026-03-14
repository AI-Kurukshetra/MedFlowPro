import type { UserRole } from "@/lib/auth/roles";

export function getRedirectForRoles(roles: UserRole[]) {
  if (roles.includes("admin")) return "/admin/overview";
  if (roles.includes("provider") || roles.includes("staff")) return "/provider/dashboard";
  if (roles.includes("pharmacy")) return "/pharmacy/queue";
  if (roles.includes("patient")) return "/patient/medications";
  return "/login";
}
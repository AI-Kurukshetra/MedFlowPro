import { createSupabaseServerClient } from "@/lib/supabase/server";
import { firstOf } from "@/utils/relations";

export type UserRole = "admin" | "provider" | "patient" | "pharmacy" | "staff";

export async function getUserAndRoles() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { user: null, roles: [] as UserRole[] };
  }

  const { data } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userData.user.id);

  const roleRows = (data ?? []) as any[];
  const roles = roleRows
    .map((row) => firstOf(row.roles)?.name)
    .filter(Boolean) as UserRole[];

  return { user: userData.user, roles };
}

export function hasRole(roles: UserRole[], allowed: UserRole[]) {
  return allowed.some((role) => roles.includes(role));
}

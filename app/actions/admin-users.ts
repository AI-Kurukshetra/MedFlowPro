"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1)
});

const AssignRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().min(1)
});

export async function createUserAction(input: z.infer<typeof CreateUserSchema>) {
  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) return { success: false, message: "Not authorized" };

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true
  });

  if (error || !data.user) {
    return { success: false, message: "Unable to create user" };
  }

  const { data: roles } = await adminClient.from("roles").select("id, name");
  const roleId = roles?.find((role) => role.name === parsed.data.role)?.id;
  if (roleId) {
    await adminClient.from("user_roles").upsert({ user_id: data.user.id, role_id: roleId });
  }

  return { success: true, message: "User created", user: data.user };
}

export async function assignRoleAction(input: z.infer<typeof AssignRoleSchema>) {
  const parsed = AssignRoleSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid input" };

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) return { success: false, message: "Not authorized" };

  const adminClient = createSupabaseAdminClient();
  const { data: roles } = await adminClient.from("roles").select("id, name");
  const roleId = roles?.find((role) => role.name === parsed.data.role)?.id;
  if (!roleId) return { success: false, message: "Role not found" };

  await adminClient.from("user_roles").upsert({ user_id: parsed.data.userId, role_id: roleId });
  return { success: true, message: "Role assigned" };
}

export async function deactivateUserAction(userId: string) {
  if (!userId) return { success: false, message: "Missing user id" };

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) return { success: false, message: "Not authorized" };

  const adminClient = createSupabaseAdminClient();
  const bannedUntil = new Date("3000-01-01T00:00:00Z").toISOString();
  await adminClient.auth.admin.updateUserById(userId, { banned_until: bannedUntil } as any);

  return { success: true, message: "User deactivated" };
}

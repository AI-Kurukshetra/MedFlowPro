"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const StaffSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  department: z.string().optional().nullable(),
  status: z.string().min(1)
});

const StaffUpdateSchema = StaffSchema.extend({
  id: z.string().uuid()
});

export async function createStaffAction(input: z.infer<typeof StaffSchema>) {
  const parsed = StaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fill all required fields." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { data, error } = await supabase
    .from("staff")
    .insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      role: parsed.data.role,
      department: parsed.data.department ?? null,
      status: parsed.data.status
    })
    .select("id, full_name, email, role, department, status")
    .single();

  if (error || !data) {
    return { success: false, message: "Unable to create staff member." };
  }

  return { success: true, message: "Staff member created.", staff: data };
}

export async function updateStaffAction(input: z.infer<typeof StaffUpdateSchema>) {
  const parsed = StaffUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid update payload." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { data, error } = await supabase
    .from("staff")
    .update({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      role: parsed.data.role,
      department: parsed.data.department ?? null,
      status: parsed.data.status
    })
    .eq("id", parsed.data.id)
    .select("id, full_name, email, role, department, status")
    .single();

  if (error || !data) {
    return { success: false, message: "Unable to update staff member." };
  }

  return { success: true, message: "Staff member updated.", staff: data };
}

export async function deleteStaffAction(id: string) {
  if (!id) {
    return { success: false, message: "Missing staff id." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  if (!isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) {
    return { success: false, message: "Unable to delete staff member." };
  }

  return { success: true, message: "Staff member deleted." };
}
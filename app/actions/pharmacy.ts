"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function fillPrescriptionAction(id: string) {
  if (!id) return { success: false, message: "Missing prescription id." };
  const supabase = createSupabaseServerClient();
  const { data: isPharmacy } = await supabase.rpc("has_role", { role_name: "pharmacy" });
  if (!isPharmacy) return { success: false, message: "Not authorized." };

  const { data, error } = await supabase
    .from("prescriptions")
    .update({ status: "filled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) return { success: false, message: "Unable to fill prescription." };

  await supabase.from("prescription_logs").insert({
    prescription_id: id,
    action: "prescription_filled",
    metadata: { status: "filled" }
  });

  return { success: true };
}

export async function rejectPrescriptionAction(id: string) {
  if (!id) return { success: false, message: "Missing prescription id." };
  const supabase = createSupabaseServerClient();
  const { data: isPharmacy } = await supabase.rpc("has_role", { role_name: "pharmacy" });
  if (!isPharmacy) return { success: false, message: "Not authorized." };

  const { data, error } = await supabase
    .from("prescriptions")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) return { success: false, message: "Unable to reject prescription." };

  await supabase.from("prescription_logs").insert({
    prescription_id: id,
    action: "prescription_rejected",
    metadata: { status: "cancelled" }
  });

  return { success: true };
}
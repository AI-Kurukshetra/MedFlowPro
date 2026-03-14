"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InteractionWarning } from "@/types";

const ItemSchema = z.object({
  medication_id: z.string().uuid(),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().min(1),
  instructions: z.string().min(1)
});

const CreatePrescriptionSchema = z.object({
  patientId: z.string().uuid(),
  pharmacyId: z.string().uuid(),
  items: z.array(ItemSchema).min(1)
});

const InteractionSchema = z.object({
  patientId: z.string().uuid(),
  medicationIds: z.array(z.string().uuid()).min(1)
});

async function logAuditEvent(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  payload: {
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }
) {
  await supabase.from("audit_logs").insert({
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId,
    metadata: payload.metadata ?? {}
  });
}

export async function checkInteractionsAction(input: z.infer<typeof InteractionSchema>) {
  const parsed = InteractionSchema.safeParse(input);
  if (!parsed.success) {
    return [] satisfies InteractionWarning[];
  }

  const supabase = createSupabaseServerClient();

  const idList = parsed.data.medicationIds.join(",");

  const { data: interactions } = await supabase
    .from("drug_interactions")
    .select("id, medication_id_1, medication_id_2, severity, warning, interaction_kind, allergy_name")
    .or(
      `and(interaction_kind.eq.drug_drug,medication_id_1.in.(${idList}),medication_id_2.in.(${idList})),and(interaction_kind.eq.drug_allergy,medication_id_1.in.(${idList}))`
    );

  const { data: allergies } = await supabase
    .from("allergies")
    .select("allergy_name")
    .eq("patient_id", parsed.data.patientId);

  const allergyNames = new Set((allergies ?? []).map((a) => a.allergy_name.toLowerCase()));

  const warnings: InteractionWarning[] = [];

  (interactions ?? []).forEach((interaction) => {
    if (interaction.interaction_kind === "drug_allergy" && interaction.allergy_name) {
      if (allergyNames.has(interaction.allergy_name.toLowerCase())) {
        warnings.push({
          id: interaction.id,
          title: "Drug-Allergy Conflict",
          description: interaction.warning,
          severity: interaction.severity
        });
      }
      return;
    }

    warnings.push({
      id: interaction.id,
      title: "Drug-Drug Interaction",
      description: interaction.warning,
      severity: interaction.severity
    });
  });

  return warnings;
}

export async function createPrescriptionAction(input: z.infer<typeof CreatePrescriptionSchema>) {
  const parsed = CreatePrescriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fill all required fields." };
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user?.id ?? "")
    .single();

  if (isProvider && !provider?.id) {
    return { success: false, message: "Provider profile missing. Contact admin." };
  }

  const { data: prescription, error } = await supabase
    .from("prescriptions")
    .insert({
      patient_id: parsed.data.patientId,
      pharmacy_id: parsed.data.pharmacyId,
      provider_id: isAdmin ? provider?.id ?? null : provider?.id,
      status: "sent"
    })
    .select("id")
    .single();

  if (error || !prescription) {
    return { success: false, message: "Unable to create prescription." };
  }

  const itemsPayload = parsed.data.items.map((item) => ({
    prescription_id: prescription.id,
    medication_id: item.medication_id,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    instructions: item.instructions
  }));

  await supabase.from("prescription_items").insert(itemsPayload);
  await logAuditEvent(supabase, {
    action: "prescription_created",
    entityType: "prescription",
    entityId: prescription.id,
    metadata: {
      patient_id: parsed.data.patientId,
      pharmacy_id: parsed.data.pharmacyId,
      item_count: itemsPayload.length
    }
  });

  return { success: true, message: "Prescription sent successfully." };
}


const UpdatePrescriptionSchema = z.object({
  id: z.string().uuid(),
  status: z.string().min(1),
  notes: z.string().optional().nullable()
});

export async function updatePrescriptionAction(input: z.infer<typeof UpdatePrescriptionSchema>) {
  const parsed = UpdatePrescriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid update payload." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });

  if (!isAdmin && !isProvider) {
    return { success: false, message: "Not authorized." };
  }

  const { data: prescription, error } = await supabase
    .from("prescriptions")
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.data.id)
    .select("id, status, notes")
    .single();

  if (error || !prescription) {
    return { success: false, message: "Unable to update prescription." };
  }

  await supabase.from("prescription_logs").insert({
    prescription_id: prescription.id,
    action: "prescription_updated",
    metadata: { status: prescription.status }
  });

  return { success: true, message: "Prescription updated.", prescription };
}

export async function cancelPrescriptionAction(id: string) {
  if (!id) {
    return { success: false, message: "Missing prescription id." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });

  if (!isAdmin && !isProvider) {
    return { success: false, message: "Not authorized." };
  }

  const { data: prescription, error } = await supabase
    .from("prescriptions")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !prescription) {
    return { success: false, message: "Unable to cancel prescription." };
  }

  await supabase.from("prescription_logs").insert({
    prescription_id: prescription.id,
    action: "prescription_cancelled",
    metadata: { status: prescription.status }
  });

  return { success: true, message: "Prescription cancelled." };
}

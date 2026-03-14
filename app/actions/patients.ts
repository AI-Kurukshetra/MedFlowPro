"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PatientSchema = z.object({
  full_name: z.string().min(1),
  age: z.coerce.number().min(0),
  gender: z.string().min(1),
  contact: z.string().optional().nullable(),
  medical_history: z.string().optional().nullable(),
  allergies: z.string().optional().nullable()
});

const PatientUpdateSchema = PatientSchema.extend({
  id: z.string().uuid()
});

function parseAllergies(allergies?: string | null) {
  if (!allergies) return [];
  return allergies
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createPatientAction(input: z.infer<typeof PatientSchema>) {
  const parsed = PatientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fill all required fields." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });

  if (!isProvider && !isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .insert({
      full_name: parsed.data.full_name,
      age: parsed.data.age,
      gender: parsed.data.gender,
      contact: parsed.data.contact ?? null,
      medical_history: parsed.data.medical_history ?? null
    })
    .select("id, full_name, age, gender, contact, medical_history, risk_level")
    .single();

  if (error || !patient) {
    return { success: false, message: "Unable to create patient." };
  }

  const allergyList = parseAllergies(parsed.data.allergies);
  if (allergyList.length) {
    await supabase.from("allergies").insert(
      allergyList.map((allergy) => ({ patient_id: patient.id, allergy_name: allergy }))
    );
  }

  return { success: true, message: "Patient created.", patient };
}

export async function updatePatientAction(input: z.infer<typeof PatientUpdateSchema>) {
  const parsed = PatientUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid update payload." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });

  if (!isProvider && !isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .update({
      full_name: parsed.data.full_name,
      age: parsed.data.age,
      gender: parsed.data.gender,
      contact: parsed.data.contact ?? null,
      medical_history: parsed.data.medical_history ?? null
    })
    .eq("id", parsed.data.id)
    .select("id, full_name, age, gender, contact, medical_history, risk_level")
    .single();

  if (error || !patient) {
    return { success: false, message: "Unable to update patient." };
  }

  const allergyList = parseAllergies(parsed.data.allergies);
  await supabase.from("allergies").delete().eq("patient_id", patient.id);
  if (allergyList.length) {
    await supabase.from("allergies").insert(
      allergyList.map((allergy) => ({ patient_id: patient.id, allergy_name: allergy }))
    );
  }

  return { success: true, message: "Patient updated.", patient };
}

export async function deletePatientAction(id: string) {
  if (!id) {
    return { success: false, message: "Missing patient id." };
  }

  const supabase = createSupabaseServerClient();
  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });

  if (!isProvider && !isAdmin) {
    return { success: false, message: "Not authorized." };
  }

  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) {
    return { success: false, message: "Unable to delete patient." };
  }

  return { success: true, message: "Patient deleted." };
}
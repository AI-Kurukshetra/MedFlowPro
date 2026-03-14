import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  analyzePatientProfile,
  suggestMedications,
  checkInteractions,
  generateDosageRecommendation
} from "@/lib/ai/prescribing-assistant";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.patientId) {
    return NextResponse.json({ error: "Missing patient" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: isProvider } = await supabase.rpc("has_role", { role_name: "provider" });
  const { data: isAdmin } = await supabase.rpc("has_role", { role_name: "admin" });

  if (!isProvider && !isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const patientId = body.patientId as string;
  const condition = (body.condition as string) ?? "";
  const selectedMedicationIds = (body.selectedMedicationIds as string[]) ?? [];

  const [{ data: allergies }, { data: history }, { data: conditions }, { data: diagnoses }, { data: meds }] =
    await Promise.all([
      supabase.from("allergies").select("allergy_name").eq("patient_id", patientId),
      supabase
        .from("medication_history")
        .select("medications(id, drug_name, strength, route)")
        .eq("patient_id", patientId)
        .eq("status", "current"),
      supabase.from("conditions").select("condition_name").eq("patient_id", patientId),
      supabase.from("diagnoses").select("diagnosis_name").eq("patient_id", patientId),
      supabase.from("medications").select("id, drug_name, strength, route")
    ]);

  const allergyList = (allergies ?? []).map((row) => row.allergy_name);
  const currentMedications = (history ?? []).flatMap((row) => {
    const med = row.medications as any;
    if (!med) return [];
    if (Array.isArray(med)) {
      return med.map((entry) => ({
        id: entry.id,
        drug_name: entry.drug_name,
        strength: entry.strength,
        route: entry.route
      }));
    }
    return [
      {
        id: med.id,
        drug_name: med.drug_name,
        strength: med.strength,
        route: med.route
      }
    ];
  });

  const conditionList = [
    ...(conditions ?? []).map((row) => row.condition_name),
    ...(diagnoses ?? []).map((row) => row.diagnosis_name)
  ];

  const profile = analyzePatientProfile(allergyList, currentMedications, conditionList);
  const suggestions = condition ? suggestMedications(condition, (meds ?? []) as any[]) : [];

  const idList = selectedMedicationIds.join(",");
  const { data: interactions } = await supabase
    .from("drug_interactions")
    .select("medication_id_1, medication_id_2, interaction_kind, allergy_name, warning, severity")
    .or(
      idList
        ? `and(interaction_kind.eq.drug_drug,medication_id_1.in.(${idList}),medication_id_2.in.(${idList})),and(interaction_kind.eq.drug_allergy,medication_id_1.in.(${idList}))`
        : "interaction_kind.eq.drug_allergy"
    );

  const warnings = checkInteractions(selectedMedicationIds, interactions ?? [], allergyList, currentMedications);

  const selectedMedName = ((meds ?? []) as any[]).find((med) => selectedMedicationIds[0] === med.id)?.drug_name ?? "";
  const dosageRecommendation = selectedMedName ? generateDosageRecommendation(selectedMedName) : "";

  await supabase.from("ai_recommendations").insert({
    patient_id: patientId,
    condition,
    recommendations: suggestions,
    warnings,
    created_by: user.id
  });

  return NextResponse.json({
    profile,
    suggestions,
    warnings,
    dosageRecommendation,
    selectedMedication: selectedMedName
  });
}

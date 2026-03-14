import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE environment variables. Check .env.local.");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const DEMO_PASSWORD = "demo123";

const demoAccounts = {
  provider: { email: "provider@medflow.dev", name: "Demo Provider" },
  admin: { email: "admin@medflow.dev", name: "Demo Admin" },
  pharmacy: { email: "pharmacy@medflow.dev", name: "Demo Pharmacy" },
  patient: { email: "patient@medflow.dev", name: "Demo Patient" }
};

const providerSeed = [
  { full_name: "Dr. Natalie Brooks", email: "natalie.brooks@medflow.demo" },
  { full_name: "Dr. Samuel Ortega", email: "samuel.ortega@medflow.demo" },
  { full_name: "Dr. Priya Iyer", email: "priya.iyer@medflow.demo" },
  { full_name: "Dr. Ethan Chen", email: "ethan.chen@medflow.demo" },
  { full_name: "Dr. Lila Morgan", email: "lila.morgan@medflow.demo" }
];

const patientSeed = [
  { full_name: "Avery Collins", age: 45, gender: "Female", risk_level: "High" },
  { full_name: "Daniel Wong", age: 58, gender: "Male", risk_level: "Medium" },
  { full_name: "Sophia Patel", age: 31, gender: "Female", risk_level: "Low" },
  { full_name: "Marcus Reed", age: 67, gender: "Male", risk_level: "High" },
  { full_name: "Iris Johnson", age: 52, gender: "Female", risk_level: "Medium" },
  { full_name: "Jamal Carter", age: 39, gender: "Male", risk_level: "Low" },
  { full_name: "Elena Rivera", age: 28, gender: "Female", risk_level: "Low" },
  { full_name: "Noah Simmons", age: 60, gender: "Male", risk_level: "Medium" },
  { full_name: "Hannah Lee", age: 34, gender: "Female", risk_level: "Low" },
  { full_name: "Victor Alvarez", age: 48, gender: "Male", risk_level: "Medium" }
];

const pharmacySeed = [
  {
    pharmacy_id: "PH-1001",
    pharmacy_name: "Riverside Pharmacy",
    address: "124 North Elm St",
    city: "Boston",
    state: "MA",
    zip: "02110",
    phone: "(617) 555-0110",
    email: "contact@riversiderx.demo",
    operating_hours: "Mon-Sat 8am-8pm"
  },
  {
    pharmacy_id: "PH-1002",
    pharmacy_name: "Central Care RX",
    address: "88 Beacon Ave",
    city: "Cambridge",
    state: "MA",
    zip: "02139",
    phone: "(617) 555-0188",
    email: "support@centralcarerx.demo",
    operating_hours: "Daily 9am-9pm"
  },
  {
    pharmacy_id: "PH-1003",
    pharmacy_name: "Harbor Health Pharmacy",
    address: "460 Harbor Blvd",
    city: "Quincy",
    state: "MA",
    zip: "02169",
    phone: "(617) 555-0192",
    email: "hello@harborhealthrx.demo",
    operating_hours: "Mon-Fri 7am-7pm"
  },
  {
    pharmacy_id: "PH-1004",
    pharmacy_name: "MetroPoint Pharmacy",
    address: "12 Metro Point",
    city: "Somerville",
    state: "MA",
    zip: "02145",
    phone: "(617) 555-0104",
    email: "team@metropointrx.demo",
    operating_hours: "Daily 8am-10pm"
  },
  {
    pharmacy_id: "PH-1005",
    pharmacy_name: "Northline RX",
    address: "975 Northline Rd",
    city: "Medford",
    state: "MA",
    zip: "02155",
    phone: "(617) 555-0144",
    email: "northline@rx.demo",
    operating_hours: "Mon-Sat 8am-6pm"
  }
];

const staffSeed = [
  {
    full_name: "Olivia Hart",
    email: "olivia.hart@medflow.demo",
    role: "staff",
    department: "Care Coordination",
    status: "active"
  },
  {
    full_name: "Miles Carter",
    email: "miles.carter@medflow.demo",
    role: "staff",
    department: "Operations",
    status: "active"
  },
  {
    full_name: "Asha Gomez",
    email: "asha.gomez@medflow.demo",
    role: "staff",
    department: "Clinical Support",
    status: "inactive"
  }
];

const medicationSeed = [
  { drug_name: "Atorvastatin", generic_name: "atorvastatin", brand_name: "Lipitor", dosage_forms: "tablet", strength: "20 mg", route: "Oral" },
  { drug_name: "Lisinopril", generic_name: "lisinopril", brand_name: "Prinivil", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Metformin", generic_name: "metformin", brand_name: "Glucophage", dosage_forms: "tablet", strength: "500 mg", route: "Oral" },
  { drug_name: "Amlodipine", generic_name: "amlodipine", brand_name: "Norvasc", dosage_forms: "tablet", strength: "5 mg", route: "Oral" },
  { drug_name: "Levothyroxine", generic_name: "levothyroxine", brand_name: "Synthroid", dosage_forms: "tablet", strength: "50 mcg", route: "Oral" },
  { drug_name: "Losartan", generic_name: "losartan", brand_name: "Cozaar", dosage_forms: "tablet", strength: "50 mg", route: "Oral" },
  { drug_name: "Omeprazole", generic_name: "omeprazole", brand_name: "Prilosec", dosage_forms: "capsule", strength: "20 mg", route: "Oral" },
  { drug_name: "Sertraline", generic_name: "sertraline", brand_name: "Zoloft", dosage_forms: "tablet", strength: "50 mg", route: "Oral" },
  { drug_name: "Warfarin", generic_name: "warfarin", brand_name: "Coumadin", dosage_forms: "tablet", strength: "5 mg", route: "Oral" },
  { drug_name: "Aspirin", generic_name: "aspirin", brand_name: "Bayer", dosage_forms: "tablet", strength: "81 mg", route: "Oral" },
  { drug_name: "Clopidogrel", generic_name: "clopidogrel", brand_name: "Plavix", dosage_forms: "tablet", strength: "75 mg", route: "Oral" },
  { drug_name: "Albuterol", generic_name: "albuterol", brand_name: "ProAir", dosage_forms: "inhaler", strength: "90 mcg", route: "Inhalation" },
  { drug_name: "Fluticasone", generic_name: "fluticasone", brand_name: "Flonase", dosage_forms: "spray", strength: "50 mcg", route: "Nasal" },
  { drug_name: "Hydrochlorothiazide", generic_name: "hydrochlorothiazide", brand_name: "Microzide", dosage_forms: "tablet", strength: "25 mg", route: "Oral" },
  { drug_name: "Furosemide", generic_name: "furosemide", brand_name: "Lasix", dosage_forms: "tablet", strength: "20 mg", route: "Oral" },
  { drug_name: "Gabapentin", generic_name: "gabapentin", brand_name: "Neurontin", dosage_forms: "capsule", strength: "300 mg", route: "Oral" },
  { drug_name: "Amoxicillin", generic_name: "amoxicillin", brand_name: "Amoxil", dosage_forms: "capsule", strength: "500 mg", route: "Oral" },
  { drug_name: "Azithromycin", generic_name: "azithromycin", brand_name: "Zithromax", dosage_forms: "tablet", strength: "250 mg", route: "Oral" },
  { drug_name: "Ciprofloxacin", generic_name: "ciprofloxacin", brand_name: "Cipro", dosage_forms: "tablet", strength: "500 mg", route: "Oral" },
  { drug_name: "Ibuprofen", generic_name: "ibuprofen", brand_name: "Advil", dosage_forms: "tablet", strength: "200 mg", route: "Oral" },
  { drug_name: "Naproxen", generic_name: "naproxen", brand_name: "Aleve", dosage_forms: "tablet", strength: "220 mg", route: "Oral" },
  { drug_name: "Insulin Glargine", generic_name: "insulin glargine", brand_name: "Lantus", dosage_forms: "injection", strength: "100 units/mL", route: "Subcutaneous" },
  { drug_name: "Metoprolol", generic_name: "metoprolol", brand_name: "Lopressor", dosage_forms: "tablet", strength: "50 mg", route: "Oral" },
  { drug_name: "Duloxetine", generic_name: "duloxetine", brand_name: "Cymbalta", dosage_forms: "capsule", strength: "30 mg", route: "Oral" },
  { drug_name: "Prednisone", generic_name: "prednisone", brand_name: "Deltasone", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Montelukast", generic_name: "montelukast", brand_name: "Singulair", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Budesonide", generic_name: "budesonide", brand_name: "Pulmicort", dosage_forms: "inhaler", strength: "180 mcg", route: "Inhalation" },
  { drug_name: "Cetirizine", generic_name: "cetirizine", brand_name: "Zyrtec", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Escitalopram", generic_name: "escitalopram", brand_name: "Lexapro", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Rosuvastatin", generic_name: "rosuvastatin", brand_name: "Crestor", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Tramadol", generic_name: "tramadol", brand_name: "Ultram", dosage_forms: "tablet", strength: "50 mg", route: "Oral" },
  { drug_name: "Clindamycin", generic_name: "clindamycin", brand_name: "Cleocin", dosage_forms: "capsule", strength: "300 mg", route: "Oral" },
  { drug_name: "Cyclobenzaprine", generic_name: "cyclobenzaprine", brand_name: "Flexeril", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Pantoprazole", generic_name: "pantoprazole", brand_name: "Protonix", dosage_forms: "tablet", strength: "40 mg", route: "Oral" },
  { drug_name: "Spironolactone", generic_name: "spironolactone", brand_name: "Aldactone", dosage_forms: "tablet", strength: "25 mg", route: "Oral" },
  { drug_name: "Tamsulosin", generic_name: "tamsulosin", brand_name: "Flomax", dosage_forms: "capsule", strength: "0.4 mg", route: "Oral" },
  { drug_name: "Losartan-HCTZ", generic_name: "losartan/hydrochlorothiazide", brand_name: "Hyzaar", dosage_forms: "tablet", strength: "50/12.5 mg", route: "Oral" },
  { drug_name: "Sitagliptin", generic_name: "sitagliptin", brand_name: "Januvia", dosage_forms: "tablet", strength: "100 mg", route: "Oral" },
  { drug_name: "Dapagliflozin", generic_name: "dapagliflozin", brand_name: "Farxiga", dosage_forms: "tablet", strength: "10 mg", route: "Oral" },
  { drug_name: "Semaglutide", generic_name: "semaglutide", brand_name: "Ozempic", dosage_forms: "injection", strength: "0.5 mg", route: "Subcutaneous" },
  { drug_name: "Meloxicam", generic_name: "meloxicam", brand_name: "Mobic", dosage_forms: "tablet", strength: "7.5 mg", route: "Oral" },
  { drug_name: "Rivaroxaban", generic_name: "rivaroxaban", brand_name: "Xarelto", dosage_forms: "tablet", strength: "20 mg", route: "Oral" },
  { drug_name: "Apixaban", generic_name: "apixaban", brand_name: "Eliquis", dosage_forms: "tablet", strength: "5 mg", route: "Oral" },
  { drug_name: "Fluoxetine", generic_name: "fluoxetine", brand_name: "Prozac", dosage_forms: "capsule", strength: "20 mg", route: "Oral" },
  { drug_name: "Bupropion", generic_name: "bupropion", brand_name: "Wellbutrin", dosage_forms: "tablet", strength: "150 mg", route: "Oral" },
  { drug_name: "Famotidine", generic_name: "famotidine", brand_name: "Pepcid", dosage_forms: "tablet", strength: "20 mg", route: "Oral" },
  { drug_name: "Ondansetron", generic_name: "ondansetron", brand_name: "Zofran", dosage_forms: "tablet", strength: "4 mg", route: "Oral" },
  { drug_name: "Allopurinol", generic_name: "allopurinol", brand_name: "Zyloprim", dosage_forms: "tablet", strength: "100 mg", route: "Oral" },
  { drug_name: "Metronidazole", generic_name: "metronidazole", brand_name: "Flagyl", dosage_forms: "tablet", strength: "500 mg", route: "Oral" },
  { drug_name: "Doxycycline", generic_name: "doxycycline", brand_name: "Vibramycin", dosage_forms: "capsule", strength: "100 mg", route: "Oral" }
];

type InteractionSeed = {
  drug_a: string;
  drug_b?: string;
  severity: "low" | "moderate" | "high";
  warning: string;
  kind?: "drug_drug" | "drug_allergy";
  allergy_name?: string;
};

const interactionSeed: InteractionSeed[] = [
  { drug_a: "Warfarin", drug_b: "Aspirin", severity: "high", warning: "Increased bleeding risk" },
  { drug_a: "Warfarin", drug_b: "Ibuprofen", severity: "high", warning: "Bleeding risk amplified" },
  { drug_a: "Lisinopril", drug_b: "Spironolactone", severity: "moderate", warning: "Monitor potassium levels" },
  { drug_a: "Metformin", drug_b: "Dapagliflozin", severity: "moderate", warning: "Monitor renal function" },
  { drug_a: "Sertraline", drug_b: "Tramadol", severity: "high", warning: "Serotonin syndrome risk" },
  { drug_a: "Clopidogrel", drug_b: "Omeprazole", severity: "moderate", warning: "Reduced antiplatelet effect" },
  { drug_a: "Metoprolol", drug_b: "Fluoxetine", severity: "moderate", warning: "Increased beta-blocker effects" },
  { drug_a: "Amlodipine", drug_b: "Atorvastatin", severity: "moderate", warning: "Monitor statin toxicity" },
  { drug_a: "Rivaroxaban", drug_b: "Aspirin", severity: "high", warning: "Increased bleeding risk" },
  { drug_a: "Apixaban", drug_b: "Naproxen", severity: "high", warning: "Bleeding risk" },
  { drug_a: "Duloxetine", drug_b: "Ibuprofen", severity: "moderate", warning: "GI bleeding risk" },
  { drug_a: "Bupropion", drug_b: "Tramadol", severity: "high", warning: "Seizure threshold lowered" },
  { drug_a: "Metronidazole", drug_b: "Warfarin", severity: "high", warning: "Bleeding risk" },
  { drug_a: "Ondansetron", drug_b: "Fluoxetine", severity: "moderate", warning: "QT prolongation risk" },
  { drug_a: "Cyclobenzaprine", drug_b: "Sertraline", severity: "moderate", warning: "CNS depression" },
  { drug_a: "Meloxicam", drug_b: "Lisinopril", severity: "moderate", warning: "Reduced antihypertensive effect" },
  { drug_a: "Dapagliflozin", drug_b: "Furosemide", severity: "moderate", warning: "Volume depletion risk" },
  { drug_a: "Amoxicillin", severity: "high", warning: "Penicillin allergy alert", kind: "drug_allergy", allergy_name: "Penicillin" },
  { drug_a: "Ibuprofen", severity: "moderate", warning: "NSAID allergy alert", kind: "drug_allergy", allergy_name: "NSAIDs" },
  { drug_a: "Hydrochlorothiazide", severity: "moderate", warning: "Sulfa allergy risk", kind: "drug_allergy", allergy_name: "Sulfa" }
];

const allergySeed = [
  { allergy_name: "Penicillin", severity: "high" },
  { allergy_name: "NSAIDs", severity: "moderate" },
  { allergy_name: "Sulfa", severity: "moderate" }
];

const conditionSeed = [
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Hyperlipidemia",
  "Depression"
];

async function findUserByEmail(email: string) {
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      throw error;
    }

    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) {
      return match;
    }

    lastPage = data.lastPage ?? page;
    if (!data.nextPage) {
      break;
    }
    page = data.nextPage;
  }

  return null;
}

async function getOrCreateUser(email: string, password: string, fullName: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (error || !data.user) {
    throw error ?? new Error("Unable to create user");
  }

  return data.user;
}

async function assignRole(userId: string, roleId?: string) {
  if (!roleId) return;
  await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role_id: roleId }, { onConflict: "user_id,role_id" });
}

async function seed() {
  const roles = await supabase.from("roles").select("id, name");
  const roleMap = new Map(roles.data?.map((role) => [role.name, role.id]));

  const demoProviderUser = await getOrCreateUser(
    demoAccounts.provider.email,
    DEMO_PASSWORD,
    demoAccounts.provider.name
  );
  const demoAdminUser = await getOrCreateUser(
    demoAccounts.admin.email,
    DEMO_PASSWORD,
    demoAccounts.admin.name
  );
  const demoPharmacyUser = await getOrCreateUser(
    demoAccounts.pharmacy.email,
    DEMO_PASSWORD,
    demoAccounts.pharmacy.name
  );
  const demoPatientUser = await getOrCreateUser(
    demoAccounts.patient.email,
    DEMO_PASSWORD,
    demoAccounts.patient.name
  );

  await assignRole(demoProviderUser.id, roleMap.get("provider"));
  await assignRole(demoAdminUser.id, roleMap.get("admin"));
  await assignRole(demoPharmacyUser.id, roleMap.get("pharmacy"));
  await assignRole(demoPatientUser.id, roleMap.get("patient"));

  const { data: demoProviderRow } = await supabase
    .from("providers")
    .upsert({
      user_id: demoProviderUser.id,
      npi: "NPI-DEMO-1001",
      specialty: "Family Medicine"
    }, { onConflict: "user_id" })
    .select("id")
    .single();

  await supabase
    .from("pharmacies")
    .upsert({
      user_id: demoPharmacyUser.id,
      pharmacy_id: "PH-DEMO",
      pharmacy_name: "MedFlow Demo Pharmacy",
      address: "100 Demo Street",
      city: "Boston",
      state: "MA",
      zip: "02110",
      phone: "(617) 555-0000",
      email: demoAccounts.pharmacy.email,
      operating_hours: "Daily 8am-8pm"
    }, { onConflict: "user_id" });

  await supabase
    .from("patients")
    .upsert({
      user_id: demoPatientUser.id,
      primary_provider_id: demoProviderRow?.id ?? null,
      full_name: demoAccounts.patient.name,
      age: 42,
      gender: "Female",
      risk_level: "Medium"
    }, { onConflict: "user_id" });

    await supabase
    .from("staff")
    .upsert(staffSeed, { onConflict: "email" });

  const { data: existingMeds } = await supabase.from("medications").select("id").limit(1);
  if (existingMeds?.length) {
    console.log("Core seed data already exists. Demo accounts ensured.");
    return;
  }

  const providerUsers = [] as { userId: string; providerId: string; full_name: string }[];

  for (const provider of providerSeed) {
    const authUser = await getOrCreateUser(provider.email, "Medflow@2026", provider.full_name);

    await assignRole(authUser.id, roleMap.get("provider"));

    const { data: providerRow } = await supabase
      .from("providers")
      .upsert({
        user_id: authUser.id,
        npi: `NPI-${Math.floor(Math.random() * 900000 + 100000)}`,
        specialty: "Internal Medicine"
      }, { onConflict: "user_id" })
      .select("id")
      .single();

    if (providerRow) {
      providerUsers.push({ userId: authUser.id, providerId: providerRow.id, full_name: provider.full_name });
    }
  }

  type PharmacySeed = (typeof pharmacySeed)[number];
  type PharmacyInsert = PharmacySeed & { user_id: string | null };
  const pharmacyRows: PharmacyInsert[] = [];

  for (const pharmacy of pharmacySeed) {
    const authUser = await getOrCreateUser(pharmacy.email, "Medflow@2026", pharmacy.pharmacy_name);

    await assignRole(authUser.id, roleMap.get("pharmacy"));

    pharmacyRows.push({ ...pharmacy, user_id: authUser.id });
  }

  const { data: pharmacies } = await supabase.from("pharmacies").insert(pharmacyRows).select("id");
  const { data: medications } = await supabase.from("medications").insert(medicationSeed).select("id, drug_name");

  const patientRows = [] as { id: string }[];

  for (let i = 0; i < patientSeed.length; i += 1) {
    const patient = patientSeed[i];
    const provider = providerUsers[i % providerUsers.length];

    let patientUserId: string | null = null;
    if (i < 3) {
      const patientEmail = patient.full_name.toLowerCase().replace(/\s+/g, ".") + "@medflow.demo";
      const patientUser = await getOrCreateUser(patientEmail, "Medflow@2026", patient.full_name);
      patientUserId = patientUser.id;
      await assignRole(patientUserId, roleMap.get("patient"));
    }

    const { data: patientRow } = await supabase
      .from("patients")
      .insert({
        user_id: patientUserId,
        primary_provider_id: provider?.providerId ?? demoProviderRow?.id ?? null,
        full_name: patient.full_name,
        age: patient.age,
        gender: patient.gender,
        risk_level: patient.risk_level
      })
      .select("id")
      .single();

    if (patientRow) {
      patientRows.push(patientRow);
    }
  }

  const medicationMap = new Map((medications ?? []).map((med) => [med.drug_name, med.id]));

  const interactionRows = interactionSeed.map((interaction) => ({
    medication_id_1: medicationMap.get(interaction.drug_a),
    medication_id_2:
      interaction.kind === "drug_allergy" ? null : medicationMap.get(interaction.drug_b ?? ""),
    interaction_kind: interaction.kind ?? "drug_drug",
    allergy_name: interaction.allergy_name ?? null,
    severity: interaction.severity,
    warning: interaction.warning
  }));

  await supabase.from("drug_interactions").insert(interactionRows);

  for (const patient of patientRows) {
    const allergies = allergySeed
      .filter(() => Math.random() > 0.5)
      .map((allergy) => ({ ...allergy, patient_id: patient.id }));
    if (allergies.length) {
      await supabase.from("allergies").insert(allergies);
    }

    const conditions = conditionSeed
      .filter(() => Math.random() > 0.4)
      .map((condition) => ({ patient_id: patient.id, condition_name: condition }));
    if (conditions.length) {
      await supabase.from("conditions").insert(conditions);
    }
  }

  for (let i = 0; i < 50; i += 1) {
    const patient = patientRows[i % patientRows.length];
    const provider = providerUsers[i % providerUsers.length];
    const pharmacy = pharmacies?.[i % (pharmacies?.length ?? 1)];

    const { data: prescription } = await supabase
      .from("prescriptions")
      .insert({
        patient_id: patient.id,
        provider_id: provider?.providerId ?? demoProviderRow?.id ?? null,
        pharmacy_id: pharmacy?.id ?? null,
        status: "sent"
      })
      .select("id")
      .single();

    if (prescription) {
      const med = medications?.[i % (medications?.length ?? 1)];
      await supabase.from("prescription_items").insert({
        prescription_id: prescription.id,
        medication_id: med?.id,
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food"
      });
    }
  }

  for (let i = 0; i < patientRows.length; i += 1) {
    const patient = patientRows[i];
    const med = medications?.[i % (medications?.length ?? 1)];
    await supabase.from("medication_history").insert({
      patient_id: patient.id,
      medication_id: med?.id,
      status: "current",
      refill_status: "On schedule",
      start_date: new Date().toISOString().slice(0, 10)
    });

    await supabase.from("adherence_records").insert({
      patient_id: patient.id,
      medication_id: med?.id,
      status: i % 3 === 0 ? "needs_outreach" : "on_track",
      record_date: new Date().toISOString().slice(0, 10)
    });
  }

  console.log("Seed complete. Demo credentials:");
  console.log(`Provider: ${demoAccounts.provider.email} / ${DEMO_PASSWORD}`);
  console.log(`Admin: ${demoAccounts.admin.email} / ${DEMO_PASSWORD}`);
  console.log(`Pharmacy: ${demoAccounts.pharmacy.email} / ${DEMO_PASSWORD}`);
  console.log(`Patient: ${demoAccounts.patient.email} / ${DEMO_PASSWORD}`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

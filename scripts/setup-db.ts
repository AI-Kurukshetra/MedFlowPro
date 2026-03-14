/**
 * MedFlow Pro - Database Setup Script
 *
 * This script creates demo users and seed data in your Supabase project.
 *
 * Usage: npx ts-node scripts/setup-db.ts
 * Or:    npm run setup-db
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://onzlkldxlktbotcvpfvd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uemxrbGR4bGt0Ym90Y3ZwZnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTk3NzUsImV4cCI6MjA4OTAzNTc3NX0.R1r1qZzSj3ibHY_Ti-CwQIaEcwPzGkN4HOQyk3YvIso";

// For setup, we need the service role key (get from Supabase Dashboard > Settings > API)
// Replace with your service role key:
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DEMO_USERS = [
  {
    email: "dr.smith@medflow.com",
    password: "password123",
    full_name: "Dr. Smith",
    role: "doctor" as const,
  },
  {
    email: "dr.patel@medflow.com",
    password: "password123",
    full_name: "Dr. Patel",
    role: "doctor" as const,
  },
  {
    email: "john.doe@email.com",
    password: "password123",
    full_name: "John Doe",
    role: "patient" as const,
  },
  {
    email: "mary.johnson@email.com",
    password: "password123",
    full_name: "Mary Johnson",
    role: "patient" as const,
  },
  {
    email: "alex.brown@email.com",
    password: "password123",
    full_name: "Alex Brown",
    role: "patient" as const,
  },
];

async function setupDatabase() {
  console.log("🚀 Setting up MedFlow Pro database...\n");

  // Step 1: Create auth users and profiles
  const userIds: Record<string, string> = {};

  for (const user of DEMO_USERS) {
    console.log(`Creating user: ${user.email}...`);

    // Try to sign up
    const { data: authData, error: authError } =
      await supabase.auth.admin?.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      }) || { data: null, error: new Error("admin API not available") };

    if (authError) {
      console.log(`  ⚠ Could not create via admin API: ${authError.message}`);
      console.log(`  → Please create user ${user.email} manually in Supabase Dashboard`);
      continue;
    }

    if (authData?.user) {
      userIds[user.email] = authData.user.id;

      // Insert profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        });

      if (profileError) {
        console.log(`  ⚠ Profile error: ${profileError.message}`);
      } else {
        console.log(`  ✓ Created user: ${user.full_name} (${user.role})`);
      }
    }
  }

  // Step 2: Seed medications
  console.log("\nSeeding medications...");
  const medications = [
    { name: "Aspirin", description: "NSAID for pain, fever, and inflammation. Also used for heart attack prevention.", dosage: "81mg - 325mg", interaction_notes: "May interact with blood thinners, other NSAIDs. Avoid with Ibuprofen." },
    { name: "Ibuprofen", description: "NSAID used to relieve pain, reduce fever, and treat inflammation.", dosage: "200mg - 800mg", interaction_notes: "Avoid combining with Aspirin. Can affect blood pressure medications." },
    { name: "Metformin", description: "Oral diabetes medicine that helps control blood sugar levels. Used for type 2 diabetes.", dosage: "500mg - 2000mg", interaction_notes: "Avoid alcohol. Can interact with contrast dye used in imaging procedures." },
    { name: "Amoxicillin", description: "Penicillin antibiotic for bacterial infections.", dosage: "250mg - 500mg", interaction_notes: "May reduce effectiveness of oral contraceptives. Check for penicillin allergy." },
    { name: "Paracetamol", description: "Analgesic and antipyretic for mild to moderate pain and fever.", dosage: "500mg - 1000mg", interaction_notes: "Avoid exceeding recommended daily dose. Caution with liver disease or alcohol use." },
    { name: "Lisinopril", description: "ACE inhibitor for high blood pressure and heart failure.", dosage: "5mg - 40mg", interaction_notes: "Monitor potassium levels. Avoid with potassium supplements." },
    { name: "Atorvastatin", description: "Statin medication to lower cholesterol.", dosage: "10mg - 80mg", interaction_notes: "Avoid large quantities of grapefruit juice. Monitor for muscle pain." },
    { name: "Omeprazole", description: "Proton pump inhibitor that reduces stomach acid.", dosage: "20mg - 40mg", interaction_notes: "May affect absorption of certain medications." },
  ];

  const { error: medsError } = await supabase
    .from("medications")
    .upsert(medications, { onConflict: "name" });

  if (medsError) {
    console.log(`  ⚠ Medications error: ${medsError.message}`);
  } else {
    console.log(`  ✓ Seeded ${medications.length} medications`);
  }

  // Step 3: Create patients if we have doctor IDs
  const doctorSmithId = userIds["dr.smith@medflow.com"];

  if (doctorSmithId) {
    console.log("\nCreating patients for Dr. Smith...");
    const patients = [
      { doctor_id: doctorSmithId, name: "John Doe", dob: "1985-03-15", email: "john.doe@email.com", phone: "+1-555-0101" },
      { doctor_id: doctorSmithId, name: "Mary Johnson", dob: "1972-07-22", email: "mary.johnson@email.com", phone: "+1-555-0102" },
      { doctor_id: doctorSmithId, name: "Alex Brown", dob: "1990-11-08", email: "alex.brown@email.com", phone: "+1-555-0103" },
    ];

    const { data: insertedPatients, error: patientsError } = await supabase
      .from("patients")
      .insert(patients)
      .select();

    if (patientsError) {
      console.log(`  ⚠ Patients error: ${patientsError.message}`);
    } else {
      console.log(`  ✓ Created ${insertedPatients?.length} patients`);

      // Step 4: Get medication IDs
      const { data: medsData } = await supabase
        .from("medications")
        .select("id, name");

      const medMap: Record<string, string> = {};
      medsData?.forEach((m) => (medMap[m.name] = m.id));

      if (insertedPatients && medsData) {
        // Create sample prescriptions
        const john = insertedPatients.find((p: any) => p.name === "John Doe");
        const mary = insertedPatients.find((p: any) => p.name === "Mary Johnson");

        if (john && medMap["Aspirin"]) {
          await supabase.from("prescriptions").insert({
            patient_id: john.id,
            doctor_id: doctorSmithId,
            medication_id: medMap["Aspirin"],
            dose: "81mg",
            frequency: "Once daily",
            duration: "Ongoing",
            notes: "Take with food. Heart health management.",
            pharmacy: "City Pharmacy",
            status: "active",
          });
          console.log("  ✓ Created prescription: John Doe → Aspirin");
        }

        if (mary && medMap["Metformin"]) {
          await supabase.from("prescriptions").insert({
            patient_id: mary.id,
            doctor_id: doctorSmithId,
            medication_id: medMap["Metformin"],
            dose: "500mg",
            frequency: "Twice daily",
            duration: "Ongoing",
            notes: "Take with meals to reduce GI side effects. Monitor blood sugar.",
            pharmacy: "Health Plus Pharmacy",
            status: "active",
          });
          console.log("  ✓ Created prescription: Mary Johnson → Metformin");
        }

        // Create an Ibuprofen prescription for John to trigger interaction with Aspirin
        if (john && medMap["Ibuprofen"]) {
          const { data: rxData } = await supabase.from("prescriptions").insert({
            patient_id: john.id,
            doctor_id: doctorSmithId,
            medication_id: medMap["Ibuprofen"],
            dose: "400mg",
            frequency: "As needed",
            duration: "7 days",
            notes: "For pain management.",
            pharmacy: "City Pharmacy",
            status: "active",
          }).select().single();

          if (rxData) {
            await supabase.from("alerts").insert({
              prescription_id: rxData.id,
              message: "Warning: Aspirin and Ibuprofen combination may increase bleeding risk and reduce the effectiveness of Aspirin.",
              severity: "high",
            });
            console.log("  ✓ Created interaction alert: Aspirin + Ibuprofen");
          }
        }
      }
    }
  }

  console.log("\n✅ Database setup complete!");
  console.log("\nDemo login credentials:");
  console.log("  Doctor: dr.smith@medflow.com / password123");
  console.log("  Patient: john.doe@email.com / password123");
}

setupDatabase().catch(console.error);

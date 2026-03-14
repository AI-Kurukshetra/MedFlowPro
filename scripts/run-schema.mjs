/**
 * Run this script to set up the Supabase database schema and seed data.
 * Usage: node scripts/run-schema.mjs
 *
 * NOTE: This uses the anon key which has limited permissions.
 * For full schema setup (creating tables), use the Supabase SQL Editor with supabase/schema.sql
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://onzlkldxlktbotcvpfvd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uemxrbGR4bGt0Ym90Y3ZwZnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTk3NzUsImV4cCI6MjA4OTAzNTc3NX0.R1r1qZzSj3ibHY_Ti-CwQIaEcwPzGkN4HOQyk3YvIso";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedMedications() {
  console.log("Seeding medications...");

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

  const { error } = await supabase
    .from("medications")
    .upsert(medications, { onConflict: "name" });

  if (error) {
    console.error("Error seeding medications:", error.message);
    console.error("Make sure you've run supabase/schema.sql in the Supabase SQL Editor first!");
  } else {
    console.log(`✓ Seeded ${medications.length} medications successfully`);
  }
}

async function checkConnection() {
  const { data, error } = await supabase.from("medications").select("count").limit(1);
  if (error) {
    console.error("Connection failed:", error.message);
    return false;
  }
  return true;
}

async function main() {
  console.log("MedFlow Pro - Database Seeder\n");
  console.log("Checking connection...");

  const connected = await checkConnection();
  if (!connected) {
    console.log("\nPlease ensure:");
    console.log("1. The schema.sql has been run in Supabase SQL Editor");
    console.log("2. The Supabase URL and anon key are correct");
    return;
  }

  console.log("✓ Connected to Supabase\n");
  await seedMedications();

  console.log("\nDone! Next steps:");
  console.log("1. Create demo users in Supabase Dashboard > Authentication > Users:");
  console.log("   - dr.smith@medflow.com / password123 (role: doctor, name: Dr. Smith)");
  console.log("   - dr.patel@medflow.com / password123 (role: doctor, name: Dr. Patel)");
  console.log("   - john.doe@email.com / password123 (role: patient, name: John Doe)");
  console.log("   - mary.johnson@email.com / password123 (role: patient, name: Mary Johnson)");
  console.log("\n2. Sign up via the app at /signup (easier option)");
  console.log("3. Visit http://localhost:3000 to start using the app");
}

main().catch(console.error);

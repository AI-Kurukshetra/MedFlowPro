/**
 * Seed medications using a direct HTTP call to Supabase REST API
 * This bypasses RLS by using the service key
 *
 * IMPORTANT: Replace SERVICE_KEY below with your Supabase service role key
 * Found at: Supabase Dashboard → Settings → API → service_role key
 *
 * Usage: node scripts/seed-medications.mjs [SERVICE_KEY]
 */

const SUPABASE_URL = "https://onzlkldxlktbotcvpfvd.supabase.co";
const SERVICE_KEY = process.argv[2] || process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.log("Usage: node scripts/seed-medications.mjs <service_role_key>");
  console.log("\nGet your service role key from:");
  console.log("Supabase Dashboard → Settings → API → service_role (secret)");
  console.log("\nAlternatively, run supabase/setup-complete.sql in Supabase SQL Editor");
  process.exit(0);
}

const medications = [
  { name: "Aspirin", description: "A nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation. Also used for heart attack prevention.", dosage: "81mg - 325mg", interaction_notes: "May interact with blood thinners, other NSAIDs. Avoid with Ibuprofen." },
  { name: "Ibuprofen", description: "A nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce fever, and treat inflammation.", dosage: "200mg - 800mg", interaction_notes: "Avoid combining with Aspirin. Can affect blood pressure medications." },
  { name: "Metformin", description: "An oral diabetes medicine that helps control blood sugar levels. Used for type 2 diabetes management.", dosage: "500mg - 2000mg", interaction_notes: "Avoid alcohol. Can interact with contrast dye used in imaging procedures." },
  { name: "Amoxicillin", description: "A penicillin antibiotic used to treat bacterial infections.", dosage: "250mg - 500mg", interaction_notes: "May reduce effectiveness of oral contraceptives. Check for penicillin allergy." },
  { name: "Paracetamol", description: "An analgesic and antipyretic used to treat mild to moderate pain and fever.", dosage: "500mg - 1000mg", interaction_notes: "Avoid exceeding recommended daily dose. Caution with liver disease or alcohol use." },
  { name: "Lisinopril", description: "An ACE inhibitor used to treat high blood pressure and heart failure.", dosage: "5mg - 40mg", interaction_notes: "Monitor potassium levels. Avoid with potassium supplements." },
  { name: "Atorvastatin", description: "A statin medication used to lower cholesterol.", dosage: "10mg - 80mg", interaction_notes: "Avoid large quantities of grapefruit juice. Monitor for muscle pain." },
  { name: "Omeprazole", description: "A proton pump inhibitor that reduces stomach acid.", dosage: "20mg - 40mg", interaction_notes: "May affect absorption of certain medications." },
];

async function seedMedications() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/medications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify(medications),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error:", error);
    return;
  }

  console.log(`✓ Seeded ${medications.length} medications successfully!`);
}

seedMedications().catch(console.error);

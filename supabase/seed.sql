-- MedFlow Pro Seed Data
-- NOTE: Run schema.sql first, then create auth users manually or via the app
-- This file seeds the medications table and can be run after creating auth users.

-- =====================
-- SEED MEDICATIONS
-- =====================
INSERT INTO medications (name, description, dosage, interaction_notes) VALUES
(
  'Aspirin',
  'A nonsteroidal anti-inflammatory drug (NSAID) used to reduce pain, fever, and inflammation. Also used for heart attack prevention.',
  '81mg - 325mg',
  'May interact with blood thinners, other NSAIDs. Avoid with Ibuprofen.'
),
(
  'Ibuprofen',
  'A nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce fever, and treat inflammation.',
  '200mg - 800mg',
  'Avoid combining with Aspirin. Can affect blood pressure medications.'
),
(
  'Metformin',
  'An oral diabetes medicine that helps control blood sugar levels. Used for type 2 diabetes management.',
  '500mg - 2000mg',
  'Avoid alcohol. Can interact with contrast dye used in imaging procedures.'
),
(
  'Amoxicillin',
  'A penicillin antibiotic used to treat bacterial infections such as ear infections, pneumonia, and urinary tract infections.',
  '250mg - 500mg',
  'May reduce effectiveness of oral contraceptives. Check for penicillin allergy.'
),
(
  'Paracetamol',
  'An analgesic and antipyretic used to treat mild to moderate pain and fever. Also known as Acetaminophen.',
  '500mg - 1000mg',
  'Avoid exceeding recommended daily dose. Caution with liver disease or alcohol use.'
),
(
  'Lisinopril',
  'An ACE inhibitor used to treat high blood pressure and heart failure. Also helps protect kidneys in diabetic patients.',
  '5mg - 40mg',
  'Monitor potassium levels. Avoid with potassium supplements or potassium-sparing diuretics.'
),
(
  'Atorvastatin',
  'A statin medication used to lower cholesterol and reduce the risk of heart disease and stroke.',
  '10mg - 80mg',
  'Avoid large quantities of grapefruit juice. Monitor for muscle pain.'
),
(
  'Omeprazole',
  'A proton pump inhibitor (PPI) that reduces stomach acid production. Used for GERD, ulcers, and heartburn.',
  '20mg - 40mg',
  'May affect absorption of certain medications. Long-term use may reduce magnesium levels.'
)
ON CONFLICT (name) DO NOTHING;

-- =====================
-- DEMO USER SETUP INSTRUCTIONS
-- =====================
-- After running this seed, create the following users in Supabase Auth:
--
-- Doctor 1:
--   Email: dr.smith@medflow.com
--   Password: password123
--   Metadata: { "full_name": "Dr. Smith", "role": "doctor" }
--
-- Doctor 2:
--   Email: dr.patel@medflow.com
--   Password: password123
--   Metadata: { "full_name": "Dr. Patel", "role": "doctor" }
--
-- Patient 1:
--   Email: john.doe@email.com
--   Password: password123
--   Metadata: { "full_name": "John Doe", "role": "patient" }
--
-- Patient 2:
--   Email: mary.johnson@email.com
--   Password: password123
--   Metadata: { "full_name": "Mary Johnson", "role": "patient" }
--
-- Then insert user_profiles for each:
-- INSERT INTO user_profiles (id, email, full_name, role) VALUES
--   ('<doctor1-uuid>', 'dr.smith@medflow.com', 'Dr. Smith', 'doctor'),
--   ('<doctor2-uuid>', 'dr.patel@medflow.com', 'Dr. Patel', 'doctor'),
--   ('<patient1-uuid>', 'john.doe@email.com', 'John Doe', 'patient'),
--   ('<patient2-uuid>', 'mary.johnson@email.com', 'Mary Johnson', 'patient');
--
-- Then insert patients linked to Doctor 1:
-- INSERT INTO patients (doctor_id, name, dob, email, phone) VALUES
--   ('<doctor1-uuid>', 'John Doe', '1985-03-15', 'john.doe@email.com', '+1-555-0101'),
--   ('<doctor1-uuid>', 'Mary Johnson', '1972-07-22', 'mary.johnson@email.com', '+1-555-0102'),
--   ('<doctor1-uuid>', 'Alex Brown', '1990-11-08', 'alex.brown@email.com', '+1-555-0103');

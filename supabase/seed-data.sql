-- ============================================================
-- MedFlow Pro — Comprehensive Seed Data
-- Covers all scenarios: all prescription statuses, all alert
-- severities, adherence logs, refill requests, allergies.
--
-- Run AFTER setup-complete.sql and feature SQL (adherence_logs,
-- refill_requests, allergies column).
--
-- Supabase Dashboard → SQL Editor → New query → paste & run
-- ============================================================

-- ── Step 0: New tables + allergies column (safe to re-run) ──────────────

ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS adherence_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status        TEXT NOT NULL CHECK (status IN ('taken','missed')),
  logged_at     TIMESTAMPTZ DEFAULT NOW(),
  notes         TEXT
);
ALTER TABLE adherence_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "patient_adherence_all"     ON adherence_logs;
DROP POLICY IF EXISTS "doctor_adherence_select"   ON adherence_logs;
CREATE POLICY "patient_adherence_all"   ON adherence_logs FOR ALL
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));
CREATE POLICY "doctor_adherence_select" ON adherence_logs FOR SELECT
  USING (prescription_id IN (SELECT id FROM prescriptions WHERE doctor_id = auth.uid()));

CREATE TABLE IF NOT EXISTS refill_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id       UUID NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  patient_notes   TEXT,
  doctor_notes    TEXT,
  requested_at    TIMESTAMPTZ DEFAULT NOW(),
  responded_at    TIMESTAMPTZ
);
ALTER TABLE refill_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "patient_refills_all" ON refill_requests;
DROP POLICY IF EXISTS "doctor_refills_all"  ON refill_requests;
CREATE POLICY "patient_refills_all" ON refill_requests FOR ALL
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));
CREATE POLICY "doctor_refills_all"  ON refill_requests FOR ALL
  USING (doctor_id = auth.uid());

-- ── Step 1: Additional medications ──────────────────────────────────────

INSERT INTO medications (name, description, dosage, interaction_notes) VALUES
('Warfarin',
 'Anticoagulant used to prevent blood clots and reduce stroke risk in atrial fibrillation and DVT.',
 '1mg – 10mg',
 'Numerous drug interactions — monitor INR closely. Avoid NSAIDs and aspirin combination.'),
('Metoprolol',
 'Beta-blocker for high blood pressure, angina, heart failure, and migraine prevention.',
 '25mg – 200mg',
 'Do not stop abruptly. Avoid with verapamil or diltiazem. May mask hypoglycaemia.'),
('Sertraline',
 'SSRI antidepressant for depression, anxiety disorders, OCD, PTSD, and panic disorder.',
 '25mg – 200mg',
 'Serotonin syndrome risk with other serotonergic drugs. Avoid MAOIs within 14 days.'),
('Albuterol',
 'Short-acting bronchodilator (rescue inhaler) for acute asthma and COPD symptoms.',
 '90 mcg/actuation',
 'Avoid non-selective beta-blockers. Monitor for tremors and tachycardia.'),
('Levothyroxine',
 'Synthetic thyroid hormone replacement for hypothyroidism.',
 '25 mcg – 200 mcg',
 'Take on empty stomach 30–60 min before breakfast. Interactions with calcium and iron supplements.'),
('Prednisone',
 'Corticosteroid for inflammation, allergic reactions, asthma, and autoimmune conditions.',
 '5mg – 60mg',
 'Raises blood sugar. Long-term use risks osteoporosis and adrenal suppression. Taper slowly.'),
('Gabapentin',
 'Anticonvulsant for epilepsy, neuropathic pain, and restless leg syndrome.',
 '100mg – 600mg',
 'CNS depression with alcohol and opioids. Dizziness and falls in elderly. Titrate slowly.'),
('Amlodipine',
 'Calcium channel blocker for hypertension and angina.',
 '2.5mg – 10mg',
 'Avoid grapefruit. May cause peripheral oedema. Do not stop abruptly.'),
('Escitalopram',
 'SSRI antidepressant for major depressive disorder and generalised anxiety.',
 '5mg – 20mg',
 'QT prolongation risk. Serotonin syndrome with other serotonergic agents. Avoid MAOIs.'),
('Furosemide',
 'Loop diuretic for oedema in heart failure, liver cirrhosis, and renal disease.',
 '20mg – 80mg',
 'Monitor electrolytes. Ototoxicity at high doses. Avoid with aminoglycosides.'),
('Clonazepam',
 'Benzodiazepine for panic disorder, seizure disorders, and short-term anxiety.',
 '0.25mg – 2mg',
 'CNS and respiratory depression with alcohol or opioids. Risk of dependence. Do not stop abruptly.'),
('Montelukast',
 'Leukotriene receptor antagonist for asthma prevention and allergic rhinitis.',
 '10mg',
 'May cause neuropsychiatric effects. Not for acute attacks. Take in evening.'),
('Hydrochlorothiazide',
 'Thiazide diuretic for hypertension and oedema.',
 '12.5mg – 50mg',
 'Monitor electrolytes. Avoid with lithium. Photosensitivity possible.'),
('Azithromycin',
 'Macrolide antibiotic for respiratory, skin, ear, and sexually transmitted infections.',
 '250mg – 500mg',
 'QT prolongation risk. Interactions with warfarin and antacids.'),
('Tramadol',
 'Opioid-like analgesic for moderate to moderately severe pain.',
 '50mg – 100mg',
 'Serotonin syndrome and seizure risk — avoid SSRIs and MAOIs. Dependence potential.'),
('Pantoprazole',
 'Proton pump inhibitor for GERD, peptic ulcers, and H. pylori eradication.',
 '20mg – 40mg',
 'May reduce clopidogrel effectiveness. Long-term use affects magnesium and B12 absorption.'),
('Losartan',
 'ARB for hypertension, diabetic nephropathy, and heart failure.',
 '25mg – 100mg',
 'Monitor potassium and creatinine. Avoid with ACE inhibitors in most cases.'),
('Ciprofloxacin',
 'Fluoroquinolone antibiotic for UTIs, respiratory, GI, and skin infections.',
 '250mg – 750mg',
 'Avoid with antacids. Tendon rupture risk. QT prolongation. Avoid in children.')
ON CONFLICT (name) DO NOTHING;

-- ── Step 2: Patients + prescriptions + alerts ────────────────────────────

DO $$
DECLARE
  v_doc       UUID;

  -- patients
  v_p_john    UUID;   -- existing John Doe
  v_p_sarah   UUID;
  v_p_michael UUID;
  v_p_emily   UUID;
  v_p_robert  UUID;
  v_p_jennifer UUID;
  v_p_david   UUID;
  v_p_lisa    UUID;
  v_p_james   UUID;
  v_p_maria   UUID;

  -- medications
  v_m_asp     UUID;   v_m_ibu     UUID;   v_m_met     UUID;
  v_m_amox    UUID;   v_m_para    UUID;   v_m_lis     UUID;
  v_m_ator    UUID;   v_m_ome     UUID;   v_m_warf    UUID;
  v_m_meto    UUID;   v_m_sert    UUID;   v_m_albu    UUID;
  v_m_levo    UUID;   v_m_pred    UUID;   v_m_gaba    UUID;
  v_m_amlo    UUID;   v_m_esc     UUID;   v_m_furo    UUID;
  v_m_clon    UUID;   v_m_mont    UUID;   v_m_hctz    UUID;
  v_m_azit    UUID;   v_m_tram    UUID;   v_m_panto   UUID;
  v_m_los     UUID;   v_m_cipro   UUID;

  -- prescription ids (for alerts / adherence / refills)
  v_rx UUID;
  -- store a handful by name for cross-referencing
  v_rx_john_lis   UUID;
  v_rx_john_met   UUID;
  v_rx_john_asp   UUID;
  v_rx_sarah_warf UUID;
  v_rx_sarah_asp  UUID;
  v_rx_mich_sert  UUID;
  v_rx_mich_clon  UUID;
  v_rx_emily_albu UUID;
  v_rx_rob_gaba   UUID;
  v_rx_jen_pred   UUID;
  v_rx_james_furo UUID;
BEGIN

  -- ── Doctor ──────────────────────────────────────────────────────────
  SELECT id INTO v_doc FROM user_profiles WHERE email = 'dr.smith@medflow.com';
  IF v_doc IS NULL THEN
    RAISE EXCEPTION 'Doctor account dr.smith@medflow.com not found. Run setup-complete.sql first.';
  END IF;

  -- ── Medication IDs ───────────────────────────────────────────────────
  SELECT id INTO v_m_asp   FROM medications WHERE name = 'Aspirin';
  SELECT id INTO v_m_ibu   FROM medications WHERE name = 'Ibuprofen';
  SELECT id INTO v_m_met   FROM medications WHERE name = 'Metformin';
  SELECT id INTO v_m_amox  FROM medications WHERE name = 'Amoxicillin';
  SELECT id INTO v_m_para  FROM medications WHERE name = 'Paracetamol';
  SELECT id INTO v_m_lis   FROM medications WHERE name = 'Lisinopril';
  SELECT id INTO v_m_ator  FROM medications WHERE name = 'Atorvastatin';
  SELECT id INTO v_m_ome   FROM medications WHERE name = 'Omeprazole';
  SELECT id INTO v_m_warf  FROM medications WHERE name = 'Warfarin';
  SELECT id INTO v_m_meto  FROM medications WHERE name = 'Metoprolol';
  SELECT id INTO v_m_sert  FROM medications WHERE name = 'Sertraline';
  SELECT id INTO v_m_albu  FROM medications WHERE name = 'Albuterol';
  SELECT id INTO v_m_levo  FROM medications WHERE name = 'Levothyroxine';
  SELECT id INTO v_m_pred  FROM medications WHERE name = 'Prednisone';
  SELECT id INTO v_m_gaba  FROM medications WHERE name = 'Gabapentin';
  SELECT id INTO v_m_amlo  FROM medications WHERE name = 'Amlodipine';
  SELECT id INTO v_m_esc   FROM medications WHERE name = 'Escitalopram';
  SELECT id INTO v_m_furo  FROM medications WHERE name = 'Furosemide';
  SELECT id INTO v_m_clon  FROM medications WHERE name = 'Clonazepam';
  SELECT id INTO v_m_mont  FROM medications WHERE name = 'Montelukast';
  SELECT id INTO v_m_hctz  FROM medications WHERE name = 'Hydrochlorothiazide';
  SELECT id INTO v_m_azit  FROM medications WHERE name = 'Azithromycin';
  SELECT id INTO v_m_tram  FROM medications WHERE name = 'Tramadol';
  SELECT id INTO v_m_panto FROM medications WHERE name = 'Pantoprazole';
  SELECT id INTO v_m_los   FROM medications WHERE name = 'Losartan';
  SELECT id INTO v_m_cipro FROM medications WHERE name = 'Ciprofloxacin';

  -- ── Patient 1: John Doe (existing) ───────────────────────────────────
  SELECT id INTO v_p_john FROM patients
  WHERE doctor_id = v_doc AND email = 'john.doe@email.com';

  IF v_p_john IS NOT NULL THEN
    UPDATE patients
    SET allergies = 'Penicillin, Sulfa drugs'
    WHERE id = v_p_john;
  END IF;

  -- ── Patient 2: Sarah Johnson — 62 y/o, Heart disease, Atrial fibrillation ─
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'sarah.johnson@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Sarah Johnson','1963-04-15','sarah.johnson@email.com',
            '+1 (555) 234-5678','Sulfa drugs, Aspirin', NOW() - INTERVAL '8 months')
    RETURNING id INTO v_p_sarah;
  ELSE
    SELECT id INTO v_p_sarah FROM patients WHERE doctor_id = v_doc AND email = 'sarah.johnson@email.com';
  END IF;

  -- ── Patient 3: Michael Chen — 35 y/o, Anxiety + Insomnia ────────────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'michael.chen@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Michael Chen','1989-11-22','michael.chen@email.com',
            '+1 (555) 345-6789','', NOW() - INTERVAL '6 months')
    RETURNING id INTO v_p_michael;
  ELSE
    SELECT id INTO v_p_michael FROM patients WHERE doctor_id = v_doc AND email = 'michael.chen@email.com';
  END IF;

  -- ── Patient 4: Emily Rodriguez — 28 y/o, Asthma ─────────────────────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'emily.rodriguez@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Emily Rodriguez','1996-07-08','emily.rodriguez@email.com',
            '+1 (555) 456-7890','NSAIDs, Latex', NOW() - INTERVAL '5 months')
    RETURNING id INTO v_p_emily;
  ELSE
    SELECT id INTO v_p_emily FROM patients WHERE doctor_id = v_doc AND email = 'emily.rodriguez@email.com';
  END IF;

  -- ── Patient 5: Robert Williams — 71 y/o, Parkinson's + Depression ────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'robert.williams@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Robert Williams','1954-02-28','robert.williams@email.com',
            '+1 (555) 567-8901','Codeine, Penicillin', NOW() - INTERVAL '10 months')
    RETURNING id INTO v_p_robert;
  ELSE
    SELECT id INTO v_p_robert FROM patients WHERE doctor_id = v_doc AND email = 'robert.williams@email.com';
  END IF;

  -- ── Patient 6: Jennifer Davis — 52 y/o, Rheumatoid Arthritis + HTN ──
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'jennifer.davis@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Jennifer Davis','1972-09-14','jennifer.davis@email.com',
            '+1 (555) 678-9012','', NOW() - INTERVAL '7 months')
    RETURNING id INTO v_p_jennifer;
  ELSE
    SELECT id INTO v_p_jennifer FROM patients WHERE doctor_id = v_doc AND email = 'jennifer.davis@email.com';
  END IF;

  -- ── Patient 7: David Thompson — 45 y/o, Epilepsy + Migraines ────────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'david.thompson@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'David Thompson','1979-12-03','david.thompson@email.com',
            '+1 (555) 789-0123','Carbamazepine', NOW() - INTERVAL '4 months')
    RETURNING id INTO v_p_david;
  ELSE
    SELECT id INTO v_p_david FROM patients WHERE doctor_id = v_doc AND email = 'david.thompson@email.com';
  END IF;

  -- ── Patient 8: Lisa Martinez — 38 y/o, Hypothyroidism + Depression ──
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'lisa.martinez@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Lisa Martinez','1986-05-19','lisa.martinez@email.com',
            '+1 (555) 890-1234','', NOW() - INTERVAL '3 months')
    RETURNING id INTO v_p_lisa;
  ELSE
    SELECT id INTO v_p_lisa FROM patients WHERE doctor_id = v_doc AND email = 'lisa.martinez@email.com';
  END IF;

  -- ── Patient 9: James Anderson — 58 y/o, COPD + Heart failure ─────────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'james.anderson@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'James Anderson','1966-08-07','james.anderson@email.com',
            '+1 (555) 901-2345','Beta-blockers, Penicillin', NOW() - INTERVAL '9 months')
    RETURNING id INTO v_p_james;
  ELSE
    SELECT id INTO v_p_james FROM patients WHERE doctor_id = v_doc AND email = 'james.anderson@email.com';
  END IF;

  -- ── Patient 10: Maria Garcia — 44 y/o, Type 2 Diabetes + Obesity ────
  IF NOT EXISTS (SELECT 1 FROM patients WHERE doctor_id = v_doc AND email = 'maria.garcia@email.com') THEN
    INSERT INTO patients (doctor_id, name, dob, email, phone, allergies, created_at)
    VALUES (v_doc,'Maria Garcia','1980-03-25','maria.garcia@email.com',
            '+1 (555) 012-3456','', NOW() - INTERVAL '2 months')
    RETURNING id INTO v_p_maria;
  ELSE
    SELECT id INTO v_p_maria FROM patients WHERE doctor_id = v_doc AND email = 'maria.garcia@email.com';
  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — John Doe (hypertension + diabetes)
  -- ==============================================================
  IF v_p_john IS NOT NULL THEN

    -- active: Lisinopril
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_john, v_m_lis, '10mg', 'Once daily', 'Ongoing',
            'Take in the morning. Monitor blood pressure weekly.', 'active', NOW() - INTERVAL '3 months')
    RETURNING id INTO v_rx_john_lis;

    -- active: Metformin
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_john, v_m_met, '500mg', 'Twice daily', 'Ongoing',
            'Take with meals to reduce GI side effects. HbA1c check every 3 months.', 'active', NOW() - INTERVAL '3 months')
    RETURNING id INTO v_rx_john_met;

    -- active: Aspirin (cardio protection)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_john, v_m_asp, '81mg', 'Once daily', 'Ongoing',
            'Cardiovascular protection. Take with food.', 'active', NOW() - INTERVAL '2 months')
    RETURNING id INTO v_rx_john_asp;

    -- completed: Amoxicillin (infection cleared)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_john, v_m_amox, '500mg', 'Three times daily', '7 days',
            'Complete full course. Infection cleared.', 'completed', NOW() - INTERVAL '4 months');

    -- completed: Omeprazole (short course)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_john, v_m_ome, '20mg', 'Once daily', '4 weeks',
            'GI protection. Course complete.', 'completed', NOW() - INTERVAL '5 months');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Sarah Johnson (heart disease, AF, high cholesterol)
  -- ==============================================================
  IF v_p_sarah IS NOT NULL THEN

    -- active: Warfarin ← HIGH alert trigger
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_sarah, v_m_warf, '5mg', 'Once daily', 'Ongoing',
            'INR check every 2 weeks. Consistent vitamin K intake. Target INR 2.0–3.0.', 'active', NOW() - INTERVAL '5 months')
    RETURNING id INTO v_rx_sarah_warf;

    -- active: Atorvastatin ← MEDIUM alert
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_sarah, v_m_ator, '40mg', 'Once daily at bedtime', 'Ongoing',
            'Avoid grapefruit. Report any muscle pain or weakness immediately.', 'active', NOW() - INTERVAL '5 months');

    -- active: Metoprolol
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_sarah, v_m_meto, '25mg', 'Twice daily', 'Ongoing',
            'Do not stop abruptly. Monitor resting heart rate.', 'active', NOW() - INTERVAL '4 months');

    -- CANCELLED: Aspirin cancelled — too dangerous with Warfarin
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_sarah, v_m_asp, '81mg', 'Once daily', '30 days',
            'CANCELLED — bleeding risk unacceptable in combination with Warfarin.', 'cancelled', NOW() - INTERVAL '3 months')
    RETURNING id INTO v_rx_sarah_asp;

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Michael Chen (anxiety + insomnia)
  -- ==============================================================
  IF v_p_michael IS NOT NULL THEN

    -- active: Sertraline ← MEDIUM alert with Clonazepam
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_michael, v_m_sert, '50mg', 'Once daily', 'Ongoing',
            'Take in the morning. May take 4–6 weeks for full effect. Avoid alcohol.', 'active', NOW() - INTERVAL '2 months')
    RETURNING id INTO v_rx_mich_sert;

    -- active: Clonazepam
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_michael, v_m_clon, '0.5mg', 'As needed', '30 days',
            'Max 2 doses/day. Strictly avoid alcohol. Do not drive.', 'active', NOW() - INTERVAL '1 month')
    RETURNING id INTO v_rx_mich_clon;

    -- completed: Escitalopram — switched to Sertraline
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_michael, v_m_esc, '10mg', 'Once daily', '60 days',
            'Switched to Sertraline due to GI side effects. Course completed.', 'completed', NOW() - INTERVAL '4 months');

    -- completed: Azithromycin (respiratory infection)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_michael, v_m_azit, '250mg', 'Once daily', '5 days',
            'Z-pack for bronchitis. Course completed.', 'completed', NOW() - INTERVAL '6 months');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Emily Rodriguez (asthma)
  -- ==============================================================
  IF v_p_emily IS NOT NULL THEN

    -- active: Albuterol ← LOW alert
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_emily, v_m_albu, '2 puffs', 'As needed (max 4×/day)', 'Ongoing',
            'Rescue inhaler. Rinse mouth after use. Carry at all times.', 'active', NOW() - INTERVAL '3 months')
    RETURNING id INTO v_rx_emily_albu;

    -- active: Montelukast
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_emily, v_m_mont, '10mg', 'Once daily at bedtime', 'Ongoing',
            'Controller medication. Not for acute attacks. Take every night.', 'active', NOW() - INTERVAL '2 months');

    -- cancelled: Ibuprofen contraindicated due to NSAID allergy
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_emily, v_m_ibu, '400mg', 'As needed', '7 days',
            'CANCELLED — patient has documented NSAID allergy. Switched to Paracetamol.', 'cancelled', NOW() - INTERVAL '4 months');

    -- completed: Paracetamol instead
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_emily, v_m_para, '500mg', 'Every 6 hours as needed', '5 days',
            'Safe alternative to NSAIDs for pain. Course completed.', 'completed', NOW() - INTERVAL '4 months');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Robert Williams (Parkinson's + Depression, elderly)
  -- ==============================================================
  IF v_p_robert IS NOT NULL THEN

    -- active: Gabapentin ← HIGH alert (elderly, falls risk)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_robert, v_m_gaba, '300mg', 'Three times daily', 'Ongoing',
            'Monitor closely for dizziness and fall risk. Start low, titrate slowly.', 'active', NOW() - INTERVAL '6 months')
    RETURNING id INTO v_rx_rob_gaba;

    -- active: Sertraline (low dose for elderly)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_robert, v_m_sert, '25mg', 'Once daily', 'Ongoing',
            'Low dose for elderly patient. Monitor for falls and sodium levels.', 'active', NOW() - INTERVAL '5 months');

    -- active: Omeprazole
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_robert, v_m_ome, '20mg', 'Once daily', 'Ongoing',
            'GI protection. Take 30 minutes before breakfast.', 'active', NOW() - INTERVAL '4 months');

    -- completed: Azithromycin (pneumonia)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_robert, v_m_azit, '500mg', 'Once daily', '5 days',
            'Community-acquired pneumonia. Course completed successfully.', 'completed', NOW() - INTERVAL '2 months');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Jennifer Davis (Rheumatoid Arthritis + HTN)
  -- ==============================================================
  IF v_p_jennifer IS NOT NULL THEN

    -- active: Prednisone ← MEDIUM alert with Amlodipine
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_jennifer, v_m_pred, '10mg', 'Once daily', '30 days',
            'Taper dose gradually. Take with food. Monitor blood sugar and BP.', 'active', NOW() - INTERVAL '2 weeks')
    RETURNING id INTO v_rx_jen_pred;

    -- active: Amlodipine
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_jennifer, v_m_amlo, '5mg', 'Once daily', 'Ongoing',
            'Take at same time daily. Report ankle swelling.', 'active', NOW() - INTERVAL '5 months');

    -- active: Pantoprazole (GI protection during Prednisone)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_jennifer, v_m_panto, '40mg', 'Once daily', '30 days',
            'GI protection during corticosteroid therapy.', 'active', NOW() - INTERVAL '2 weeks');

    -- completed: Ibuprofen (stopped — started Prednisone instead)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_jennifer, v_m_ibu, '400mg', 'Three times daily', '2 weeks',
            'Stopped. Switched to Prednisone for better RA control.', 'completed', NOW() - INTERVAL '1 month');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — David Thompson (Epilepsy + Migraines)
  -- ==============================================================
  IF v_p_david IS NOT NULL THEN

    -- active: Gabapentin (seizure control)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_david, v_m_gaba, '600mg', 'Three times daily', 'Ongoing',
            'Do not stop abruptly. Drug levels quarterly. Avoid alcohol.', 'active', NOW() - INTERVAL '2 months');

    -- active: Metoprolol (migraine prevention)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_david, v_m_meto, '50mg', 'Once daily', 'Ongoing',
            'Migraine prevention. Do not stop abruptly.', 'active', NOW() - INTERVAL '1 month');

    -- completed: Tramadol (post-surgery pain)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_david, v_m_tram, '50mg', 'Every 6 hours as needed', '5 days',
            'Short course for post-surgical pain. Course completed.', 'completed', NOW() - INTERVAL '3 months');

    -- cancelled: Ciprofloxacin (interacts with Gabapentin)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_david, v_m_cipro, '500mg', 'Twice daily', '7 days',
            'CANCELLED — risk of seizure threshold lowering in epileptic patient. Use alternative antibiotic.', 'cancelled', NOW() - INTERVAL '1 month');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Lisa Martinez (Hypothyroidism + Depression)
  -- ==============================================================
  IF v_p_lisa IS NOT NULL THEN

    -- active: Levothyroxine
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_lisa, v_m_levo, '50mcg', 'Once daily', 'Ongoing',
            'Take on empty stomach 30–60 min before breakfast. TSH check in 6 weeks.', 'active', NOW() - INTERVAL '1 month');

    -- active: Escitalopram
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_lisa, v_m_esc, '10mg', 'Once daily', 'Ongoing',
            'May take 4–6 weeks for full effect. Do not stop abruptly.', 'active', NOW() - INTERVAL '3 weeks');

    -- active: Omeprazole
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_lisa, v_m_ome, '20mg', 'Once daily before breakfast', 'Ongoing',
            'For GERD symptoms. Review at 8 weeks.', 'active', NOW() - INTERVAL '2 weeks');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — James Anderson (COPD + Heart failure)
  -- ==============================================================
  IF v_p_james IS NOT NULL THEN

    -- active: Furosemide ← MEDIUM alert
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_james, v_m_furo, '40mg', 'Once daily', 'Ongoing',
            'Take in the morning. Weigh daily. Call if weight gain >2 lbs in a day.', 'active', NOW() - INTERVAL '4 months')
    RETURNING id INTO v_rx_james_furo;

    -- active: Albuterol
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_james, v_m_albu, '2 puffs', 'Every 4–6 hours as needed', 'Ongoing',
            'For acute dyspnoea. Call 911 if no relief after 3 doses.', 'active', NOW() - INTERVAL '4 months');

    -- active: Lisinopril (heart failure — low dose)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_james, v_m_lis, '5mg', 'Once daily', 'Ongoing',
            'Low starting dose for HF. Titrate up as tolerated. Monitor renal function.', 'active', NOW() - INTERVAL '3 months');

    -- completed: Azithromycin (COPD exacerbation)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_james, v_m_azit, '500mg', 'Once daily', '5 days',
            'COPD exacerbation. Course completed.', 'completed', NOW() - INTERVAL '2 months');

    -- cancelled: Hydrochlorothiazide (replaced by Furosemide)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_james, v_m_hctz, '25mg', 'Once daily', '30 days',
            'CANCELLED — replaced by Furosemide for better diuresis in heart failure.', 'cancelled', NOW() - INTERVAL '4 months');

  END IF;

  -- ==============================================================
  -- PRESCRIPTIONS — Maria Garcia (Type 2 Diabetes + Obesity)
  -- ==============================================================
  IF v_p_maria IS NOT NULL THEN

    -- active: Metformin (high dose)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_maria, v_m_met, '1000mg', 'Twice daily', 'Ongoing',
            'Take with meals. HbA1c every 3 months. Annual kidney function check.', 'active', NOW() - INTERVAL '2 months');

    -- active: Lisinopril (kidney protection)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_maria, v_m_lis, '10mg', 'Once daily', 'Ongoing',
            'Kidney protection in diabetes. Monitor creatinine and potassium.', 'active', NOW() - INTERVAL '2 months');

    -- active: Atorvastatin
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_maria, v_m_ator, '20mg', 'Once daily at bedtime', 'Ongoing',
            'Cardiovascular risk reduction. Lipid panel in 3 months.', 'active', NOW() - INTERVAL '1 month');

    -- completed: Omeprazole (short course)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_maria, v_m_ome, '20mg', 'Once daily', '4 weeks',
            'Heartburn during Metformin initiation. Resolved.', 'completed', NOW() - INTERVAL '5 months');

    -- completed: Ciprofloxacin (UTI)
    INSERT INTO prescriptions (doctor_id, patient_id, medication_id, dose, frequency, duration, notes, status, created_at)
    VALUES (v_doc, v_p_maria, v_m_cipro, '500mg', 'Twice daily', '7 days',
            'Uncomplicated UTI. Culture confirmed sensitivity. Course completed.', 'completed', NOW() - INTERVAL '3 months');

  END IF;

  -- ==============================================================
  -- DRUG INTERACTION ALERTS
  -- ==============================================================

  -- HIGH: Warfarin + Atorvastatin (Sarah)
  IF v_rx_sarah_warf IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_sarah_warf,
     'Warfarin + Atorvastatin: Atorvastatin inhibits CYP2C9, increasing warfarin plasma levels and bleeding risk. INR should be monitored more frequently when statin is initiated, dose-adjusted, or discontinued.',
     'medium', NOW() - INTERVAL '5 months');
  END IF;

  -- HIGH: Warfarin + Aspirin cancelled (Sarah)
  IF v_rx_sarah_asp IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_sarah_asp,
     'CRITICAL: Warfarin + Aspirin — dual antihaemostatic effect dramatically increases haemorrhage risk. Aspirin inhibits platelet aggregation while warfarin prolongs clotting time. This combination can cause life-threatening GI or intracranial bleeding. Prescription cancelled.',
     'high', NOW() - INTERVAL '3 months');
  END IF;

  -- MEDIUM: Sertraline + Clonazepam (Michael)
  IF v_rx_mich_clon IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_mich_clon,
     'Sertraline + Clonazepam: Additive CNS depression possible. Combined use may cause excessive sedation, cognitive impairment, and psychomotor slowing. Patient advised to avoid alcohol and to exercise caution driving.',
     'medium', NOW() - INTERVAL '1 month');
  END IF;

  -- LOW: Albuterol + Montelukast (Emily — compatible combination)
  IF v_rx_emily_albu IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_emily_albu,
     'Albuterol + Montelukast: Complementary mechanism — Albuterol (rescue bronchodilator) and Montelukast (leukotriene controller) can be safely co-prescribed. No significant pharmacokinetic interaction identified. Standard asthma step-therapy.',
     'low', NOW() - INTERVAL '2 months');
  END IF;

  -- HIGH: Gabapentin in elderly patient (Robert, 71 y/o)
  IF v_rx_rob_gaba IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_rob_gaba,
     'HIGH RISK — Gabapentin in elderly (71 years): Significantly increased risk of sedation, dizziness, respiratory depression, and falls. Dose reduction recommended. Avoid concomitant CNS depressants. Assess fall risk at each visit.',
     'high', NOW() - INTERVAL '6 months');
  END IF;

  -- MEDIUM: Prednisone reduces antihypertensive effect (Jennifer)
  IF v_rx_jen_pred IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_jen_pred,
     'Prednisone + Amlodipine: Corticosteroids may antagonise the antihypertensive effect of calcium channel blockers via sodium and water retention. Monitor blood pressure closely during steroid therapy. Dose adjustment may be required.',
     'medium', NOW() - INTERVAL '2 weeks');
  END IF;

  -- MEDIUM: Furosemide + ACE inhibitor (James — first-dose hypotension)
  IF v_rx_james_furo IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx_james_furo,
     'Furosemide + Lisinopril: Concurrent diuretic and ACE inhibitor therapy may cause first-dose hypotension, especially in volume-depleted patients. Monitor BP after initiation. Check electrolytes and renal function regularly.',
     'medium', NOW() - INTERVAL '3 months');
  END IF;

  -- HIGH: Gabapentin + Tramadol — CNS/respiratory depression (David - completed Rx)
  SELECT id INTO v_rx FROM prescriptions
  WHERE patient_id = v_p_david AND medication_id = v_m_tram;
  IF v_rx IS NOT NULL THEN
    INSERT INTO alerts (prescription_id, message, severity, created_at) VALUES
    (v_rx,
     'Gabapentin + Tramadol: HIGH RISK combination. Both agents cause CNS and respiratory depression; concomitant use significantly increases risk of severe sedation, respiratory failure, and death. Closely monitor respiratory status.',
     'high', NOW() - INTERVAL '3 months');
  END IF;

  -- ==============================================================
  -- ADHERENCE LOGS (30-day history for 3 patients)
  -- ==============================================================

  -- John Doe — high adherence ~92% (Lisinopril)
  IF v_rx_john_lis IS NOT NULL THEN
    INSERT INTO adherence_logs (prescription_id, patient_id, status, logged_at)
    SELECT
      v_rx_john_lis, v_p_john,
      CASE WHEN random() > 0.08 THEN 'taken' ELSE 'missed' END,
      NOW() - (n || ' days')::INTERVAL
    FROM generate_series(1, 30) AS n;
  END IF;

  -- Sarah Johnson — medium adherence ~68% (Warfarin — complex monitoring)
  IF v_rx_sarah_warf IS NOT NULL THEN
    INSERT INTO adherence_logs (prescription_id, patient_id, status, logged_at)
    SELECT
      v_rx_sarah_warf, v_p_sarah,
      CASE WHEN random() > 0.32 THEN 'taken' ELSE 'missed' END,
      NOW() - (n || ' days')::INTERVAL
    FROM generate_series(1, 30) AS n;
  END IF;

  -- Michael Chen — low adherence ~48% (Sertraline — common early dropout)
  IF v_rx_mich_sert IS NOT NULL THEN
    INSERT INTO adherence_logs (prescription_id, patient_id, status, logged_at)
    SELECT
      v_rx_mich_sert, v_p_michael,
      CASE WHEN random() > 0.52 THEN 'taken' ELSE 'missed' END,
      NOW() - (n || ' days')::INTERVAL
    FROM generate_series(1, 30) AS n;
  END IF;

  -- ==============================================================
  -- REFILL REQUESTS (all statuses)
  -- ==============================================================

  -- PENDING: John Doe — Lisinopril running low
  IF v_rx_john_lis IS NOT NULL THEN
    INSERT INTO refill_requests (prescription_id, patient_id, doctor_id, status, patient_notes, requested_at)
    VALUES (v_rx_john_lis, v_p_john, v_doc, 'pending',
            'Running low on medication. Need refill before my trip next week.', NOW() - INTERVAL '1 day');
  END IF;

  -- PENDING: Sarah Johnson — Warfarin refill + recent INR note
  IF v_rx_sarah_warf IS NOT NULL THEN
    INSERT INTO refill_requests (prescription_id, patient_id, doctor_id, status, patient_notes, requested_at)
    VALUES (v_rx_sarah_warf, v_p_sarah, v_doc, 'pending',
            'Need next month supply. Last INR was 2.4 — within range.', NOW() - INTERVAL '2 days');
  END IF;

  -- APPROVED: Michael Chen — Sertraline continuation
  IF v_rx_mich_sert IS NOT NULL THEN
    INSERT INTO refill_requests (prescription_id, patient_id, doctor_id, status, patient_notes, doctor_notes, requested_at, responded_at)
    VALUES (v_rx_mich_sert, v_p_michael, v_doc, 'approved',
            'Feeling much better. Would like to continue.',
            'Approved for 30-day supply. Schedule follow-up in 4 weeks.', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '13 days');
  END IF;

  -- DENIED: Emily Rodriguez — too early for refill
  IF v_rx_emily_albu IS NOT NULL THEN
    INSERT INTO refill_requests (prescription_id, patient_id, doctor_id, status, patient_notes, doctor_notes, requested_at, responded_at)
    VALUES (v_rx_emily_albu, v_p_emily, v_doc, 'denied',
            'Requesting early refill, going on holiday.',
            'Refill too early — should still have 2–3 weeks supply. Resubmit closer to date.', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '20 days');
  END IF;

  RAISE NOTICE '✅ Seed data inserted successfully. Doctor ID: %', v_doc;
END $$;

-- ============================================================
-- MedFlow Pro - Complete Setup SQL
-- Run this ENTIRE script in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste & run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- DROP EXISTING TABLES (clean slate)
-- =====================
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS medication_history CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- =====================
-- USER PROFILES TABLE
-- =====================
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PATIENTS TABLE
-- =====================
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dob DATE,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MEDICATIONS TABLE
-- =====================
CREATE TABLE medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  dosage TEXT,
  interaction_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PRESCRIPTIONS TABLE
-- =====================
CREATE TABLE prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medication_id UUID REFERENCES medications(id) ON DELETE RESTRICT NOT NULL,
  dose TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT,
  notes TEXT,
  pharmacy TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MEDICATION HISTORY TABLE
-- =====================
CREATE TABLE medication_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ALERTS TABLE
-- =====================
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- USER PROFILES
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- PATIENTS
CREATE POLICY "Doctors can manage their patients" ON patients
  FOR ALL USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can view their own record" ON patients
  FOR SELECT USING (email = auth.email());

-- MEDICATIONS (read-only for authenticated users, admins can insert via SQL editor)
CREATE POLICY "Authenticated users can view medications" ON medications
  FOR SELECT USING (auth.role() = 'authenticated');

-- PRESCRIPTIONS
CREATE POLICY "Doctors can manage their prescriptions" ON prescriptions
  FOR ALL USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can view their prescriptions" ON prescriptions
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.email()
    )
  );

-- MEDICATION HISTORY
CREATE POLICY "Doctors can manage medication history" ON medication_history
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE doctor_id = auth.uid())
  );
CREATE POLICY "Patients can view their medication history" ON medication_history
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE email = auth.email()
    )
  );

-- ALERTS
CREATE POLICY "Doctors can manage alerts" ON alerts
  FOR ALL USING (
    prescription_id IN (SELECT id FROM prescriptions WHERE doctor_id = auth.uid())
  );
CREATE POLICY "Patients can view their alerts" ON alerts
  FOR SELECT USING (
    prescription_id IN (
      SELECT p.id FROM prescriptions p
      JOIN patients pat ON p.patient_id = pat.id
      WHERE pat.email = auth.email()
    )
  );

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_medication_history_patient_id ON medication_history(patient_id);
CREATE INDEX idx_alerts_prescription_id ON alerts(prescription_id);

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
  'A penicillin antibiotic used to treat bacterial infections.',
  '250mg - 500mg',
  'May reduce effectiveness of oral contraceptives. Check for penicillin allergy.'
),
(
  'Paracetamol',
  'An analgesic and antipyretic used to treat mild to moderate pain and fever.',
  '500mg - 1000mg',
  'Avoid exceeding recommended daily dose. Caution with liver disease or alcohol use.'
),
(
  'Lisinopril',
  'An ACE inhibitor used to treat high blood pressure and heart failure.',
  '5mg - 40mg',
  'Monitor potassium levels. Avoid with potassium supplements.'
),
(
  'Atorvastatin',
  'A statin medication used to lower cholesterol and reduce risk of heart disease.',
  '10mg - 80mg',
  'Avoid large quantities of grapefruit juice. Monitor for muscle pain.'
),
(
  'Omeprazole',
  'A proton pump inhibitor that reduces stomach acid production.',
  '20mg - 40mg',
  'May affect absorption of certain medications.'
);

-- =====================
-- TRIGGER: Auto-create user profile on signup
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- BACKFILL: Create profiles for any existing auth users missing a profile
-- =====================
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'role', 'doctor')
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles p WHERE p.id = u.id
);

-- =====================
-- SUCCESS MESSAGE
-- =====================
SELECT 'MedFlow Pro schema and seed data created successfully! ' ||
       'Trigger created for auto-profile on signup.' AS status;

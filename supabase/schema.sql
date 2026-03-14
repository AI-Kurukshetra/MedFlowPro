-- MedFlow Pro Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USER PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PATIENTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS patients (
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
CREATE TABLE IF NOT EXISTS medications (
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
CREATE TABLE IF NOT EXISTS prescriptions (
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
CREATE TABLE IF NOT EXISTS medication_history (
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
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- USER PROFILES policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- PATIENTS policies
CREATE POLICY "Doctors can manage their patients" ON patients
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can view their own record" ON patients
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- MEDICATIONS policies (public read, admin write)
CREATE POLICY "Anyone authenticated can view medications" ON medications
  FOR SELECT USING (auth.role() = 'authenticated');

-- PRESCRIPTIONS policies
CREATE POLICY "Doctors can manage their prescriptions" ON prescriptions
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can view their prescriptions" ON prescriptions
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- MEDICATION HISTORY policies
CREATE POLICY "Doctors can manage medication history" ON medication_history
  FOR ALL USING (
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their medication history" ON medication_history
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ALERTS policies
CREATE POLICY "Doctors can view alerts for their prescriptions" ON alerts
  FOR SELECT USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert alerts" ON alerts
  FOR INSERT WITH CHECK (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their alerts" ON alerts
  FOR SELECT USING (
    prescription_id IN (
      SELECT p.id FROM prescriptions p
      JOIN patients pat ON p.patient_id = pat.id
      WHERE pat.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_medication_history_patient_id ON medication_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_prescription_id ON alerts(prescription_id);

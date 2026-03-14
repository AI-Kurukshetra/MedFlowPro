export type UserRole = "doctor" | "patient";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface Patient {
  id: string;
  doctor_id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  dosage: string;
  interaction_notes: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication_id: string;
  dose: string;
  frequency: string;
  duration: string;
  notes: string;
  pharmacy: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  patients?: Patient;
  medications?: Medication;
}

export interface MedicationHistory {
  id: string;
  patient_id: string;
  prescription_id: string;
  start_date: string;
  end_date: string | null;
  prescriptions?: Prescription;
}

export interface Alert {
  id: string;
  prescription_id: string;
  message: string;
  severity: "low" | "medium" | "high";
  created_at: string;
}

export interface DrugInteraction {
  medication1: string;
  medication2: string;
  warning: string;
  severity: "low" | "medium" | "high";
}

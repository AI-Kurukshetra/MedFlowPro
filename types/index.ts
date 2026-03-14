export type Role = "provider" | "patient" | "pharmacy" | "admin" | "staff";

export type PatientSummary = {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  risk_level: "Low" | "Medium" | "High";
};

export type PharmacySummary = {
  id: string;
  pharmacy_name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
};

export type MedicationSummary = {
  id: string;
  drug_name: string;
  generic_name: string;
  strength: string;
  route: string;
};

export type InteractionWarning = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "moderate" | "high";
};

export type StaffMember = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string | null;
  status: string;
};
import type { PatientSummary, PharmacySummary, MedicationSummary } from "@/types";

export const mockPatients: PatientSummary[] = [
  { id: "11111111-1111-1111-1111-111111111111", full_name: "Avery Collins", age: 45, gender: "Female", risk_level: "High" },
  { id: "22222222-2222-2222-2222-222222222222", full_name: "Daniel Wong", age: 58, gender: "Male", risk_level: "Medium" },
  { id: "33333333-3333-3333-3333-333333333333", full_name: "Sophia Patel", age: 31, gender: "Female", risk_level: "Low" }
];

export const mockPharmacies: PharmacySummary[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    pharmacy_name: "Riverside Pharmacy",
    address: "124 North Elm St",
    city: "Boston",
    state: "MA",
    phone: "(617) 555-0110"
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    pharmacy_name: "Central Care RX",
    address: "88 Beacon Ave",
    city: "Cambridge",
    state: "MA",
    phone: "(617) 555-0188"
  }
];

export const mockMedications: MedicationSummary[] = [
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    drug_name: "Atorvastatin",
    generic_name: "atorvastatin",
    strength: "20 mg",
    route: "Oral"
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    drug_name: "Lisinopril",
    generic_name: "lisinopril",
    strength: "10 mg",
    route: "Oral"
  }
];


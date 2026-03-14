-- Add patient contact and medical history fields
alter table public.patients
  add column if not exists contact text;

alter table public.patients
  add column if not exists medical_history text;
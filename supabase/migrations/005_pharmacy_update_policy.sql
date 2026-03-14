-- Allow pharmacies to update prescription status
create policy "Pharmacies update prescriptions" on public.prescriptions
  for update using (public.has_role('pharmacy'));
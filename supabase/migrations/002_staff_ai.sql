-- Add staff role
insert into public.roles (name)
values ('staff')
on conflict do nothing;

-- Staff table
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  full_name text not null,
  email text unique not null,
  role text not null,
  department text,
  status text default 'active',
  created_at timestamptz default now()
);

create index if not exists idx_staff_user on public.staff(user_id);

-- Diagnoses table
create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  diagnosis_name text not null,
  created_at timestamptz default now()
);

create index if not exists idx_diagnoses_patient on public.diagnoses(patient_id);

-- AI recommendations
create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  condition text,
  recommendations jsonb default '[]'::jsonb,
  warnings jsonb default '[]'::jsonb,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_ai_recommendations_patient on public.ai_recommendations(patient_id);

-- Prescription logs
create table if not exists public.prescription_logs (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid references public.prescriptions(id) on delete cascade,
  actor_user_id uuid default auth.uid(),
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_prescription_logs_prescription on public.prescription_logs(prescription_id);

-- RLS
alter table public.staff enable row level security;
alter table public.diagnoses enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.prescription_logs enable row level security;

-- Policies
create policy "Admins manage staff" on public.staff
  for all using (public.has_role('admin'));

create policy "Providers read diagnoses" on public.diagnoses
  for select using (public.has_role('provider') or public.has_role('admin') or public.has_role('patient'));

create policy "Providers manage diagnoses" on public.diagnoses
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Providers insert ai recommendations" on public.ai_recommendations
  for insert with check (public.has_role('provider') or public.has_role('admin'));

create policy "Providers read ai recommendations" on public.ai_recommendations
  for select using (public.has_role('provider') or public.has_role('admin'));

create policy "Insert prescription logs" on public.prescription_logs
  for insert with check (auth.uid() is not null);

create policy "Read prescription logs" on public.prescription_logs
  for select using (public.has_role('provider') or public.has_role('admin'));
-- Enable extensions
create extension if not exists "pgcrypto";

-- Roles
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

insert into public.roles (name)
values ('provider'), ('patient'), ('pharmacy'), ('admin')
on conflict do nothing;

-- Users & Profiles
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.user_roles (
  user_id uuid references public.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, role_id)
);

-- Providers
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  npi text,
  specialty text,
  created_at timestamptz default now()
);

-- Patients
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  primary_provider_id uuid references public.providers(id),
  full_name text not null,
  age int,
  gender text,
  risk_level text default 'Low',
  created_at timestamptz default now()
);

-- Pharmacies
create table if not exists public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  pharmacy_id text,
  pharmacy_name text not null,
  address text,
  city text,
  state text,
  zip text,
  phone text,
  email text,
  operating_hours text,
  created_at timestamptz default now()
);

-- Medications
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  drug_name text not null,
  generic_name text,
  brand_name text,
  dosage_forms text,
  strength text,
  route text,
  created_at timestamptz default now()
);

-- Prescriptions
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete set null,
  pharmacy_id uuid references public.pharmacies(id) on delete set null,
  status text default 'draft',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medication_id uuid not null references public.medications(id),
  dosage text not null,
  frequency text not null,
  duration text not null,
  instructions text not null,
  created_at timestamptz default now()
);

-- Allergies
create table if not exists public.allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  allergy_name text not null,
  severity text default 'moderate',
  created_at timestamptz default now()
);

-- Conditions
create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  condition_name text not null,
  created_at timestamptz default now()
);

-- Drug interactions
create table if not exists public.drug_interactions (
  id uuid primary key default gen_random_uuid(),
  medication_id_1 uuid references public.medications(id) on delete cascade,
  medication_id_2 uuid references public.medications(id) on delete cascade,
  interaction_kind text default 'drug_drug',
  allergy_name text,
  severity text default 'moderate',
  warning text not null,
  created_at timestamptz default now()
);

-- Medication history
create table if not exists public.medication_history (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  medication_id uuid references public.medications(id),
  status text default 'current',
  refill_status text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

-- Adherence records
create table if not exists public.adherence_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  medication_id uuid references public.medications(id),
  status text default 'on_track',
  record_date date default current_date,
  notes text,
  created_at timestamptz default now()
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid default auth.uid(),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_patients_provider on public.patients(primary_provider_id);
create index if not exists idx_pharmacies_user on public.pharmacies(user_id);
create index if not exists idx_prescriptions_patient on public.prescriptions(patient_id);
create index if not exists idx_prescriptions_provider on public.prescriptions(provider_id);
create index if not exists idx_prescriptions_pharmacy on public.prescriptions(pharmacy_id);
create index if not exists idx_prescription_items_prescription on public.prescription_items(prescription_id);
create index if not exists idx_medication_history_patient on public.medication_history(patient_id);
create index if not exists idx_adherence_patient on public.adherence_records(patient_id);

-- Trigger to sync users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict do nothing;

  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Role helper
create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.name = role_name
  );
$$;

-- RLS
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.providers enable row level security;
alter table public.patients enable row level security;
alter table public.pharmacies enable row level security;
alter table public.medications enable row level security;
alter table public.prescriptions enable row level security;
alter table public.prescription_items enable row level security;
alter table public.allergies enable row level security;
alter table public.conditions enable row level security;
alter table public.drug_interactions enable row level security;
alter table public.medication_history enable row level security;
alter table public.adherence_records enable row level security;
alter table public.audit_logs enable row level security;

-- Policies
create policy "Users can view own user row" on public.users
  for select using (auth.uid() = id or public.has_role('admin'));

create policy "Profiles are self view" on public.profiles
  for select using (auth.uid() = id or public.has_role('admin'));

create policy "Profiles are self update" on public.profiles
  for update using (auth.uid() = id or public.has_role('admin'));

create policy "Admins manage roles" on public.user_roles
  for all using (public.has_role('admin'));

create policy "Providers view own row" on public.providers
  for select using (user_id = auth.uid() or public.has_role('admin'));

create policy "Patients view own row" on public.patients
  for select using (
    public.has_role('admin')
    or public.has_role('provider')
    or user_id = auth.uid()
  );

create policy "Providers manage patients" on public.patients
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Read pharmacies" on public.pharmacies
  for select using (auth.uid() is not null);

create policy "Admins manage pharmacies" on public.pharmacies
  for all using (public.has_role('admin'));

create policy "Read medications" on public.medications
  for select using (auth.uid() is not null);

create policy "Providers manage medications" on public.medications
  for all using (public.has_role('admin'));

create policy "Read interactions" on public.drug_interactions
  for select using (auth.uid() is not null);

create policy "Providers manage interactions" on public.drug_interactions
  for all using (public.has_role('admin'));

create policy "Read prescriptions" on public.prescriptions
  for select using (
    public.has_role('admin')
    or public.has_role('provider')
    or public.has_role('pharmacy')
    or public.has_role('patient')
  );

create policy "Providers insert prescriptions" on public.prescriptions
  for insert with check (public.has_role('provider') or public.has_role('admin'));

create policy "Providers update prescriptions" on public.prescriptions
  for update using (public.has_role('provider') or public.has_role('admin'));

create policy "Read prescription items" on public.prescription_items
  for select using (auth.uid() is not null);

create policy "Manage prescription items" on public.prescription_items
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Read allergies" on public.allergies
  for select using (public.has_role('provider') or public.has_role('admin') or public.has_role('patient'));

create policy "Manage allergies" on public.allergies
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Read conditions" on public.conditions
  for select using (public.has_role('provider') or public.has_role('admin') or public.has_role('patient'));

create policy "Manage conditions" on public.conditions
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Read medication history" on public.medication_history
  for select using (
    public.has_role('provider')
    or public.has_role('admin')
    or public.has_role('patient')
  );

create policy "Manage medication history" on public.medication_history
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Read adherence" on public.adherence_records
  for select using (
    public.has_role('provider')
    or public.has_role('admin')
    or public.has_role('patient')
  );

create policy "Manage adherence" on public.adherence_records
  for all using (public.has_role('provider') or public.has_role('admin'));

create policy "Insert audit logs" on public.audit_logs
  for insert with check (auth.uid() is not null);

create policy "Admins read audit logs" on public.audit_logs
  for select using (public.has_role('admin'));


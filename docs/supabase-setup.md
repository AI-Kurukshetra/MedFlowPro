# Supabase Setup Guide

## 1. Create Project
- Create a Supabase project in US East (or closest available region).
- Copy the project URL and anon key for `.env.local`.

## 2. Run Migration
- Open the SQL editor in Supabase and run:
  - `supabase/migrations/001_init.sql`

This sets up tables, RLS policies, and audit logging.

## 3. Create Service Role Key
- In Supabase settings, copy the `service_role` key.
- Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY` (used for seeding only).

## 4. Seed Demo Data
```bash
npm run seed
```

The seed script creates:
- Predictable demo accounts (provider, admin, pharmacy, patient)
- 5 additional providers
- 10 patients
- 5 pharmacies
- 50 medications
- 20 drug interaction rules
- 50 prescriptions and items
- Medication history and adherence records

## 5. Demo Credentials
- Provider: `provider@medflow.dev` / `demo123`
- Admin: `admin@medflow.dev` / `demo123`
- Pharmacy: `pharmacy@medflow.dev` / `demo123`
- Patient: `patient@medflow.dev` / `demo123`

## Notes
- Patients are created by providers/admins, not self-registered.
- RLS policies enforce role-based access.

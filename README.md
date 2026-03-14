# MedFlow Pro

Medication management and e-prescribing MVP built with Next.js App Router, Supabase, and TailwindCSS.

## Features
- Role-based portals (provider, patient, pharmacy, admin) with themed UI
- Role-based access control with Supabase Auth + RLS
- Provider dashboard with AI insights, alerts, and prescription activity
- Patient, staff, and prescription management modules
- AI prescribing assistant with interaction warnings and dosage suggestions
- Pharmacy queue with fill/reject actions
- Audit logging for prescriptions and provider activity

## Tech Stack
- Next.js App Router (TypeScript)
- TailwindCSS + shadcn/ui style components
- Supabase Postgres + Auth
- Server Actions + React Server Components

## Demo Credentials
Use these predictable demo logins after seeding:

- Provider: `provider@medflow.dev` / `demo123`
- Admin: `admin@medflow.dev` / `demo123`
- Pharmacy: `pharmacy@medflow.dev` / `demo123`
- Patient: `patient@medflow.dev` / `demo123`

## Local Development
1. Install dependencies
```bash
npm install
```

2. Create `.env.local` from `.env.example`
```bash
cp .env.example .env.local
```

3. Configure Supabase (see `docs/supabase-setup.md`)

4. Run migrations
- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_staff_ai.sql`
- `supabase/migrations/003_patient_fields.sql`
- `supabase/migrations/004_user_roles_policy.sql`
- `supabase/migrations/005_pharmacy_update_policy.sql`

5. Seed demo data
```bash
npm run seed
```

6. Run the dev server
```bash
npm run dev
```

## Portal Routes
- Provider: `/provider/dashboard`
- Patient: `/patient/medications`
- Pharmacy: `/pharmacy/queue`
- Admin: `/admin/overview`

## Scripts
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run seed` - seed Supabase with demo data

## Documentation
- Supabase setup: `docs/supabase-setup.md`
- Vercel deployment: `docs/vercel-deploy.md`

## Notes
This MVP implements HIPAA-ready architecture patterns (audit logging, RBAC, encryption in transit, and at-rest defaults) without formal HIPAA certification.
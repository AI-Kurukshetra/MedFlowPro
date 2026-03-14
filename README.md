# MedFlow Pro

AI-Assisted Medication Management & E-Prescribing SaaS

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Go to your Supabase project → **SQL Editor** → **New query**

Copy and paste the contents of `supabase/setup-complete.sql` and run it.

This creates all tables, RLS policies, and seeds the medications.

### 3. Create demo users

Option A - Via the app (recommended):
- Visit `/signup` and create accounts

Option B - Via Supabase Dashboard > Authentication > Users:
| Email | Password | Role | Name |
|-------|----------|------|------|
| dr.smith@medflow.com | password123 | doctor | Dr. Smith |
| dr.patel@medflow.com | password123 | doctor | Dr. Patel |
| john.doe@email.com | password123 | patient | John Doe |
| mary.johnson@email.com | password123 | patient | Mary Johnson |

After creating auth users, sign in and the profile is auto-created on first login.

### 4. Run locally

```bash
npm run dev
```

Visit http://localhost:3000

## Demo Flow

1. Login as **Dr. Smith** (`dr.smith@medflow.com` / `password123`)
2. Add a patient from the Patients page
3. Create a prescription — select Aspirin for a patient who already has Aspirin (triggers interaction)
4. See the drug interaction warning and AI-suggested alternatives
5. Login as **John Doe** to see the Patient Portal

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Deployment**: Vercel

## Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── login/          # Auth pages
│   ├── signup/
│   ├── dashboard/      # Doctor dashboard
│   ├── patients/       # Patient management
│   │   ├── new/        # Add patient
│   │   └── [id]/       # Patient profile
│   ├── prescriptions/  # Prescription management
│   │   └── new/        # Create prescription (with drug interaction check)
│   └── patient/        # Patient portal
│       ├── dashboard/
│       └── medications/
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts   # Browser client
│   │   └── server.ts   # Server client
│   └── interactions.ts # Drug interaction rules
└── types/
    └── index.ts
supabase/
├── schema.sql          # Database schema
├── seed.sql            # Seed data (medications)
└── setup-complete.sql  # All-in-one setup script
```

# Vercel Deployment Guide

## 1. Push to Git
Commit and push the repository to GitHub/GitLab/Bitbucket.

## 2. Create Vercel Project
- Import the repo into Vercel.
- Framework preset: Next.js

## 3. Environment Variables
Add the following in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional; only needed if running seed remotely)

## 4. Deploy
Vercel will run `npm run build` and deploy automatically.

## 5. Post-Deploy
- Run database migration in Supabase if not already done.
- Seed data using local `npm run seed`.

## Recommended
Enable Vercel analytics and production monitoring for performance insights.


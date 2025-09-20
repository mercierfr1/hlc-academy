
# HLC Academy - Database Setup Instructions

## 1. Get your Supabase Anon Key

1. Go to your Supabase dashboard: https://app.supabase.com/project/mwrtykejdzvnlckmqbbn.supabase.co
2. Go to Settings > API
3. Copy the "anon public" key
4. Replace the placeholder in .env.local:
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

## 2. Get your Database Password

1. Go to Settings > Database in your Supabase dashboard
2. Copy your database password
3. Update the DATABASE_URL in .env.local:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.mwrtykejdzvnlckmqbbn.supabase.co:5432/postgres

## 3. Run the Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of database/schema.sql
3. Click "Run" to execute the schema

## 4. (Optional) Seed the Database

1. In SQL Editor, copy and paste the contents of database/seed.sql
2. Click "Run" to add sample data

## 5. Configure Authentication

1. Go to Authentication > Settings
2. Set Site URL to: http://localhost:3000
3. Add Redirect URL: http://localhost:3000/auth/callback
4. Enable email confirmations if desired

## 6. Test the Setup

Run the development server:
```bash
npm run dev
```

Then visit:
- http://localhost:3000/test-supabase (to test the backend)
- http://localhost:3000/login (to test authentication)

## Your Supabase Project Details:
- Project URL: https://mwrtykejdzvnlckmqbbn.supabase.co
- Project Reference: mwrtykejdzvnlckmqbbn
- Dashboard: https://app.supabase.com/project/mwrtykejdzvnlckmqbbn

## Quick Test Commands:

```bash
# Test the backend
curl -X GET https://mwrtykejdzvnlckmqbbn.supabase.co/rest/v1/ -H "apikey: YOUR_ANON_KEY"

# Test authentication
curl -X POST https://mwrtykejdzvnlckmqbbn.supabase.co/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

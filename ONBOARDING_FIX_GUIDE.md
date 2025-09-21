# 🚨 Onboarding Responses Fix Guide

## Issue
The onboarding responses are failing to save with the error "Failed to save onboarding responses".

## Root Cause
The `onboarding_responses` table doesn't exist in the Supabase database yet.

## Solution

### Step 1: Create the Table in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create New Query**: Click "New Query"
4. **Run the following SQL**:

```sql
-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    trading_experience TEXT,
    current_profitability TEXT,
    biggest_challenge TEXT,
    account_size TEXT,
    time_commitment TEXT,
    primary_goal TEXT,
    motivation_level TEXT,
    preferred_learning_style TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, email)
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own onboarding responses" ON public.onboarding_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses" ON public.onboarding_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses" ON public.onboarding_responses
    FOR UPDATE USING (auth.uid() = user_id);
```

5. **Click "Run"** to execute the SQL

### Step 2: Verify the Fix

After creating the table, test the onboarding flow:

1. **Start the development server**: `npm run dev`
2. **Go to**: http://localhost:3000/onboarding
3. **Complete the onboarding questions**
4. **Check if it saves successfully**

### Step 3: Test the API (Optional)

Run the test script to verify everything is working:

```bash
node test-onboarding-api.js
```

## Alternative: Quick Fix Script

If you prefer, you can run this script to get the exact SQL to copy:

```bash
node deploy-onboarding-schema-direct.js
```

This will output the exact SQL you need to run in Supabase.

## Expected Result

After fixing:
- ✅ Users can complete onboarding questions
- ✅ Responses are saved to Supabase
- ✅ Users are marked as onboarding completed
- ✅ Users are redirected to trading dashboard
- ✅ Onboarding completion status is tracked

## Troubleshooting

If you still get errors:

1. **Check Supabase logs**: Go to Logs → API logs
2. **Verify table exists**: Check Table Editor → onboarding_responses
3. **Check RLS policies**: Verify policies are created correctly
4. **Test with a fresh user**: Create a new account and try onboarding

## Files Involved

- `app/api/onboarding/route.ts` - API endpoint
- `components/OnboardingQuestions.tsx` - Frontend component
- `database/schema.sql` - Database schema (needs to be deployed)

The issue is simply that the database table hasn't been created yet. Once you run the SQL in Supabase, everything should work perfectly!

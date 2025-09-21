-- Fix trading_goals table structure for HLC Academy
-- Run this in your Supabase SQL Editor

-- Add missing columns to trading_goals table
ALTER TABLE public.trading_goals 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS target_date TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records if any (set default values)
UPDATE public.trading_goals 
SET 
  title = COALESCE(title, 'Untitled Goal'),
  description = COALESCE(description, 'No description'),
  target_date = COALESCE(target_date, '2025-12-31'),
  priority = COALESCE(priority, 'medium'),
  email = COALESCE(email, 'unknown@example.com'),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE title IS NULL OR description IS NULL OR target_date IS NULL OR priority IS NULL;

-- Make sure all required columns have NOT NULL constraints where needed
ALTER TABLE public.trading_goals ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.trading_goals ALTER COLUMN priority SET NOT NULL;
ALTER TABLE public.trading_goals ALTER COLUMN completed SET NOT NULL;
ALTER TABLE public.trading_goals ALTER COLUMN user_id SET NOT NULL;

-- Ensure RLS is enabled
ALTER TABLE public.trading_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_trading_goals" ON public.trading_goals;
DROP POLICY IF EXISTS "users_can_insert_own_trading_goals" ON public.trading_goals;
DROP POLICY IF EXISTS "users_can_update_own_trading_goals" ON public.trading_goals;
DROP POLICY IF EXISTS "users_can_delete_own_trading_goals" ON public.trading_goals;

-- Create RLS policies
CREATE POLICY "users_can_view_own_trading_goals" ON public.trading_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_trading_goals" ON public.trading_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_trading_goals" ON public.trading_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_trading_goals" ON public.trading_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Fix trade_journal table by adding missing email column
-- Run this in your Supabase SQL editor

-- Add email column if it doesn't exist
ALTER TABLE public.trade_journal 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing records with email from user_id lookup
UPDATE public.trade_journal 
SET email = profiles.email 
FROM public.profiles 
WHERE trade_journal.user_id = profiles.id 
AND trade_journal.email IS NULL;

-- Make email column NOT NULL after updating existing records
ALTER TABLE public.trade_journal 
ALTER COLUMN email SET NOT NULL;

-- Add index for email column
CREATE INDEX IF NOT EXISTS idx_trade_journal_email ON public.trade_journal(email);

-- Update the unique constraint to include email
ALTER TABLE public.trade_journal 
DROP CONSTRAINT IF EXISTS trade_journal_user_id_email_trade_date_symbol_side_key;

ALTER TABLE public.trade_journal 
ADD CONSTRAINT trade_journal_user_id_email_trade_date_symbol_side_key 
UNIQUE(user_id, email, trade_date, symbol, side);

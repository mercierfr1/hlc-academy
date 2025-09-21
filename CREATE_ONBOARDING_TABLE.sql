-- Create onboarding_responses table for HLC Academy
-- Run this in your Supabase SQL Editor

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

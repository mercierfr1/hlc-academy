-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_plan AS ENUM ('Kickstart', 'Scale Up', 'Mastery');
CREATE TYPE trade_direction AS ENUM ('Long', 'Short');
CREATE TYPE trade_outcome AS ENUM ('Win', 'Loss', 'Break Even');
CREATE TYPE module_status AS ENUM ('Not Started', 'In Progress', 'Completed');
CREATE TYPE quiz_status AS ENUM ('Not Started', 'In Progress', 'Completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan user_plan DEFAULT 'Kickstart',
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    daily_goal_minutes INTEGER DEFAULT 30,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    welcome_questions_completed BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding responses table
CREATE TABLE public.onboarding_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Trading courses/modules
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    xp_reward INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    required_plan user_plan,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course sections
CREATE TABLE public.course_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE public.user_course_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    status module_status DEFAULT 'Not Started',
    progress_percentage INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Section progress tracking
CREATE TABLE public.user_section_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.course_sections(id) ON DELETE CASCADE,
    status module_status DEFAULT 'Not Started',
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section_id)
);

-- Trading journal entries
CREATE TABLE public.trade_journal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    symbol TEXT NOT NULL,
    direction trade_direction NOT NULL,
    entry_price DECIMAL(10,4),
    exit_price DECIMAL(10,4),
    quantity INTEGER,
    outcome trade_outcome,
    pnl DECIMAL(12,2),
    notes TEXT,
    screenshot_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily trading goals
CREATE TABLE public.trading_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_date DATE NOT NULL,
    target_trades INTEGER DEFAULT 0,
    actual_trades INTEGER DEFAULT 0,
    target_study_minutes INTEGER DEFAULT 30,
    actual_study_minutes INTEGER DEFAULT 0,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, goal_date)
);

-- XP transactions log
CREATE TABLE public.xp_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL, -- 'course_completion', 'trade_journal', 'daily_goal', etc.
    description TEXT,
    reference_id UUID, -- ID of the related record (course, trade, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes for courses
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL, -- Array of question objects
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- User's answers
    score INTEGER,
    status quiz_status DEFAULT 'In Progress',
    time_spent_minutes INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light', -- 'light', 'dark', 'auto'
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    trading_reminders BOOLEAN DEFAULT TRUE,
    study_reminders BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_trade_journal_user_date ON public.trade_journal(user_id, trade_date);
CREATE INDEX idx_trade_journal_symbol ON public.trade_journal(symbol);
CREATE INDEX idx_user_course_progress_user ON public.user_course_progress(user_id);
CREATE INDEX idx_user_section_progress_user ON public.user_section_progress(user_id);
CREATE INDEX idx_trading_goals_user_date ON public.trading_goals(user_id, goal_date);
CREATE INDEX idx_xp_transactions_user ON public.xp_transactions(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Onboarding responses policies
CREATE POLICY "Users can view own onboarding responses" ON public.onboarding_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses" ON public.onboarding_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses" ON public.onboarding_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Course progress policies
CREATE POLICY "Users can view own course progress" ON public.user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress" ON public.user_course_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress" ON public.user_course_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Section progress policies
CREATE POLICY "Users can view own section progress" ON public.user_section_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own section progress" ON public.user_section_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own section progress" ON public.user_section_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trade journal policies
CREATE POLICY "Users can view own trades" ON public.trade_journal
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON public.trade_journal
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON public.trade_journal
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON public.trade_journal
    FOR DELETE USING (auth.uid() = user_id);

-- Trading goals policies
CREATE POLICY "Users can view own goals" ON public.trading_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.trading_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.trading_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.trading_goals
    FOR DELETE USING (auth.uid() = user_id);

-- XP transactions policies
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Quiz attempts policies
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz attempts" ON public.quiz_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_sections_updated_at BEFORE UPDATE ON public.course_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_section_progress_updated_at BEFORE UPDATE ON public.user_section_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trade_journal_updated_at BEFORE UPDATE ON public.trade_journal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_goals_updated_at BEFORE UPDATE ON public.trading_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON public.quiz_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    
    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    current_xp INTEGER;
BEGIN
    -- Get current XP
    SELECT xp_points INTO current_xp FROM public.profiles WHERE id = NEW.user_id;
    
    -- Calculate new level (every 1000 XP = 1 level)
    new_level := (current_xp / 1000) + 1;
    
    -- Update user level if it changed
    UPDATE public.profiles 
    SET level = new_level 
    WHERE id = NEW.user_id AND level != new_level;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level when XP is added
CREATE TRIGGER update_level_on_xp
    AFTER INSERT ON public.xp_transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

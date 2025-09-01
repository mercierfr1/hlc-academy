-- HLC Academy Database Schema
-- Run this in your Supabase SQL editor or PostgreSQL database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, cancelled, expired
    subscription_plan VARCHAR(50) DEFAULT 'weekly', -- weekly, monthly, annual
    stripe_customer_id VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE
);

-- User profiles for additional information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trading_experience VARCHAR(50), -- beginner, intermediate, advanced
    preferred_timeframe VARCHAR(50), -- scalping, day, swing, position
    risk_tolerance VARCHAR(50), -- conservative, moderate, aggressive
    trading_goals TEXT,
    profile_image_url VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading goals
CREATE TABLE trading_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- daily, weekly, monthly, yearly
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50), -- £, %, trades, etc.
    deadline DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, paused, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading journal entries
CREATE TABLE trading_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    currency_pair VARCHAR(20),
    position_type VARCHAR(10), -- long, short
    entry_price DECIMAL(10,5),
    exit_price DECIMAL(10,5),
    pnl DECIMAL(10,2),
    risk_reward_ratio DECIMAL(5,2),
    notes TEXT,
    strategy VARCHAR(100),
    timeframe VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading plans
CREATE TABLE trading_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mindset_quote TEXT,
    htf_4h BOOLEAN DEFAULT FALSE,
    htf_daily BOOLEAN DEFAULT FALSE,
    htf_weekly BOOLEAN DEFAULT FALSE,
    ltf_m15 BOOLEAN DEFAULT FALSE,
    ltf_m1 BOOLEAN DEFAULT FALSE,
    scaling_in BOOLEAN DEFAULT FALSE,
    break_even BOOLEAN DEFAULT FALSE,
    partials BOOLEAN DEFAULT FALSE,
    max_risk BOOLEAN DEFAULT FALSE,
    daily_cap BOOLEAN DEFAULT FALSE,
    position_sizing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entry models
CREATE TABLE entry_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- High probability examples
CREATE TABLE high_probability_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(100),
    lesson_id VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    xp_earned INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- active, cancelled, past_due, etc.
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    plan_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_trading_entries_user_date ON trading_entries(user_id, trade_date);
CREATE INDEX idx_trading_goals_user_status ON trading_goals(user_id, status);
CREATE INDEX idx_user_progress_user_module ON user_progress(user_id, module_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_goals_updated_at BEFORE UPDATE ON trading_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_entries_updated_at BEFORE UPDATE ON trading_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_plans_updated_at BEFORE UPDATE ON trading_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

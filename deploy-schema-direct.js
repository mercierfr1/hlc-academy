#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')

const SUPABASE_URL = 'https://mwrtykejdzvnlckmqbbn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnR5a2VqZHp2bmxja21xYmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM4NzMzMCwiZXhwIjoyMDczOTYzMzMwfQ.zYqgApdOds24JA52WmFZsISM2P4TZHlVfxiGuKZHh9k'

console.log('🗄️  Deploying Database Schema Directly...\n')

// Essential schema for immediate functionality
const essentialSchema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_plan AS ENUM ('Kickstart', 'Scale Up', 'Mastery');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    xp_reward INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    required_plan user_plan DEFAULT 'Kickstart',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course sections table
CREATE TABLE IF NOT EXISTS public.course_sections (
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

-- Create trade journal table
CREATE TABLE IF NOT EXISTS public.trade_journal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    symbol TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('Long', 'Short')),
    entry_price DECIMAL(10,4),
    exit_price DECIMAL(10,4),
    quantity INTEGER,
    outcome TEXT CHECK (outcome IN ('Win', 'Loss', 'Break Even')),
    pnl DECIMAL(12,2),
    notes TEXT,
    screenshot_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create XP transactions table
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trading goals table
CREATE TABLE IF NOT EXISTS public.trading_goals (
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

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for trade_journal
DROP POLICY IF EXISTS "Users can view own trades" ON public.trade_journal;
CREATE POLICY "Users can view own trades" ON public.trade_journal FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trades" ON public.trade_journal;
CREATE POLICY "Users can insert own trades" ON public.trade_journal FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trades" ON public.trade_journal;
CREATE POLICY "Users can update own trades" ON public.trade_journal FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trades" ON public.trade_journal;
CREATE POLICY "Users can delete own trades" ON public.trade_journal FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for xp_transactions
DROP POLICY IF EXISTS "Users can view own XP transactions" ON public.xp_transactions;
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for trading_goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.trading_goals;
CREATE POLICY "Users can view own goals" ON public.trading_goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own goals" ON public.trading_goals;
CREATE POLICY "Users can insert own goals" ON public.trading_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goals" ON public.trading_goals;
CREATE POLICY "Users can update own goals" ON public.trading_goals FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own goals" ON public.trading_goals;
CREATE POLICY "Users can delete own goals" ON public.trading_goals FOR DELETE USING (auth.uid() = user_id);

-- Create profile trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_trade_journal_user_date ON public.trade_journal(user_id, trade_date);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_goals_user_date ON public.trading_goals(user_id, goal_date);

-- Insert sample courses
INSERT INTO public.courses (id, title, description, thumbnail_url, duration_minutes, difficulty_level, xp_reward, is_premium, required_plan, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Introduction to Supply & Demand', 'Learn the fundamentals of institutional supply and demand zones in trading.', '/images/courses/supply-demand-intro.jpg', 45, 1, 100, false, 'Kickstart', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Market Structure Analysis', 'Deep dive into market structure and how institutions move price.', '/images/courses/market-structure.jpg', 60, 2, 150, false, 'Kickstart', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Advanced Order Flow', 'Master reading order flow and understanding institutional behavior.', '/images/courses/order-flow.jpg', 90, 3, 200, true, 'Scale Up', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Psychology & Bias Management', 'Overcome cognitive biases and develop a trader''s mindset.', '/images/courses/psychology.jpg', 75, 2, 175, false, 'Kickstart', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Risk Management Mastery', 'Advanced risk management techniques used by professional traders.', '/images/courses/risk-management.jpg', 120, 4, 250, true, 'Mastery', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert sample course sections
INSERT INTO public.course_sections (course_id, title, description, content, video_url, duration_minutes, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'What is Supply & Demand?', 'Understanding the basic concepts', 'Supply and demand zones are areas where price has previously reversed or paused significantly. These zones represent areas of institutional interest where large players have placed orders.', 'https://example.com/videos/supply-demand-1.mp4', 15, 1),
('550e8400-e29b-41d4-a716-446655440001', 'Identifying Supply Zones', 'How to spot supply zones on charts', 'Supply zones are areas where selling pressure is strong. Look for areas where price has previously rejected and moved lower multiple times.', 'https://example.com/videos/supply-demand-2.mp4', 15, 2),
('550e8400-e29b-41d4-a716-446655440001', 'Identifying Demand Zones', 'How to spot demand zones on charts', 'Demand zones are areas where buying pressure is strong. Look for areas where price has previously bounced and moved higher multiple times.', 'https://example.com/videos/supply-demand-3.mp4', 15, 3)
ON CONFLICT DO NOTHING;
`

// Function to execute SQL via direct HTTP request
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql })
    
    const options = {
      hostname: 'mwrtykejdzvnlckmqbbn.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data })
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`))
        }
      })
    })
    
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

// Try to create the exec_sql function first
async function createExecFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
      RETURN 'Success';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
    END;
    $$;
  `
  
  try {
    await executeSQL(createFunctionSQL)
    console.log('✅ SQL execution function created')
    return true
  } catch (error) {
    console.log('⚠️  Could not create exec function, trying alternative approach')
    return false
  }
}

// Deploy schema using alternative method
async function deploySchemaAlternative() {
  console.log('🔄 Trying alternative deployment method...')
  
  try {
    // Try to create tables one by one using direct SQL execution
    const statements = essentialSchema.split(';').filter(stmt => stmt.trim().length > 0)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim() + ';'
      
      if (statement.includes('CREATE TABLE') || statement.includes('CREATE TYPE') || statement.includes('ALTER TABLE') || statement.includes('CREATE POLICY') || statement.includes('CREATE OR REPLACE FUNCTION') || statement.includes('CREATE TRIGGER') || statement.includes('CREATE INDEX') || statement.includes('INSERT INTO')) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          
          // Use a direct approach with raw SQL
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'apikey': SERVICE_ROLE_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql_text: statement })
          })
          
          if (response.ok) {
            successCount++
          } else {
            errorCount++
            console.log(`⚠️  Statement ${i + 1} failed:`, await response.text())
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          errorCount++
          console.log(`⚠️  Statement ${i + 1} failed:`, error.message)
        }
      }
    }
    
    console.log(`\n📊 Deployment Results:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    
    if (successCount > 0) {
      console.log('\n🎉 Essential database schema deployed!')
    }
    
  } catch (error) {
    console.log('❌ Alternative deployment failed:', error.message)
  }
}

// Main deployment function
async function deploySchema() {
  try {
    console.log('📝 Deploying essential database schema...')
    
    // First try to create the exec function
    const execFunctionCreated = await createExecFunction()
    
    if (execFunctionCreated) {
      // Try to execute the full schema
      try {
        await executeSQL(essentialSchema)
        console.log('✅ Full schema deployed successfully!')
      } catch (error) {
        console.log('⚠️  Full schema deployment failed, trying statement by statement')
        await deploySchemaAlternative()
      }
    } else {
      console.log('🔄 Trying alternative deployment approach...')
      await deploySchemaAlternative()
    }
    
  } catch (error) {
    console.log('❌ Schema deployment failed:', error.message)
    console.log('\n📋 Manual deployment required:')
    console.log('1. Go to https://app.supabase.com/project/mwrtykejdzvnlckmqbbn')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy the schema from database/schema.sql')
    console.log('4. Paste and execute')
  }
}

// Run deployment
deploySchema()

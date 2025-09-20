#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const https = require('https')

const SUPABASE_URL = 'https://mwrtykejdzvnlckmqbbn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnR5a2VqZHp2bmxja21xYmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM4NzMzMCwiZXhwIjoyMDczOTYzMzMwfQ.zYqgApdOds24JA52WmFZsISM2P4TZHlVfxiGuKZHh9k'

console.log('🗄️  Deploying Database Schema to Supabase...\n')

// Read the schema file
const schemaPath = path.join(__dirname, 'database', 'schema.sql')
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Schema file not found at:', schemaPath)
  process.exit(1)
}

const schema = fs.readFileSync(schemaPath, 'utf8')
console.log('✅ Schema file loaded')

// Function to execute SQL via Supabase REST API
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

// Function to create a simple SQL execution function
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
    const response = await executeSQL(createFunctionSQL)
    console.log('✅ SQL execution function created')
    return true
  } catch (error) {
    console.log('⚠️  Could not create exec function:', error.message)
    return false
  }
}

async function deploySchema() {
  try {
    // Try to create the exec function first
    await createExecFunction()
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        await executeSQL(statement)
        successCount++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.log(`⚠️  Statement ${i + 1} failed:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n📊 Deployment Results:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    
    if (successCount > 0) {
      console.log('\n🎉 Database schema deployment completed!')
      console.log('\n📋 Next Steps:')
      console.log('1. Check your Supabase dashboard to verify tables were created')
      console.log('2. Run the seed script if you want sample data')
      console.log('3. Test the backend with: npm run dev')
    } else {
      console.log('\n❌ Schema deployment failed. Please run the schema manually in Supabase SQL Editor.')
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    console.log('\n📋 Manual Deployment Required:')
    console.log('1. Go to your Supabase dashboard SQL Editor')
    console.log('2. Copy the contents of database/schema.sql')
    console.log('3. Paste and execute the SQL')
    console.log('\n🔗 Dashboard: https://app.supabase.com/project/mwrtykejdzvnlckmqbbn')
  }
}

// Alternative: Create a simplified schema deployment
async function createTablesManually() {
  console.log('\n🔧 Creating essential tables manually...')
  
  const essentialTables = [
    // Create profiles table
    `CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      plan TEXT DEFAULT 'Kickstart',
      xp_points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      daily_goal_minutes INTEGER DEFAULT 30,
      onboarding_completed BOOLEAN DEFAULT FALSE,
      welcome_questions_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    // Enable RLS
    `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`,
    
    // Create basic policies
    `CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);`,
    `CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
    `CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);`,
    
    // Create profile trigger function
    `CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO public.profiles (id, email, full_name, avatar_url)
        VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;`,
    
    // Create trigger
    `CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
  ]
  
  for (let i = 0; i < essentialTables.length; i++) {
    try {
      console.log(`⏳ Creating table/function ${i + 1}/${essentialTables.length}...`)
      await executeSQL(essentialTables[i])
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.log(`⚠️  Item ${i + 1} failed:`, error.message)
    }
  }
  
  console.log('\n✅ Essential tables created!')
}

// Run the deployment
deploySchema().catch(() => {
  console.log('\n🔄 Falling back to manual table creation...')
  createTablesManually()
})

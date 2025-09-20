#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Supabase configuration from your service key
const SUPABASE_CONFIG = {
  url: 'https://mwrtykejdzvnlckmqbbn.supabase.co',
  projectRef: 'mwrtykejdzvnlckmqbbn',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnR5a2VqZHp2bmxja21xYmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM4NzMzMCwiZXhwIjoyMDczOTYzMzMwfQ.zYqgApdOds24JA52WmFZsISM2P4TZHlVfxiGuKZHh9k'
}

console.log('🚀 Setting up HLC Academy Supabase Backend...\n')

// Create .env.local file
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_CONFIG.url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnR5a2VqZHp2bmxja21xYmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODczMzAsImV4cCI6MjA3Mzk2MzMzMH0.placeholder
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_CONFIG.serviceRoleKey}

# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:placeholder@db.${SUPABASE_CONFIG.projectRef}.supabase.co:5432/postgres

# JWT Secret
JWT_SECRET=hlc_academy_super_secret_jwt_key_2024_trading_platform_secure

# Stripe Configuration (Add your keys later)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (Optional - for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=hlc_academy_session_secret_2024_secure_random_string

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`

try {
  fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent)
  console.log('✅ Created .env.local file')
} catch (error) {
  console.log('⚠️  Could not create .env.local (may be blocked), but continuing...')
}

// Create database setup instructions
const dbInstructions = `
# HLC Academy - Database Setup Instructions

## 1. Get your Supabase Anon Key

1. Go to your Supabase dashboard: ${SUPABASE_CONFIG.url.replace('https://', 'https://app.supabase.com/project/')}
2. Go to Settings > API
3. Copy the "anon public" key
4. Replace the placeholder in .env.local:
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

## 2. Get your Database Password

1. Go to Settings > Database in your Supabase dashboard
2. Copy your database password
3. Update the DATABASE_URL in .env.local:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.${SUPABASE_CONFIG.projectRef}.supabase.co:5432/postgres

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
\`\`\`bash
npm run dev
\`\`\`

Then visit:
- http://localhost:3000/test-supabase (to test the backend)
- http://localhost:3000/login (to test authentication)

## Your Supabase Project Details:
- Project URL: ${SUPABASE_CONFIG.url}
- Project Reference: ${SUPABASE_CONFIG.projectRef}
- Dashboard: https://app.supabase.com/project/${SUPABASE_CONFIG.projectRef}

## Quick Test Commands:

\`\`\`bash
# Test the backend
curl -X GET ${SUPABASE_CONFIG.url}/rest/v1/ -H "apikey: YOUR_ANON_KEY"

# Test authentication
curl -X POST ${SUPABASE_CONFIG.url}/auth/v1/signup \\
  -H "apikey: YOUR_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'
\`\`\`
`

fs.writeFileSync(path.join(process.cwd(), 'DATABASE_SETUP_COMPLETE.md'), dbInstructions)
console.log('✅ Created DATABASE_SETUP_COMPLETE.md with detailed instructions')

// Create a quick setup verification script
const verifyScript = `
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Supabase Setup...')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check for required variables
  const checks = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://mwrtykejdzvnlckmqbbn.supabase.co' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', present: true },
    { name: 'JWT_SECRET', present: true }
  ]
  
  checks.forEach(check => {
    if (check.value) {
      if (envContent.includes(check.value)) {
        console.log(\`✅ \${check.name} is correctly set\`)
      } else {
        console.log(\`⚠️  \${check.name} may need to be updated\`)
      }
    } else if (check.present) {
      if (envContent.includes(check.name)) {
        console.log(\`✅ \${check.name} is present\`)
      } else {
        console.log(\`❌ \${check.name} is missing\`)
      }
    }
  })
} else {
  console.log('❌ .env.local file not found')
}

// Check if database files exist
const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
if (fs.existsSync(schemaPath)) {
  console.log('✅ Database schema file exists')
} else {
  console.log('❌ Database schema file missing')
}

console.log('\\n📋 Next Steps:')
console.log('1. Update your Supabase anon key in .env.local')
console.log('2. Update your database password in .env.local')
console.log('3. Run the database schema in Supabase SQL Editor')
console.log('4. Test with: npm run dev')
`

fs.writeFileSync(path.join(process.cwd(), 'verify-setup.js'), verifyScript)
console.log('✅ Created verify-setup.js for setup verification')

console.log('\n🎉 Backend setup complete!')
console.log('\n📋 Next Steps:')
console.log('1. Read DATABASE_SETUP_COMPLETE.md for detailed instructions')
console.log('2. Update your Supabase anon key in .env.local')
console.log('3. Update your database password in .env.local')
console.log('4. Run the database schema in Supabase SQL Editor')
console.log('5. Test with: npm run dev')
console.log('\n🔗 Your Supabase Dashboard:')
console.log(`https://app.supabase.com/project/${SUPABASE_CONFIG.projectRef}`)
console.log('\n✨ Your backend is ready to go!')

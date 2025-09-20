#!/usr/bin/env node

/**
 * Supabase Setup Script for HLC Academy
 * 
 * This script helps you set up Supabase for the HLC Academy project.
 * Run this script after creating your Supabase project.
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupSupabase() {
  console.log('🚀 HLC Academy - Supabase Setup\n')
  
  console.log('This script will help you configure Supabase for your project.\n')
  
  // Get Supabase project details
  const supabaseUrl = await question('Enter your Supabase project URL: ')
  const supabaseAnonKey = await question('Enter your Supabase anon key: ')
  const supabaseServiceKey = await question('Enter your Supabase service role key: ')
  const databasePassword = await question('Enter your database password: ')
  
  // Create .env.local file
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:${databasePassword}@db.${extractProjectRef(supabaseUrl)}.supabase.co:5432/postgres

# JWT Secret
JWT_SECRET=${generateJWTSecret()}

# Stripe Configuration (Optional - add your keys later)
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
SESSION_SECRET=${generateSessionSecret()}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`

  // Write .env.local file
  const envPath = path.join(process.cwd(), '.env.local')
  fs.writeFileSync(envPath, envContent)
  console.log('\n✅ Created .env.local file')

  // Create database setup instructions
  const dbInstructions = `
# Database Setup Instructions

## 1. Run the Database Schema

Copy and paste the following SQL into your Supabase SQL Editor:

\`\`\`sql
${fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8')}
\`\`\`

## 2. Seed the Database (Optional)

Copy and paste the following SQL into your Supabase SQL Editor:

\`\`\`sql
${fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8')}
\`\`\`

## 3. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable email confirmations if desired
3. Configure redirect URLs:
   - Site URL: http://localhost:3000
   - Redirect URLs: http://localhost:3000/auth/callback

## 4. Set up Row Level Security

The schema includes RLS policies, but you may want to review them in your Supabase dashboard under Authentication > Policies.

## 5. Test the Setup

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000/login to test the authentication.

## Next Steps

1. Update your Stripe configuration in .env.local
2. Configure email settings if needed
3. Customize the database schema as needed
4. Deploy to production when ready

For more help, check the Supabase documentation: https://supabase.com/docs
`

  const instructionsPath = path.join(process.cwd(), 'SUPABASE_SETUP_INSTRUCTIONS.md')
  fs.writeFileSync(instructionsPath, dbInstructions)
  console.log('✅ Created SUPABASE_SETUP_INSTRUCTIONS.md')

  console.log('\n🎉 Supabase setup complete!')
  console.log('\nNext steps:')
  console.log('1. Follow the instructions in SUPABASE_SETUP_INSTRUCTIONS.md')
  console.log('2. Run the database schema in your Supabase SQL Editor')
  console.log('3. Test the setup by running: npm run dev')
  console.log('4. Visit http://localhost:3000/login to test authentication')
  
  rl.close()
}

function extractProjectRef(url) {
  const match = url.match(/https:\/\/.*\.supabase\.co/)
  if (match) {
    return match[0].split('//')[1].split('.')[0]
  }
  return 'your-project-ref'
}

function generateJWTSecret() {
  return require('crypto').randomBytes(64).toString('hex')
}

function generateSessionSecret() {
  return require('crypto').randomBytes(32).toString('hex')
}

// Run the setup
setupSupabase().catch(console.error)

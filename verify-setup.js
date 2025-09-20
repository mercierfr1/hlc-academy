
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
        console.log(`✅ ${check.name} is correctly set`)
      } else {
        console.log(`⚠️  ${check.name} may need to be updated`)
      }
    } else if (check.present) {
      if (envContent.includes(check.name)) {
        console.log(`✅ ${check.name} is present`)
      } else {
        console.log(`❌ ${check.name} is missing`)
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

console.log('\n📋 Next Steps:')
console.log('1. Update your Supabase anon key in .env.local')
console.log('2. Update your database password in .env.local')
console.log('3. Run the database schema in Supabase SQL Editor')
console.log('4. Test with: npm run dev')

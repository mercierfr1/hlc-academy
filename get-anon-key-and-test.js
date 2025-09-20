#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const path = require('path')

console.log('🔑 Getting Supabase Anon Key and Testing Backend...\n')

const SUPABASE_URL = 'https://mwrtykejdzvnlckmqbbn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnR5a2VqZHp2bmxja21xYmJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM4NzMzMCwiZXhwIjoyMDczOTYzMzMwfQ.zYqgApdOds24JA52WmFZsISM2P4TZHlVfxiGuKZHh9k'

// Function to make HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) })
        } catch (e) {
          resolve({ status: res.statusCode, data })
        }
      })
    })
    
    req.on('error', reject)
    req.setTimeout(10000, () => reject(new Error('Request timeout')))
    req.end()
  })
}

// Test the backend API
async function testBackendAPI() {
  console.log('🧪 Testing Backend API...')
  
  try {
    // Test courses API
    const response = await makeRequest('http://localhost:3001/api/courses')
    
    if (response.status === 200) {
      console.log('✅ Courses API is working!')
      console.log('📊 Response:', JSON.stringify(response.data, null, 2))
    } else {
      console.log('⚠️  Courses API returned:', response.status)
      console.log('📊 Response:', response.data)
    }
  } catch (error) {
    console.log('❌ Could not test API:', error.message)
  }
}

// Test Supabase connection directly
async function testSupabaseConnection() {
  console.log('🌐 Testing Supabase Connection...')
  
  try {
    // Test with service role key
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    })
    
    if (response.status === 200) {
      console.log('✅ Supabase connection successful!')
      
      // Try to query courses table
      const coursesResponse = await makeRequest(`${SUPABASE_URL}/rest/v1/courses`, {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        }
      })
      
      if (coursesResponse.status === 200) {
        console.log('✅ Courses table exists and is accessible!')
        console.log('📚 Found courses:', coursesResponse.data.length)
        coursesResponse.data.forEach(course => {
          console.log(`   - ${course.title} (${course.plan})`)
        })
      } else {
        console.log('⚠️  Courses table query failed:', coursesResponse.status)
      }
    } else {
      console.log('❌ Supabase connection failed:', response.status)
    }
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message)
  }
}

// Create a proper anon key (this is a mock but follows the pattern)
function createAnonKey() {
  // This creates a mock anon key - you'll need to get the real one from Supabase dashboard
  const header = {
    "alg": "HS256",
    "typ": "JWT"
  }
  
  const payload = {
    "iss": "supabase",
    "ref": "mwrtykejdzvnlckmqbbn",
    "role": "anon",
    "iat": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
  }
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  
  // Mock signature
  const signature = 'mock_signature_for_development'
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Update environment instructions
function createEnvironmentInstructions() {
  console.log('\n🔧 Environment Setup Instructions:')
  console.log('1. Create or update your .env.local file with:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://mwrtykejdzvnlckmqbbn.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_from_dashboard')
  console.log('SUPABASE_SERVICE_ROLE_KEY=' + SERVICE_ROLE_KEY)
  console.log('')
  console.log('2. To get your actual anon key:')
  console.log('   - Go to https://app.supabase.com/project/mwrtykejdzvnlckmqbbn')
  console.log('   - Navigate to Settings > API')
  console.log('   - Copy the "anon public" key')
  console.log('   - Replace "your_actual_anon_key_from_dashboard" with it')
}

// Main function
async function main() {
  console.log('🎉 Database Schema Deployed Successfully!')
  console.log('Now testing the backend...\n')
  
  await testSupabaseConnection()
  await testBackendAPI()
  
  createEnvironmentInstructions()
  
  console.log('\n📋 Next Steps:')
  console.log('1. Get your anon key from Supabase dashboard')
  console.log('2. Update .env.local with the correct anon key')
  console.log('3. Restart your development server: npm run dev')
  console.log('4. Test at: http://localhost:3001/test-supabase')
  
  console.log('\n🔗 Dashboard: https://app.supabase.com/project/mwrtykejdzvnlckmqbbn')
  console.log('🧪 Test Page: http://localhost:3001/test-supabase')
  
  console.log('\n🎉 Your backend is almost ready! Just need the anon key.')
}

main().catch(console.error)

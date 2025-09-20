#!/usr/bin/env node

const https = require('https')

console.log('🔍 Finding User Logins in HLC Academy\n')

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

// Get all users from Supabase
async function getAllUsers() {
  console.log('📋 Fetching all registered users...\n')
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    })
    
    if (response.status === 200 && response.data.users) {
      console.log(`✅ Found ${response.data.users.length} registered users:\n`)
      
      response.data.users.forEach((user, index) => {
        console.log(`${index + 1}. 📧 Email: ${user.email}`)
        console.log(`   🆔 User ID: ${user.id}`)
        console.log(`   📅 Created: ${new Date(user.created_at).toLocaleString()}`)
        console.log(`   ✅ Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
        console.log(`   🔐 Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`)
        console.log(`   📊 Sign In Count: ${user.sign_in_count || 0}`)
        console.log('')
      })
      
      return response.data.users
    } else {
      console.log('❌ Failed to fetch users:', response.status, response.data)
      return []
    }
  } catch (error) {
    console.log('❌ Error fetching users:', error.message)
    return []
  }
}

// Get user profiles from database
async function getUserProfiles() {
  console.log('👤 Fetching user profiles...\n')
  
  try {
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/profiles`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    })
    
    if (response.status === 200) {
      console.log(`✅ Found ${response.data.length} user profiles:\n`)
      
      response.data.forEach((profile, index) => {
        console.log(`${index + 1}. 👤 Name: ${profile.full_name || 'Not set'}`)
        console.log(`   🆔 User ID: ${profile.id}`)
        console.log(`   📧 Email: ${profile.email || 'Not set'}`)
        console.log(`   📱 Phone: ${profile.phone || 'Not set'}`)
        console.log(`   🎯 Plan: ${profile.plan || 'Not set'}`)
        console.log(`   📅 Joined: ${new Date(profile.created_at).toLocaleString()}`)
        console.log(`   🏆 Level: ${profile.level || 1}`)
        console.log(`   ⭐ XP: ${profile.total_xp || 0}`)
        console.log('')
      })
      
      return response.data
    } else {
      console.log('❌ Failed to fetch profiles:', response.status, response.data)
      return []
    }
  } catch (error) {
    console.log('❌ Error fetching profiles:', error.message)
    return []
  }
}

// Main function
async function findUserLogins() {
  console.log('🚀 Finding User Logins in HLC Academy...\n')
  
  // Get authentication users
  const authUsers = await getAllUsers()
  
  // Get user profiles
  const profiles = await getUserProfiles()
  
  // Summary
  console.log('📊 Summary:')
  console.log(`- 🔐 Authentication Users: ${authUsers.length}`)
  console.log(`- 👤 User Profiles: ${profiles.length}`)
  
  console.log('\n🌐 How to Manage Users:')
  console.log('1. 📊 Supabase Dashboard: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn')
  console.log('   - Go to Authentication → Users')
  console.log('   - View all registered users')
  console.log('   - Reset passwords, confirm emails, etc.')
  
  console.log('\n2. 🗄️ Database Management:')
  console.log('   - Go to Table Editor → profiles')
  console.log('   - View and edit user profiles')
  console.log('   - Manage user data and settings')
  
  console.log('\n3. 🔧 Admin API:')
  console.log('   - Use the service role key for admin operations')
  console.log('   - Create, update, or delete users programmatically')
  
  console.log('\n4. 🌐 Your Application:')
  console.log('   - Login Page: http://localhost:3000/login')
  console.log('   - Dashboard: http://localhost:3000/trading-dashboard')
  console.log('   - Test Page: http://localhost:3000/test-supabase')
  
  if (authUsers.length === 0) {
    console.log('\n💡 No users found yet. Create a test account:')
    console.log('   - Visit http://localhost:3000/login')
    console.log('   - Click "Sign Up"')
    console.log('   - Use a valid email address')
  }
}

findUserLogins().catch(console.error)

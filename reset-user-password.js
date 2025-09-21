const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Supabase URL or Service Role Key is not set in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetUserPassword(email) {
  console.log(`🔐 Resetting password for: ${email}\n`);

  try {
    // Check if user exists
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);
    
    if (userError) {
      console.log('❌ Error finding user:', userError.message);
      return;
    }

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.email);
    console.log(`📅 Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log(`🔐 Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);

    // Generate password reset link
    console.log('\n📧 Generating password reset link...');
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
      }
    });

    if (resetError) {
      console.log('❌ Error generating reset link:', resetError.message);
      return;
    }

    console.log('✅ Password reset link generated successfully!');
    console.log('\n📋 RESET DETAILS:');
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Reset Link: ${resetData.properties.action_link}`);
    console.log(`⏰ Expires: ${resetData.properties.expires_at ? new Date(resetData.properties.expires_at).toLocaleString() : 'Default expiration'}`);
    
    console.log('\n📤 The user will receive an email with the reset link.');
    console.log('💡 They can click the link to set a new password.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function listUsers() {
  console.log('👥 Available Users:\n');
  
  try {
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }

    if (!users.users || users.users.length === 0) {
      console.log('❌ No users found');
      return;
    }

    console.log(`✅ Found ${users.users.length} user(s):\n`);
    
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. 📧 ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   🔐 Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
      console.log(`   ✅ Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('🔐 Supabase Password Reset Tool\n');
  console.log('USAGE:');
  console.log('  node reset-user-password.js <email>     - Reset password for specific user');
  console.log('  node reset-user-password.js --list      - List all users\n');
  
  console.log('📋 Examples:');
  console.log('  node reset-user-password.js user@example.com');
  console.log('  node reset-user-password.js --list');
} else if (email === '--list') {
  listUsers();
} else {
  resetUserPassword(email);
}

# 🔐 Supabase Password Reset Guide

## Quick Options

### 1. 🌐 **Supabase Dashboard (Easiest)**
- **URL**: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn
- **Steps**:
  1. Go to **Authentication → Users**
  2. Click on the user you want to reset
  3. Click **"Reset Password"** button
  4. User receives password reset email

### 2. 🔧 **Command Line Tool (Most Control)**
Use the included script for programmatic control:

```bash
# List all users
node reset-user-password.js --list

# Reset password for specific user
node reset-user-password.js user@example.com
```

### 3. 📧 **Direct API (For Developers)**
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate reset link
const { data, error } = await supabaseAdmin.auth.admin.generateLink({
  type: 'recovery',
  email: 'user@example.com',
  options: {
    redirectTo: 'http://localhost:3000/login'
  }
});
```

## Current Users

You have **8 users** in your system:

1. **hatemgse@gmail.com** - Created 9/21/2025, Not confirmed
2. **daria.bogolyubova@gmail.com** - Created 9/21/2025, Confirmed ✅
3. **mommen2022@icloud.com** - Created 9/20/2025, Confirmed ✅
4. **payment-test@hlcacademy.com** - Test user, Not confirmed
5. **payment-flow-test@hlcacademy.com** - Test user, Not confirmed
6. **demo@hlcacademy.com** - Test user, Not confirmed
7. **auth-test@hlcacademy.com** - Test user, Not confirmed
8. **test@hlcacademy.com** - Test user, Not confirmed

## Password Reset Process

### What Happens:
1. ✅ Reset link is generated
2. 📧 Email is sent to user (if email is confirmed)
3. 🔗 User clicks link in email
4. 🔐 User sets new password
5. ✅ User can log in with new password

### Important Notes:
- **Confirmed emails**: Will receive reset emails
- **Unconfirmed emails**: May not receive emails (check spam folder)
- **Reset links**: Expire after default time period
- **Security**: Links are one-time use only

## Troubleshooting

### User Can't Receive Emails:
1. Check spam/junk folder
2. Verify email is confirmed in Supabase
3. Check email server settings in Supabase dashboard

### Reset Link Doesn't Work:
1. Link may have expired
2. Link may have been used already
3. Generate a new reset link

### Bulk Password Resets:
```bash
# Reset all users (use with caution)
for email in $(node reset-user-password.js --list | grep "📧" | cut -d' ' -f2); do
  node reset-user-password.js "$email"
done
```

## Security Best Practices

1. **Use service role key** only for admin operations
2. **Log all password resets** for audit purposes
3. **Set appropriate expiration times** for reset links
4. **Monitor failed login attempts**
5. **Use strong password requirements**

## Dashboard Access

**Direct Links:**
- **Main Dashboard**: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn
- **Users Management**: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn/auth/users
- **Email Templates**: https://supabase.com/dashboard/project/mwrtykejdzvnlckmqbbn/auth/templates

The password reset functionality is now fully operational!

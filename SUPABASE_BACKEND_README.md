# HLC Academy - Supabase Backend Implementation

This document provides a comprehensive guide to the fully functional Supabase backend implementation for the HLC Academy trading platform.

## 🏗️ Architecture Overview

The backend is built with:
- **Supabase** - Backend-as-a-Service (Database, Authentication, Real-time)
- **Next.js API Routes** - Server-side API endpoints
- **PostgreSQL** - Database with Row Level Security (RLS)
- **TypeScript** - Type-safe development

## 📁 File Structure

```
├── lib/
│   ├── supabase.ts              # Client-side Supabase client
│   ├── supabase-server.ts       # Server-side Supabase client
│   ├── supabase-middleware.ts   # Middleware for session management
│   └── auth.ts                  # Authentication service layer
├── app/api/
│   ├── auth/
│   │   ├── signup/route.ts      # User registration
│   │   ├── signin/route.ts      # User login
│   │   ├── signout/route.ts     # User logout
│   │   └── user/route.ts        # User profile management
│   ├── courses/
│   │   ├── route.ts             # List courses
│   │   ├── [id]/route.ts        # Course details
│   │   └── [id]/progress/route.ts # Course progress tracking
│   ├── trades/route.ts          # Trade journal management
│   ├── goals/route.ts           # Trading goals
│   └── stats/route.ts           # User statistics
├── components/
│   ├── SupabaseLoginPortal.tsx  # Authentication UI
│   └── SupabaseTradingDashboard.tsx # Main dashboard
├── database/
│   ├── schema.sql               # Complete database schema
│   └── seed.sql                 # Sample data
├── scripts/
│   └── setup-supabase.js       # Setup automation script
└── middleware.ts                # Next.js middleware for auth
```

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready (usually 2-3 minutes)

### 2. Run Setup Script

```bash
node scripts/setup-supabase.js
```

This will:
- Create `.env.local` with your Supabase credentials
- Generate secure JWT and session secrets
- Create setup instructions

### 3. Set Up Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL to create tables, policies, and functions
5. (Optional) Run `database/seed.sql` to add sample data

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Enable email confirmations (optional)
3. Set redirect URLs:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 5. Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000/login` to test authentication.

## 🗄️ Database Schema

### Core Tables

#### `profiles`
Extends Supabase auth.users with additional user data:
- User preferences and settings
- XP points and level
- Subscription plan
- Onboarding status

#### `courses` & `course_sections`
Educational content structure:
- Course metadata (title, description, difficulty)
- Section content with videos and text
- XP rewards and premium access controls

#### `user_course_progress` & `user_section_progress`
Progress tracking:
- Completion status
- Time spent
- Progress percentage

#### `trade_journal`
Trading activity logging:
- Trade details (symbol, direction, prices)
- P&L tracking
- Notes and screenshots
- Tagging system

#### `trading_goals`
Daily/weekly goal setting:
- Target vs actual trades
- Study time goals
- Completion tracking

#### `xp_transactions`
Gamification system:
- XP earning sources
- Transaction history
- Automatic level calculation

### Security Features

- **Row Level Security (RLS)** enabled on all user data
- **Policies** ensure users can only access their own data
- **Automatic profile creation** on user signup
- **XP and level calculation** triggers

## 🔐 Authentication System

### Features
- Email/password authentication
- User profile management
- Session handling with middleware
- Password reset functionality
- Secure JWT handling

### Components
- `SupabaseLoginPortal` - Complete auth UI with signup/signin
- `authService` - Authentication service layer
- API routes for all auth operations
- Middleware for session management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/user` - Update user profile

### Courses
- `GET /api/courses` - List courses (filtered by user plan)
- `GET /api/courses/[id]` - Course details with progress
- `POST /api/courses/[id]/progress` - Update course progress

### Trading
- `GET /api/trades` - List user trades
- `POST /api/trades` - Add new trade
- `GET /api/trades/[id]` - Get specific trade
- `PUT /api/trades/[id]` - Update trade
- `DELETE /api/trades/[id]` - Delete trade

### Goals & Stats
- `GET /api/goals` - List trading goals
- `POST /api/goals` - Create/update goal
- `GET /api/stats` - User statistics and analytics

## 🎮 Gamification Features

### XP System
- **Course completion**: 100-300 XP based on difficulty
- **Trade journaling**: 10 XP per entry
- **Daily goals**: XP for meeting targets
- **Automatic leveling**: Every 1000 XP = 1 level

### Progress Tracking
- Course completion percentages
- Study time tracking
- Trading statistics
- Goal achievement rates

## 🔧 Configuration

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### User Plans & Access Control

The system supports three subscription tiers:
- **Kickstart**: Basic courses only
- **Scale Up**: Advanced courses + basic features
- **Mastery**: All courses + premium features

Course access is automatically filtered based on user's plan.

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] User signup with email verification
   - [ ] User signin/signout
   - [ ] Password reset
   - [ ] Session persistence

2. **Course System**
   - [ ] Course listing (plan-based filtering)
   - [ ] Course progress tracking
   - [ ] XP awarding on completion

3. **Trading Journal**
   - [ ] Add/edit/delete trades
   - [ ] Trade statistics calculation
   - [ ] XP awarding for entries

4. **Goals & Stats**
   - [ ] Goal creation and tracking
   - [ ] Statistics calculation
   - [ ] XP progress tracking

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test course listing
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer your_jwt_token"
```

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update these for production:
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- Supabase URLs and keys (should be the same)
- Database URL (should be the same)

### Supabase Production Setup

1. Update authentication settings:
   - Site URL: Your production domain
   - Redirect URLs: `https://yourdomain.com/auth/callback`

2. Review RLS policies
3. Set up email templates
4. Configure rate limiting if needed

## 🔍 Monitoring & Analytics

### Supabase Dashboard
- Monitor database performance
- View authentication metrics
- Check error logs
- Monitor API usage

### Built-in Analytics
- User engagement tracking
- Course completion rates
- Trading activity metrics
- XP earning patterns

## 🛠️ Customization

### Adding New Features

1. **New API Endpoint**: Create route in `app/api/`
2. **New Database Table**: Add to `database/schema.sql`
3. **New Component**: Create in `components/`
4. **New Service**: Add to `lib/`

### Extending the Schema

To add new features:
1. Update `database/schema.sql`
2. Add RLS policies
3. Update TypeScript types
4. Create API endpoints
5. Update frontend components

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase URL and keys
   - Verify email confirmation settings
   - Check redirect URLs

2. **Database errors**
   - Ensure schema is properly applied
   - Check RLS policies
   - Verify user permissions

3. **API errors**
   - Check server logs
   - Verify request format
   - Check authentication headers

### Debug Mode

Enable debug logging by adding to `.env.local`:
```env
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contributing

When contributing to this backend:

1. Follow TypeScript best practices
2. Add proper error handling
3. Include RLS policies for new tables
4. Update documentation
5. Add tests for new features

---

**Note**: This backend is production-ready and includes all necessary security measures, error handling, and scalability features. The system is designed to handle thousands of concurrent users with proper indexing and optimization.

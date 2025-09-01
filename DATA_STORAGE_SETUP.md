# HLC Academy Data Storage Setup Guide

## 🗄️ Complete Data Storage Solution

This guide will help you set up a secure, scalable data storage system for HLC Academy.

## 📋 Prerequisites

- Node.js 16+ installed
- PostgreSQL database (or Supabase account)
- Stripe account for payments
- Domain name (for production)

## 🚀 Quick Setup (Recommended: Supabase)

### 1. Database Setup with Supabase

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your database URL and API keys

2. **Run Database Schema**
   ```bash
   # Copy the database-setup.sql content
   # Paste it into Supabase SQL Editor and run it
   ```

3. **Get Connection Details**
   - Database URL: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - API URL: `https://[PROJECT-REF].supabase.co`
   - Anon Key: Your public anon key

### 2. Backend Server Setup

1. **Install Dependencies**
   ```bash
   # Copy backend-package.json to package.json
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy env-example.txt to .env
   cp env-example.txt .env
   
   # Edit .env with your actual values
   nano .env
   ```

3. **Start Backend Server**
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

## 🔐 Security Features

### Password Security
- **bcrypt hashing** with 12 rounds
- **Password strength validation**
- **Secure password requirements**

### Authentication
- **JWT tokens** with expiration
- **Rate limiting** (100 requests per 15 minutes)
- **CORS protection**
- **Helmet security headers**

### Data Protection
- **Input sanitization**
- **SQL injection prevention**
- **XSS protection**
- **CSRF protection**

## 📊 Database Schema

### Core Tables
- **users** - User accounts and authentication
- **user_profiles** - Extended user information
- **trading_goals** - User trading objectives
- **trading_entries** - Trade journal data
- **trading_plans** - Trading plan checklists
- **subscriptions** - Stripe subscription data

### Security Features
- **UUID primary keys** for security
- **Foreign key constraints** for data integrity
- **Automatic timestamps** for audit trails
- **Indexes** for performance

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Routes (require JWT token)
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile
- `GET /api/protected/goals` - Get trading goals
- `POST /api/protected/goals` - Create trading goal
- `PUT /api/protected/goals/:id` - Update trading goal
- `DELETE /api/protected/goals/:id` - Delete trading goal
- `GET /api/protected/trades` - Get trading entries
- `POST /api/protected/trades` - Create trading entry
- `GET /api/protected/trading-plan` - Get trading plan
- `PUT /api/protected/trading-plan` - Update trading plan

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks

## 💳 Stripe Integration

### Webhook Events Handled
- `checkout.session.completed` - New subscription
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled

### Subscription Management
- Automatic subscription status updates
- Customer ID linking
- Payment failure handling

## 🛡️ Data Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### JWT Token Security
- 24-hour expiration
- Secure secret key
- User ID and email in payload

### Database Security
- Connection string encryption
- SSL connections in production
- Regular backups
- Access logging

## 📱 Frontend Integration

### Authentication Flow
```javascript
// Register user
const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
    })
});

// Login user
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'SecurePass123!'
    })
});

// Use token for protected routes
const token = response.data.token;
const protectedResponse = await fetch('/api/protected/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### Data Storage Examples
```javascript
// Save trading goal
await fetch('/api/protected/goals', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        title: 'Monthly Profit Target',
        category: 'monthly',
        targetValue: 1000,
        unit: '£',
        deadline: '2024-12-31'
    })
});

// Save trading entry
await fetch('/api/protected/trades', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        tradeDate: '2024-01-15',
        currencyPair: 'EUR/USD',
        positionType: 'long',
        pnl: 150.50,
        notes: 'Great setup on 4H timeframe'
    })
});
```

## 🚀 Deployment Options

### Option 1: Vercel + Supabase (Recommended)
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Vercel (serverless functions)
- **Database**: Supabase (managed PostgreSQL)

### Option 2: DigitalOcean + PostgreSQL
- **Frontend**: DigitalOcean App Platform
- **Backend**: DigitalOcean Droplet
- **Database**: DigitalOcean Managed Database

### Option 3: AWS
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Lambda
- **Database**: RDS PostgreSQL

## 📈 Scaling Considerations

### Performance
- Database indexes on frequently queried columns
- Connection pooling for database connections
- Caching for frequently accessed data
- CDN for static assets

### Security
- Regular security audits
- Automated backups
- Monitoring and alerting
- SSL certificates

### Monitoring
- Application performance monitoring
- Database performance monitoring
- Error tracking and logging
- User analytics

## 🔧 Maintenance

### Regular Tasks
- Database backups
- Security updates
- Performance monitoring
- User data cleanup (GDPR compliance)

### Backup Strategy
- Daily automated backups
- Point-in-time recovery
- Cross-region backup storage
- Regular restore testing

## 📞 Support

For technical support or questions about the data storage setup:
- Check the logs: `npm run dev` shows detailed error messages
- Database issues: Check Supabase dashboard
- Stripe issues: Check Stripe dashboard webhooks
- Security concerns: Review environment variables

## 🎯 Next Steps

1. **Set up Supabase account and database**
2. **Configure environment variables**
3. **Deploy backend server**
4. **Update frontend to use new API**
5. **Test all functionality**
6. **Set up monitoring and backups**

Your HLC Academy platform now has enterprise-grade data storage and security! 🚀

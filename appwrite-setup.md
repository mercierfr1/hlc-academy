# Appwrite Setup Guide for HLC Academy

## 🚀 Quick Setup Steps

### 1. Create Appwrite Account
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Create a new project called "HLC Academy"

### 2. Get Your Project Credentials
1. Go to your project dashboard
2. Copy your **Project ID** from the overview
3. Go to **Settings** → **API Keys**
4. Create a new API key with these permissions:
   - `databases.read`
   - `databases.write`
   - `users.read`
   - `users.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`

### 3. Create Database
1. Go to **Databases** in your Appwrite console
2. Create a new database called "hlc_academy"
3. Copy the **Database ID**

### 4. Create Collections

#### Collection 1: Users
- **Collection ID**: `users`
- **Name**: Users
- **Permissions**: 
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

**Attributes:**
- `firstName` (String, 255 chars, required)
- `lastName` (String, 255 chars, required)
- `email` (String, 255 chars, required, unique)
- `phone` (String, 20 chars, optional)
- `dateOfBirth` (DateTime, optional)
- `country` (String, 100 chars, optional)
- `tradingExperience` (String, 50 chars, optional)
- `preferredCurrency` (String, 10 chars, default: "USD")
- `subscriptionStatus` (String, 50 chars, default: "free")
- `subscriptionPlan` (String, 50 chars, default: "basic")
- `subscriptionExpiry` (DateTime, optional)
- `stripeCustomerId` (String, 255 chars, optional)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

#### Collection 2: Trading Goals
- **Collection ID**: `trading_goals`
- **Name**: Trading Goals
- **Permissions**: 
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

**Attributes:**
- `userId` (String, 255 chars, required)
- `title` (String, 255 chars, required)
- `description` (String, 1000 chars, optional)
- `category` (String, 50 chars, required) // daily, weekly, monthly, yearly
- `targetValue` (Float, required)
- `currentValue` (Float, default: 0)
- `unit` (String, 10 chars, required) // £, $, €, %
- `deadline` (DateTime, required)
- `status` (String, 20 chars, default: "active") // active, completed, paused, cancelled
- `priority` (String, 20 chars, default: "medium") // low, medium, high
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

#### Collection 3: Trading Entries
- **Collection ID**: `trading_entries`
- **Name**: Trading Entries
- **Permissions**: 
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

**Attributes:**
- `userId` (String, 255 chars, required)
- `tradeDate` (DateTime, required)
- `currencyPair` (String, 20 chars, required)
- `positionType` (String, 10 chars, required) // long, short
- `entryPrice` (Float, required)
- `exitPrice` (Float, optional)
- `positionSize` (Float, required)
- `pnl` (Float, required)
- `pnlPercentage` (Float, optional)
- `fees` (Float, default: 0)
- `notes` (String, 2000 chars, optional)
- `tags` (String, 500 chars, optional) // comma-separated
- `screenshot` (String, 500 chars, optional) // file ID
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

#### Collection 4: Trading Plans
- **Collection ID**: `trading_plans`
- **Name**: Trading Plans
- **Permissions**: 
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

**Attributes:**
- `userId` (String, 255 chars, required)
- `planName` (String, 255 chars, required)
- `riskManagement` (String, 2000 chars, optional)
- `entryCriteria` (String, 2000 chars, optional)
- `exitCriteria` (String, 2000 chars, optional)
- `dailyRoutine` (String, 2000 chars, optional)
- `weeklyReview` (String, 2000 chars, optional)
- `monthlyGoals` (String, 2000 chars, optional)
- `isActive` (Boolean, default: true)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

#### Collection 5: Subscriptions
- **Collection ID**: `subscriptions`
- **Name**: Subscriptions
- **Permissions**: 
  - Create: `users`
  - Read: `users`
  - Update: `users`
  - Delete: `users`

**Attributes:**
- `userId` (String, 255 chars, required)
- `stripeSubscriptionId` (String, 255 chars, required, unique)
- `stripeCustomerId` (String, 255 chars, required)
- `planId` (String, 100 chars, required)
- `planName` (String, 100 chars, required)
- `status` (String, 50 chars, required) // active, cancelled, past_due, etc.
- `currentPeriodStart` (DateTime, required)
- `currentPeriodEnd` (DateTime, required)
- `cancelAtPeriodEnd` (Boolean, default: false)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

### 5. Environment Variables for Vercel

Add these to your Vercel environment variables:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here
VITE_APPWRITE_DATABASE_ID=your-database-id-here
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_GOALS_COLLECTION_ID=trading_goals
VITE_APPWRITE_ENTRIES_COLLECTION_ID=trading_entries
VITE_APPWRITE_PLANS_COLLECTION_ID=trading_plans
VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID=subscriptions
APPWRITE_API_KEY=your-api-key-here
```

### 6. Benefits of Using Appwrite

✅ **Built-in Authentication** - No need to manage JWT tokens
✅ **Real-time Database** - Automatic updates across clients
✅ **File Storage** - For trading screenshots and documents
✅ **Serverless Functions** - For custom business logic
✅ **Easy API** - Auto-generated REST and GraphQL APIs
✅ **Free Tier** - Generous free usage limits
✅ **Security** - Built-in security and permissions
✅ **Scalability** - Handles millions of users

### 7. Next Steps

1. Set up your Appwrite project
2. Create the database and collections
3. Add environment variables to Vercel
4. Update your frontend to use Appwrite SDK
5. Deploy and test!

Your HLC Academy will be much simpler to manage with Appwrite! 🚀

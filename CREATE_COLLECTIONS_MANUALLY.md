# 🚀 Create Appwrite Collections Manually

## Step-by-Step Guide to Create Collections in Appwrite

### 1. Go to your Appwrite Dashboard
- Visit: https://cloud.appwrite.io
- Go to your project: `68b5f3810033d6c0a8a7`
- Click on **Databases**
- Click on your database: `68b5f5b3001823db7050`

### 2. Create Collection 1: Users
1. Click **"Create Collection"**
2. **Collection ID**: `users`
3. **Name**: `Users`
4. **Permissions**: 
   - Create: `users`
   - Read: `users`
   - Update: `users`
   - Delete: `users`
5. Click **"Create"**

**Add these attributes:**
- `firstName` (String, 255 chars, required)
- `lastName` (String, 255 chars, required)
- `email` (String, 255 chars, required)
- `phone` (String, 20 chars, optional)
- `dateOfBirth` (DateTime, optional)
- `country` (String, 100 chars, optional)
- `tradingExperience` (String, 50 chars, optional)
- `preferredCurrency` (String, 10 chars, optional)
- `subscriptionStatus` (String, 50 chars, optional)
- `subscriptionPlan` (String, 50 chars, optional)
- `subscriptionExpiry` (DateTime, optional)
- `stripeCustomerId` (String, 255 chars, optional)

### 3. Create Collection 2: Trading Goals
1. Click **"Create Collection"**
2. **Collection ID**: `trading_goals`
3. **Name**: `Trading Goals`
4. **Permissions**: 
   - Create: `users`
   - Read: `users`
   - Update: `users`
   - Delete: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, 255 chars, required)
- `title` (String, 255 chars, required)
- `description` (String, 1000 chars, optional)
- `category` (String, 50 chars, required)
- `targetValue` (Float, required)
- `currentValue` (Float, optional)
- `unit` (String, 10 chars, required)
- `deadline` (DateTime, required)
- `status` (String, 20 chars, optional)
- `priority` (String, 20 chars, optional)

### 4. Create Collection 3: Trading Entries
1. Click **"Create Collection"**
2. **Collection ID**: `trading_entries`
3. **Name**: `Trading Entries`
4. **Permissions**: 
   - Create: `users`
   - Read: `users`
   - Update: `users`
   - Delete: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, 255 chars, required)
- `tradeDate` (DateTime, required)
- `currencyPair` (String, 20 chars, required)
- `positionType` (String, 10 chars, required)
- `entryPrice` (Float, required)
- `exitPrice` (Float, optional)
- `positionSize` (Float, required)
- `pnl` (Float, required)
- `pnlPercentage` (Float, optional)
- `fees` (Float, optional)
- `notes` (String, 2000 chars, optional)
- `tags` (String, 500 chars, optional)
- `screenshot` (String, 500 chars, optional)

### 5. Create Collection 4: Trading Plans
1. Click **"Create Collection"**
2. **Collection ID**: `trading_plans`
3. **Name**: `Trading Plans`
4. **Permissions**: 
   - Create: `users`
   - Read: `users`
   - Update: `users`
   - Delete: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, 255 chars, required)
- `planName` (String, 255 chars, required)
- `riskManagement` (String, 2000 chars, optional)
- `entryCriteria` (String, 2000 chars, optional)
- `exitCriteria` (String, 2000 chars, optional)
- `dailyRoutine` (String, 2000 chars, optional)
- `weeklyReview` (String, 2000 chars, optional)
- `monthlyGoals` (String, 2000 chars, optional)
- `isActive` (Boolean, optional)

### 6. Create Collection 5: Subscriptions
1. Click **"Create Collection"**
2. **Collection ID**: `subscriptions`
3. **Name**: `Subscriptions`
4. **Permissions**: 
   - Create: `users`
   - Read: `users`
   - Update: `users`
   - Delete: `users`
5. Click **"Create"**

**Add these attributes:**
- `userId` (String, 255 chars, required)
- `stripeSubscriptionId` (String, 255 chars, required)
- `stripeCustomerId` (String, 255 chars, required)
- `planId` (String, 100 chars, required)
- `planName` (String, 100 chars, required)
- `status` (String, 50 chars, required)
- `currentPeriodStart` (DateTime, required)
- `currentPeriodEnd` (DateTime, required)
- `cancelAtPeriodEnd` (Boolean, optional)

## 🎉 After Creating All Collections

Your HLC Academy will be fully functional with:
- ✅ User management
- ✅ Trading goals tracking
- ✅ Trade journal entries
- ✅ Trading plans
- ✅ Subscription management

## 🚀 Test Your Application

Visit your live app: https://hlc-academy-1xf5h2eez-mercierfr1s-projects.vercel.app

The collections are now ready to store data from your trading education platform!

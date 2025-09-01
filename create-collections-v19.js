// Appwrite Collections Setup Script - Version 19 Compatible
import { Client, Databases, ID } from 'appwrite';

// Your actual values
const PROJECT_ID = '68b5f3810033d6c0a8a7';
const DATABASE_ID = '68b5f5b3001823db7050';
const API_KEY = process.env.APPWRITE_API_KEY;

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const databases = new Databases(client);

async function createCollections() {
    try {
        console.log('🚀 Creating Appwrite collections for HLC Academy...');
        console.log('📊 Project ID:', PROJECT_ID);
        console.log('🗄️ Database ID:', DATABASE_ID);
        console.log('');

        // 1. Users Collection
        console.log('📝 Creating Users collection...');
        const usersCollection = await databases.createCollection(
            DATABASE_ID,
            'users',
            'Users',
            [
                'create("users")',
                'read("users")',
                'update("users")',
                'delete("users")'
            ]
        );
        console.log('✅ Users collection created:', usersCollection.$id);

        // Add attributes to Users collection
        console.log('  Adding attributes...');
        await databases.createStringAttribute(DATABASE_ID, 'users', 'firstName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'lastName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'email', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'phone', 20, false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'users', 'dateOfBirth', false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'country', 100, false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'tradingExperience', 50, false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'preferredCurrency', 10, false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'subscriptionStatus', 50, false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'subscriptionPlan', 50, false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'users', 'subscriptionExpiry', false);
        await databases.createStringAttribute(DATABASE_ID, 'users', 'stripeCustomerId', 255, false);
        console.log('✅ Users attributes added');
        console.log('');

        // 2. Trading Goals Collection
        console.log('🎯 Creating Trading Goals collection...');
        const goalsCollection = await databases.createCollection(
            DATABASE_ID,
            'trading_goals',
            'Trading Goals',
            [
                'create("users")',
                'read("users")',
                'update("users")',
                'delete("users")'
            ]
        );
        console.log('✅ Trading Goals collection created:', goalsCollection.$id);

        console.log('  Adding attributes...');
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'title', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'description', 1000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'category', 50, true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_goals', 'targetValue', true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_goals', 'currentValue', false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'unit', 10, true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'trading_goals', 'deadline', true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'status', 20, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_goals', 'priority', 20, false);
        console.log('✅ Trading Goals attributes added');
        console.log('');

        // 3. Trading Entries Collection
        console.log('📊 Creating Trading Entries collection...');
        const entriesCollection = await databases.createCollection(
            DATABASE_ID,
            'trading_entries',
            'Trading Entries',
            [
                'create("users")',
                'read("users")',
                'update("users")',
                'delete("users")'
            ]
        );
        console.log('✅ Trading Entries collection created:', entriesCollection.$id);

        console.log('  Adding attributes...');
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'userId', 255, true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'trading_entries', 'tradeDate', true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'currencyPair', 20, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'positionType', 10, true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'entryPrice', true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'exitPrice', false);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'positionSize', true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'pnl', true);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'pnlPercentage', false);
        await databases.createFloatAttribute(DATABASE_ID, 'trading_entries', 'fees', false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'notes', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'tags', 500, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_entries', 'screenshot', 500, false);
        console.log('✅ Trading Entries attributes added');
        console.log('');

        // 4. Trading Plans Collection
        console.log('📋 Creating Trading Plans collection...');
        const plansCollection = await databases.createCollection(
            DATABASE_ID,
            'trading_plans',
            'Trading Plans',
            [
                'create("users")',
                'read("users")',
                'update("users")',
                'delete("users")'
            ]
        );
        console.log('✅ Trading Plans collection created:', plansCollection.$id);

        console.log('  Adding attributes...');
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'planName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'riskManagement', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'entryCriteria', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'exitCriteria', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'dailyRoutine', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'weeklyReview', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'monthlyGoals', 2000, false);
        await databases.createBooleanAttribute(DATABASE_ID, 'trading_plans', 'isActive', false);
        console.log('✅ Trading Plans attributes added');
        console.log('');

        // 5. Subscriptions Collection
        console.log('💳 Creating Subscriptions collection...');
        const subscriptionsCollection = await databases.createCollection(
            DATABASE_ID,
            'subscriptions',
            'Subscriptions',
            [
                'create("users")',
                'read("users")',
                'update("users")',
                'delete("users")'
            ]
        );
        console.log('✅ Subscriptions collection created:', subscriptionsCollection.$id);

        console.log('  Adding attributes...');
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'stripeSubscriptionId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'stripeCustomerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'planId', 100, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'planName', 100, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'status', 50, true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'subscriptions', 'currentPeriodStart', true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'subscriptions', 'currentPeriodEnd', true);
        await databases.createBooleanAttribute(DATABASE_ID, 'subscriptions', 'cancelAtPeriodEnd', false);
        console.log('✅ Subscriptions attributes added');
        console.log('');

        console.log('🎉 All collections created successfully!');
        console.log('🚀 Your HLC Academy database is ready!');
        console.log('');
        console.log('📋 Collections created:');
        console.log('  ✅ users');
        console.log('  ✅ trading_goals');
        console.log('  ✅ trading_entries');
        console.log('  ✅ trading_plans');
        console.log('  ✅ subscriptions');
        console.log('');
        console.log('🌐 Your app is live at: https://hlc-academy-1xf5h2eez-mercierfr1s-projects.vercel.app');

    } catch (error) {
        console.error('❌ Error creating collections:', error.message);
        console.log('');
        console.log('💡 This might be because:');
        console.log('   - Collections already exist (which is fine!)');
        console.log('   - API key permissions need to be updated');
        console.log('   - Database ID is incorrect');
        console.log('');
        console.log('🔧 Try creating collections manually in the Appwrite dashboard');
    }
}

// Run the setup
createCollections();

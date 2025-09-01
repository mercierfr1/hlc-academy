// Appwrite Collections Setup Script
// Run this after you have your Project ID and Database ID

import { Client, Databases, ID } from 'appwrite';

// Your actual values
const PROJECT_ID = '68b5f3810033d6c0a8a7';
const DATABASE_ID = '68b5f5b3001823db7050';
const API_KEY = 'standard_3b2b8a0fba4286a440844f6c4f41c83286beee221f2efa36b443fcb048e42fdf8b2d89353a31e130d25aada0ce7d0859cc8c74a9ef6d33389a337677cffa68dbc0ee462f575235b8dea8f361b1eab12c0d5036ed0eb223656622fbae342e669c86c06c2edda8e1875858083a59fb2d5d8e79bc63ff76547d7bef19d937efd5f6';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

// For server-side operations, we need to use the API key differently
const databases = new Databases(client, API_KEY);

async function createCollections() {
    try {
        console.log('🚀 Creating Appwrite collections for HLC Academy...');

        // 1. Users Collection
        console.log('📝 Creating Users collection...');
        await databases.createCollection(DATABASE_ID, 'users', 'Users', [
            'create("users")',
            'read("users")',
            'update("users")',
            'delete("users")'
        ]);

        // Add attributes to Users collection
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

        // 2. Trading Goals Collection
        console.log('🎯 Creating Trading Goals collection...');
        await databases.createCollection(DATABASE_ID, 'trading_goals', 'Trading Goals', [
            'create("users")',
            'read("users")',
            'update("users")',
            'delete("users")'
        ]);

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

        // 3. Trading Entries Collection
        console.log('📊 Creating Trading Entries collection...');
        await databases.createCollection(DATABASE_ID, 'trading_entries', 'Trading Entries', [
            'create("users")',
            'read("users")',
            'update("users")',
            'delete("users")'
        ]);

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

        // 4. Trading Plans Collection
        console.log('📋 Creating Trading Plans collection...');
        await databases.createCollection(DATABASE_ID, 'trading_plans', 'Trading Plans', [
            'create("users")',
            'read("users")',
            'update("users")',
            'delete("users")'
        ]);

        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'planName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'riskManagement', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'entryCriteria', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'exitCriteria', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'dailyRoutine', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'weeklyReview', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, 'trading_plans', 'monthlyGoals', 2000, false);
        await databases.createBooleanAttribute(DATABASE_ID, 'trading_plans', 'isActive', false);

        // 5. Subscriptions Collection
        console.log('💳 Creating Subscriptions collection...');
        await databases.createCollection(DATABASE_ID, 'subscriptions', 'Subscriptions', [
            'create("users")',
            'read("users")',
            'update("users")',
            'delete("users")'
        ]);

        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'stripeSubscriptionId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'stripeCustomerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'planId', 100, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'planName', 100, true);
        await databases.createStringAttribute(DATABASE_ID, 'subscriptions', 'status', 50, true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'subscriptions', 'currentPeriodStart', true);
        await databases.createDatetimeAttribute(DATABASE_ID, 'subscriptions', 'currentPeriodEnd', true);
        await databases.createBooleanAttribute(DATABASE_ID, 'subscriptions', 'cancelAtPeriodEnd', false);

        console.log('✅ All collections created successfully!');
        console.log('🎉 Your HLC Academy database is ready!');

    } catch (error) {
        console.error('❌ Error creating collections:', error);
    }
}

// Run the setup
createCollections();

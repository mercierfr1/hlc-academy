// Simple Appwrite backend for HLC Academy
// This replaces the complex PostgreSQL backend with Appwrite's built-in features

import express from 'express';
import cors from 'cors';
import { Client, Databases, Account, ID } from 'appwrite';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Appwrite
const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const account = new Account(client);

// Database and Collection IDs
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTIONS = {
    USERS: process.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users',
    TRADING_GOALS: process.env.VITE_APPWRITE_GOALS_COLLECTION_ID || 'trading_goals',
    TRADING_ENTRIES: process.env.VITE_APPWRITE_ENTRIES_COLLECTION_ID || 'trading_entries',
    TRADING_PLANS: process.env.VITE_APPWRITE_PLANS_COLLECTION_ID || 'trading_plans',
    SUBSCRIPTIONS: process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID || 'subscriptions',
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'HLC Academy API is running with Appwrite!' });
});

// Get user profile
app.get('/api/user/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const user = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
app.put('/api/user/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const { firstName, lastName, phone, country, tradingExperience, preferredCurrency } = req.body;
        
        const updatedUser = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            userId,
            {
                firstName,
                lastName,
                phone,
                country,
                tradingExperience,
                preferredCurrency,
                updatedAt: new Date().toISOString()
            }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// Get trading goals
app.get('/api/trading-goals', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const goals = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.TRADING_GOALS,
            [`userId=${userId}`]
        );

        res.json(goals.documents);
    } catch (error) {
        console.error('Error fetching trading goals:', error);
        res.status(500).json({ error: 'Failed to fetch trading goals' });
    }
});

// Create trading goal
app.post('/api/trading-goals', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const { title, description, category, targetValue, unit, deadline, priority } = req.body;
        
        const goal = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.TRADING_GOALS,
            ID.unique(),
            {
                userId,
                title,
                description,
                category,
                targetValue,
                currentValue: 0,
                unit,
                deadline,
                priority: priority || 'medium',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        res.json(goal);
    } catch (error) {
        console.error('Error creating trading goal:', error);
        res.status(500).json({ error: 'Failed to create trading goal' });
    }
});

// Get trading entries
app.get('/api/trading-entries', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const entries = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.TRADING_ENTRIES,
            [`userId=${userId}`]
        );

        res.json(entries.documents);
    } catch (error) {
        console.error('Error fetching trading entries:', error);
        res.status(500).json({ error: 'Failed to fetch trading entries' });
    }
});

// Create trading entry
app.post('/api/trading-entries', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const { tradeDate, currencyPair, positionType, entryPrice, exitPrice, positionSize, pnl, notes, tags } = req.body;
        
        const entry = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.TRADING_ENTRIES,
            ID.unique(),
            {
                userId,
                tradeDate,
                currencyPair,
                positionType,
                entryPrice,
                exitPrice,
                positionSize,
                pnl,
                pnlPercentage: exitPrice ? ((pnl / (entryPrice * positionSize)) * 100) : null,
                fees: 0,
                notes,
                tags,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        res.json(entry);
    } catch (error) {
        console.error('Error creating trading entry:', error);
        res.status(500).json({ error: 'Failed to create trading entry' });
    }
});

// Get trading plan
app.get('/api/trading-plan', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const plans = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.TRADING_PLANS,
            [`userId=${userId}`, `isActive=true`]
        );

        res.json(plans.documents[0] || null);
    } catch (error) {
        console.error('Error fetching trading plan:', error);
        res.status(500).json({ error: 'Failed to fetch trading plan' });
    }
});

// Update trading plan
app.put('/api/trading-plan', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID required' });
        }

        const { planName, riskManagement, entryCriteria, exitCriteria, dailyRoutine, weeklyReview, monthlyGoals } = req.body;
        
        // Check if plan exists
        const existingPlans = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.TRADING_PLANS,
            [`userId=${userId}`, `isActive=true`]
        );

        let plan;
        if (existingPlans.documents.length > 0) {
            // Update existing plan
            plan = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.TRADING_PLANS,
                existingPlans.documents[0].$id,
                {
                    planName,
                    riskManagement,
                    entryCriteria,
                    exitCriteria,
                    dailyRoutine,
                    weeklyReview,
                    monthlyGoals,
                    updatedAt: new Date().toISOString()
                }
            );
        } else {
            // Create new plan
            plan = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.TRADING_PLANS,
                ID.unique(),
                {
                    userId,
                    planName,
                    riskManagement,
                    entryCriteria,
                    exitCriteria,
                    dailyRoutine,
                    weeklyReview,
                    monthlyGoals,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
        }

        res.json(plan);
    } catch (error) {
        console.error('Error updating trading plan:', error);
        res.status(500).json({ error: 'Failed to update trading plan' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HLC Academy API server running on port ${PORT} with Appwrite!`);
    console.log(`📊 Database: ${DATABASE_ID}`);
    console.log(`🔑 Project: ${process.env.VITE_APPWRITE_PROJECT_ID}`);
});

export default app;

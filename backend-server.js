// HLC Academy Backend Server
// Handles user data, authentication, and Stripe integration

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { registerUser, loginUser, authenticateToken } = require('./auth-system');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const result = await registerUser(req.body, db);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password, db);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Protected routes (require authentication)
app.use('/api/protected', authenticateToken);

// User profile routes
app.get('/api/protected/profile', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.*, p.* 
            FROM users u 
            LEFT JOIN user_profiles p ON u.id = p.user_id 
            WHERE u.id = $1
        `, [req.user.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            subscriptionStatus: user.subscription_status,
            subscriptionPlan: user.subscription_plan,
            profile: {
                tradingExperience: user.trading_experience,
                preferredTimeframe: user.preferred_timeframe,
                riskTolerance: user.risk_tolerance,
                tradingGoals: user.trading_goals,
                bio: user.bio
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/protected/profile', async (req, res) => {
    try {
        const { firstName, lastName, tradingExperience, preferredTimeframe, riskTolerance, tradingGoals, bio } = req.body;
        
        // Update user table
        await db.query(`
            UPDATE users 
            SET first_name = $1, last_name = $2, updated_at = NOW()
            WHERE id = $3
        `, [firstName, lastName, req.user.userId]);

        // Update or insert user profile
        await db.query(`
            INSERT INTO user_profiles (user_id, trading_experience, preferred_timeframe, risk_tolerance, trading_goals, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                trading_experience = $2,
                preferred_timeframe = $3,
                risk_tolerance = $4,
                trading_goals = $5,
                bio = $6,
                updated_at = NOW()
        `, [req.user.userId, tradingExperience, preferredTimeframe, riskTolerance, tradingGoals, bio]);

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Trading goals routes
app.get('/api/protected/goals', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM trading_goals 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `, [req.user.userId]);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/protected/goals', async (req, res) => {
    try {
        const { title, category, description, targetValue, unit, deadline } = req.body;
        
        const result = await db.query(`
            INSERT INTO trading_goals (user_id, title, category, description, target_value, unit, deadline)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [req.user.userId, title, category, description, targetValue, unit, deadline]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/protected/goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, targetValue, currentValue, unit, deadline, status } = req.body;
        
        const result = await db.query(`
            UPDATE trading_goals 
            SET title = $1, category = $2, description = $3, target_value = $4, 
                current_value = $5, unit = $6, deadline = $7, status = $8, updated_at = NOW()
            WHERE id = $9 AND user_id = $10
            RETURNING *
        `, [title, category, description, targetValue, currentValue, unit, deadline, status, id, req.user.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/protected/goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(`
            DELETE FROM trading_goals 
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `, [id, req.user.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Trading entries routes
app.get('/api/protected/trades', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM trading_entries WHERE user_id = $1';
        let params = [req.user.userId];

        if (startDate && endDate) {
            query += ' AND trade_date BETWEEN $2 AND $3';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY trade_date DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/protected/trades', async (req, res) => {
    try {
        const { tradeDate, currencyPair, positionType, entryPrice, exitPrice, pnl, riskRewardRatio, notes, strategy, timeframe } = req.body;
        
        const result = await db.query(`
            INSERT INTO trading_entries (user_id, trade_date, currency_pair, position_type, entry_price, exit_price, pnl, risk_reward_ratio, notes, strategy, timeframe)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [req.user.userId, tradeDate, currencyPair, positionType, entryPrice, exitPrice, pnl, riskRewardRatio, notes, strategy, timeframe]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Trading plan routes
app.get('/api/protected/trading-plan', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM trading_plans 
            WHERE user_id = $1
        `, [req.user.userId]);

        if (result.rows.length === 0) {
            // Create default trading plan if none exists
            const defaultPlan = await db.query(`
                INSERT INTO trading_plans (user_id)
                VALUES ($1)
                RETURNING *
            `, [req.user.userId]);
            
            return res.json(defaultPlan.rows[0]);
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/protected/trading-plan', async (req, res) => {
    try {
        const { mindsetQuote, htf4h, htfDaily, htfWeekly, ltfM15, ltfM1, scalingIn, breakEven, partials, maxRisk, dailyCap, positionSizing } = req.body;
        
        const result = await db.query(`
            INSERT INTO trading_plans (user_id, mindset_quote, htf_4h, htf_daily, htf_weekly, ltf_m15, ltf_m1, scaling_in, break_even, partials, max_risk, daily_cap, position_sizing)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                mindset_quote = $2,
                htf_4h = $3,
                htf_daily = $4,
                htf_weekly = $5,
                ltf_m15 = $6,
                ltf_m1 = $7,
                scaling_in = $8,
                break_even = $9,
                partials = $10,
                max_risk = $11,
                daily_cap = $12,
                position_sizing = $13,
                updated_at = NOW()
            RETURNING *
        `, [req.user.userId, mindsetQuote, htf4h, htfDaily, htfWeekly, ltfM15, ltfM1, scalingIn, breakEven, partials, maxRisk, dailyCap, positionSizing]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Stripe webhook handler
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            handleCheckoutSessionCompleted(event.data.object);
            break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            handleSubscriptionChange(event.data.object);
            break;
        case 'customer.subscription.deleted':
            handleSubscriptionCancelled(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

async function handleCheckoutSessionCompleted(session) {
    try {
        // Update user subscription status
        await db.query(`
            UPDATE users 
            SET subscription_status = 'active', stripe_customer_id = $1
            WHERE email = $2
        `, [session.customer, session.customer_email]);
        
        console.log('Subscription activated for:', session.customer_email);
    } catch (error) {
        console.error('Error handling checkout session:', error);
    }
}

async function handleSubscriptionChange(subscription) {
    try {
        await db.query(`
            UPDATE users 
            SET subscription_status = $1
            WHERE stripe_customer_id = $2
        `, [subscription.status, subscription.customer]);
        
        console.log('Subscription updated:', subscription.id);
    } catch (error) {
        console.error('Error handling subscription change:', error);
    }
}

async function handleSubscriptionCancelled(subscription) {
    try {
        await db.query(`
            UPDATE users 
            SET subscription_status = 'cancelled'
            WHERE stripe_customer_id = $1
        `, [subscription.customer]);
        
        console.log('Subscription cancelled:', subscription.id);
    } catch (error) {
        console.error('Error handling subscription cancellation:', error);
    }
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`HLC Academy Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

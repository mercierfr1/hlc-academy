// Stripe Checkout Session API for HLC Academy
import express from 'express';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, userId, userEmail, planName, successUrl, cancelUrl } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: 'Price ID is required' });
        }

        console.log('Creating checkout session for:', { priceId, userId, userEmail, planName });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
            metadata: {
                userId: userId || '',
                planName: planName || '',
                userEmail: userEmail || ''
            },
            customer_email: userEmail,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            subscription_data: {
                metadata: {
                    userId: userId || '',
                    planName: planName || ''
                }
            }
        });

        console.log('✅ Checkout session created:', session.id);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create customer portal session
app.post('/api/create-portal-session', async (req, res) => {
    try {
        const { customerId, returnUrl } = req.body;

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        console.log('Creating portal session for customer:', customerId);

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
        });

        console.log('✅ Portal session created:', session.id);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get subscription status
app.get('/api/subscription/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        console.log('Getting subscription for customer:', customerId);

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            return res.json({ subscription: null });
        }

        const subscription = subscriptions.data[0];
        const product = await stripe.products.retrieve(subscription.items.data[0].price.product);

        res.json({
            subscription: {
                id: subscription.id,
                status: subscription.status,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                planName: product.name,
                planId: subscription.items.data[0].price.id
            }
        });
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel subscription
app.post('/api/cancel-subscription/:subscriptionId', async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const { cancelAtPeriodEnd = true } = req.body;

        console.log('Cancelling subscription:', subscriptionId);

        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: cancelAtPeriodEnd
        });

        console.log('✅ Subscription cancelled:', subscription.id);

        res.json({
            subscription: {
                id: subscription.id,
                status: subscription.status,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodEnd: subscription.current_period_end
            }
        });
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

export default app;

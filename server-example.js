// Example server implementation for Stripe checkout
// This is a Node.js/Express example - implement according to your backend technology

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, planName, successUrl, cancelUrl } = req.body;

        // Define your pricing structure with real Stripe Price IDs
        const pricing = {
            'price_kickstart_weekly': {
                priceId: 'price_1S2KQHCFO3z7Hw9FkmcoBEE0',
                amount: 3000, // £30.00 in pence
                currency: 'gbp',
                recurring: {
                    interval: 'week'
                }
            },
            'price_scaleup_monthly': {
                priceId: 'price_1S2KQHCFO3z7Hw9F1dExtAmD',
                amount: 9700, // £97.00 in pence
                currency: 'gbp',
                recurring: {
                    interval: 'month'
                }
            },
            'price_mastery_quarterly': {
                priceId: 'price_1S2KQICFO3z7Hw9FkyPx0Igh',
                amount: 27900, // £279.00 in pence
                currency: 'gbp',
                recurring: {
                    interval: 'month',
                    interval_count: 3
                }
            }
        };

        const priceConfig = pricing[priceId];
        if (!priceConfig) {
            return res.status(400).json({ error: 'Invalid price ID' });
        }

        // Create Stripe checkout session using real Price IDs
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceConfig.priceId, // Use the real Stripe Price ID
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: cancelUrl,
            metadata: {
                planName: planName,
                priceId: priceId
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_your_webhook_secret_here'; // Replace with your actual webhook secret from Stripe dashboard

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment successful for session:', session.id);
            // Here you would:
            // 1. Create user account
            // 2. Grant access to course
            // 3. Send welcome email
            // 4. Set up subscription management
            break;
        case 'customer.subscription.created':
            const subscription = event.data.object;
            console.log('Subscription created:', subscription.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

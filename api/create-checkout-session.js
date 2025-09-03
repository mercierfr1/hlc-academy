// Stripe Checkout Session API for HLC Academy - Vercel Serverless Function
const Stripe = require('stripe');

// Use the provided Stripe secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { plan, planName, price, successUrl, cancelUrl } = req.body;

        console.log('Creating checkout session for:', { plan, planName, price });

        // Define plan configurations with price data
        const planConfigs = {
            'kickstart': {
                name: 'Kickstart Plan',
                price: 3000, // £30.00 in pence
                currency: 'gbp',
                interval: 'week'
            },
            'scaleup': {
                name: 'Scale Up Plan', 
                price: 9700, // £97.00 in pence
                currency: 'gbp',
                interval: 'month'
            },
            'mastery': {
                name: 'Mastery Plan',
                price: 27900, // £279.00 in pence
                currency: 'gbp',
                interval: 'month',
                interval_count: 3
            }
        };

        const planConfig = planConfigs[plan];
        if (!planConfig) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        // Create Stripe checkout session with price data
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: planConfig.currency,
                        product_data: {
                            name: planConfig.name,
                            description: `HLC Academy ${planConfig.name} - 3 Day Free Trial`,
                        },
                        unit_amount: planConfig.price,
                        recurring: {
                            interval: planConfig.interval,
                            interval_count: planConfig.interval_count || 1,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${process.env.FRONTEND_URL || 'https://hlc-academy1-ihz2odqji-mercierfr1s-projects.vercel.app'}/welcome.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'https://hlc-academy1-ihz2odqji-mercierfr1s-projects.vercel.app'}/onboarding.html`,
            metadata: {
                plan: plan,
                planName: planName || planConfig.name
            },
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            subscription_data: {
                trial_period_days: 3, // 3-day free trial
                metadata: {
                    plan: plan,
                    planName: planName || planConfig.name
                }
            }
        });

        console.log('✅ Checkout session created:', session.id);

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
}
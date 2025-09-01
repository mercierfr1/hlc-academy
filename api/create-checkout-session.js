// Stripe Checkout Session API for HLC Academy - Vercel Serverless Function
import Stripe from 'stripe';

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
            success_url: successUrl || `${process.env.FRONTEND_URL || 'https://www.hlcacademy.co.uk'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'https://www.hlcacademy.co.uk'}/pricing`,
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
}
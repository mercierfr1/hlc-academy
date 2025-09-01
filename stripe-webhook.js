// Stripe Webhook Handler for HLC Academy
import express from 'express';
import Stripe from 'stripe';
import { Client, Databases } from 'appwrite';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Appwrite
const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Middleware
app.use(express.raw({ type: 'application/json' }));

// Webhook endpoint
app.post('/api/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received Stripe webhook:', event.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session) {
    console.log('Processing checkout session completed:', session.id);
    
    try {
        // Get the subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        // Find user by email or create new user record
        const userEmail = session.customer_details.email;
        
        // Create subscription record in Appwrite
        await databases.createDocument(
            process.env.VITE_APPWRITE_DATABASE_ID,
            process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
            subscription.id, // Use Stripe subscription ID as document ID
            {
                userId: session.metadata?.userId || userEmail,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                planId: subscription.items.data[0].price.id,
                planName: subscription.items.data[0].price.nickname || 'Premium Plan',
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        // Update user subscription status
        if (session.metadata?.userId) {
            await databases.updateDocument(
                process.env.VITE_APPWRITE_DATABASE_ID,
                process.env.VITE_APPWRITE_USERS_COLLECTION_ID,
                session.metadata.userId,
                {
                    subscriptionStatus: 'active',
                    subscriptionPlan: subscription.items.data[0].price.nickname || 'premium',
                    subscriptionExpiry: new Date(subscription.current_period_end * 1000).toISOString(),
                    stripeCustomerId: subscription.customer,
                    updatedAt: new Date().toISOString()
                }
            );
        }

        console.log('✅ Subscription created successfully');
    } catch (error) {
        console.error('Error handling checkout session completed:', error);
    }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
    console.log('Processing subscription created:', subscription.id);
    
    try {
        await databases.createDocument(
            process.env.VITE_APPWRITE_DATABASE_ID,
            process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
            subscription.id,
            {
                userId: subscription.metadata?.userId || subscription.customer,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                planId: subscription.items.data[0].price.id,
                planName: subscription.items.data[0].price.nickname || 'Premium Plan',
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        console.log('✅ Subscription record created');
    } catch (error) {
        console.error('Error handling subscription created:', error);
    }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
    console.log('Processing subscription updated:', subscription.id);
    
    try {
        await databases.updateDocument(
            process.env.VITE_APPWRITE_DATABASE_ID,
            process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
            subscription.id,
            {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                updatedAt: new Date().toISOString()
            }
        );

        console.log('✅ Subscription updated');
    } catch (error) {
        console.error('Error handling subscription updated:', error);
    }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
    console.log('Processing subscription deleted:', subscription.id);
    
    try {
        await databases.updateDocument(
            process.env.VITE_APPWRITE_DATABASE_ID,
            process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
            subscription.id,
            {
                status: 'cancelled',
                updatedAt: new Date().toISOString()
            }
        );

        console.log('✅ Subscription cancelled');
    } catch (error) {
        console.error('Error handling subscription deleted:', error);
    }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice) {
    console.log('Processing payment succeeded:', invoice.id);
    
    try {
        if (invoice.subscription) {
            await databases.updateDocument(
                process.env.VITE_APPWRITE_DATABASE_ID,
                process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
                invoice.subscription,
                {
                    status: 'active',
                    updatedAt: new Date().toISOString()
                }
            );
        }

        console.log('✅ Payment processed successfully');
    } catch (error) {
        console.error('Error handling payment succeeded:', error);
    }
}

// Handle failed payment
async function handlePaymentFailed(invoice) {
    console.log('Processing payment failed:', invoice.id);
    
    try {
        if (invoice.subscription) {
            await databases.updateDocument(
                process.env.VITE_APPWRITE_DATABASE_ID,
                process.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
                invoice.subscription,
                {
                    status: 'past_due',
                    updatedAt: new Date().toISOString()
                }
            );
        }

        console.log('⚠️ Payment failed - subscription marked as past due');
    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

export default app;

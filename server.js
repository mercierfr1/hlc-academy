const express = require('express');
// Use test keys for development, live keys for production
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes (must come before static files)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planName, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: priceId, successUrl, cancelUrl' 
      });
    }

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
      'price_scaleup_weekly': {
        priceId: 'price_1S2KQHCFO3z7Hw9F1dExtAmD',
        amount: 3500, // £35.00 in pence
        currency: 'gbp',
        recurring: {
          interval: 'week'
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
      return res.status(400).json({ 
        error: 'Invalid price ID. Available plans: ' + Object.keys(pricing).join(', ') 
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceConfig.priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      metadata: {
        planName: planName || 'Unknown Plan',
        priceId: priceId
      },
      customer_email: req.body.customerEmail, // Optional: pre-fill customer email
      allow_promotion_codes: true, // Allow discount codes
      billing_address_collection: 'required', // Collect billing address
      subscription_data: {
        metadata: {
          planName: planName || 'Unknown Plan',
          priceId: priceId
        }
      }
    });

    console.log('✅ Checkout session created:', session.id);
    res.json({ 
      id: session.id, 
      url: session.url,
      message: 'Checkout session created successfully' 
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_your_webhook_secret_here'; // Replace with your actual webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Webhook received:', event.type);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💰 Payment successful for session:', session.id);
        console.log('📧 Customer email:', session.customer_details?.email);
        console.log('💳 Amount paid:', session.amount_total / 100, 'GBP');
        
        // Here you would:
        // 1. Create user account in your database
        // 2. Grant access to course content
        // 3. Send welcome email
        // 4. Set up subscription management
        // 5. Update user progress tracking
        
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log('🆕 Subscription created:', subscription.id);
        console.log('📅 Current period end:', new Date(subscription.current_period_end * 1000));
        
        // Handle new subscription
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log('🔄 Subscription updated:', updatedSubscription.id);
        console.log('📅 New period end:', new Date(updatedSubscription.current_period_end * 1000));
        
        // Handle subscription updates
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('🗑️ Subscription deleted:', deletedSubscription.id);
        
        // Handle subscription cancellation
        // Revoke access, send cancellation email, etc.
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('💳 Invoice payment succeeded:', invoice.id);
        
        // Handle successful recurring payments
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('❌ Invoice payment failed:', failedInvoice.id);
        
        // Handle failed payments
        // Send dunning emails, retry logic, etc.
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, event: event.type });
    
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
});

// Customer portal endpoint for subscription management
app.post('/customer-portal', async (req, res) => {
  try {
    const { customerId } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: req.body.returnUrl || 'https://yourdomain.com/dashboard',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating customer portal session:', error);
    res.status(500).json({ 
      error: 'Failed to create customer portal session',
      details: error.message 
    });
  }
});

// Check subscription status
app.post('/check-subscription', async (req, res) => {
  try {
    const { customerId } = req.body;
    
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      res.json({
        subscribed: true,
        subscriptionId: subscription.id,
        current_period_end: subscription.current_period_end,
        planName: subscription.metadata.planName || 'Unknown Plan'
      });
    } else {
      res.json({
        subscribed: false,
        trial_end: null
      });
    }
  } catch (error) {
    console.error('❌ Error checking subscription:', error);
    res.status(500).json({ 
      error: 'Failed to check subscription status',
      details: error.message 
    });
  }
});

// Serve static files (must come after API routes)
app.use(express.static(path.join(__dirname, 'src')));

// Serve the main application (catch-all route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 HLC Academy Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Stripe webhook: http://localhost:${PORT}/webhook`);
  console.log(`🔑 Using Stripe key: ${stripe.getApiField('apiKey')?.substring(0, 20) || 'sk_live_...'}...`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

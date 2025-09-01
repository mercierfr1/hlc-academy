// Webhook Setup Helper for HLC Academy
// This script helps you set up webhooks in Stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function listWebhooks() {
    try {
        console.log('🔍 Checking existing webhooks...\n');
        
        const webhooks = await stripe.webhookEndpoints.list({
            limit: 10
        });

        if (webhooks.data.length === 0) {
            console.log('❌ No webhooks found. You need to create one.');
        } else {
            console.log('✅ Found existing webhooks:');
            webhooks.data.forEach((webhook, index) => {
                console.log(`\n${index + 1}. Webhook ID: ${webhook.id}`);
                console.log(`   URL: ${webhook.url}`);
                console.log(`   Status: ${webhook.status}`);
                console.log(`   Events: ${webhook.enabled_events.join(', ')}`);
            });
        }

        console.log('\n📋 To create a new webhook:');
        console.log('1. Go to Stripe Dashboard → Developers → Webhooks');
        console.log('2. Click "Add endpoint"');
        console.log('3. Set URL to: https://yourdomain.com/webhook');
        console.log('4. Select these events:');
        console.log('   - checkout.session.completed');
        console.log('   - customer.subscription.created');
        console.log('   - customer.subscription.updated');
        console.log('   - customer.subscription.deleted');
        console.log('5. Copy the webhook signing secret');
        console.log('6. Update server-example.js with the secret');

    } catch (error) {
        console.error('❌ Error checking webhooks:', error.message);
    }
}

// Run the function
listWebhooks();

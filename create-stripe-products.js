// Create Stripe Products and Pricing for HLC Academy
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
    try {
        console.log('🚀 Creating Stripe products for HLC Academy...');

        // 1. Basic Plan
        console.log('📝 Creating Basic Plan...');
        const basicProduct = await stripe.products.create({
            name: 'HLC Academy Basic',
            description: 'Essential trading education with basic tools and community access',
            metadata: {
                plan: 'basic',
                features: 'basic_course,community_access,email_support'
            }
        });

        const basicPrice = await stripe.prices.create({
            product: basicProduct.id,
            unit_amount: 2900, // $29.00
            currency: 'usd',
            recurring: {
                interval: 'month'
            },
            nickname: 'Basic Monthly'
        });

        console.log('✅ Basic Plan created:', basicProduct.id);
        console.log('   Price ID:', basicPrice.id);

        // 2. Premium Plan
        console.log('📝 Creating Premium Plan...');
        const premiumProduct = await stripe.products.create({
            name: 'HLC Academy Premium',
            description: 'Complete trading education with advanced tools, 1-on-1 coaching, and premium community',
            metadata: {
                plan: 'premium',
                features: 'all_courses,1on1_coaching,premium_community,advanced_tools,priority_support'
            }
        });

        const premiumPrice = await stripe.prices.create({
            product: premiumProduct.id,
            unit_amount: 9900, // $99.00
            currency: 'usd',
            recurring: {
                interval: 'month'
            },
            nickname: 'Premium Monthly'
        });

        console.log('✅ Premium Plan created:', premiumProduct.id);
        console.log('   Price ID:', premiumPrice.id);

        // 3. Pro Plan (Annual)
        console.log('📝 Creating Pro Plan (Annual)...');
        const proProduct = await stripe.products.create({
            name: 'HLC Academy Pro',
            description: 'Ultimate trading education package with lifetime access and exclusive benefits',
            metadata: {
                plan: 'pro',
                features: 'all_courses,1on1_coaching,premium_community,advanced_tools,priority_support,lifetime_access,exclusive_content'
            }
        });

        const proPrice = await stripe.prices.create({
            product: proProduct.id,
            unit_amount: 99900, // $999.00
            currency: 'usd',
            recurring: {
                interval: 'year'
            },
            nickname: 'Pro Annual'
        });

        console.log('✅ Pro Plan created:', proProduct.id);
        console.log('   Price ID:', proPrice.id);

        console.log('');
        console.log('🎉 All Stripe products created successfully!');
        console.log('');
        console.log('📋 Product Summary:');
        console.log('  Basic Plan: $29/month -', basicPrice.id);
        console.log('  Premium Plan: $99/month -', premiumPrice.id);
        console.log('  Pro Plan: $999/year -', proPrice.id);
        console.log('');
        console.log('🔗 Add these Price IDs to your frontend for checkout!');

        return {
            basic: basicPrice.id,
            premium: premiumPrice.id,
            pro: proPrice.id
        };

    } catch (error) {
        console.error('❌ Error creating Stripe products:', error);
    }
}

// Run the setup
createStripeProducts();
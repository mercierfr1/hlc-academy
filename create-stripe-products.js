// Create Stripe Products and Get Price IDs
// Run this script to automatically create your products

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
    try {
        console.log('🚀 Creating Stripe products for HLC Academy...\n');

        // Product 1: Kickstart Weekly
        console.log('📦 Creating Kickstart Weekly product...');
        const kickstartProduct = await stripe.products.create({
            name: 'Kickstart Weekly',
            description: 'Perfect for beginners who want quick results - Weekly access to HLC Academy',
            metadata: {
                plan: 'kickstart',
                interval: 'weekly'
            }
        });

        const kickstartPrice = await stripe.prices.create({
            product: kickstartProduct.id,
            unit_amount: 3000, // £30.00 in pence
            currency: 'gbp',
            recurring: {
                interval: 'week'
            },
            metadata: {
                plan: 'kickstart',
                interval: 'weekly'
            }
        });

        console.log(`✅ Kickstart Weekly created:`);
        console.log(`   Product ID: ${kickstartProduct.id}`);
        console.log(`   Price ID: ${kickstartPrice.id}`);
        console.log(`   Price: £30.00/week\n`);

        // Product 2: Scale Up Monthly
        console.log('📦 Creating Scale Up Monthly product...');
        const scaleupProduct = await stripe.products.create({
            name: 'Scale Up Monthly',
            description: 'The sweet spot for serious traders ready to accelerate - Monthly access to HLC Academy',
            metadata: {
                plan: 'scaleup',
                interval: 'monthly'
            }
        });

        const scaleupPrice = await stripe.prices.create({
            product: scaleupProduct.id,
            unit_amount: 9700, // £97.00 in pence
            currency: 'gbp',
            recurring: {
                interval: 'month'
            },
            metadata: {
                plan: 'scaleup',
                interval: 'monthly'
            }
        });

        console.log(`✅ Scale Up Monthly created:`);
        console.log(`   Product ID: ${scaleupProduct.id}`);
        console.log(`   Price ID: ${scaleupPrice.id}`);
        console.log(`   Price: £97.00/month\n`);

        // Product 3: Mastery Quarterly
        console.log('📦 Creating Mastery Quarterly product...');
        const masteryProduct = await stripe.products.create({
            name: 'Mastery Quarterly',
            description: 'For traders committed to achieving consistent profits - 3-month access to HLC Academy',
            metadata: {
                plan: 'mastery',
                interval: 'quarterly'
            }
        });

        const masteryPrice = await stripe.prices.create({
            product: masteryProduct.id,
            unit_amount: 27900, // £279.00 in pence
            currency: 'gbp',
            recurring: {
                interval: 'month',
                interval_count: 3
            },
            metadata: {
                plan: 'mastery',
                interval: 'quarterly'
            }
        });

        console.log(`✅ Mastery Quarterly created:`);
        console.log(`   Product ID: ${masteryProduct.id}`);
        console.log(`   Price ID: ${masteryPrice.id}`);
        console.log(`   Price: £279.00/3 months\n`);

        // Summary
        console.log('🎉 All products created successfully!');
        console.log('\n📋 Copy these Price IDs to your server-example.js:');
        console.log('```javascript');
        console.log('const pricing = {');
        console.log(`    'price_kickstart_weekly': '${kickstartPrice.id}',`);
        console.log(`    'price_scaleup_monthly': '${scaleupPrice.id}',`);
        console.log(`    'price_mastery_quarterly': '${masteryPrice.id}'`);
        console.log('};');
        console.log('```');

        // Save to file
        const fs = require('fs');
        const config = {
            products: {
                kickstart: {
                    productId: kickstartProduct.id,
                    priceId: kickstartPrice.id,
                    name: 'Kickstart Weekly',
                    price: '£30.00/week'
                },
                scaleup: {
                    productId: scaleupProduct.id,
                    priceId: scaleupPrice.id,
                    name: 'Scale Up Monthly',
                    price: '£97.00/month'
                },
                mastery: {
                    productId: masteryProduct.id,
                    priceId: masteryPrice.id,
                    name: 'Mastery Quarterly',
                    price: '£279.00/3 months'
                }
            }
        };

        fs.writeFileSync('stripe-config.json', JSON.stringify(config, null, 2));
        console.log('\n💾 Configuration saved to stripe-config.json');

    } catch (error) {
        console.error('❌ Error creating products:', error.message);
        if (error.type === 'StripeInvalidRequestError') {
            console.error('This might be because the products already exist or there\'s an issue with the API key.');
        }
    }
}

// Run the function
createProducts();

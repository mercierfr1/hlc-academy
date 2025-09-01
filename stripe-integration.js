// Stripe Integration for HLC Academy
// Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Rq5yfscED7Qsj7iKOuyEsmxx03cBSmHYb0ZsmcnBxBwkzHgndvTdyMc8QzP36bjCHvJQP5MjcOM0072r0lJBH';

// Initialize Stripe
let stripe;

// Initialize Stripe when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    } else {
        console.error('Stripe.js not loaded');
    }
});

// Function to redirect to Stripe checkout
function redirectToStripe(priceId, planName) {
    if (!stripe) {
        console.error('Stripe not initialized');
        return;
    }

    // Create checkout session
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            priceId: priceId,
            planName: planName,
            successUrl: window.location.origin + '/success.html',
            cancelUrl: window.location.origin + '/index.html'
        })
    })
    .then(response => response.json())
    .then(session => {
        // Redirect to Stripe checkout
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback: redirect to signup page
        window.location.href = 'signup.html';
    });
}

// Enrollment button click handlers
function enrollKickstart() {
    redirectToStripe('price_kickstart_weekly', 'Kickstart Weekly Plan');
}

function enrollScaleUp() {
    redirectToStripe('price_scaleup_monthly', 'Scale Up Monthly Plan');
}

function enrollMastery() {
    redirectToStripe('price_mastery_quarterly', 'Mastery Quarterly Plan');
}

// Add click event listeners to enrollment buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all enrollment buttons and add event listeners
    const kickstartBtn = document.querySelector('.btn-starter');
    const scaleupBtn = document.querySelector('.btn-pro');
    const masteryBtn = document.querySelector('.btn-elite');
    
    if (kickstartBtn) {
        kickstartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enrollKickstart();
        });
    }
    
    if (scaleupBtn) {
        scaleupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enrollScaleUp();
        });
    }
    
    if (masteryBtn) {
        masteryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enrollMastery();
        });
    }
});

// Fallback function if Stripe fails to load
function fallbackEnrollment() {
    window.location.href = 'signup.html';
}

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  priceId: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    currency: 'USD',
    interval: 'month',
    priceId: 'price_1S2fCQCFO3z7Hw9F5CaUUFcT', // Basic Plan
    features: [
      'Essential trading courses',
      'Community access',
      'Email support',
      'Basic trading tools',
      'Mobile app access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    currency: 'USD',
    interval: 'month',
    priceId: 'price_1S2fCQCFO3z7Hw9FmQEerPol', // Premium Plan
    popular: true,
    features: [
      'All trading courses',
      '1-on-1 coaching sessions',
      'Premium community',
      'Advanced trading tools',
      'Priority support',
      'Live trading sessions',
      'Custom trading plans'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    currency: 'USD',
    interval: 'year',
    priceId: 'price_1S2fCRCFO3z7Hw9F8RROEWGk', // Pro Plan
    features: [
      'Everything in Premium',
      'Lifetime access',
      'Exclusive content',
      'Personal trading mentor',
      'Advanced analytics',
      'Custom indicators',
      'API access'
    ]
  }
];

interface StripeCheckoutProps {
  userId?: string;
  userEmail?: string;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ userId, userEmail }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planName: string) => {
    setLoading(priceId);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
          planName,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
      {pricingPlans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
            plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${plan.price}
              </span>
              <span className="text-gray-600 ml-1">
                /{plan.interval}
              </span>
            </div>

            <ul className="space-y-3 mb-8 text-left">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId, plan.name)}
              disabled={loading === plan.priceId}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === plan.priceId ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Get ${plan.name}`
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StripeCheckout;

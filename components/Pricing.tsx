'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Kickstart',
    description: 'Perfect for beginners who want quick results',
    price: 30,
    period: 'week',
    commitment: 'Cancel anytime • No commitment',
    features: [
      'Complete Supply & Demand Course',
      'Weekly Live Trading Calls',
      'Trading Dashboard & Journal',
      'Daily Market Learning Notes',
      'Discord Community Access',
      'Basic Support',
    ],
    cta: 'Start 3-Day Free Trial',
    href: '/onboarding.html',
    popular: false,
  },
  {
    name: 'Scale Up',
    description: 'The sweet spot for serious traders ready to accelerate',
    price: 97,
    period: 'month',
    savings: 'Save £23/month vs weekly',
    valueLabel: 'Best Value',
    features: [
      'Everything in Kickstart, Plus:',
      'Priority Support & Office Hours',
      'Advanced Trading Psychology Modules',
      'Private Study Groups',
      'Monthly 1-on-1 Strategy Sessions',
      'Exclusive Market Analysis Tools',
      '30-Day Money-Back Guarantee',
    ],
    cta: 'Start 3-Day Free Trial',
    href: '/onboarding.html',
    popular: true,
  },
  {
    name: 'Mastery',
    description: 'For traders committed to achieving consistent profits',
    price: 279,
    period: '3 months',
    savings: 'Save £81 vs monthly',
    valueLabel: 'Best Long-term Value',
    features: [
      'Everything in Scale Up, Plus:',
      '3-Month Commitment Discount',
      'Priority Access to New Content',
      'Advanced Risk Management Tools',
      'Quarterly Performance Reviews',
      'VIP Community Events',
      'Extended Support Hours',
    ],
    cta: 'Start 3-Day Free Trial',
    href: '/onboarding.html',
    popular: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function Pricing() {
  const handlePlanSelection = (planName: string) => {
    // Store the selected plan
    localStorage.setItem('selectedPlan', planName)
    
    // GoHighLevel/FastPay Direct payment URLs for each plan
    const paymentUrls = {
      'kickstart': 'https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37',
      'scaleup': 'https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37', 
      'mastery': 'https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37'
    }
    
    // Redirect directly to the GoHighLevel payment page
    const paymentUrl = paymentUrls[planName as keyof typeof paymentUrls]
    if (paymentUrl) {
      // Add success URL parameter to redirect back to our payment success page
      const successUrl = encodeURIComponent(`${window.location.origin}/payment-success?plan=${planName}&success=true`)
      window.location.href = `${paymentUrl}?success_url=${successUrl}`
    } else {
      // Fallback to onboarding page
      window.location.href = '/onboarding.html'
    }
  }

  return (
    <section id="pricing" className="py-32 sm:py-40 lg:py-48 bg-white dark:bg-gray-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center">
            <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Only 7 spots left in our next cohort starting in 5 days
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Trading Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start with our 3-day free trial. No commitment, cancel anytime.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={plan.name} variants={itemVariants}>
              <Card className={`h-full card-hover group relative ${
                plan.popular 
                  ? 'border-blue-500/60 dark:border-blue-400/60 shadow-2xl scale-105' 
                  : 'border-gray-200/60 dark:border-white/10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        £{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        /{plan.period}
                      </span>
                    </div>
                    
                    {/* Savings and Value Labels */}
                    {plan.savings && (
                      <div className="mt-2">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                    
                    {plan.commitment && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.commitment}
                        </span>
                      </div>
                    )}
                    
                    {plan.valueLabel && (
                      <div className="mt-3">
                        <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                          {plan.valueLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, featureIndex) => {
                      const isHeader = feature.includes('Everything in') && feature.includes('Plus:')
                      return (
                        <li key={featureIndex} className={isHeader ? "mb-2" : ""}>
                          {isHeader ? (
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">
                              {feature}
                            </div>
                          ) : (
                            <div className="flex items-start space-x-3">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                {feature}
                              </span>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90' 
                        : ''
                    }`}
                    onClick={() => handlePlanSelection(plan.name.toLowerCase())}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            All plans include a 30-day money-back guarantee. Start your free trial today.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, User, Mail, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isValidPayment, setIsValidPayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    // Check URL parameters for GoHighLevel payment success
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get('plan')
    const success = urlParams.get('success')
    const email = urlParams.get('email') // Get email from FastPay redirect

    console.log('Payment Success Page - URL Params:', { plan, success, email })

    // Check if this is a valid GoHighLevel payment success
    // Accept both literal template strings and actual values
    if (success === 'true' || success === '{{success}}') {
      // Store payment success data
      const planToStore = (plan && plan !== '{{plan_name}}') ? plan : 'kickstart'
      localStorage.setItem('selectedPlan', planToStore)
      localStorage.setItem('showWelcomeAfterPayment', 'true')
      
      // Store customer email if available from FastPay (and not template string)
      if (email && email !== '{{email}}' && email.includes('@')) {
        setCustomerEmail(email)
        localStorage.setItem('customerEmail', email)
      }
      
      setIsValidPayment(true)
      setIsLoading(false)

      // Show registration prompt immediately for better UX
      setTimeout(() => {
        setShowRegistrationPrompt(true)
      }, 1500)
      
    } else {
      // Check if user came from local payment flow
      const showWelcome = localStorage.getItem('showWelcomeAfterPayment')
      if (showWelcome !== 'true') {
        // If not from payment, redirect to home
        window.location.href = '/'
        return
      }

      setIsValidPayment(true)
      setIsLoading(false)
      setShowRegistrationPrompt(true)
    }
  }, [])

  const handleCreateAccount = () => {
    setIsRedirecting(true)
    window.location.href = '/login'
  }

  const handleLogin = () => {
    setIsRedirecting(true)
    window.location.href = '/login'
  }

  const selectedPlan = typeof window !== 'undefined' ? localStorage.getItem('selectedPlan') : null
  const planNames = {
    'kickstart': 'Kickstart',
    'scaleup': 'Scale Up',
    'mastery': 'Mastery'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (!isValidPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-xl text-gray-600 mb-6">This page is only accessible after completing a payment.</p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="text-center p-8">
          <CardHeader className="pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </CardTitle>
            
                <p className="text-xl text-gray-600 mb-6">
                  Welcome to HLC Academy! Your {planNames[selectedPlan as keyof typeof planNames] || 'selected'} plan is now active.
                </p>
                
                {/* Show warning if template variables detected */}
                {typeof window !== 'undefined' && window.location.search.includes('{{') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <h4 className="text-yellow-800 font-semibold mb-2">⚠️ GoHighLevel Configuration Needed</h4>
                    <p className="text-yellow-700 text-sm">
                      Template variables detected in URL. Please update your GoHighLevel Success URL to use actual values instead of template strings.
                    </p>
                  </div>
                )}
          </CardHeader>

          <CardContent className="space-y-6">
            {!showRegistrationPrompt ? (
              // Initial success message
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Payment Confirmed! 🎉</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-green-700">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      Your {planNames[selectedPlan as keyof typeof planNames] || 'selected'} plan is now active
                    </li>
                    <li className="flex items-center text-green-700">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      3-day free trial started
                    </li>
                    <li className="flex items-center text-green-700">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      Welcome to HLC Academy!
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Setting up your account...
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              </>
            ) : (
              // Registration prompt
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-blue-800">Complete Your Account Setup</h3>
                  </div>
                  <p className="text-blue-700 mb-4">
                    To access your trading dashboard and course materials, please create your HLC Academy account or login if you already have one.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Secure access to your trading dashboard
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Personalized course progress tracking
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Exclusive community access
                    </li>
                  </ul>
                </div>

                {customerEmail && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Payment Email:</span>
                    </div>
                    <p className="text-gray-900 font-mono text-sm">{customerEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">This email will be used for your account</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleCreateAccount}
                      disabled={isRedirecting}
                      className="group h-14"
                      size="lg"
                    >
                      <User className="mr-2 h-5 w-5" />
                      {isRedirecting ? 'Redirecting...' : 'Create Account'}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    
                        <Button
                          onClick={handleLogin}
                          disabled={isRedirecting}
                          variant="secondary"
                          className="group h-14"
                          size="lg"
                        >
                      <Lock className="mr-2 h-5 w-5" />
                      {isRedirecting ? 'Redirecting...' : 'Already Have Account? Login'}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      After creating your account, you'll be redirected to your personalized trading dashboard
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, User, Mail, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('kickstart')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for dark mode preference
    const checkDarkMode = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }

    checkDarkMode()

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkDarkMode)

    // Check URL parameters for GoHighLevel payment success
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get('plan')
    const email = urlParams.get('email')

    console.log('Payment Success Page - URL Params:', { plan, email })

    // Store payment success data
    const planToStore = (plan && plan !== '{{plan_name}}') ? plan : 'kickstart'
    setSelectedPlan(planToStore)
    localStorage.setItem('selectedPlan', planToStore)
    localStorage.setItem('showWelcomeAfterPayment', 'true')
    
    // Store customer email if available
    if (email && email !== '{{email}}' && email.includes('@')) {
      setCustomerEmail(email)
      localStorage.setItem('customerEmail', email)
    }

    return () => {
      mediaQuery.removeEventListener('change', checkDarkMode)
    }
  }, [])

  const handleCreateAccount = () => {
    window.location.href = '/login'
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const planNames = {
    'kickstart': 'Kickstart',
    'scaleup': 'Scale Up',
    'mastery': 'Mastery'
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className={`text-center p-8 shadow-2xl border-0 ${
          isDarkMode 
            ? 'bg-gray-800/90 backdrop-blur-sm' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}>
          <CardHeader className="pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDarkMode 
                  ? 'bg-blue-600/20' 
                  : 'bg-green-100'
              }`}
            >
              <Check className={`w-10 h-10 ${
                isDarkMode ? 'text-blue-400' : 'text-green-600'
              }`} />
            </motion.div>
            
            <CardTitle className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Payment Successful! 🎉
            </CardTitle>
            
            <p className={`text-xl mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Welcome to HLC Academy! Your {planNames[selectedPlan as keyof typeof planNames]} plan is now active.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className={`border rounded-xl p-6 text-left ${
              isDarkMode
                ? 'bg-blue-900/20 border-blue-800'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center mb-4">
                <Shield className={`w-6 h-6 mr-3 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>Complete Your Account Setup</h3>
              </div>
              <p className={`mb-4 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                To access your trading dashboard and course materials, please create your HLC Academy account or login if you already have one.
              </p>
              <ul className={`space-y-2 ${
                isDarkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                <li className="flex items-center">
                  <Check className={`w-4 h-4 mr-2 flex-shrink-0 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  Secure access to your trading dashboard
                </li>
                <li className="flex items-center">
                  <Check className={`w-4 h-4 mr-2 flex-shrink-0 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  Personalized course progress tracking
                </li>
                <li className="flex items-center">
                  <Check className={`w-4 h-4 mr-2 flex-shrink-0 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  Exclusive community access
                </li>
              </ul>
            </div>

            {customerEmail && (
              <div className={`border rounded-xl p-4 ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center mb-2">
                  <Mail className={`w-5 h-5 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Payment Email:</span>
                </div>
                <p className={`font-mono text-sm ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{customerEmail}</p>
                <p className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>This email will be used for your account</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCreateAccount}
                  className="group h-14"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button
                  onClick={handleLogin}
                  variant="secondary"
                  className="group h-14"
                  size="lg"
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Already Have Account? Login
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="text-center">
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  After creating your account, you'll be redirected to your personalized trading dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
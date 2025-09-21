'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, User, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

// Pre-stored user credentials
const STORED_CREDENTIALS = [
  {
    email: 'jamesmith30963@icloud.com',
    password: 'password123',
    name: 'James Smith',
    plan: 'Scale Up'
  },
  {
    email: 'admin@hlcacademy.co.uk',
    password: 'admin123',
    name: 'Admin User',
    plan: 'Mastery'
  },
  {
    email: 'demo@hlcacademy.co.uk',
    password: 'demo123',
    name: 'Demo User',
    plan: 'Kickstart'
  }
]

interface LoginPortalProps {
  onLoginSuccess?: () => void
}

export default function LoginPortal({ onLoginSuccess }: LoginPortalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for dark mode preference
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDarkMode(isDark)
    }
    
    checkDarkMode()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Check if user should be forced into signup mode (from payment success page)
    const forceSignupMode = localStorage.getItem('forceSignupMode')
    if (forceSignupMode === 'true') {
      setIsSignUp(true)
      localStorage.removeItem('forceSignupMode') // Clear the flag
    }
    
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (field: 'email' | 'password' | 'fullName', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const validateCredentials = (email: string, password: string) => {
    return STORED_CREDENTIALS.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    )
  }

  const clearAllUserData = () => {
    // Clear ALL localStorage data except theme preference
    const theme = localStorage.getItem('theme')
    localStorage.clear()
    
    // Restore theme preference
    if (theme) {
      localStorage.setItem('theme', theme)
    }
    
    console.log('All user data cleared for fresh start')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Handle signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName
          }),
        })

        const result = await response.json()

        if (response.ok) {
          // Signup successful - now try to login
          const loginResponse = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          })

          const loginResult = await loginResponse.json()

          if (loginResponse.ok) {
            // Store user session
            localStorage.setItem('userEmail', formData.email)
            localStorage.setItem('userName', formData.fullName)
            localStorage.setItem('userPlan', 'Kickstart')
            localStorage.setItem('userLoginSet', 'true')
            localStorage.setItem('isLoggedIn', 'true')
            
                // Clear any onboarding flags
                localStorage.removeItem('showWelcomeAfterPayment')
            
            // Redirect to dashboard
            router.push('/trading-dashboard')
          } else {
            setError(loginResult.error || 'Account created but login failed. Please try logging in.')
          }
        } else {
          setError(result.error || 'Failed to create account. Please try again.')
        }
      } else {
        // Handle login
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        })

        const result = await response.json()

        if (response.ok) {
          // Store user session
          localStorage.setItem('userEmail', formData.email)
          localStorage.setItem('userName', result.user?.fullName || 'User')
          localStorage.setItem('userPlan', result.user?.plan || 'Kickstart')
          localStorage.setItem('userLoginSet', 'true')
          localStorage.setItem('isLoggedIn', 'true')
          
          // Clear any onboarding flags
          localStorage.removeItem('showWelcomeAfterPayment')
          localStorage.removeItem('showLoginSetup')
          
          // Redirect to dashboard
          if (onLoginSuccess) {
            onLoginSuccess()
          } else {
            router.push('/trading-dashboard')
          }
        } else {
          setError(result.error || 'Invalid email or password. Please try again.')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('An error occurred. Please try again.')
    }
    
    setIsLoading(false)
  }


  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className={`p-8 shadow-2xl border-0 ${
          isDarkMode 
            ? 'bg-gray-800/90 backdrop-blur-sm' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}>
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDarkMode 
                  ? 'bg-blue-600/20' 
                  : 'bg-blue-100'
              }`}
            >
              <User className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            

            <CardTitle className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </CardTitle>
            
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isSignUp 
                ? 'Complete your HLC Academy account setup' 
                : 'Sign in to your HLC Academy account'
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field (for signup only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 pl-12 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 pl-12 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pl-12 pr-12 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center p-4 rounded-xl ${
                    isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 mr-3 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    {error}
                  </span>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full group h-12 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle between Login and Signup */}
            <div className="mt-6 text-center">
              <p className={`text-sm mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className={`text-sm font-medium ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-500'
                } transition-colors`}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/')}
                className={`text-sm ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-600 hover:text-gray-500'
                } transition-colors`}
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

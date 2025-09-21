'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, User, TrendingUp, Target, Clock, DollarSign, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

interface OnboardingData {
  tradingExperience: string
  currentProfitability: string
  biggestChallenge: string
  accountSize: string
  timeCommitment: string
  primaryGoal: string
  motivationLevel: string
  preferredLearningStyle: string
}

export default function OnboardingQuestions() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    tradingExperience: '',
    currentProfitability: '',
    biggestChallenge: '',
    accountSize: '',
    timeCommitment: '',
    primaryGoal: '',
    motivationLevel: '',
    preferredLearningStyle: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  const totalSteps = 4

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
    
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.tradingExperience && formData.currentProfitability
      case 2:
        return formData.biggestChallenge && formData.accountSize
      case 3:
        return formData.timeCommitment && formData.primaryGoal
      case 4:
        return formData.motivationLevel && formData.preferredLearningStyle
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Get user email from localStorage, with fallback for testing
      let userEmail = localStorage.getItem('userEmail')
      
      // If no email in localStorage, try to get it from other sources
      if (!userEmail) {
        // Check if there's a customer email from payment flow
        userEmail = localStorage.getItem('customerEmail')
      }
      
      // If still no email, use a temporary email for testing
      if (!userEmail) {
        userEmail = 'temp-user@example.com'
        console.warn('No user email found, using temporary email for onboarding')
        console.log('Available localStorage keys:', Object.keys(localStorage))
      }

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          responses: formData
        }),
      })

      const result = await response.json()
      console.log('Onboarding API response:', result)

      if (response.ok) {
        // Mark onboarding as completed
        localStorage.setItem('onboardingCompleted', 'true')
        
        // Redirect to trading dashboard
        router.push('/trading-dashboard')
      } else {
        console.error('Onboarding API error:', result)
        setError(result.error || 'Failed to save onboarding responses. Please try again.')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      setError('An error occurred. Please try again.')
    }
    
    setIsLoading(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                How long have you been trading?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'I\'m completely new to trading' },
                  { value: 'less_6_months', label: 'Less than 6 months' },
                  { value: '6_months_2_years', label: '6 months to 2 years' },
                  { value: '2_5_years', label: '2-5 years' },
                  { value: '5_plus_years', label: '5+ years' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="tradingExperience"
                      value={option.value}
                      checked={formData.tradingExperience === option.value}
                      onChange={(e) => handleInputChange('tradingExperience', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                How would you describe your current profitability?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'consistently_profitable', label: 'Consistently profitable' },
                  { value: 'sometimes_profitable', label: 'Sometimes profitable' },
                  { value: 'break_even', label: 'Break even' },
                  { value: 'losing_money', label: 'Currently losing money' },
                  { value: 'haven_traded', label: 'Haven\'t started trading yet' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="currentProfitability"
                      value={option.value}
                      checked={formData.currentProfitability === option.value}
                      onChange={(e) => handleInputChange('currentProfitability', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                What's your biggest challenge in trading?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'emotions', label: 'Managing emotions and psychology' },
                  { value: 'strategy', label: 'Finding a consistent strategy' },
                  { value: 'risk_management', label: 'Risk management and position sizing' },
                  { value: 'market_analysis', label: 'Market analysis and timing' },
                  { value: 'discipline', label: 'Sticking to my plan' },
                  { value: 'knowledge', label: 'Lack of knowledge/education' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="biggestChallenge"
                      value={option.value}
                      checked={formData.biggestChallenge === option.value}
                      onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                What's your current account size?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'under_1k', label: 'Under £1,000' },
                  { value: '1k_5k', label: '£1,000 - £5,000' },
                  { value: '5k_25k', label: '£5,000 - £25,000' },
                  { value: '25k_100k', label: '£25,000 - £100,000' },
                  { value: 'over_100k', label: 'Over £100,000' },
                  { value: 'not_started', label: 'I haven\'t started trading yet' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="accountSize"
                      value={option.value}
                      checked={formData.accountSize === option.value}
                      onChange={(e) => handleInputChange('accountSize', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                How much time can you commit to trading per week?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'under_5_hours', label: 'Under 5 hours' },
                  { value: '5_10_hours', label: '5-10 hours' },
                  { value: '10_20_hours', label: '10-20 hours' },
                  { value: '20_40_hours', label: '20-40 hours' },
                  { value: 'over_40_hours', label: 'Over 40 hours (full-time)' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="timeCommitment"
                      value={option.value}
                      checked={formData.timeCommitment === option.value}
                      onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                What's your primary goal with trading?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'supplement_income', label: 'Supplement my main income' },
                  { value: 'full_time_income', label: 'Replace my full-time income' },
                  { value: 'wealth_building', label: 'Build long-term wealth' },
                  { value: 'financial_freedom', label: 'Achieve financial freedom' },
                  { value: 'learn_skill', label: 'Learn a valuable skill' },
                  { value: 'passion_hobby', label: 'It\'s a passion/hobby' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="primaryGoal"
                      value={option.value}
                      checked={formData.primaryGoal === option.value}
                      onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                How motivated are you to become a successful trader?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'extremely_motivated', label: 'Extremely motivated - this is my top priority' },
                  { value: 'very_motivated', label: 'Very motivated - I\'m committed to this' },
                  { value: 'moderately_motivated', label: 'Moderately motivated - I want to learn' },
                  { value: 'somewhat_motivated', label: 'Somewhat motivated - I\'m curious' },
                  { value: 'not_sure', label: 'Not sure yet - exploring options' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="motivationLevel"
                      value={option.value}
                      checked={formData.motivationLevel === option.value}
                      onChange={(e) => handleInputChange('motivationLevel', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                How do you prefer to learn?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'structured_courses', label: 'Structured courses with clear progression' },
                  { value: 'live_teaching', label: 'Live teaching and real-time guidance' },
                  { value: 'community_learning', label: 'Learning with a community of peers' },
                  { value: 'hands_on_practice', label: 'Hands-on practice and simulation' },
                  { value: 'one_on_one', label: 'One-on-one mentoring and coaching' },
                  { value: 'self_directed', label: 'Self-directed learning at my own pace' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="preferredLearningStyle"
                      value={option.value}
                      checked={formData.preferredLearningStyle === option.value}
                      onChange={(e) => handleInputChange('preferredLearningStyle', e.target.value)}
                      className="mr-3"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Trading Experience'
      case 2: return 'Trading Challenges'
      case 3: return 'Goals & Commitment'
      case 4: return 'Learning Preferences'
      default: return ''
    }
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <User className="w-6 h-6" />
      case 2: return <Target className="w-6 h-6" />
      case 3: return <TrendingUp className="w-6 h-6" />
      case 4: return <Clock className="w-6 h-6" />
      default: return <User className="w-6 h-6" />
    }
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
        className="w-full max-w-2xl"
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
              {getStepIcon()}
            </motion.div>
            
            <CardTitle className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {getStepTitle()}
            </CardTitle>
            
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Help us personalize your learning experience
            </p>

            {/* Progress bar */}
            <div className="mt-6">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              {renderStepContent()}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl ${
                    isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <span className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    {error}
                  </span>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="secondary"
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateCurrentStep()}
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!validateCurrentStep() || isLoading}
                    className="flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

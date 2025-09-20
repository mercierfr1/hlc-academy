'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface WelcomeQuestionsProps {
  onComplete: () => void
}

interface WelcomeFormData {
  experience: string
  profitability: string
  obstacle: string
  screenTime: string
  accountSize: string
  winGoal: string
}

export default function WelcomeQuestions({ onComplete }: WelcomeQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<WelcomeFormData>({
    experience: '',
    profitability: '',
    obstacle: '',
    screenTime: '',
    accountSize: '',
    winGoal: ''
  })

  const totalSteps = 6

  useEffect(() => {
    // Check if user has already completed welcome questions
    const completed = localStorage.getItem('welcomeQuestionsCompleted')
    if (completed === 'true') {
      onComplete()
    }
  }, [onComplete])

  const updateFormData = (field: keyof WelcomeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
        return formData.experience
      case 2:
        return formData.profitability
      case 3:
        return formData.obstacle
      case 4:
        return formData.screenTime
      case 5:
        return formData.accountSize
      case 6:
        return formData.winGoal
      default:
        return true
    }
  }

  const handleSubmit = () => {
    // Store form data in localStorage
    localStorage.setItem('welcomeQuestionsData', JSON.stringify(formData))
    localStorage.setItem('welcomeQuestionsCompleted', 'true')
    
    // Set flag to show login setup next
    localStorage.setItem('showLoginSetup', 'true')
    
    // Clear the payment flag since welcome questions are now complete
    localStorage.removeItem('showWelcomeAfterPayment')
    
    // Show success message
    alert('Profile saved successfully! Now let\'s set up your login credentials.')
    
    // Complete the welcome process
    onComplete()
  }

  const progress = (currentStep / totalSteps) * 100

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How long have you been trading?</h2>
        <p className="text-gray-600">This helps us understand your starting point</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'brand-new', label: 'Brand new to trading' },
          { value: 'less-than-1', label: 'Less than 1 year' },
          { value: '1-3-years', label: '1-3 years' },
          { value: '3-plus', label: '3+ years' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="experience"
              value={option.value}
              checked={formData.experience === option.value}
              onChange={(e) => updateFormData('experience', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Are you profitable right now?</h2>
        <p className="text-gray-600">Be honest - this helps us tailor your learning path</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'consistently', label: 'Consistently profitable' },
          { value: 'sometimes', label: 'Sometimes profitable' },
          { value: 'not-yet', label: 'Not yet profitable' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="profitability"
              value={option.value}
              checked={formData.profitability === option.value}
              onChange={(e) => updateFormData('profitability', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your biggest obstacle?</h2>
        <p className="text-gray-600">Understanding your challenges helps us focus your training</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'strategy', label: 'Finding a consistent strategy' },
          { value: 'psychology', label: 'Risk management & psychology' },
          { value: 'account-growth', label: 'Growing my account' },
          { value: 'discipline', label: 'Discipline & consistency' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="obstacle"
              value={option.value}
              checked={formData.obstacle === option.value}
              onChange={(e) => updateFormData('obstacle', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Average monthly screen time?</h2>
        <p className="text-gray-600">This helps us recommend the right content schedule</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'less-than-10', label: 'Less than 10 hours' },
          { value: '10-30', label: '10-30 hours' },
          { value: '30-60', label: '30-60 hours' },
          { value: '60-plus', label: '60+ hours' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="screenTime"
              value={option.value}
              checked={formData.screenTime === option.value}
              onChange={(e) => updateFormData('screenTime', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Account size range?</h2>
        <p className="text-gray-600">This helps us provide appropriate risk management guidance</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'less-than-1000', label: 'Less than £1,000' },
          { value: '1000-10000', label: '£1,000 - £10,000' },
          { value: '10000-50000', label: '£10,000 - £50,000' },
          { value: '50000-plus', label: '£50,000+' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="accountSize"
              value={option.value}
              checked={formData.accountSize === option.value}
              onChange={(e) => updateFormData('accountSize', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What would a win in 6 months look like?</h2>
        <p className="text-gray-600">This helps us set the right expectations and milestones</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'consistent-profit', label: 'Consistent monthly profits' },
          { value: 'account-doubling', label: 'Doubling my account size' },
          { value: 'psychology-mastery', label: 'Mastering my trading psychology' },
          { value: 'strategy-system', label: 'Having a proven trading system' }
        ].map((option) => (
          <label key={option.value} className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="radio"
              name="winGoal"
              value={option.value}
              checked={formData.winGoal === option.value}
              onChange={(e) => updateFormData('winGoal', e.target.value)}
              className="mr-4 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderWelcomeContent = () => (
    <div className="text-center space-y-8">
      <div className="text-6xl mb-6">🎉</div>
      
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to HLC Academy!</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Let's personalize your trading journey with a few quick questions.
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-left">
        <h3 className="text-xl font-bold text-green-800 mb-4">What happens next?</h3>
        <ul className="space-y-3">
          {[
            'Complete your profile to unlock personalized content',
            'Access your customized learning path',
            'Join our Discord community',
            'Start your first trading module',
            'Track your progress with our XP system'
          ].map((item, index) => (
            <li key={index} className="flex items-center text-green-700">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Welcome Message */}
          <div className="flex items-center">
            {renderWelcomeContent()}
          </div>

          {/* Right Side - Form Steps */}
          <Card className="p-8">
            <CardHeader className="text-center pb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <CardTitle className="text-lg text-gray-500">Step {currentStep} of {totalSteps}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                  {currentStep === 5 && renderStep5()}
                  {currentStep === 6 && renderStep6()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="secondary"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                  disabled={!validateCurrentStep()}
                  className="flex items-center"
                >
                  {currentStep === totalSteps ? 'Complete Profile' : 'Next'}
                  {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

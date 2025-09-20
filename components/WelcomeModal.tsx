'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface WelcomeFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  experience: string
  profitability: string
  obstacle: string
  screenTime: string
  accountSize: string
  winGoal: string
}

export default function WelcomeModal({ isOpen, onClose, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<WelcomeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    experience: '',
    profitability: '',
    obstacle: '',
    screenTime: '',
    accountSize: '',
    winGoal: ''
  })

  const totalSteps = 7

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
        return formData.firstName && formData.lastName && formData.email && formData.password
      case 2:
        return formData.experience
      case 3:
        return formData.profitability
      case 4:
        return formData.obstacle
      case 5:
        return formData.screenTime
      case 6:
        return formData.accountSize
      case 7:
        return formData.winGoal
      default:
        return true
    }
  }

  const handleSubmit = () => {
    // Store form data in localStorage
    localStorage.setItem('welcomeData', JSON.stringify(formData))
    
    // Show success message
    alert('Profile saved successfully! Your learning path has been personalized.')
    
    // Close modal and trigger completion
    onClose()
    onComplete()
  }

  const progress = (currentStep / totalSteps) * 100

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join HLC Academy</h2>
        <p className="text-gray-600">Start your trading transformation today</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="Enter your email address"
          required
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="Create a password"
          required
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
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

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  const renderStep5 = () => (
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

  const renderStep6 = () => (
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

  const renderStep7 = () => (
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
          Join 2,400+ traders who've transformed their psychology and mastered institutional supply & demand. 
          Your trading transformation journey starts now.
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-left">
        <h3 className="text-xl font-bold text-green-800 mb-4">What happens next?</h3>
        <ul className="space-y-3">
          {[
            'Check your email for login credentials and setup instructions',
            'Join our Discord community to connect with fellow traders',
            'Access your personalized dashboard and course materials',
            'Attend your first live trading call this week',
            'Start your 3-day free trial with full access to all features'
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Welcome Message */}
                <div className="flex items-center">
                  {renderWelcomeContent()}
                </div>

                {/* Right Side - Form Steps */}
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
                  </div>

                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                  {currentStep === 5 && renderStep5()}
                  {currentStep === 6 && renderStep6()}
                  {currentStep === 7 && renderStep7()}

                  {/* Navigation */}
                  <div className="flex justify-between">
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
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

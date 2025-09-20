'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  experience: string
  profitability: string
  obstacle: string
  screenTime: string
  accountSize: string
  winVision: string
  fullName: string
  email: string
  phone: string
  consent: boolean
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    experience: '',
    profitability: '',
    obstacle: '',
    screenTime: '',
    accountSize: '',
    winVision: '',
    fullName: '',
    email: '',
    phone: '',
    consent: false
  })

  const plans = [
    {
      id: 'kickstart',
      name: 'Kickstart',
      description: 'Perfect for beginners who want quick results',
      price: 30,
      period: 'per week',
      commitment: 'Cancel anytime • No commitment',
      features: [
        'Complete Supply & Demand Course',
        'Weekly Live Trading Calls',
        'Trading Dashboard & Journal',
        'Daily Market Learning Notes',
        'Discord Community Access',
        'Basic Support',
      ],
      paymentLink: 'https://your-ghl-account.gohighlevel.com/calendar/booking/kickstart-plan'
    },
    {
      id: 'scaleup',
      name: 'Scale Up',
      description: 'The sweet spot for serious traders ready to accelerate',
      price: 97,
      period: 'per month',
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
      paymentLink: 'https://your-ghl-account.gohighlevel.com/calendar/booking/scaleup-plan'
    },
    {
      id: 'mastery',
      name: 'Mastery',
      description: 'For traders committed to achieving consistent profits',
      price: 279,
      period: 'per 3 months',
      savings: 'Save £81 vs monthly',
      features: [
        'Everything in Scale Up, Plus:',
        '3-Month Commitment Discount',
        'Priority Access to New Content',
        'Advanced Risk Management Tools',
        'Quarterly Performance Reviews',
        'VIP Community Events',
        'Extended Support Hours',
      ],
      paymentLink: 'https://your-ghl-account.gohighlevel.com/calendar/booking/mastery-plan'
    }
  ]

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
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
        return formData.experience && formData.profitability
      case 2:
        return formData.obstacle && formData.screenTime && formData.accountSize
      case 3:
        return formData.fullName && formData.email && formData.consent
      default:
        return true
    }
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    const plan = plans.find(p => p.id === planId)
    if (plan) {
      // Store form data in localStorage for tracking
      localStorage.setItem('onboardingData', JSON.stringify(formData))
      localStorage.setItem('selectedPlan', planId)
      
      // Store a flag to show welcome questions after payment
      localStorage.setItem('showWelcomeAfterPayment', 'true')
      
      // Redirect to payment page
      window.location.href = plan.paymentLink
    }
  }

  const progress = (currentStep / 4) * 100

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about your trading experience</h2>
        <p className="text-gray-600">This helps us personalize your learning path</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">How long have you been trading?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'brand_new', label: 'Brand new to trading' },
              { value: 'less_1_year', label: 'Less than 1 year' },
              { value: '1_3_years', label: '1-3 years' },
              { value: '3_plus_years', label: '3+ years' }
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

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">Would you describe yourself as profitable right now?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'consistently', label: 'Consistently profitable' },
              { value: 'sometimes', label: 'Sometimes profitable' },
              { value: 'not_yet', label: 'Not yet profitable' }
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
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What's holding you back?</h2>
        <p className="text-gray-600">Understanding your challenges helps us provide the right support</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">What's your biggest obstacle in trading?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'strategy', label: 'Finding a consistent strategy' },
              { value: 'psychology', label: 'Risk management & psychology' },
              { value: 'growing', label: 'Growing my account' },
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

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">Average monthly screen time?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'less_10h', label: 'Less than 10 hours' },
              { value: '10_30h', label: '10-30 hours' },
              { value: '30_60h', label: '30-60 hours' },
              { value: '60h_plus', label: '60+ hours' }
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

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">Account size range?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'less_1k', label: 'Less than £1,000' },
              { value: '1k_10k', label: '£1,000 - £10,000' },
              { value: '10k_50k', label: '£10,000 - £50,000' },
              { value: '50k_plus', label: '£50,000+' }
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

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-4">What would a win in 6 months look like for you?</label>
          <textarea
            value={formData.winVision}
            onChange={(e) => updateFormData('winVision', e.target.value)}
            placeholder="e.g., consistent risk-adjusted returns, rule-based execution, growing my account by 20%..."
            rows={3}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Almost there!</h2>
        <p className="text-gray-600">Let's get your details so we can personalize your experience</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            required
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">Phone Number (optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => updateFormData('consent', e.target.checked)}
              required
              className="mt-1 h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">
              I agree to receive educational content and updates from HLC Academy. You can unsubscribe at any time.
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Trading Transformation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`bg-white rounded-2xl shadow-xl border-2 p-6 cursor-pointer transition-all ${
              plan.id === 'scaleup' 
                ? 'border-blue-500 transform scale-105' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.id === 'scaleup' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {plan.valueLabel}
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">£{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-sm text-green-600 font-medium">{plan.savings || plan.commitment}</p>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700 text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className={feature.includes('Everything in') ? 'font-semibold' : ''}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full h-10 text-sm font-semibold">
              Start 3-Day Free Trial
            </Button>
          </motion.div>
        ))}
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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
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
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8">
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
                    onClick={nextStep}
                    disabled={!validateCurrentStep()}
                    className="flex items-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
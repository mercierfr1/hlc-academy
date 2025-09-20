'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import VideoDemo from '@/components/VideoDemo'
import FeatureGrid from '@/components/FeatureGrid'
import ProductStrip from '@/components/ProductStrip'
import Steps from '@/components/Steps'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import OnboardingModal from '@/components/OnboardingModal'

export default function Home() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  return (
    <main className="min-h-screen relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <VideoDemo />
        <FeatureGrid />
        <ProductStrip />
        <Steps />
        <Testimonials />
        <Pricing />
        <FAQ />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
      />
    </main>
  )
}

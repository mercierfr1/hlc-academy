'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestWelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Clear localStorage to simulate a new user
    localStorage.removeItem('welcomeQuestionsCompleted')
    localStorage.removeItem('welcomeQuestionsData')
    localStorage.removeItem('showWelcomeAfterPayment')
    
    // Set a flag to show welcome questions
    localStorage.setItem('showWelcomeAfterPayment', 'true')
    
    // Redirect to dashboard
    router.push('/trading-dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up test user and redirecting...</p>
      </div>
    </div>
  )
}

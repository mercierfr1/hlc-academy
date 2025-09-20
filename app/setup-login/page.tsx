'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if this is a first-time setup
    const existingUser = localStorage.getItem('userEmail')
    const isFirstTime = !existingUser
    
    if (isFirstTime) {
      // Clear ALL existing data first
      const theme = localStorage.getItem('theme')
      localStorage.clear()
      
      // Restore theme preference
      if (theme) {
        localStorage.setItem('theme', theme)
      }
      
      console.log('First-time setup: All data cleared')
    } else {
      console.log('Returning user: Preserving existing data')
    }
    
    // Set up user login credentials
    localStorage.setItem('userEmail', 'jamesmith30963@icloud.com')
    localStorage.setItem('userPassword', 'password123')
    localStorage.setItem('userLoginSet', 'true')
    localStorage.setItem('welcomeQuestionsCompleted', 'true')
    localStorage.setItem('showLoginSetup', 'false')
    localStorage.setItem('showWelcomeAfterPayment', 'false')

    console.log('User login created successfully!')
    console.log('Email: jamesmith30963@icloud.com')
    console.log('Password: password123')
    console.log('Status: Ready to access trading dashboard')

    // Redirect to trading dashboard after 2 seconds
    setTimeout(() => {
      router.push('/trading-dashboard')
    }, 2000)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting up login...</h1>
        <p className="text-gray-600 mb-2">Email: jamesmith30963@icloud.com</p>
        <p className="text-gray-600 mb-4">Password: password123</p>
        <p className="text-blue-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import TradingDashboard from './TradingDashboard'
import WelcomeQuestions from './WelcomeQuestions'
import LoginSetup from './LoginSetup'

export default function TradingDashboardWrapper() {
  const [showWelcomeQuestions, setShowWelcomeQuestions] = useState(false)
  const [showLoginSetup, setShowLoginSetup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userEmail = localStorage.getItem('userEmail')
    
    // If not logged in, redirect to login page
    if (isLoggedIn !== 'true' || !userEmail) {
      window.location.href = '/login'
      return
    }
    
    // Only clear data if this is a first-time user (no existing data)
    const hasExistingData = localStorage.getItem('trade-journal') || 
                           localStorage.getItem('trading-goals') || 
                           localStorage.getItem('xpData')
    
    if (!hasExistingData) {
      clearDashboardData()
    }
    
    // Check what step the user needs to complete
    const completed = localStorage.getItem('welcomeQuestionsCompleted')
    const showAfterPayment = localStorage.getItem('showWelcomeAfterPayment')
    const showLogin = localStorage.getItem('showLoginSetup')
    const hasLogin = localStorage.getItem('userLoginSet')
    
    console.log('Dashboard check:', { completed, showAfterPayment, showLogin, hasLogin, isLoggedIn })
    
    // Determine what to show:
    // 1. If user hasn't completed welcome questions, show them
    // 2. If user completed welcome questions but needs to set up login, show login setup
    // 3. Otherwise, show dashboard
    
    if (completed !== 'true' || showAfterPayment === 'true') {
      setShowWelcomeQuestions(true)
    } else if (showLogin === 'true' && hasLogin !== 'true') {
      setShowLoginSetup(true)
    }
    
    setIsLoading(false)
  }, [])

  const clearDashboardData = () => {
    // Clear all dashboard-related localStorage data
    const keysToRemove = [
      'xpData',
      'tradingGoals',
      'tradeJournal',
      'dailyGoalSettings',
      'courseProgress',
      'moduleProgress',
      'sectionProgress',
      'quizScores',
      'tradingPlanSteps',
      'checklistItems',
      'xpHistory',
      'goalHistory',
      'tradeHistory',
      'dailyGoals',
      'weeklyGoals',
      'monthlyGoals',
      'achievements',
      'badges',
      'streaks',
      'performanceData',
      'analyticsData',
      'userPreferences',
      'dashboardSettings',
      'notifications',
      'recentActivity'
    ]
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('Dashboard data cleared for fresh start')
  }

  const handleWelcomeComplete = () => {
    setShowWelcomeQuestions(false)
    // After welcome questions, check if login setup is needed
    const showLogin = localStorage.getItem('showLoginSetup')
    if (showLogin === 'true') {
      setShowLoginSetup(true)
    }
  }

  const handleLoginComplete = () => {
    setShowLoginSetup(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (showWelcomeQuestions) {
    return <WelcomeQuestions onComplete={handleWelcomeComplete} />
  }

  if (showLoginSetup) {
    return <LoginSetup onComplete={handleLoginComplete} />
  }

  return <TradingDashboard />
}

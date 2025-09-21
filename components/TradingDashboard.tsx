'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import XPTracker from './XPTracker'
import TradingGoals from './TradingGoals'
import TradeJournal from './TradeJournal'
import DailyGoalSettings from './DailyGoalSettings'
import CourseOverview from './CourseOverview'
import XPBar from './XPBar'
import ContentSection from './ContentSection'
import TradingStats from './TradingStats'
import EnhancedTradingPlan from './EnhancedTradingPlan'
import MentorshipDashboard from './MentorshipDashboard'
import { 
  BarChart3, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Brain, 
  Calendar,
  DollarSign,
  Award,
  Clock,
  ArrowLeft,
  Home,
  Menu,
  X,
  Trophy
} from 'lucide-react'

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [recentTrades, setRecentTrades] = useState<any[]>([])
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState([
    { label: 'Total P&L', value: '£0', change: '0%', positive: true },
    { label: 'Win Rate', value: '0%', change: '0%', positive: true },
    { label: 'Trades This Month', value: '0', change: '0', positive: true },
    { label: 'Streak', value: '0 days', change: '0', positive: true }
  ])
  const [checklistItems, setChecklistItems] = useState<{[key: string]: boolean}>({
    'market-analysis': false,
    'htf-perspective': false,
    '4h-narrative': false,
    'm15-bias': false,
    'm1-execution': false,
    'entry-confirmation': false,
    'risk-management': false,
    'position-sizing': false,
    'stop-loss': false,
    'take-profit': false,
    'trade-logging': false,
    'post-trade-review': false
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'content', label: 'Content', icon: BookOpen },
    { id: 'journal', label: 'Trade Journal', icon: BookOpen },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'daily-goals', label: 'Daily Goals', icon: Award },
    { id: 'plan', label: 'Trading Plan', icon: Brain },
    { id: 'mentorship', label: 'Premium Mentorship', icon: Trophy }
  ]

  // Load trade data on component mount
  useEffect(() => {
    loadTradeData()
    loadTradingStats()
    
    // Get user name from localStorage
    const savedUserName = localStorage.getItem('userName')
    if (savedUserName) {
      setUserName(savedUserName)
    }
    
    // Listen for trade updates
    const handleDataUpdate = () => {
      loadTradeData()
      loadTradingStats()
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate)
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate)
    }
  }, [])

  const loadTradingStats = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) {
        console.log('No user email found, using default stats')
        return
      }

      const response = await fetch(`/api/trading-stats?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const statsData = result.stats
          setStats([
            { 
              label: 'Total P&L', 
              value: `£${statsData.totalPnL.toFixed(2)}`, 
              change: '0%', 
              positive: statsData.totalPnL >= 0 
            },
            { 
              label: 'Win Rate', 
              value: `${statsData.winRate.toFixed(1)}%`, 
              change: '0%', 
              positive: statsData.winRate >= 50 
            },
            { 
              label: 'Trades This Month', 
              value: statsData.tradesThisMonth.toString(), 
              change: '0', 
              positive: true 
            },
            { 
              label: 'Streak', 
              value: `${statsData.currentStreak} days`, 
              change: '0', 
              positive: statsData.currentStreak > 0 
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error loading trading stats:', error)
    }
  }

  const loadTradeData = () => {
    try {
      // Load trades from localStorage
      const savedTrades = localStorage.getItem('trade-journal')
      if (savedTrades) {
        const trades = JSON.parse(savedTrades)
        
        // Sort trades by date (most recent first) and take last 3
        const sortedTrades = trades
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
        
        // Format trades for display
        const formattedTrades = sortedTrades.map((trade: any) => ({
          symbol: trade.symbol,
          type: trade.type,
          pnl: trade.pnl,
          time: getTimeAgo(trade.date)
        }))
        
        setRecentTrades(formattedTrades)
      }
    } catch (error) {
      console.error('Error loading trade data:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const tradeDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const calculateStats = (trades: any[]) => {
    // Calculate total P&L
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
    
    // Calculate win rate
    const winningTrades = trades.filter(trade => trade.pnl > 0)
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0
    
    // Calculate monthly trades
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const monthlyTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date)
      return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear
    })
    
    // Calculate streak
    let currentStreak = 0
    for (let i = trades.length - 1; i >= 0; i--) {
      if (trades[i].pnl > 0) {
        currentStreak++
      } else {
        break
      }
    }
    
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
    
    setStats([
      { 
        label: 'Total P&L', 
        value: formatCurrency(totalPnL), 
        change: '0%', 
        positive: totalPnL >= 0 
      },
      { 
        label: 'Win Rate', 
        value: `${winRate.toFixed(1)}%`, 
        change: '0%', 
        positive: winRate >= 50 
      },
      { 
        label: 'Trades This Month', 
        value: monthlyTrades.length.toString(), 
        change: '0', 
        positive: true 
      },
      { 
        label: 'Streak', 
        value: `${currentStreak} days`, 
        change: '0', 
        positive: currentStreak > 0 
      }
    ])
  }

  const mindsetQuotes = [
    "The markets transfer money from the impatient to the patient.",
    "Risk comes from not knowing what you're doing.",
    "The stock market is a device for transferring money from the impatient to the patient.",
    "Be fearful when others are greedy and greedy when others are fearful."
  ]

  const [currentQuote, setCurrentQuote] = useState(mindsetQuotes[0])

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleChecklist = (item: string) => {
    setChecklistItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 text-center">
              <div className={`text-2xl font-bold ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </div>
              <div className={`text-xs ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* XP Bar Section */}
      <XPBar currentXP={400} totalXP={1000} level={1} />

      {/* Course Overview Section - Shorter */}
      <div className="mb-6">
        <CourseOverview showViewAll={false} maxModules={3} showHeader={false} showStats={false} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* XP Tracker */}
        <div className="lg:col-span-1">
          <XPTracker />
        </div>

        {/* Recent Trades */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
            </div>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900 dark:text-white">{trade.symbol}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trade.type === 'Long' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {trade.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{trade.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Goals and Journal Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TradingGoals />
        <TradeJournal />
      </div>
    </div>
  )

  const renderTradingPlan = () => (
    <EnhancedTradingPlan />
  )

  return (
    <div className="min-h-screen relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Home</span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">HLC Academy</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {userName && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{userName}</span>
                </div>
              )}
              <Button 
                onClick={() => {
                  // Add logout functionality here
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('user')
                    localStorage.removeItem('userName')
                    localStorage.removeItem('userEmail')
                    window.location.href = '/'
                  }
                }}
                variant="secondary" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                Log out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col space-y-3">
                {userName && (
                  <div className="text-center py-2 text-sm text-gray-600 dark:text-gray-400">
                    Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{userName}</span>
                  </div>
                )}
                <Button 
                  onClick={() => {
                    // Add logout functionality here
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('user')
                      localStorage.removeItem('userName')
                      localStorage.removeItem('userEmail')
                      window.location.href = '/'
                    }
                    setIsMobileMenuOpen(false)
                  }}
                  variant="secondary" 
                  size="sm"
                  className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  Log out
                </Button>
              </div>
            </motion.div>
          )}
        </Container>
      </nav>

      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trading Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and achieve your trading goals
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'content' && <ContentSection />}
          {activeTab === 'journal' && <TradeJournal />}
          {activeTab === 'goals' && <TradingGoals />}
          {activeTab === 'daily-goals' && <DailyGoalSettings />}
          {activeTab === 'plan' && renderTradingPlan()}
          {activeTab === 'mentorship' && <MentorshipDashboard />}
        </motion.div>
      </Container>
      </div>
    </div>
  )
}

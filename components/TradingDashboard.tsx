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
  X
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
    { id: 'plan', label: 'Trading Plan', icon: Brain }
  ]

  // Load trade data on component mount
  useEffect(() => {
    loadTradeData()
    
    // Get user name from localStorage
    const savedUserName = localStorage.getItem('userName')
    if (savedUserName) {
      setUserName(savedUserName)
    }
    
    // Listen for trade updates
    const handleDataUpdate = () => {
      loadTradeData()
    }
    
    window.addEventListener('dataUpdated', handleDataUpdate)
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate)
    }
  }, [])

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
        
        // Calculate stats
        calculateStats(trades)
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
      <div className="space-y-6">
        {/* Trading Checklist - Full Width */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trading Checklist</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { id: 'market-analysis', label: 'Market Analysis Complete', category: 'Analysis' },
              { id: 'htf-perspective', label: 'HTF Perspective Identified', category: 'Analysis' },
              { id: '4h-narrative', label: '4H Narrative Confirmed', category: 'Analysis' },
              { id: 'm15-bias', label: 'M15 Bias Established', category: 'Analysis' },
              { id: 'm1-execution', label: 'M1 Execution Setup', category: 'Execution' },
              { id: 'entry-confirmation', label: 'Entry Confirmation Signals', category: 'Execution' },
              { id: 'risk-management', label: 'Risk Management Plan', category: 'Risk' },
              { id: 'position-sizing', label: 'Position Sizing Calculated', category: 'Risk' },
              { id: 'stop-loss', label: 'Stop Loss Set', category: 'Risk' },
              { id: 'take-profit', label: 'Take Profit Targets', category: 'Risk' },
              { id: 'trade-logging', label: 'Trade Logged', category: 'Management' },
              { id: 'post-trade-review', label: 'Post-Trade Review', category: 'Management' }
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={checklistItems[item.id]}
                  onChange={() => toggleChecklist(item.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mapping Workflow */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mapping Workflow</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                step: "Weekly/Daily → HTF Perspective", 
                completed: false,
                details: {
                  title: "Higher Timeframe Analysis",
                  description: "Analyze weekly and daily charts to identify major trends, support/resistance levels, and key market structure.",
                  checklist: [
                    "Identify major trend direction (bullish/bearish/sideways)",
                    "Mark key support and resistance levels",
                    "Identify major swing highs and lows",
                    "Analyze volume patterns and market sentiment",
                    "Check for major news events or economic releases"
                  ]
                }
              },
              { 
                step: "4H → HTF Narrative", 
                completed: false,
                details: {
                  title: "4-Hour Market Narrative",
                  description: "Use 4-hour charts to confirm the higher timeframe bias and identify potential entry zones.",
                  checklist: [
                    "Confirm HTF trend direction on 4H",
                    "Identify key 4H support/resistance levels",
                    "Look for confluences with HTF levels",
                    "Analyze 4H candlestick patterns",
                    "Check for divergence signals"
                  ]
                }
              },
              { 
                step: "M15 → MTF Immediate Bias", 
                completed: false,
                details: {
                  title: "15-Minute Immediate Bias",
                  description: "Use 15-minute charts to fine-tune entry timing and confirm immediate market direction.",
                  checklist: [
                    "Confirm 4H bias on M15 timeframe",
                    "Identify M15 support/resistance levels",
                    "Look for entry signals and patterns",
                    "Check momentum indicators (RSI, MACD)",
                    "Identify optimal entry zones"
                  ]
                }
              },
              { 
                step: "M1 → LTF Execution", 
                completed: false,
                details: {
                  title: "1-Minute Execution",
                  description: "Execute trades on 1-minute charts with precise entry timing and risk management.",
                  checklist: [
                    "Confirm M15 bias on M1",
                    "Wait for precise entry signals",
                    "Set stop loss immediately",
                    "Enter position at optimal price",
                    "Monitor trade execution"
                  ]
                }
              }
            ].map((workflow, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleStep(index)}
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{workflow.step}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${workflow.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">→</span>
                    <div className={`transform transition-transform ${expandedSteps.includes(index) ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {expandedSteps.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {workflow.details.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {workflow.details.description}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Checklist:</h5>
                        <div className="space-y-2">
                          {workflow.details.checklist.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center space-x-3">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>

      {/* Entry Models and Examples */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Entry Models */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Target className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Entry Models</h3>
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="text-4xl text-gray-400 dark:text-gray-500 mb-2">+</div>
            <p className="text-gray-600 dark:text-gray-400">Add Entry Model</p>
          </div>
        </Card>

        {/* High Probability Examples */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Probability Examples</h3>
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="text-4xl text-gray-400 dark:text-gray-500 mb-2">📷</div>
            <p className="text-gray-600 dark:text-gray-400">Upload Screenshot</p>
          </div>
        </Card>
      </div>

      {/* Motivation & Discipline */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Motivation & Discipline</h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Plan Adherence Streak</p>
            <p className="text-2xl font-bold">0 days</p>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <blockquote className="text-lg italic mb-2">
            "Success is not final, failure is not fatal: it is the courage to continue that counts."
          </blockquote>
          <p className="text-sm opacity-90">— Winston Churchill</p>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => setCurrentQuote(mindsetQuotes[Math.floor(Math.random() * mindsetQuotes.length)])}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Next Quote →
          </Button>
        </div>
      </Card>

        {/* Export Button */}
        <div className="text-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Award className="mr-2 h-5 w-5" />
            Export Trading Plan as PDF
          </Button>
        </div>
      </div>
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
        </motion.div>
      </Container>
      </div>
    </div>
  )
}

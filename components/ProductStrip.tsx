'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BarChart3, TrendingUp, Shield, Zap, Play, ArrowRight, CheckCircle, Clock, Award, Target, Brain, FileText, BookOpen } from 'lucide-react'
import Image from 'next/image'

// Interactive Dashboard Demo Component
const InteractiveDashboardDemo = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveData, setLiveData] = useState({
    totalTrades: 127,
    winRate: 68,
    totalPnL: 2340,
    currentStreak: 5,
    xp: 1850,
    level: 3
  })

  const formatPnL = (value: number) => {
    const thousands = (value / 1000).toFixed(1)
    return `${value >= 0 ? '+' : ''}£${thousands}k`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 2),
        winRate: 65 + Math.floor(Math.random() * 10),
        totalPnL: prev.totalPnL + (Math.random() > 0.5 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 30)),
        currentStreak: prev.currentStreak + (Math.random() > 0.8 ? 1 : 0),
        xp: prev.xp + Math.floor(Math.random() * 20)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'journal', label: 'Journal', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'content', label: 'Content', icon: BookOpen }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{liveData.totalTrades}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Trades</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{liveData.winRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
        </Card>
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${liveData.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPnL(liveData.totalPnL)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{liveData.currentStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">XP Progress</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">Level {liveData.level}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${(liveData.xp % 1000) / 10}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>{liveData.xp} XP</span>
          <span>{(liveData.level + 1) * 1000} XP</span>
        </div>
      </Card>
    </div>
  )

  const renderJournal = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Trades</h3>
      {[
        { pair: 'EUR/USD', type: 'Long', pnl: 1450, emotion: 'Confident', time: '2m ago' },
        { pair: 'GBP/USD', type: 'Short', pnl: -2320, emotion: 'Frustrated', time: '15m ago' },
        { pair: 'USD/JPY', type: 'Long', pnl: 6780, emotion: 'Focused', time: '1h ago' }
      ].map((trade, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${trade.type === 'Long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-gray-900 dark:text-white">{trade.pair}</span>
              <span className="text-sm text-gray-500">{trade.emotion}</span>
            </div>
            <div className="text-right">
              <div className={`font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPnL(trade.pnl)}
              </div>
              <div className="text-xs text-gray-500">{trade.time}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trading Goals</h3>
      {[
        { title: 'Daily XP Goal', target: 200, current: 150, icon: Target },
        { title: 'Win Rate Target', target: 70, current: 68, icon: TrendingUp },
        { title: 'Risk Management', target: 100, current: 85, icon: Shield }
      ].map((goal, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <goal.icon className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900 dark:text-white">{goal.title}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(goal.current / goal.target) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>{goal.current}/{goal.target}</span>
            <span>{Math.round((goal.current / goal.target) * 100)}%</span>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Progress</h3>
      {[
        { title: 'Trading Psychology', progress: 100, status: 'completed' },
        { title: 'Technical Analysis', progress: 75, status: 'in_progress' },
        { title: 'Risk Management', progress: 0, status: 'locked' }
      ].map((module, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-white">{module.title}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{module.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                module.status === 'completed' ? 'bg-green-500' : 
                module.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'journal' && renderJournal()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'content' && renderContent()}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Button asChild size="lg" className="group">
          <a href="/trading-dashboard" target="_blank" rel="noopener noreferrer">
            Open Full Dashboard
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </div>
  )
}

// Interactive Demo Components
const AnalyticsDemo = () => {
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    currentStreak: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 2),
        winRate: 65 + Math.floor(Math.random() * 10),
        totalPnL: prev.totalPnL + (Math.random() > 0.5 ? Math.floor(Math.random() * 50) : -Math.floor(Math.random() * 30)),
        currentStreak: prev.currentStreak + (Math.random() > 0.7 ? 1 : 0)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatPnL = (value: number) => {
    const thousands = (value / 1000).toFixed(1)
    return `${value >= 0 ? '+' : ''}£${thousands}k`
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Live Analytics</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalTrades}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Trades</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPnL(stats.totalPnL)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.currentStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
        </div>
      </div>
    </div>
  )
}

const TradingJournalDemo = () => {
  const [trades, setTrades] = useState([
    { id: 1, pair: 'EUR/USD', type: 'Long', pnl: 45.50, emotion: 'Confident', time: '2m ago' },
    { id: 2, pair: 'GBP/USD', type: 'Short', pnl: -23.20, emotion: 'Frustrated', time: '15m ago' },
    { id: 3, pair: 'USD/JPY', type: 'Long', pnl: 67.80, emotion: 'Focused', time: '1h ago' }
  ])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Trades</h4>
      <div className="space-y-3">
        {trades.map(trade => (
          <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${trade.type === 'Long' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium text-gray-900 dark:text-white">{trade.pair}</span>
              <span className="text-sm text-gray-500">{trade.emotion}</span>
            </div>
            <div className="text-right">
              <div className={`font-bold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trade.pnl >= 0 ? '+' : ''}£{trade.pnl}
              </div>
              <div className="text-xs text-gray-500">{trade.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const BiasDetectionDemo = () => {
  const [alerts, setAlerts] = useState([
    { type: 'Confirmation Bias', severity: 'Medium', message: 'You\'re only looking for bullish signals' },
    { type: 'FOMO', severity: 'High', message: 'Rushing into trades without proper analysis' },
    { type: 'Recency Bias', severity: 'Low', message: 'Overweighting recent market events' }
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'Low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bias Alerts</h4>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'High' ? 'bg-red-500' : alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{alert.type}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CourseProgressDemo = () => {
  const [modules] = useState([
    { title: 'Trading Psychology', progress: 100, status: 'completed' },
    { title: 'Technical Analysis', progress: 75, status: 'in_progress' },
    { title: 'Risk Management', progress: 0, status: 'locked' },
    { title: 'Advanced Strategies', progress: 0, status: 'locked' }
  ])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Progress</h4>
      <div className="space-y-4">
        {modules.map((module, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{module.title}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  module.status === 'completed' ? 'bg-green-500' : 
                  module.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }`}
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const productFeatures = [
  {
    title: 'Real-Time Analytics',
    description: 'Live account metrics that update in real-time. Track your performance, win rate, P&L, and trading streaks with institutional-grade analytics.',
    icon: BarChart3,
    demo: AnalyticsDemo,
    reverse: false,
  },
  {
    title: 'Advanced Trading Journal',
    description: 'Comprehensive trade logging with emotion tracking and bias detection. Every trade is analyzed to improve your decision-making process.',
    icon: TrendingUp,
    demo: TradingJournalDemo,
    reverse: true,
  },
  {
    title: 'Bias Detection System',
    description: 'AI-powered cognitive bias alerts that warn you when psychological patterns might be affecting your trading decisions.',
    icon: Shield,
    demo: BiasDetectionDemo,
    reverse: false,
  },
  {
    title: 'Structured Learning Path',
    description: 'Progressive course modules with real-time progress tracking. Master trading psychology, technical analysis, and risk management.',
    icon: Zap,
    demo: CourseProgressDemo,
    reverse: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export default function ProductStrip() {
  return (
    <section className="py-32 sm:py-40 lg:py-48 bg-gray-50 dark:bg-gray-800/50">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-24 lg:space-y-40"
        >
          {productFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <div className={`grid items-center gap-16 lg:grid-cols-2 ${feature.reverse ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={feature.reverse ? 'lg:col-start-2' : ''}>
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl">
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-8">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group cursor-pointer">
                      <span>Learn More</span>
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className={feature.reverse ? 'lg:col-start-1' : ''}>
                  <Card className="overflow-hidden border-gray-200/60 dark:border-white/10 shadow-2xl rounded-3xl">
                    <div className="aspect-[16/10] relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
                      <div className="h-full flex items-center justify-center">
                        <feature.demo />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Interactive Trading Dashboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24 lg:mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Interactive Trading Dashboard
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience our live trading platform with real-time data updates, bias detection, 
              and comprehensive analytics that our 2,400+ traders use daily.
            </p>
          </div>
          
          <Card className="max-w-6xl mx-auto border-gray-200/60 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HLC Trading Dashboard</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white dark:bg-gray-900 p-6">
              <InteractiveDashboardDemo />
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
}

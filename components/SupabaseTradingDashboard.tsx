'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  Calendar,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  Trophy,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { authService, User } from '@/lib/auth'

interface Trade {
  id: string
  trade_date: string
  symbol: string
  direction: 'Long' | 'Short'
  entry_price: number
  exit_price?: number
  quantity: number
  outcome?: 'Win' | 'Loss' | 'Break Even'
  pnl?: number
  notes?: string
  tags?: string[]
}

interface TradingGoal {
  id: string
  goal_date: string
  target_trades: number
  actual_trades: number
  target_study_minutes: number
  actual_study_minutes: number
  completed: boolean
}

interface Stats {
  trading: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    breakEvenTrades: number
    winRate: number
    totalPnL: number
    avgPnL: number
  }
  study: {
    totalStudyTime: number
    avgStudyTimePerDay: number
  }
  xp: {
    currentXP: number
    currentLevel: number
    xpProgress: number
    xpToNextLevel: number
    totalXPEarned: number
  }
}

interface SupabaseTradingDashboardProps {
  user?: User
}

export default function SupabaseTradingDashboard({ user: propUser }: SupabaseTradingDashboardProps) {
  const [user, setUser] = useState<User | null>(propUser || null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [goals, setGoals] = useState<TradingGoal[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddTrade, setShowAddTrade] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Get current user if not provided
      if (!user) {
        const authResult = await authService.getCurrentUser()
        if (authResult.error || !authResult.user) {
          router.push('/login')
          return
        }
        setUser(authResult.user)
      }

      // Load all data in parallel
      await Promise.all([
        loadTrades(),
        loadGoals(),
        loadStats()
      ])

    } catch (error) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrades = async () => {
    try {
      const response = await fetch('/api/trades?limit=10')
      if (!response.ok) throw new Error('Failed to load trades')
      
      const data = await response.json()
      setTrades(data.trades || [])
    } catch (error) {
      console.error('Error loading trades:', error)
    }
  }

  const loadGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      if (!response.ok) throw new Error('Failed to load goals')
      
      const data = await response.json()
      setGoals(data.goals || [])
    } catch (error) {
      console.error('Error loading goals:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats?period=30')
      if (!response.ok) throw new Error('Failed to load stats')
      
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      localStorage.clear()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const addTrade = async (tradeData: Partial<Trade>) => {
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      })

      if (!response.ok) throw new Error('Failed to add trade')

      const data = await response.json()
      setTrades(prev => [data.trade, ...prev])
      setShowAddTrade(false)
      
      // Reload stats to update XP and other metrics
      await loadStats()
    } catch (error) {
      console.error('Error adding trade:', error)
    }
  }

  const addGoal = async (goalData: Partial<TradingGoal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      })

      if (!response.ok) throw new Error('Failed to add goal')

      const data = await response.json()
      setGoals(prev => [data.goal, ...prev])
      setShowAddGoal(false)
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const deleteTrade = async (tradeId: string) => {
    try {
      const response = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete trade')

      setTrades(prev => prev.filter(trade => trade.id !== tradeId))
      await loadStats() // Reload stats after deletion
    } catch (error) {
      console.error('Error deleting trade:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={loadUserData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.full_name || user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Level {user?.level} • {user?.xp_points} XP • {user?.plan} Plan
            </p>
          </div>
          <Button onClick={handleSignOut} variant="secondary">
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Win Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.trading.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total P&L</p>
                    <p className={`text-2xl font-bold ${
                      stats.trading.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${stats.trading.totalPnL.toFixed(2)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Study Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.study.totalStudyTime}m
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">XP Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.xp.xpProgress.toFixed(1)}%
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trades */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Trades
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddTrade(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No trades recorded yet. Add your first trade to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {trades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          trade.direction === 'Long' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">{trade.symbol}</p>
                          <p className="text-sm text-gray-500">
                            {trade.direction} • {trade.trade_date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {trade.pnl && (
                          <span className={`font-medium ${
                            trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${trade.pnl.toFixed(2)}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTrade(trade.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trading Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Daily Goals
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddGoal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No goals set yet. Create your first daily goal!
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 5).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{goal.goal_date}</p>
                        <p className="text-sm text-gray-500">
                          {goal.actual_trades}/{goal.target_trades} trades • {goal.actual_study_minutes}/{goal.target_study_minutes}m study
                        </p>
                      </div>
                      <div className="flex items-center">
                        {goal.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        )}
                        <div className="text-right">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, (goal.actual_trades / goal.target_trades) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
                  <BookOpen className="w-6 h-6 mb-2" />
                  <span>Study</span>
                </Button>
                <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="w-6 h-6 mb-2" />
                  <span>Journal</span>
                </Button>
                <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span>Analytics</span>
                </Button>
                <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
                  <Trophy className="w-6 h-6 mb-2" />
                  <span>Achievements</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

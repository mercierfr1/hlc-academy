'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Calendar,
  BarChart3,
  Award,
  Clock
} from 'lucide-react'

interface Trade {
  id: string
  symbol: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  date: string
  notes: string
  emotions: string[]
  lessons: string
}

interface TradingStatsProps {
  className?: string
}

export default function TradingStats({ className = '' }: TradingStatsProps) {
  const [stats, setStats] = useState({
    totalPnL: 0,
    monthlyPnL: 0,
    totalTrades: 0,
    monthlyTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    bestTrade: 0,
    worstTrade: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalVolume: 0,
    monthlyVolume: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStats()
  }, [])

  const calculateStats = () => {
    try {
      // Get trades from localStorage
      const savedTrades = localStorage.getItem('trade-journal')
      const trades: Trade[] = savedTrades ? JSON.parse(savedTrades) : []
      
      // Get current month
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      // Filter trades for current month
      const monthlyTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.date)
        return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear
      })
      
      // Calculate total P&L
      const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
      const monthlyPnL = monthlyTrades.reduce((sum, trade) => sum + trade.pnl, 0)
      
      // Calculate trade counts
      const totalTrades = trades.length
      const monthlyTradesCount = monthlyTrades.length
      
      // Calculate win rate
      const winningTrades = trades.filter(trade => trade.pnl > 0)
      const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0
      
      // Calculate average win/loss
      const wins = trades.filter(trade => trade.pnl > 0)
      const losses = trades.filter(trade => trade.pnl < 0)
      const avgWin = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.pnl, 0) / wins.length : 0
      const avgLoss = losses.length > 0 ? losses.reduce((sum, trade) => sum + trade.pnl, 0) / losses.length : 0
      
      // Calculate best/worst trades
      const bestTrade = trades.length > 0 ? Math.max(...trades.map(trade => trade.pnl)) : 0
      const worstTrade = trades.length > 0 ? Math.min(...trades.map(trade => trade.pnl)) : 0
      
      // Calculate streaks
      let currentStreak = 0
      let longestStreak = 0
      let tempStreak = 0
      
      for (let i = trades.length - 1; i >= 0; i--) {
        if (trades[i].pnl > 0) {
          tempStreak++
          if (i === trades.length - 1) currentStreak = tempStreak
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 0
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)
      
      // Calculate volume
      const totalVolume = trades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0)
      const monthlyVolume = monthlyTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0)
      
      setStats({
        totalPnL,
        monthlyPnL,
        totalTrades,
        monthlyTrades: monthlyTradesCount,
        winRate,
        avgWin,
        avgLoss,
        bestTrade,
        worstTrade,
        currentStreak,
        longestStreak,
        totalVolume,
        monthlyVolume
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB').format(num)
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total P&L',
      value: formatCurrency(stats.totalPnL),
      icon: DollarSign,
      color: stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.totalPnL >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      borderColor: stats.totalPnL >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthlyPnL),
      icon: Calendar,
      color: stats.monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.monthlyPnL >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      borderColor: stats.monthlyPnL >= 0 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Total Trades',
      value: formatNumber(stats.totalTrades),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Monthly Trades',
      value: formatNumber(stats.monthlyTrades),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: stats.winRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      borderColor: stats.winRate >= 50 ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Avg Win',
      value: formatCurrency(stats.avgWin),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Avg Loss',
      value: formatCurrency(stats.avgLoss),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} wins`,
      icon: Clock,
      color: stats.currentStreak > 0 ? 'text-green-600' : 'text-gray-600',
      bgColor: stats.currentStreak > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: stats.currentStreak > 0 ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-800'
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Trading Performance
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time statistics based on your trade journal
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`p-6 border-2 ${stat.bgColor} ${stat.borderColor} transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="p-6 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.bestTrade)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Best Trade
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="p-6 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.worstTrade)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Worst Trade
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.longestStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Longest Streak
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Eye
} from 'lucide-react'

interface FundingOverviewWidgetProps {
  onViewDetails?: () => void
}

interface FundingStats {
  totalAccounts: number
  liveAccounts: number
  evaluationAccounts: number
  totalFunding: number
  totalCurrentBalance: number
  totalProfit: number
  averageHealthScore: number
  recentChanges: {
    account: string
    change: number
    type: 'profit' | 'loss'
  }[]
}

export default function FundingOverviewWidget({ onViewDetails }: FundingOverviewWidgetProps) {
  const [stats, setStats] = useState<FundingStats>({
    totalAccounts: 3,
    liveAccounts: 1,
    evaluationAccounts: 2,
    totalFunding: 200000,
    totalCurrentBalance: 372500,
    totalProfit: 172500,
    averageHealthScore: 83,
    recentChanges: [
      { account: 'FTMO 100K', change: 5500, type: 'profit' },
      { account: 'TFT 50K', change: 2000, type: 'profit' },
      { account: 'MFF Live', change: 15000, type: 'profit' }
    ]
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group" onClick={onViewDetails}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Funding Tracker</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prop firm accounts overview</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAccounts}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Accounts</p>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="text-xs text-green-600 dark:text-green-400">{stats.liveAccounts} Live</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">{stats.evaluationAccounts} Eval</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalFunding)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Funding</p>
            <div className="flex items-center justify-center mt-1">
              <span className="text-xs text-green-600 dark:text-green-400">
                +{formatCurrency(stats.totalProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Health Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Health Score</span>
            <span className={`text-sm font-semibold ${getHealthColor(stats.averageHealthScore)}`}>
              {stats.averageHealthScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.averageHealthScore}%` }}
            />
          </div>
        </div>

        {/* Recent Changes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Changes</h4>
          {stats.recentChanges.map((change, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{change.account}</span>
              <div className="flex items-center space-x-1">
                {change.type === 'profit' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  change.type === 'profit' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {change.type === 'profit' ? '+' : ''}{formatCurrency(change.change)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onViewDetails}
          >
            View All Accounts
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Calendar,
  BarChart3,
  Wallet,
  Trophy,
  Star,
  Tag,
  ExternalLink,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface FundingAccount {
  id: string
  propFirm: string
  accountName: string
  stage: 'Evaluation Phase 1' | 'Evaluation Phase 2' | 'Live'
  startingBalance: number
  currentBalance: number
  profitTarget: number
  maxDailyLoss: number
  maxDrawdown: number
  profitTargetPercent: number
  maxDailyLossPercent: number
  maxDrawdownPercent: number
  verificationStatus: 'Unverified' | 'Pending' | 'Verified'
  tags: string[]
  createdAt: string
  lastUpdated: string
  healthScore: number
}

interface FundingOverview {
  totalAccounts: number
  liveAccounts: number
  evaluationAccounts: number
  totalFunding: number
  totalCurrentBalance: number
  totalProfit: number
  averageHealthScore: number
}

const PROP_FIRMS = [
  'FTMO',
  'The Funded Trader',
  'MyForexFunds',
  'True Forex Funds',
  'E8 Funding',
  'FundedNext',
  'The 5%ers',
  'City Traders Imperium',
  'Lux Trading',
  'Trade the Pool',
  'SurgeTrader',
  'TopStepFX',
  'TradingFunds',
  'Prop Firm Match',
  'Custom'
]

const ACCOUNT_TAGS = [
  'Forex',
  'Indices',
  'Crypto',
  'Commodities',
  'Stocks',
  'Scalping',
  'Swing Trading',
  'Day Trading',
  'News Trading',
  'Algorithmic'
]

export default function FundingTracker() {
  const [accounts, setAccounts] = useState<FundingAccount[]>([
    {
      id: '1',
      propFirm: 'FTMO',
      accountName: 'FTMO Challenge 100K',
      stage: 'Evaluation Phase 1',
      startingBalance: 100000,
      currentBalance: 105500,
      profitTarget: 10000,
      maxDailyLoss: 5000,
      maxDrawdown: 10000,
      profitTargetPercent: 10,
      maxDailyLossPercent: 5,
      maxDrawdownPercent: 10,
      verificationStatus: 'Verified',
      tags: ['Forex', 'Day Trading'],
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      healthScore: 85
    },
    {
      id: '2',
      propFirm: 'The Funded Trader',
      accountName: 'TFT 50K Evaluation',
      stage: 'Evaluation Phase 2',
      startingBalance: 50000,
      currentBalance: 52000,
      profitTarget: 5000,
      maxDailyLoss: 2500,
      maxDrawdown: 5000,
      profitTargetPercent: 10,
      maxDailyLossPercent: 5,
      maxDrawdownPercent: 10,
      verificationStatus: 'Pending',
      tags: ['Indices', 'Swing Trading'],
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-19',
      healthScore: 72
    },
    {
      id: '3',
      propFirm: 'MyForexFunds',
      accountName: 'MFF Live Account',
      stage: 'Live',
      startingBalance: 200000,
      currentBalance: 215000,
      profitTarget: 0,
      maxDailyLoss: 10000,
      maxDrawdown: 20000,
      profitTargetPercent: 0,
      maxDailyLossPercent: 5,
      maxDrawdownPercent: 10,
      verificationStatus: 'Verified',
      tags: ['Forex', 'Scalping'],
      createdAt: '2023-12-01',
      lastUpdated: '2024-01-20',
      healthScore: 92
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<FundingAccount | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'health' | 'balance' | 'profit' | 'date'>('health')
  const [filterStage, setFilterStage] = useState<'all' | 'Evaluation Phase 1' | 'Evaluation Phase 2' | 'Live'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate funding overview
  const overview: FundingOverview = accounts.reduce((acc, account) => {
    acc.totalAccounts++
    if (account.stage === 'Live') {
      acc.liveAccounts++
      acc.totalFunding += account.startingBalance
    } else {
      acc.evaluationAccounts++
    }
    acc.totalCurrentBalance += account.currentBalance
    acc.totalProfit += (account.currentBalance - account.startingBalance)
    acc.averageHealthScore += account.healthScore
    return acc
  }, {
    totalAccounts: 0,
    liveAccounts: 0,
    evaluationAccounts: 0,
    totalFunding: 0,
    totalCurrentBalance: 0,
    totalProfit: 0,
    averageHealthScore: 0
  })

  if (accounts.length > 0) {
    overview.averageHealthScore = overview.averageHealthScore / accounts.length
  }

  // Filter and sort accounts
  const filteredAccounts = accounts
    .filter(account => {
      const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.propFirm.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStage = filterStage === 'all' || account.stage === filterStage
      return matchesSearch && matchesStage
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'health':
          return b.healthScore - a.healthScore
        case 'balance':
          return b.currentBalance - a.currentBalance
        case 'profit':
          return (b.currentBalance - b.startingBalance) - (a.currentBalance - a.startingBalance)
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Evaluation Phase 1':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      case 'Evaluation Phase 2':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20'
      case 'Live':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

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

  const exportToCSV = () => {
    const csvContent = [
      ['Account Name', 'Prop Firm', 'Stage', 'Starting Balance', 'Current Balance', 'Profit/Loss', 'Health Score', 'Verification Status', 'Tags'],
      ...accounts.map(account => [
        account.accountName,
        account.propFirm,
        account.stage,
        account.startingBalance,
        account.currentBalance,
        account.currentBalance - account.startingBalance,
        account.healthScore,
        account.verificationStatus,
        account.tags.join(', ')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `funding-tracker-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Funding Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all your prop firm accounts in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.totalAccounts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400">{overview.liveAccounts} Live</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-blue-600 dark:text-blue-400">{overview.evaluationAccounts} Evaluation</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Funding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(overview.totalFunding)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400">+{formatCurrency(overview.totalProfit)}</span>
            <span className="text-gray-400 ml-2">total profit</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(overview.totalCurrentBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400">+{formatPercentage((overview.totalProfit / (overview.totalCurrentBalance - overview.totalProfit)) * 100)}</span>
            <span className="text-gray-400 ml-2">growth</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Health Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.averageHealthScore.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                style={{ width: `${overview.averageHealthScore}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Stages</option>
            <option value="Evaluation Phase 1">Phase 1</option>
            <option value="Evaluation Phase 2">Phase 2</option>
            <option value="Live">Live</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="health">Health Score</option>
            <option value="balance">Current Balance</option>
            <option value="profit">Profit/Loss</option>
            <option value="date">Date Added</option>
          </select>

          <div className="flex items-center space-x-2 ml-auto">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Accounts Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredAccounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              {/* Account Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {account.accountName}
                    </h3>
                    {getVerificationIcon(account.verificationStatus)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{account.propFirm}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(account.stage)}`}>
                    {account.stage}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(account.healthScore)}`}>
                    {account.healthScore}/100
                  </span>
                </div>
              </div>

              {/* Balance Information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Starting Balance</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(account.startingBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                  <p className={`text-lg font-semibold ${
                    account.currentBalance >= account.startingBalance 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(account.currentBalance)}
                  </p>
                </div>
              </div>

              {/* Profit/Loss */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss</span>
                  <span className={`text-sm font-medium ${
                    account.currentBalance >= account.startingBalance 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {account.currentBalance >= account.startingBalance ? '+' : ''}
                    {formatCurrency(account.currentBalance - account.startingBalance)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      account.currentBalance >= account.startingBalance 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs((account.currentBalance - account.startingBalance) / account.startingBalance * 100), 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Progress Bars */}
              {account.stage !== 'Live' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Profit Target</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercentage(calculateProgress(account.currentBalance - account.startingBalance, account.profitTarget))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateProgress(account.currentBalance - account.startingBalance, account.profitTarget), 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercentage(calculateProgress(account.startingBalance - account.currentBalance, account.maxDrawdown))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateProgress(account.startingBalance - account.currentBalance, account.maxDrawdown), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {account.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAccount(account)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No accounts found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterStage !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first prop firm account'
            }
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Account
          </Button>
        </Card>
      )}

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Account</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prop Firm
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        {PROP_FIRMS.map((firm) => (
                          <option key={firm} value={firm}>{firm}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., FTMO Challenge 100K"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stage
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="Evaluation Phase 1">Evaluation Phase 1</option>
                        <option value="Evaluation Phase 2">Evaluation Phase 2</option>
                        <option value="Live">Live</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Starting Balance
                      </label>
                      <input
                        type="number"
                        placeholder="100000"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Balance
                      </label>
                      <input
                        type="number"
                        placeholder="105000"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profit Target (%)
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Daily Loss (%)
                      </label>
                      <input
                        type="number"
                        placeholder="5"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Drawdown (%)
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ACCOUNT_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Verification
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag and drop screenshots or click to upload
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button>
                      Add Account
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Export Data</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExportModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      exportToCSV()
                      setShowExportModal(false)
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowExportModal(false)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

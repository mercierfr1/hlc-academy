'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Calendar, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { 
  Trade, 
  TradeFilters, 
  DailyAggregation, 
  WeeklySummary,
  fetchTrades,
  saveTrade,
  updateTrade,
  deleteTrade,
  getDailyAggregations,
  getWeeklySummary,
  exportTradesToCSV,
  importTradesFromCSV
} from '@/lib/tradeAdapter'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  trade?: Trade
  selectedDate?: string
  onSave: (trade: Omit<Trade, 'id'>) => void
  onUpdate?: (id: string, updates: Partial<Trade>) => void
  onDelete?: (id: string) => void
}

const TradeModal = ({ isOpen, onClose, trade, selectedDate, onSave, onUpdate, onDelete }: TradeModalProps) => {
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'LONG' as 'LONG' | 'SHORT',
    size: 1,
    rr: 1,
    pnl: 0,
    tags: '',
    notes: ''
  })

  useEffect(() => {
    if (trade) {
      setFormData({
        symbol: trade.symbol,
        side: trade.side,
        size: trade.size,
        rr: trade.rr,
        pnl: trade.pnl,
        tags: trade.tags.join(', '),
        notes: trade.notes || ''
      })
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        symbol: '',
        side: 'LONG',
        size: 1,
        rr: 1,
        pnl: 0,
        tags: '',
        notes: ''
      }))
    }
  }, [trade, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tradeData = {
      ...formData,
      date: selectedDate ? `${selectedDate}T12:00:00Z` : trade?.date || new Date().toISOString(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    }

    if (trade && onUpdate) {
      onUpdate(trade.id, tradeData)
    } else {
      onSave(tradeData)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {trade ? 'Edit Trade' : 'Add New Trade'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Side
              </label>
              <select
                value={formData.side}
                onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'LONG' | 'SHORT' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Size
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  R:R
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rr}
                  onChange={(e) => setFormData(prev => ({ ...prev, rr: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                P&L
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pnl}
                onChange={(e) => setFormData(prev => ({ ...prev, pnl: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., LondonOpen, Breakout"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {trade && onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onDelete(trade.id)
                    onClose()
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {trade ? 'Update' : 'Add'} Trade
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SimpleTradeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [trades, setTrades] = useState<Trade[]>([])
  const [dailyAggregations, setDailyAggregations] = useState<DailyAggregation[]>([])
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null)
  const [filters, setFilters] = useState<TradeFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showWeeklySummary, setShowWeeklySummary] = useState(true)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    trade?: Trade
    selectedDate?: string
  }>({ isOpen: false })

  // Calculate key metrics
  const keyMetrics = useMemo(() => {
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
    const totalTrades = trades.length
    const winningTrades = trades.filter(trade => trade.pnl > 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const bestDay = dailyAggregations.reduce((best, day) => 
      day.totalPnl > best.totalPnl ? day : best, 
      { totalPnl: 0, date: '', tradeCount: 0, avgRr: 0, tags: [], trades: [] }
    )

    return {
      totalPnL,
      totalTrades,
      winRate,
      bestDay: bestDay.totalPnl
    }
  }, [trades, dailyAggregations])

  // Load trades and aggregations
  const loadData = useCallback(async () => {
    const start = new Date(currentDate)
    start.setDate(1)
    const end = new Date(currentDate)
    end.setMonth(end.getMonth() + 1)
    end.setDate(0)

    const [tradesData, aggregationsData] = await Promise.all([
      fetchTrades(start.toISOString(), end.toISOString(), filters),
      getDailyAggregations(start.toISOString(), end.toISOString(), filters)
    ])

    setTrades(tradesData)
    setDailyAggregations(aggregationsData)

    // Load weekly summary for current week
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weeklyData = await getWeeklySummary(weekStart.toISOString(), weekEnd.toISOString(), filters)
    setWeeklySummary(weeklyData)
  }, [currentDate, filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSaveTrade = async (tradeData: Omit<Trade, 'id'>) => {
    await saveTrade(tradeData)
    loadData()
  }

  const handleUpdateTrade = async (id: string, updates: Partial<Trade>) => {
    await updateTrade(id, updates)
    loadData()
  }

  const handleDeleteTrade = async (id: string) => {
    await deleteTrade(id)
    loadData()
  }

  const handleExport = () => {
    const csv = exportTradesToCSV(trades)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trades-${currentDate.toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const importedTrades = importTradesFromCSV(csv)
        // TODO: Save imported trades to backend
        console.log('Imported trades:', importedTrades)
      }
      reader.readAsText(file)
    }
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayData = dailyAggregations.find(d => d.date === dateStr)
      const dayTrades = trades.filter(t => t.date.split('T')[0] === dateStr)
      
      days.push({
        date,
        dateStr,
        isCurrentMonth: date.getMonth() === month,
        dayData,
        trades: dayTrades
      })
    }
    return days
  }, [currentDate, dailyAggregations, trades])

  const availableSymbols = useMemo(() => {
    return Array.from(new Set(trades.map(t => t.symbol))).sort()
  }, [trades])

  const availableTags = useMemo(() => {
    return Array.from(new Set(trades.flatMap(t => t.tags))).sort()
  }, [trades])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              keyMetrics.totalPnL > 0 ? 'text-green-600' : 
              keyMetrics.totalPnL < 0 ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {keyMetrics.totalPnL > 0 ? '+' : ''}£{keyMetrics.totalPnL.toFixed(2)}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
              Total P&L
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {keyMetrics.totalTrades}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
              Total Trades
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {keyMetrics.winRate.toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
              Win Rate
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              +£{keyMetrics.bestDay.toFixed(2)}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
              Best Day
            </div>
          </div>
        </Card>
      </div>

      {/* Daily P&L Calendar Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily P&L Calendar
          </h3>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (confirm('Are you sure you want to clear all trades? This action cannot be undone.')) {
                  // TODO: Implement clear all functionality
                  console.log('Clear all trades')
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {trades.length} trades • {keyMetrics.totalPnL > 0 ? '+' : ''}£{keyMetrics.totalPnL.toFixed(2)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="text-blue-600 hover:text-blue-700"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                !day.isCurrentMonth ? 'opacity-30' : ''
              } ${day.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setModalState({ isOpen: true, selectedDate: day.dateStr })}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  day.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}>
                  {day.date.getDate()}
                </span>
                {day.dayData && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    day.dayData.totalPnl > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    day.dayData.totalPnl < 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {day.dayData.totalPnl > 0 ? '+' : ''}£{day.dayData.totalPnl.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {day.trades.slice(0, 3).map((trade, tradeIndex) => (
                  <div
                    key={tradeIndex}
                    className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 truncate"
                    onClick={(e) => {
                      e.stopPropagation()
                      setModalState({ isOpen: true, trade })
                    }}
                    title={`${trade.symbol} ${trade.side} - £${trade.pnl.toFixed(2)}`}
                  >
                    {trade.symbol} {trade.side}
                  </div>
                ))}
                {day.trades.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{day.trades.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              id="import-trades"
            />
            <label htmlFor="import-trades">
              <Button variant="ghost" size="sm" asChild>
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setModalState({ isOpen: true })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trade
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbols
                </label>
                <select
                  multiple
                  value={filters.symbols || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setFilters(prev => ({ ...prev, symbols: values }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {availableSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Side
                </label>
                <select
                  multiple
                  value={filters.sides || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value) as ('LONG' | 'SHORT')[]
                    setFilters(prev => ({ ...prev, sides: values }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <select
                  multiple
                  value={filters.tags || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    setFilters(prev => ({ ...prev, tags: values }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.journaledOnly || false}
                    onChange={(e) => setFilters(prev => ({ ...prev, journaledOnly: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Journaled only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </Card>


      {/* Trade Modal */}
      <TradeModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        trade={modalState.trade}
        selectedDate={modalState.selectedDate}
        onSave={handleSaveTrade}
        onUpdate={handleUpdateTrade}
        onDelete={handleDeleteTrade}
      />
    </div>
  )
}

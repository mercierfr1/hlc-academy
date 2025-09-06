'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Plus, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3 } from 'lucide-react'
import SimpleTradeCalendar from './SimpleTradeCalendar'

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

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    type: 'long' as 'long' | 'short',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    notes: '',
    emotions: [] as string[],
    lessons: ''
  })

  const emotions = ['Confident', 'Anxious', 'Greedy', 'Fearful', 'Patient', 'Impatient', 'Focused', 'Distracted']

  useEffect(() => {
    // Load trades from localStorage
    const savedTrades = localStorage.getItem('trade-journal')
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades))
    }
  }, [])

  const saveTrades = (updatedTrades: Trade[]) => {
    setTrades(updatedTrades)
    localStorage.setItem('trade-journal', JSON.stringify(updatedTrades))
  }

  const addTrade = () => {
    if (!newTrade.symbol.trim() || !newTrade.entryPrice || !newTrade.exitPrice || !newTrade.quantity) return

    const entryPrice = parseFloat(newTrade.entryPrice)
    const exitPrice = parseFloat(newTrade.exitPrice)
    const quantity = parseFloat(newTrade.quantity)
    
    const pnl = newTrade.type === 'long' 
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity

    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol.toUpperCase(),
      type: newTrade.type,
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      date: new Date().toISOString().split('T')[0],
      notes: newTrade.notes,
      emotions: newTrade.emotions,
      lessons: newTrade.lessons
    }

    const updatedTrades = [...trades, trade]
    saveTrades(updatedTrades)
    
    setNewTrade({
      symbol: '',
      type: 'long',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      notes: '',
      emotions: [],
      lessons: ''
    })
    setShowAddForm(false)
  }

  const deleteTrade = (id: string) => {
    const updatedTrades = trades.filter(trade => trade.id !== id)
    saveTrades(updatedTrades)
  }

  const toggleEmotion = (emotion: string) => {
    setNewTrade(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }))
  }

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  const winRate = trades.length > 0 
    ? (trades.filter(trade => trade.pnl > 0).length / trades.length) * 100 
    : 0

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trade Journal</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Total P&L: <span className={`font-semibold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toFixed(2)}
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Win Rate: <span className="font-semibold">{winRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors mb-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Trade</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Symbol (e.g., BTC)"
              value={newTrade.symbol}
              onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newTrade.type}
              onChange={(e) => setNewTrade({ ...newTrade, type: e.target.value as 'long' | 'short' })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Entry Price"
              value={newTrade.entryPrice}
              onChange={(e) => setNewTrade({ ...newTrade, entryPrice: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Exit Price"
              value={newTrade.exitPrice}
              onChange={(e) => setNewTrade({ ...newTrade, exitPrice: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newTrade.quantity}
              onChange={(e) => setNewTrade({ ...newTrade, quantity: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emotions
            </label>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    newTrade.emotions.includes(emotion)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Notes about this trade"
            value={newTrade.notes}
            onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={2}
          />

          <textarea
            placeholder="Key lessons learned"
            value={newTrade.lessons}
            onChange={(e) => setNewTrade({ ...newTrade, lessons: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={2}
          />

          <div className="flex space-x-2">
            <button
              onClick={addTrade}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Trade
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{trade.symbol}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    trade.type === 'long' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                  <div className={`flex items-center space-x-1 ${
                    trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">${trade.pnl.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTrade(trade.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <div>Entry: ${trade.entryPrice}</div>
                <div>Exit: ${trade.exitPrice}</div>
                <div>Qty: {trade.quantity}</div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(trade.date).toLocaleDateString()}</span>
                </div>
              </div>

              {trade.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {trade.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              )}

              {trade.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{trade.notes}</p>
              )}

              {trade.lessons && (
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Lesson:</strong> {trade.lessons}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

        {trades.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trades recorded yet. Add your first trade to start tracking your progress!</p>
          </div>
        )}
      </Card>

      {/* Trade Calendar */}
      <SimpleTradeCalendar />
    </div>
  )
}

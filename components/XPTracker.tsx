'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface XPTrackerProps {
  currentXP?: number
  targetXP?: number
  streak?: number
  timeRemaining?: string
}

export default function XPTracker({ 
  currentXP = 0, 
  targetXP = 100, 
  streak = 0, 
  timeRemaining = "23 hours left" 
}: XPTrackerProps) {
  const [xp, setXp] = useState(currentXP)
  const [currentStreak, setCurrentStreak] = useState(streak)
  
  const progressPercentage = (xp / targetXP) * 100

  const addXP = (amount: number) => {
    setXp(prev => Math.min(prev + amount, targetXP))
  }

  const resetXP = () => {
    setXp(0)
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/60 dark:border-blue-800/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily XP Goal</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">{timeRemaining}</span>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="flex items-baseline justify-center space-x-2">
            <motion.div 
              key={xp}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#1f2937' }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              {xp}
            </motion.div>
            <div className="text-2xl text-gray-400">/</div>
            <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">{targetXP}</div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">XP Today</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentStreak}-day streak
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => addXP(10)}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          +10 XP
        </button>
        <button
          onClick={() => addXP(25)}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          +25 XP
        </button>
        <button
          onClick={resetXP}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Reset
        </button>
      </div>
    </Card>
  )
}

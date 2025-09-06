'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Award, TrendingUp, Star, Target } from 'lucide-react'

interface XPBarProps {
  currentXP?: number
  totalXP?: number
  level?: number
  showLevels?: boolean
}

export default function XPBar({ 
  currentXP = 400, 
  totalXP = 1000, 
  level = 1,
  showLevels = true 
}: XPBarProps) {
  const [animatedXP, setAnimatedXP] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const progressPercentage = Math.min((currentXP / totalXP) * 100, 100)
  const xpToNextLevel = totalXP - currentXP
  const nextLevel = level + 1

  // Animate XP bar on mount and when currentXP changes
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setAnimatedXP(currentXP)
      setIsAnimating(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [currentXP])

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500'
    if (level >= 5) return 'from-blue-500 to-purple-500'
    if (level >= 3) return 'from-green-500 to-blue-500'
    return 'from-yellow-500 to-orange-500'
  }

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Trading Master'
    if (level >= 7) return 'Expert Trader'
    if (level >= 5) return 'Advanced Trader'
    if (level >= 3) return 'Intermediate Trader'
    return 'Beginner Trader'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-gradient-to-r ${getLevelColor(level)}`}>
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Level {level} - {getLevelTitle(level)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {animatedXP.toLocaleString()} / {totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>
        {showLevels && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {level}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Level
            </div>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress to Level {nextLevel}</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              delay: 0.2
            }}
          />
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{animatedXP.toLocaleString()} XP</span>
          <span>{totalXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* XP Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {xpToNextLevel.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            XP to Next Level
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.floor(animatedXP / 100)}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Stars Earned
          </div>
        </div>
      </div>

      {/* Recent XP Activity */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Recent Activity
        </h4>
        <div className="space-y-2">
          {[
            { action: 'Completed Module 1', xp: 50, time: '2h ago' },
            { action: 'Daily Goal Achieved', xp: 25, time: '1d ago' },
            { action: 'Trade Journal Entry', xp: 10, time: '2d ago' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">{activity.action}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">+{activity.xp} XP</span>
                <span className="text-gray-500 dark:text-gray-400">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Level Rewards Preview */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Level {nextLevel} Rewards
          </span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Unlock advanced trading strategies and exclusive content
        </div>
      </div>
    </Card>
  )
}

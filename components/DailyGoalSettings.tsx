'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface GoalPreset {
  id: string
  name: string
  xpPerDay: number
  description: string
  warning?: string
}

const goalPresets: GoalPreset[] = [
  { id: 'basic', name: 'Basic', xpPerDay: 50, description: 'Perfect for getting started' },
  { id: 'casual', name: 'Casual', xpPerDay: 100, description: 'Balanced learning pace' },
  { id: 'regular', name: 'Regular', xpPerDay: 200, description: 'Steady progress approach' },
  { id: 'serious', name: 'Serious', xpPerDay: 350, description: 'Intensive learning mode' },
  { id: 'insane', name: 'Insane', xpPerDay: 500, description: 'Maximum intensity', warning: 'Not recommended for beginners' }
]

const tiers = [
  { name: 'Novice', xp: 0, color: '#ef4444' },
  { name: 'Apprentice', xp: 1000, color: '#f97316' },
  { name: 'Consistent', xp: 2500, color: '#eab308' },
  { name: 'Disciplined', xp: 5000, color: '#22c55e' },
  { name: 'Pro', xp: 10000, color: '#3b82f6' }
]

export default function DailyGoalSettings() {
  const [selectedGoal, setSelectedGoal] = useState('casual')
  const [currentXP, setCurrentXP] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // Generate mock XP history for the last 7 days
  const mockHistory = useMemo(() => {
    const history: { date: string; xp: number; cumulativeXP: number }[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Generate realistic XP data with some variance
      const baseXP = 100 + Math.random() * 50
      const xp = Math.floor(baseXP + (Math.random() - 0.5) * 30)
      
      history.push({
        date: date.toISOString().split('T')[0],
        xp: xp,
        cumulativeXP: history.length > 0 ? history[history.length - 1].cumulativeXP + xp : xp
      })
    }
    
    return history
  }, [])

  // Calculate current average XP per day
  const currentAverageXP = useMemo(() => {
    return Math.round(mockHistory.reduce((sum, day) => sum + day.xp, 0) / mockHistory.length)
  }, [mockHistory])

  // Generate projection data
  const projectionData = useMemo(() => {
    const selectedPreset = goalPresets.find(preset => preset.id === selectedGoal)
    if (!selectedPreset) return []

    const data = []
    const startXP = mockHistory[mockHistory.length - 1].cumulativeXP
    const startDate = new Date(mockHistory[mockHistory.length - 1].date)
    
    // Generate 30 days of projection
    for (let i = 0; i <= 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      const goalXP = startXP + (selectedPreset.xpPerDay * i)
      const currentTrajectoryXP = startXP + (currentAverageXP * i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        goalXP,
        currentTrajectoryXP,
        day: i
      })
    }
    
    return data
  }, [selectedGoal, mockHistory, currentAverageXP])

  // Get current tier based on XP
  const getCurrentTier = (xp: number) => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (xp >= tiers[i].xp) {
        return tiers[i]
      }
    }
    return tiers[0]
  }

  const selectedPreset = goalPresets.find(preset => preset.id === selectedGoal)
  const currentTier = getCurrentTier(mockHistory[mockHistory.length - 1].cumulativeXP)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white dark:bg-gray-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Daily Goal Settings
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Set your daily XP target to build consistent trading habits and track your progress toward mastery
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-8 h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Choose Your Goal
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a daily XP target that matches your learning pace and commitment level.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {goalPresets.map((preset) => (
                      <motion.div
                        key={preset.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedGoal === preset.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedGoal(preset.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedGoal === preset.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedGoal === preset.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {preset.name}
                              </h4>
                              {preset.warning && (
                                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                                  ⚠️ {preset.warning}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {preset.xpPerDay} XP per day • {preset.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current XP Level:
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {mockHistory[mockHistory.length - 1].cumulativeXP} XP
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Tier:
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: currentTier.color }}
                      >
                        {currentTier.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Average (7 days):
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {currentAverageXP} XP/day
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity duration-200"
                    >
                      {isSaved ? '✓ Goal Saved!' : 'Save Goal'}
                    </motion.button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Panel - Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 h-full">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      XP Projection
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      See how your daily goal will impact your progress over the next 30 days
                    </p>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `Day ${value}`}
                        />
                        <YAxis 
                          yAxisId="xp"
                          orientation="left"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                        />
                        <YAxis 
                          yAxisId="tier"
                          orientation="right"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const tier = tiers.find(t => t.xp === value)
                            return tier ? tier.name : ''
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value.toLocaleString()} XP`, 
                            name === 'goalXP' ? 'Goal Trajectory' : 'Current Trajectory'
                          ]}
                          labelFormatter={(value) => `Day ${value}`}
                        />
                        
                        {/* Goal trajectory */}
                        <Area
                          yAxisId="xp"
                          type="monotone"
                          dataKey="goalXP"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          strokeWidth={3}
                        />
                        
                        {/* Current trajectory */}
                        <Area
                          yAxisId="xp"
                          type="monotone"
                          dataKey="currentTrajectoryXP"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.1}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Goal Trajectory ({selectedPreset?.xpPerDay} XP/day)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded" style={{ background: 'repeating-linear-gradient(45deg, #10b981, #10b981 3px, transparent 3px, transparent 6px)' }}></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Current Trajectory ({currentAverageXP} XP/day)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

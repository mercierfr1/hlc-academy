'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Plus, Target, Calendar, CheckCircle } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
}

export default function TradingGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  })

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('trading-goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals)
    localStorage.setItem('trading-goals', JSON.stringify(updatedGoals))
  }

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      completed: false,
      createdAt: new Date().toISOString()
    }

    const updatedGoals = [...goals, goal]
    saveGoals(updatedGoals)
    
    setNewGoal({ title: '', description: '', targetDate: '', priority: 'medium' })
    setShowAddForm(false)
  }

  const toggleGoal = (id: string) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    )
    saveGoals(updatedGoals)
  }

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    saveGoals(updatedGoals)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const completedGoals = goals.filter(goal => goal.completed).length
  const totalGoals = goals.length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trading Goals</h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {completedGoals}/{totalGoals} completed
        </div>
      </div>

      {totalGoals > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                goal.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`mt-1 p-1 rounded-full transition-colors ${
                    goal.completed
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${
                      goal.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  
                  {goal.description && (
                    <p className={`text-sm ${
                      goal.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {goal.description}
                    </p>
                  )}
                  
                  {goal.targetDate && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Goal</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <input
            type="text"
            placeholder="Goal title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          
          <textarea
            placeholder="Description (optional)"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={2}
          />
          
          <div className="flex space-x-2">
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            
            <select
              value={newGoal.priority}
              onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'high' | 'medium' | 'low' })}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={addGoal}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Goal
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
    </Card>
  )
}

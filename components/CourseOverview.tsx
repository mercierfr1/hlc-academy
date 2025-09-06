'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  Clock, 
  Lock, 
  ArrowRight, 
  Star,
  Trophy,
  BookOpen,
  Target
} from 'lucide-react'
import { CourseModule, getCourseOverview } from '@/lib/courseAdapter'

interface CourseOverviewProps {
  showViewAll?: boolean
  maxModules?: number
  showHeader?: boolean
  showStats?: boolean
}

export default function CourseOverview({ 
  showViewAll = true, 
  maxModules = 6, 
  showHeader = true, 
  showStats = true 
}: CourseOverviewProps) {
  const [modules, setModules] = useState<CourseModule[]>([])
  const [stats, setStats] = useState({
    totalModules: 0,
    completedModules: 0,
    inProgressModules: 0,
    totalXP: 0,
    earnedXP: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const data = await getCourseOverview()
        setModules(data.modules.slice(0, maxModules))
        setStats(data.stats)
      } catch (error) {
        console.error('Failed to load course data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourseData()
  }, [maxModules])

  const getStatusIcon = (status: CourseModule['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-600" />
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: CourseModule['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      case 'in_progress':
        return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
      case 'locked':
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
      default:
        return 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'intermediate':
        return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
      case 'advanced':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-8"></div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(maxModules)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                Course Overview
              </h2>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Master institutional-grade trading with our comprehensive curriculum designed by professional traders
          </p>
          
          {/* Stats */}
          {showStats && (
            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedModules}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgressModules}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.earnedXP}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completionRate.toFixed(0)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
              </div>
            </div>
          )}

          {showViewAll && (
            <div className="flex justify-center">
              <Button asChild variant="secondary" className="group">
                <Link href="/course"> {/* TODO: wire to real course/curriculum page */}
                  View All Modules
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Module Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group"
          >
              {module.status === 'locked' ? (
                <Card className={`p-6 h-full ${getStatusColor(module.status)} transition-all duration-300 cursor-not-allowed opacity-75`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(module.status)}
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Locked
                      </span>
                    </div>
                    {module.difficulty && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {module.unlockCondition}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {module.xp} XP
                        </span>
                      </div>
                      {module.duration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {module.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <Link href={module.href || '#'} className="block">
                  <Card className={`p-6 h-full ${getStatusColor(module.status)} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group-hover:shadow-lg`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(module.status)}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {module.status === 'completed' ? 'Complete' : 
                           module.status === 'in_progress' ? `${module.progressPct}% Complete` : 'Not Started'}
                        </span>
                      </div>
                      {module.difficulty && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {module.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {module.description}
                    </p>
                    
                    {/* Progress Bar for in_progress modules */}
                    {module.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${module.progressPct}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          +{module.xp} XP
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {module.duration && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {module.duration}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action - Only show if showHeader is true */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ready to Start Your Trading Journey?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join 2,400+ traders who've transformed their psychology and achieved consistent profits through our neuroscience-backed curriculum.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/trading-dashboard">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/course"> {/* TODO: wire to real course page */}
                  View Full Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  Star,
  Clock,
  Award,
  TrendingUp,
  Users,
  Target
} from 'lucide-react'
import CourseModule from './CourseModule'
import { CourseModule as CourseModuleType, getCourseModules } from '@/lib/courseAdapter'

interface CourseSectionProps {
  showHeader?: boolean
  maxModules?: number
  showFilters?: boolean
  showStats?: boolean
}

export default function CourseSection({ 
  showHeader = true, 
  maxModules = 6, 
  showFilters = true,
  showStats = true 
}: CourseSectionProps) {
  const [modules, setModules] = useState<CourseModuleType[]>([])
  const [filteredModules, setFilteredModules] = useState<CourseModuleType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'progress' | 'difficulty' | 'xp' | 'title'>('progress')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'locked'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await getCourseModules()
        setModules(data.slice(0, maxModules))
        setFilteredModules(data.slice(0, maxModules))
      } catch (error) {
        console.error('Failed to load course modules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [maxModules])

  // Filter and sort modules
  useEffect(() => {
    let filtered = modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || module.status === filterStatus
      return matchesSearch && matchesStatus
    })

    // Sort modules
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progressPct - a.progressPct
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return (difficultyOrder[a.difficulty || 'beginner'] || 0) - (difficultyOrder[b.difficulty || 'beginner'] || 0)
        case 'xp':
          return b.xp - a.xp
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredModules(filtered)
  }, [modules, searchTerm, sortBy, filterStatus])

  const handleStartModule = (moduleId: string) => {
    // TODO: Implement module start logic
    console.log('Starting module:', moduleId)
  }

  const handleCompleteLesson = (moduleId: string, lessonId: string) => {
    // TODO: Implement lesson completion logic
    console.log('Completing lesson:', moduleId, lessonId)
  }

  // Calculate course statistics
  const courseStats = {
    totalModules: modules.length,
    completedModules: modules.filter(m => m.status === 'completed').length,
    inProgressModules: modules.filter(m => m.status === 'in_progress').length,
    totalXP: modules.reduce((sum, m) => sum + m.xp, 0),
    earnedXP: modules.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0),
    completionRate: modules.length > 0 ? (modules.filter(m => m.status === 'completed').length / modules.length) * 100 : 0
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
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
                Trading Course
              </h2>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Master institutional-grade trading with our comprehensive curriculum designed by professional traders
          </p>
        </motion.div>
      )}

      {/* Course Statistics */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.completedModules}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.inProgressModules}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.earnedXP}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.completionRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.totalXP}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
          </Card>
        </motion.div>
      )}

      {/* Filters and Search */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Modules</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="locked">Locked</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="progress">Sort by Progress</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="xp">Sort by XP</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Course Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}
      >
        {filteredModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <CourseModule
              module={module}
              onStartModule={handleStartModule}
              onCompleteLesson={handleCompleteLesson}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No modules found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchTerm('')
            setFilterStatus('all')
          }}>
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}

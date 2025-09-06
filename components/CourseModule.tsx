'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen, 
  Award,
  ArrowRight,
  Download,
  Star,
  Target,
  Brain,
  TrendingUp
} from 'lucide-react'

interface CourseModuleProps {
  module: {
    id: string
    title: string
    description: string
    progressPct: number
    xp: number
    status: 'completed' | 'in_progress' | 'locked'
    unlockCondition?: string
    href?: string
    thumbnail?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    lessons?: Array<{
      id: string
      title: string
      duration: string
      type: 'video' | 'reading' | 'quiz' | 'practice'
      completed: boolean
    }>
    resources?: Array<{
      id: string
      title: string
      type: 'pdf' | 'video' | 'worksheet'
      url: string
    }>
  }
  onStartModule?: (moduleId: string) => void
  onCompleteLesson?: (moduleId: string, lessonId: string) => void
}

export default function CourseModule({ module, onStartModule, onCompleteLesson }: CourseModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'in_progress':
        return <Play className="h-6 w-6 text-amber-600" />
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
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

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />
      case 'reading':
        return <BookOpen className="h-4 w-4" />
      case 'quiz':
        return <Target className="h-4 w-4" />
      case 'practice':
        return <Brain className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <Download className="h-4 w-4" />
      case 'video':
        return <Play className="h-4 w-4" />
      case 'worksheet':
        return <Award className="h-4 w-4" />
      default:
        return <Download className="h-4 w-4" />
    }
  }

  return (
    <Card className={`p-6 ${getStatusColor(module.status)} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(module.status)}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {module.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {module.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {module.difficulty && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {module.status === 'in_progress' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{module.progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${module.progressPct}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Module Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{module.duration || '2h 30m'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4" />
            <span>{module.xp} XP</span>
          </div>
          {module.lessons && (
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{module.lessons.length} lessons</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {module.status === 'locked' ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {module.unlockCondition}
            </div>
          ) : (
            <Button
              onClick={() => onStartModule?.(module.id)}
              className="group"
            >
              {module.status === 'completed' ? 'Review' : 'Start'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Lessons */}
          {module.lessons && module.lessons.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Lessons
              </h4>
              <div className="space-y-2">
                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      lesson.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        lesson.completed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          getLessonIcon(lesson.type)
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {lesson.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lesson.type} • {lesson.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {lesson.completed ? (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Completed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setActiveLesson(lesson.id)
                            onCompleteLesson?.(module.id, lesson.id)
                          }}
                        >
                          {activeLesson === lesson.id ? 'Active' : 'Start'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {module.resources && module.resources.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {resource.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module Description */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              What you'll learn:
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Master the core concepts and principles</li>
              <li>• Apply knowledge through practical exercises</li>
              <li>• Build confidence with real-world examples</li>
              <li>• Track your progress and earn XP</li>
            </ul>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

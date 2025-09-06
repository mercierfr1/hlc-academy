'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Star,
  Target,
  Brain,
  TrendingUp,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  progressPct: number
  xp: number
  status: 'completed' | 'in_progress' | 'locked'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  subsections: Array<{
    id: string
    title: string
    type: 'video' | 'reading' | 'practice' | 'quiz'
    duration: string
    completed: boolean
  }>
  endQuiz: {
    id: string
    title: string
    questions: number
    completed: boolean
  }
}

const modules: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1: Trading Psychology Fundamentals',
    description: 'Master the psychological edge required for consistent trading success.',
    progressPct: 100,
    xp: 400,
    status: 'completed',
    difficulty: 'beginner',
    duration: '2h 30m',
    subsections: [
      { id: '1-1', title: 'Understanding Market Psychology', type: 'video', duration: '15m', completed: true },
      { id: '1-2', title: 'Emotional Control Techniques', type: 'video', duration: '20m', completed: true },
      { id: '1-3', title: 'Risk Management Psychology', type: 'video', duration: '10m', completed: true },
      { id: '1-4', title: 'Building Trading Discipline', type: 'video', duration: '25m', completed: true }
    ],
    endQuiz: { id: 'quiz-1', title: 'Psychology Fundamentals Quiz', questions: 10, completed: true }
  },
  {
    id: 'module-2',
    title: 'Module 2: Technical Analysis Mastery',
    description: 'Learn to read charts like a professional trader.',
    progressPct: 75,
    xp: 500,
    status: 'in_progress',
    difficulty: 'intermediate',
    duration: '3h 15m',
    subsections: [
      { id: '2-1', title: 'Chart Patterns & Formations', type: 'video', duration: '25m', completed: true },
      { id: '2-2', title: 'Support & Resistance Levels', type: 'video', duration: '20m', completed: true },
      { id: '2-3', title: 'Moving Averages & Trends', type: 'video', duration: '18m', completed: true },
      { id: '2-4', title: 'Advanced Chart Analysis', type: 'video', duration: '30m', completed: false }
    ],
    endQuiz: { id: 'quiz-2', title: 'Technical Analysis Quiz', questions: 15, completed: false }
  },
  {
    id: 'module-3',
    title: 'Module 3: Risk Management Strategies',
    description: 'Protect your capital with institutional-grade risk management.',
    progressPct: 0,
    xp: 600,
    status: 'locked',
    difficulty: 'intermediate',
    duration: '2h 45m',
    subsections: [
      { id: '3-1', title: 'Position Sizing Fundamentals', type: 'video', duration: '20m', completed: false },
      { id: '3-2', title: 'Stop Loss Strategies', type: 'video', duration: '15m', completed: false },
      { id: '3-3', title: 'Portfolio Risk Assessment', type: 'video', duration: '12m', completed: false },
      { id: '3-4', title: 'Risk-Reward Optimization', type: 'video', duration: '25m', completed: false }
    ],
    endQuiz: { id: 'quiz-3', title: 'Risk Management Quiz', questions: 12, completed: false }
  },
  {
    id: 'module-4',
    title: 'Module 4: Advanced Trading Strategies',
    description: 'Master sophisticated trading approaches used by professionals.',
    progressPct: 0,
    xp: 800,
    status: 'locked',
    difficulty: 'advanced',
    duration: '4h 20m',
    subsections: [
      { id: '4-1', title: 'Scalping Techniques', type: 'video', duration: '30m', completed: false },
      { id: '4-2', title: 'Swing Trading Strategies', type: 'video', duration: '25m', completed: false },
      { id: '4-3', title: 'Algorithmic Trading Basics', type: 'video', duration: '35m', completed: false },
      { id: '4-4', title: 'Market Making Strategies', type: 'video', duration: '40m', completed: false }
    ],
    endQuiz: { id: 'quiz-4', title: 'Advanced Strategies Quiz', questions: 20, completed: false }
  }
]

export default function ContentSection() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

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

  const getDifficultyColor = (difficulty: string) => {
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

  const getSubsectionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'reading':
        return <FileText className="h-4 w-4" />
      case 'practice':
        return <Target className="h-4 w-4" />
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const totalModules = modules.length
  const completedModules = modules.filter(m => m.status === 'completed').length
  const inProgressModules = modules.filter(m => m.status === 'in_progress').length
  const totalXP = modules.reduce((sum, m) => sum + m.xp, 0)
  const earnedXP = modules.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0)

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
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
              Trading Content
            </h2>
          </div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Master institutional-grade trading with our comprehensive curriculum designed by professional traders
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedModules}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressModules}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{earnedXP}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalXP}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
        </Card>
      </motion.div>

      {/* All Course Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: moduleIndex * 0.1 }}
          >
            <Card className="p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              {/* Module Header */}
              <div className="flex items-center space-x-4 mb-6 w-full">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {module.description}
                  </p>
                </div>
              </div>

              {/* Individual Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {module.subsections.map((subsection, subIndex) => (
                <motion.div
                  key={subsection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (moduleIndex * 0.1) + (subIndex * 0.05) }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full ${
                      subsection.completed
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : module.status === 'locked'
                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-75'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    onClick={() => {
                      if (module.status !== 'locked') {
                        window.location.href = `/section/${subsection.id}`
                      }
                    }}
                  >
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-full ${
                          subsection.completed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                            : module.status === 'locked'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        }`}>
                          {subsection.completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            getSubsectionIcon(subsection.type)
                          )}
                        </div>
                        {module.status === 'locked' && (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {subsection.title}
                      </h4>
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{subsection.duration}</span>
                          </div>
                          <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {subsection.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.floor(module.xp / module.subsections.length)} XP
                            </span>
                          </div>
                          {subsection.completed ? (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                              Completed
                            </span>
                          ) : module.status === 'locked' ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Locked
                            </span>
                          ) : (
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              Start Learning
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {/* Module End Quiz Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (moduleIndex * 0.1) + (module.subsections.length * 0.05) }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full ${
                    module.endQuiz.completed
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : module.status === 'locked'
                      ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-75'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  onClick={() => {
                    if (module.status !== 'locked') {
                      window.location.href = `/section/${module.endQuiz.id}`
                    }
                  }}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full ${
                        module.endQuiz.completed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : module.status === 'locked'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      {module.status === 'locked' && (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {module.endQuiz.title}
                    </h4>
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="h-4 w-4" />
                          <span>{module.endQuiz.questions} questions</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                          Quiz
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.floor(module.xp * 0.2)} XP
                          </span>
                        </div>
                        {module.endQuiz.completed ? (
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Completed
                          </span>
                        ) : module.status === 'locked' ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Locked
                          </span>
                        ) : (
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Take Quiz
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

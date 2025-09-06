'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Quiz from '@/components/Quiz'
import { 
  ArrowLeft, 
  ArrowRight,
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Award,
  Video,
  FileText,
  Target,
  HelpCircle,
  Star,
  TrendingUp,
  Volume2
} from 'lucide-react'

interface VideoContent {
  id: string
  title: string
  duration: string
  thumbnail: string
  videoUrl: string
  completed: boolean
}

interface QuizData {
  id: string
  title: string
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
}

interface ModuleData {
  id: string
  title: string
  description: string
  progressPct: number
  xp: number
  status: 'completed' | 'in_progress' | 'locked'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  videos: VideoContent[]
  quizzes: QuizData[]
}

// Mock data for modules
const moduleData: { [key: string]: ModuleData } = {
  'module-1': {
    id: 'module-1',
    title: 'Module 1: Trading Psychology Fundamentals',
    description: 'Master the psychological edge required for consistent trading success.',
    progressPct: 100,
    xp: 400,
    status: 'completed',
    difficulty: 'beginner',
    duration: '2h 30m',
    videos: [
      {
        id: 'v1-1',
        title: 'Understanding Market Psychology',
        duration: '15:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video1',
        completed: true
      },
      {
        id: 'v1-2',
        title: 'Emotional Control Techniques',
        duration: '20:45',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video2',
        completed: true
      },
      {
        id: 'v1-3',
        title: 'Risk Management Psychology',
        duration: '18:20',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video3',
        completed: true
      },
      {
        id: 'v1-4',
        title: 'Building Trading Discipline',
        duration: '22:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video4',
        completed: true
      },
      {
        id: 'v1-5',
        title: 'Overcoming Fear and Greed',
        duration: '16:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video5',
        completed: true
      },
      {
        id: 'v1-6',
        title: 'Developing Patience in Trading',
        duration: '19:45',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video6',
        completed: true
      },
      {
        id: 'v1-7',
        title: 'Mental Models for Trading',
        duration: '21:10',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video7',
        completed: true
      },
      {
        id: 'v1-8',
        title: 'Creating Trading Routines',
        duration: '17:25',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video8',
        completed: true
      },
      {
        id: 'v1-9',
        title: 'Handling Trading Losses',
        duration: '23:40',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video9',
        completed: true
      },
      {
        id: 'v1-10',
        title: 'Building Confidence in Trading',
        duration: '20:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video10',
        completed: true
      }
    ],
    quizzes: [
      {
        id: 'quiz-1',
        title: 'Psychology Fundamentals Quiz 1',
        questions: [
          {
            id: 'q1',
            question: 'What is the most important psychological trait for successful trading?',
            options: ['Patience', 'Aggressiveness', 'Optimism', 'Pessimism'],
            correctAnswer: 0,
            explanation: 'Patience is crucial in trading as it allows you to wait for the right opportunities and avoid impulsive decisions.'
          },
          {
            id: 'q2',
            question: 'How should you handle a losing streak?',
            options: ['Increase position size', 'Take a break and review', 'Blame the market', 'Double down'],
            correctAnswer: 1,
            explanation: 'Taking a break and reviewing your strategy helps you maintain objectivity and avoid emotional trading.'
          }
        ]
      },
      {
        id: 'quiz-2',
        title: 'Psychology Fundamentals Quiz 2',
        questions: [
          {
            id: 'q3',
            question: 'What is the primary cause of most trading losses?',
            options: ['Bad market conditions', 'Emotional decisions', 'Lack of capital', 'Poor timing'],
            correctAnswer: 1,
            explanation: 'Emotional decisions often lead to poor risk management and impulsive trades that result in losses.'
          },
          {
            id: 'q4',
            question: 'When should you review your trading plan?',
            options: ['Only after losses', 'Regularly and after major market changes', 'Never', 'Only when profitable'],
            correctAnswer: 1,
            explanation: 'Regular review ensures your plan remains relevant and effective in current market conditions.'
          }
        ]
      }
    ]
  },
  'module-2': {
    id: 'module-2',
    title: 'Module 2: Technical Analysis Mastery',
    description: 'Learn to read charts like a professional trader.',
    progressPct: 75,
    xp: 500,
    status: 'in_progress',
    difficulty: 'intermediate',
    duration: '3h 15m',
    videos: [
      {
        id: 'v2-1',
        title: 'Chart Patterns & Formations',
        duration: '25:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video1',
        completed: true
      },
      {
        id: 'v2-2',
        title: 'Support & Resistance Levels',
        duration: '20:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video2',
        completed: true
      },
      {
        id: 'v2-3',
        title: 'Moving Averages & Trends',
        duration: '18:45',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video3',
        completed: true
      },
      {
        id: 'v2-4',
        title: 'Advanced Chart Analysis',
        duration: '30:20',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video4',
        completed: false
      },
      {
        id: 'v2-5',
        title: 'Volume Analysis',
        duration: '22:10',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video5',
        completed: false
      },
      {
        id: 'v2-6',
        title: 'Fibonacci Retracements',
        duration: '19:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video6',
        completed: false
      },
      {
        id: 'v2-7',
        title: 'Candlestick Patterns',
        duration: '24:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video7',
        completed: false
      },
      {
        id: 'v2-8',
        title: 'Technical Indicators',
        duration: '26:40',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video8',
        completed: false
      },
      {
        id: 'v2-9',
        title: 'Multi-Timeframe Analysis',
        duration: '21:25',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video9',
        completed: false
      },
      {
        id: 'v2-10',
        title: 'Chart Reading Practice',
        duration: '28:50',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video10',
        completed: false
      }
    ],
    quizzes: [
      {
        id: 'quiz-1',
        title: 'Technical Analysis Quiz 1',
        questions: [
          {
            id: 'q1',
            question: 'What does a head and shoulders pattern indicate?',
            options: ['Bullish continuation', 'Bearish reversal', 'Sideways movement', 'Volume increase'],
            correctAnswer: 1,
            explanation: 'The head and shoulders pattern is a classic bearish reversal pattern that signals a potential trend change.'
          }
        ]
      }
    ]
  }
}

interface ModulePageProps {
  params: {
    id: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [module, setModule] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundModule = moduleData[params.id]
      if (foundModule) {
        setModule(foundModule)
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleVideoClick = (video: VideoContent) => {
    setCurrentVideo(video)
    setShowQuiz(false)
  }

  const handleQuizClick = (quiz: QuizData) => {
    setCurrentQuiz(quiz)
    setShowQuiz(true)
    setCurrentVideo(null)
  }

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    console.log(`Quiz completed: ${score}/${totalQuestions}`)
    // TODO: Update progress and XP
  }

  const handleNextVideo = () => {
    if (!module) return
    const currentIndex = module.videos.findIndex(v => v.id === currentVideo?.id)
    if (currentIndex < module.videos.length - 1) {
      setCurrentVideo(module.videos[currentIndex + 1])
    }
  }

  const handlePrevVideo = () => {
    if (!module) return
    const currentIndex = module.videos.findIndex(v => v.id === currentVideo?.id)
    if (currentIndex > 0) {
      setCurrentVideo(module.videos[currentIndex - 1])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Module Not Found
          </h1>
          <Button asChild>
            <Link href="/trading-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/trading-dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {module.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {module.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {module.progressPct}% Complete
                </div>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${module.progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentVideo ? (
          /* Video Player */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
                    <p className="text-gray-300">{currentVideo.duration}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 rounded-lg p-3">
                    <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
                      <div className="bg-white h-1 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>5:30 / {currentVideo.duration}</span>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Play className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Navigation */}
            <div className="flex justify-between">
              <Button 
                onClick={handlePrevVideo}
                disabled={module.videos.findIndex(v => v.id === currentVideo.id) === 0}
                variant="secondary"
              >
                Previous Video
              </Button>
              <Button 
                onClick={handleNextVideo}
                disabled={module.videos.findIndex(v => v.id === currentVideo.id) === module.videos.length - 1}
              >
                Next Video
              </Button>
            </div>
          </motion.div>
        ) : showQuiz && currentQuiz ? (
          /* Quiz */
          <Quiz
            questions={currentQuiz.questions}
            onComplete={handleQuizComplete}
            onNext={() => setShowQuiz(false)}
            title={currentQuiz.title}
          />
        ) : (
          /* Video List */
          <div className="space-y-6">
            {/* Module Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {module.videos.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {module.videos.filter(v => v.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {module.quizzes.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {module.xp}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP Available</div>
              </Card>
            </div>

            {/* Videos Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {module.videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        video.completed ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : ''
                      }`}
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-gray-600 dark:text-gray-400">
                            <Play className="h-12 w-12 mx-auto mb-2" />
                            <span className="text-sm">{video.duration}</span>
                          </div>
                        </div>
                        {video.completed && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{video.duration}</span>
                          {video.completed && (
                            <span className="text-green-600 font-medium">Completed</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quizzes */}
            {module.quizzes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Course Quizzes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {module.quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (module.videos.length + index) * 0.1 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg"
                        onClick={() => handleQuizClick(quiz)}
                      >
                        <div className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                              <HelpCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {quiz.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {quiz.questions.length} questions
                          </p>
                          <Button className="w-full">
                            Take Quiz
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

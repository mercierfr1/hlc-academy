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
  Volume2,
  ChevronLeft,
  ChevronRight
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

interface SectionData {
  id: string
  title: string
  description: string
  moduleTitle: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp: number
  videos: VideoContent[]
  quizzes: QuizData[]
  subsectionQuiz: QuizData
}

// Mock data for sections
const sectionData: { [key: string]: SectionData } = {
  '1-1': {
    id: '1-1',
    title: 'Understanding Market Psychology',
    description: 'Learn the fundamental psychological principles that drive market behavior and how to use them to your advantage.',
    moduleTitle: 'Module 1: Trading Psychology Fundamentals',
    difficulty: 'beginner',
    xp: 100,
    videos: [
      {
        id: 'v1-1-1',
        title: 'Introduction to Market Psychology',
        duration: '8:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video1',
        completed: true
      },
      {
        id: 'v1-1-2',
        title: 'Fear and Greed in Markets',
        duration: '12:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video2',
        completed: true
      },
      {
        id: 'v1-1-3',
        title: 'Herd Mentality and Contrarian Thinking',
        duration: '10:45',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video3',
        completed: true
      },
      {
        id: 'v1-1-4',
        title: 'Cognitive Biases in Trading',
        duration: '14:20',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video4',
        completed: true
      },
      {
        id: 'v1-1-5',
        title: 'Market Sentiment Indicators',
        duration: '11:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video5',
        completed: true
      },
      {
        id: 'v1-1-6',
        title: 'Psychology of Price Action',
        duration: '13:25',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video6',
        completed: true
      },
      {
        id: 'v1-1-7',
        title: 'Emotional Intelligence in Trading',
        duration: '9:40',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video7',
        completed: true
      },
      {
        id: 'v1-1-8',
        title: 'Building Mental Resilience',
        duration: '16:10',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video8',
        completed: true
      },
      {
        id: 'v1-1-9',
        title: 'Psychology of Risk Management',
        duration: '12:55',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video9',
        completed: true
      },
      {
        id: 'v1-1-10',
        title: 'Advanced Psychological Strategies',
        duration: '15:35',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video10',
        completed: true
      }
    ],
    quizzes: [
      {
        id: 'quiz-1-1-1',
        title: 'Market Psychology Quiz 1',
        questions: [
          {
            id: 'q1',
            question: 'What is the primary emotion that drives market bubbles?',
            options: ['Fear', 'Greed', 'Anger', 'Sadness'],
            correctAnswer: 1,
            explanation: 'Greed is the primary emotion that drives market bubbles as investors become overly optimistic and chase rising prices.'
          },
          {
            id: 'q2',
            question: 'Which cognitive bias causes traders to hold losing positions too long?',
            options: ['Confirmation bias', 'Loss aversion', 'Anchoring bias', 'Availability heuristic'],
            correctAnswer: 1,
            explanation: 'Loss aversion causes traders to hold losing positions too long because the pain of realizing a loss is psychologically stronger than the pleasure of a gain.'
          }
        ]
      },
      {
        id: 'quiz-1-1-2',
        title: 'Market Psychology Quiz 2',
        questions: [
          {
            id: 'q3',
            question: 'What is herd mentality in trading?',
            options: ['Following the crowd', 'Independent thinking', 'Risk management', 'Technical analysis'],
            correctAnswer: 0,
            explanation: 'Herd mentality refers to the tendency of individuals to follow the actions of a larger group, often leading to market bubbles and crashes.'
          }
        ]
      }
    ],
    subsectionQuiz: {
      id: 'subsection-quiz-1-1',
      title: 'Understanding Market Psychology - Final Quiz',
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
        },
        {
          id: 'q3',
          question: 'What is the primary cause of most trading losses?',
          options: ['Bad market conditions', 'Emotional decisions', 'Lack of capital', 'Poor timing'],
          correctAnswer: 1,
          explanation: 'Emotional decisions often lead to poor risk management and impulsive trades that result in losses.'
        }
      ]
    }
  },
  '1-2': {
    id: '1-2',
    title: 'Emotional Control Techniques',
    description: 'Master the art of emotional control and develop the mental discipline needed for consistent trading success.',
    moduleTitle: 'Module 1: Trading Psychology Fundamentals',
    difficulty: 'beginner',
    xp: 100,
    videos: [
      {
        id: 'v1-2-1',
        title: 'Recognizing Emotional Triggers',
        duration: '9:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video1',
        completed: true
      },
      {
        id: 'v1-2-2',
        title: 'Breathing and Relaxation Techniques',
        duration: '11:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video2',
        completed: true
      },
      {
        id: 'v1-2-3',
        title: 'Mindfulness in Trading',
        duration: '13:45',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video3',
        completed: true
      },
      {
        id: 'v1-2-4',
        title: 'Managing Trading Anxiety',
        duration: '10:20',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video4',
        completed: true
      },
      {
        id: 'v1-2-5',
        title: 'Building Emotional Resilience',
        duration: '14:10',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video5',
        completed: true
      },
      {
        id: 'v1-2-6',
        title: 'Pre-Trading Mental Preparation',
        duration: '8:55',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video6',
        completed: true
      },
      {
        id: 'v1-2-7',
        title: 'Post-Trading Reflection',
        duration: '12:25',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video7',
        completed: true
      },
      {
        id: 'v1-2-8',
        title: 'Developing Patience',
        duration: '15:40',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video8',
        completed: true
      },
      {
        id: 'v1-2-9',
        title: 'Overcoming Fear of Missing Out',
        duration: '11:15',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video9',
        completed: true
      },
      {
        id: 'v1-2-10',
        title: 'Advanced Emotional Control',
        duration: '16:30',
        thumbnail: '/api/placeholder/400/225',
        videoUrl: '/api/placeholder/video10',
        completed: true
      }
    ],
    quizzes: [
      {
        id: 'quiz-1-2-1',
        title: 'Emotional Control Quiz 1',
        questions: [
          {
            id: 'q1',
            question: 'What is the first step in managing trading emotions?',
            options: ['Ignore them', 'Recognize them', 'Suppress them', 'Avoid trading'],
            correctAnswer: 1,
            explanation: 'The first step in managing trading emotions is to recognize and acknowledge them, not ignore or suppress them.'
          }
        ]
      }
    ],
    subsectionQuiz: {
      id: 'subsection-quiz-1-2',
      title: 'Emotional Control Techniques - Final Quiz',
      questions: [
        {
          id: 'q1',
          question: 'What is the most effective way to control trading emotions?',
          options: ['Suppression', 'Recognition and management', 'Avoidance', 'Medication'],
          correctAnswer: 1,
          explanation: 'Recognition and management of emotions is more effective than suppression or avoidance.'
        }
      ]
    }
  }
}

interface SectionPageProps {
  params: {
    id: string
  }
}

export default function SectionPage({ params }: SectionPageProps) {
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [section, setSection] = useState<SectionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundSection = sectionData[params.id]
      if (foundSection) {
        setSection(foundSection)
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleVideoClick = (video: VideoContent, index: number) => {
    setCurrentVideo(video)
    setCurrentVideoIndex(index)
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
    if (!section) return
    if (currentVideoIndex < section.videos.length - 1) {
      const nextIndex = currentVideoIndex + 1
      setCurrentVideo(section.videos[nextIndex])
      setCurrentVideoIndex(nextIndex)
    }
  }

  const handlePrevVideo = () => {
    if (!section) return
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1
      setCurrentVideo(section.videos[prevIndex])
      setCurrentVideoIndex(prevIndex)
    }
  }

  const handleVideoComplete = () => {
    if (!section) return
    // Mark video as completed
    console.log(`Video ${currentVideo?.id} completed`)
    
    // Show quiz after video (if not the last video)
    if (currentVideoIndex < section.videos.length - 1) {
      const quizIndex = Math.floor(currentVideoIndex / 2) // Quiz every 2 videos
      if (quizIndex < section.quizzes.length) {
        setTimeout(() => {
          handleQuizClick(section.quizzes[quizIndex])
        }, 1000)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Section Not Found
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
                  {section.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {section.moduleTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {section.videos.filter(v => v.completed).length}/{section.videos.length} Videos
                </div>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(section.videos.filter(v => v.completed).length / section.videos.length) * 100}%` }}
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
                disabled={currentVideoIndex === 0}
                variant="secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Video
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Video {currentVideoIndex + 1} of {section.videos.length}
                </span>
                <Button onClick={handleVideoComplete} variant="secondary">
                  Mark as Complete
                </Button>
              </div>
              <Button 
                onClick={handleNextVideo}
                disabled={currentVideoIndex === section.videos.length - 1}
              >
                Next Video
                <ChevronRight className="h-4 w-4 ml-2" />
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
          <div className="space-y-8">
            {/* Section Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{section.videos.reduce((acc, v) => acc + parseInt(v.duration), 0)} min total</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{section.xp} XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>{section.videos.length} videos</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {section.videos.filter(v => v.completed).length}/{section.videos.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Videos Completed
                  </div>
                </div>
              </div>
            </Card>

            {/* Videos Grid */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Course Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.videos.map((video, index) => (
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
                      onClick={() => handleVideoClick(video, index)}
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
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {video.title}
                        </h4>
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

            {/* Quizzes Between Videos */}
            {section.quizzes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Progress Quizzes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.quizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (section.videos.length + index) * 0.1 }}
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
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {quiz.title}
                            </h4>
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

            {/* Subsection Final Quiz */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Section Final Quiz
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (section.videos.length + section.quizzes.length) * 0.1 }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  onClick={() => handleQuizClick(section.subsectionQuiz)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                        <Target className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {section.subsectionQuiz.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {section.subsectionQuiz.questions.length} questions • Complete this quiz to finish the section
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor(section.xp * 0.3)} XP
                        </span>
                      </div>
                      <Button>
                        Take Final Quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

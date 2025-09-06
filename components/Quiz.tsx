'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  Star,
  Clock
} from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizProps {
  questions: Question[]
  onComplete: (score: number, totalQuestions: number) => void
  onNext?: () => void
  title?: string
  showProgress?: boolean
}

export default function Quiz({ 
  questions, 
  onComplete, 
  onNext,
  title = "Quiz",
  showProgress = true 
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQ.correctAnswer
    const newScore = isCorrect ? score + 1 : score
    setScore(newScore)
    setAnswers([...answers, selectedAnswer])
    setShowResult(true)

    if (currentQuestion === questions.length - 1) {
      setTimeout(() => {
        setIsCompleted(true)
        onComplete(newScore, questions.length)
      }, 2000)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else if (onNext) {
      onNext()
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setIsCompleted(false)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent! You have a deep understanding of this topic.'
    if (percentage >= 80) return 'Great job! You understand the material well.'
    if (percentage >= 60) return 'Good effort! Consider reviewing some concepts.'
    return 'Keep studying! Review the material and try again.'
  }

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {title}
            </p>
          </div>

          <div className="mb-6">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {score}/{questions.length}
            </div>
            <div className={`text-xl font-semibold mb-2 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {getScoreMessage(percentage)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRestart} variant="secondary">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
            {onNext && (
              <Button onClick={onNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          {showProgress && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {Math.round((questions.length - currentQuestion) * 2)} min left
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {currentQ.question}
          </h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 "
              
              if (showResult) {
                if (index === currentQ.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                } else {
                  buttonClass += "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                }
              } else {
                buttonClass += selectedAnswer === index
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-white"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === currentQ.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Explanation:
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {currentQ.explanation}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Score: {score}/{currentQuestion + 1}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {!showResult ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

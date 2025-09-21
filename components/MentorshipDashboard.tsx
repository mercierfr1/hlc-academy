'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Calendar as CalendarIcon,
  Play,
  Clock,
  Users,
  Target,
  FileText,
  BookOpen,
  TrendingUp,
  Bell,
  CheckCircle,
  Star,
  Download,
  MessageCircle,
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Video,
  Mic,
  Headphones,
  FileImage,
  Link,
  Award,
  BarChart3,
  Settings,
  Search,
  Filter,
  Plus,
  ExternalLink,
  X,
  MessageSquare
} from 'lucide-react'

interface Call {
  id: string
  title: string
  date: string
  time: string
  type: 'live' | 'recording'
  duration: string
  attendees: number
  status: 'upcoming' | 'live' | 'completed'
  agenda: string[]
  thumbnail?: string
}

interface Recording {
  id: string
  title: string
  date: string
  duration: string
  thumbnail: string
  summary: string
  views: number
  rating: number
}

interface Task {
  id: string
  title: string
  dueDate: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
}

interface EconomicEvent {
  id: string
  title: string
  impact: 'high' | 'medium' | 'low'
  time: string
  currency: string
}

export default function MentorshipDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [activeTab, setActiveTab] = useState<'recordings' | 'notes' | 'resources'>('recordings')
  const [showSidebar, setShowSidebar] = useState(true)
  const [showEconomicTicker, setShowEconomicTicker] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState('')
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState('')
  const [newReminderUrgent, setNewReminderUrgent] = useState(false)

  // Mock data - in real implementation, this would come from API
  const [upcomingCalls] = useState<Call[]>([
    {
      id: '1',
      title: 'Weekly Market Analysis & Q&A',
      date: '2024-01-22',
      time: '18:00',
      type: 'live',
      duration: '60 min',
      attendees: 24,
      status: 'upcoming',
      agenda: ['Market Overview', 'Technical Analysis', 'Q&A Session', 'Next Week Preview']
    },
    {
      id: '2',
      title: 'Advanced Risk Management',
      date: '2024-01-25',
      time: '19:00',
      type: 'live',
      duration: '90 min',
      attendees: 0,
      status: 'upcoming',
      agenda: ['Risk Metrics', 'Position Sizing', 'Stop Loss Strategies', 'Portfolio Protection']
    }
  ])

  const [recordings] = useState<Recording[]>([
    {
      id: '1',
      title: 'Forex Fundamentals Masterclass',
      date: '2024-01-15',
      duration: '45 min',
      thumbnail: '/api/placeholder/300/200',
      summary: 'Deep dive into currency markets, central bank policies, and economic indicators.',
      views: 156,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Technical Analysis Deep Dive',
      date: '2024-01-12',
      duration: '52 min',
      thumbnail: '/api/placeholder/300/200',
      summary: 'Advanced chart patterns, support/resistance, and trend analysis techniques.',
      views: 203,
      rating: 4.9
    }
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Risk Management Worksheet',
      dueDate: '2024-01-23',
      completed: false,
      priority: 'high',
      category: 'Assignments'
    },
    {
      id: '2',
      title: 'Watch Recording: Market Psychology',
      dueDate: '2024-01-25',
      completed: true,
      priority: 'medium',
      category: 'Learning'
    },
    {
      id: '3',
      title: 'Prepare Questions for Next Call',
      dueDate: '2024-01-22',
      completed: false,
      priority: 'medium',
      category: 'Preparation'
    }
  ])

  const [economicEvents] = useState<EconomicEvent[]>([
    { id: '1', title: 'USD CPI Data', impact: 'high', time: '13:30', currency: 'USD' },
    { id: '2', title: 'EUR ECB Rate Decision', impact: 'high', time: '12:45', currency: 'EUR' },
    { id: '3', title: 'GBP Retail Sales', impact: 'medium', time: '09:30', currency: 'GBP' },
    { id: '4', title: 'JPY GDP Release', impact: 'medium', time: '23:50', currency: 'JPY' }
  ])

  const progressStats = {
    callsAttended: 12,
    totalCalls: 15,
    goalsCompleted: 8,
    totalGoals: 10,
    recordingsWatched: 24,
    totalRecordings: 30
  }

  // Calendar logic
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const hasCall = upcomingCalls.some(call => call.date === dateStr)
      
      days.push({
        date,
        dateStr,
        isCurrentMonth: date.getMonth() === month,
        hasCall
      })
    }
    return days
  }

  const nextCall = upcomingCalls[0]

  // Interactive functions
  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        completed: false,
        priority: 'medium',
        category: 'Personal'
      }
      setTasks([...tasks, task])
      setNewTask('')
      setShowAddTask(false)
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const submitPoll = () => {
    if (selectedPoll) {
      alert(`Thank you for voting: ${selectedPoll}`)
      setSelectedPoll('')
    }
  }

  const addReminder = () => {
    if (newReminder.trim()) {
      // In a real app, this would save to database
      alert(`Reminder added: ${newReminder}`)
      setNewReminder('')
      setNewReminderUrgent(false)
      setShowAddReminder(false)
    }
  }

  const connectAccountabilityPartner = () => {
    alert('Accountability Partner matching system would open here. This feature connects you with other traders for mutual support and motivation.')
  }

  const joinQASession = () => {
    alert('Q&A Session would open here. This would connect you to the live weekly market analysis Q&A session where you can ask questions about trading setups and market outlook.')
  }

  const quickAdd = () => {
    const options = ['Task', 'Reminder', 'Note', 'Goal']
    const choice = prompt(`What would you like to add?\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`)
    
    if (choice) {
      const index = parseInt(choice) - 1
      if (index >= 0 && index < options.length) {
        const item = prompt(`Enter your ${options[index].toLowerCase()}:`)
        if (item) {
          alert(`${options[index]} added: ${item}`)
        }
      }
    }
  }

  const exportData = () => {
    const data = {
      upcomingCalls,
      recordings,
      tasks,
      economicEvents,
      progressStats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mentorship-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Premium Mentorship
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Users className="w-4 h-4" />
                <span>24 Active Members</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="hidden lg:flex"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={quickAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'lg:mr-72' : ''}`}>
          <div className="p-6 space-y-6">
            {/* Calendar Section */}
            <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Schedule</h2>
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === 'month' 
                          ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === 'week' 
                          ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Week
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white min-w-[200px] text-center">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {generateCalendarDays().map((day, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`min-h-[100px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all duration-200 ${
                      !day.isCurrentMonth ? 'opacity-30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    } ${day.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        day.isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                      }`}>
                        {day.date.getDate()}
                      </span>
                      {day.hasCall && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    {day.hasCall && (
                      <div className="space-y-1">
                        {upcomingCalls.filter(call => call.date === day.dateStr).map(call => (
                          <div
                            key={call.id}
                            className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 truncate"
                          >
                            {call.time} - {call.title.split(' ').slice(0, 2).join(' ')}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Content Hub */}
            <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Content Hub</h2>
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  {(['recordings', 'notes', 'resources'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
                        activeTab === tab 
                          ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'recordings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recordings.map((recording) => (
                        <motion.div
                          key={recording.id}
                          whileHover={{ scale: 1.02 }}
                          className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200"
                        >
                          <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {recording.duration}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                              {recording.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {recording.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{recording.views} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{recording.rating}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      {[
                        { title: 'Market Psychology Notes', date: '2024-01-15', preview: 'Key insights on trader psychology and emotional control...' },
                        { title: 'Risk Management Summary', date: '2024-01-12', preview: 'Position sizing formulas and stop-loss strategies...' },
                        { title: 'Technical Analysis Cheat Sheet', date: '2024-01-10', preview: 'Chart patterns and support/resistance levels...' }
                      ].map((note, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {note.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {note.preview}
                              </p>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {note.date}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: 'Trading Psychology Guide', type: 'PDF', icon: FileText },
                        { title: 'Risk Management Template', type: 'Excel', icon: BarChart3 },
                        { title: 'Market Analysis Checklist', type: 'PDF', icon: CheckCircle },
                        { title: 'Economic Calendar', type: 'Link', icon: CalendarIcon }
                      ].map((resource, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all duration-200"
                        >
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <resource.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            {resource.type}
                          </p>
                          <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>

            {/* Engagement Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Tracker */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Calls Attended</span>
                      <span className="text-slate-900 dark:text-white">{progressStats.callsAttended}/{progressStats.totalCalls}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(progressStats.callsAttended / progressStats.totalCalls) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Goals Completed</span>
                      <span className="text-slate-900 dark:text-white">{progressStats.goalsCompleted}/{progressStats.totalGoals}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(progressStats.goalsCompleted / progressStats.totalGoals) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Recordings Watched</span>
                      <span className="text-slate-900 dark:text-white">{progressStats.recordingsWatched}/{progressStats.totalRecordings}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(progressStats.recordingsWatched / progressStats.totalRecordings) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Weekly Poll */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Weekly Poll</h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    What's your biggest trading challenge this week?
                  </p>
                  <div className="space-y-2">
                    {['Risk Management', 'Market Analysis', 'Psychology', 'Execution'].map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="poll" 
                          value={option}
                          checked={selectedPoll === option}
                          onChange={(e) => setSelectedPoll(e.target.value)}
                          className="text-blue-500" 
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{option}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={submitPoll}
                    disabled={!selectedPoll}
                  >
                    Submit Vote
                  </Button>
                </div>
              </Card>

              {/* Weekly Market Analysis & Q&A */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Weekly Market Analysis & Q&A</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Market Outlook</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Updated every Monday</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">This Week's Focus</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        EUR/USD consolidation pattern, watch for breakout above 1.0850 resistance
                      </p>
                    </div>
                    
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Key Events</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Wed 14:30</span>
                          <span className="text-slate-700 dark:text-slate-300">US CPI Data</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Thu 12:45</span>
                          <span className="text-slate-700 dark:text-slate-300">ECB Rate Decision</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-900 dark:text-white">Q&A Session</h5>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                      Ask questions about this week's analysis or your trading setup
                    </p>
                    <Button size="sm" variant="secondary" className="w-full" onClick={joinQASession}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Q&A
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Accountability Partner */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Connect</h3>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Find an accountability partner to stay motivated
                    </p>
                    <Button size="sm" variant="secondary" onClick={connectAccountabilityPartner}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Connect Now
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Economic Events Ticker */}
            {showEconomicTicker && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white py-2 px-4 z-50"
              >
                <div className="flex items-center space-x-6 overflow-x-auto">
                  <div className="flex items-center space-x-2 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Economic Events</span>
                  </div>
                  <div className="flex items-center space-x-8">
                    {economicEvents.map((event, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm whitespace-nowrap">
                        <span className={`w-2 h-2 rounded-full ${
                          event.impact === 'high' ? 'bg-red-400' : 
                          event.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}></span>
                        <span>{event.currency}</span>
                        <span>{event.title}</span>
                        <span className="text-slate-400">{event.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed right-0 top-0 h-full w-72 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 p-4 overflow-y-auto z-30"
          >
            {/* Next Call */}
            {nextCall && (
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Next Call</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {nextCall.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(nextCall.date).toLocaleDateString()}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{nextCall.time}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Agenda:</p>
                  {nextCall.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-4">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </Card>
            )}

            {/* Quick Reminders */}
            <Card className="p-4 border-0 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Reminders</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              {showAddReminder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <input
                    type="text"
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    placeholder="Add reminder..."
                    className="w-full text-xs px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={newReminderUrgent}
                        onChange={(e) => setNewReminderUrgent(e.target.checked)}
                        className="rounded"
                      />
                      <span>Urgent</span>
                    </label>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" onClick={addReminder} className="h-6 px-2 text-xs">
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowAddReminder(false)} className="h-6 px-2 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-3">
                {[
                  { text: 'Submit weekly trading journal', urgent: true },
                  { text: 'Review market analysis notes', urgent: false },
                  { text: 'Prepare questions for next call', urgent: false }
                ].map((reminder, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${reminder.urgent ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                    <span className={`text-xs ${reminder.urgent ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {reminder.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Personal To-Do */}
            <Card className="p-4 border-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">To-Do List</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              {showAddTask && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                    className="w-full text-xs px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <div className="flex justify-end space-x-1">
                    <Button size="sm" variant="ghost" onClick={addTask} className="h-6 px-2 text-xs">
                      Add
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddTask(false)} className="h-6 px-2 text-xs">
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors group ${
                      task.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600/50'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className={`w-4 h-4 transition-colors ${
                        task.completed ? 'text-green-500' : 'text-slate-400 hover:text-green-500'
                      }`} />
                    </button>
                    <span className={`text-xs flex-1 cursor-pointer ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {task.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

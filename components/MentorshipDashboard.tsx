'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ListTodo,
  Bell, 
  Video, 
  FileText, 
  Folder, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Award, 
  BarChart2, 
  Clock, 
  CheckCircle, 
  Target, 
  BookOpen, 
  Zap, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  UserPlus, 
  Globe, 
  Trophy,
  Settings,
  Plus,
  X,
  Play,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingDown,
  Activity,
  CalendarDays,
  UserCheck,
  FileVideo,
  Brain,
  Lightbulb
} from 'lucide-react'

interface Call {
  id: string
  title: string
  date: string
  time: string
  type: 'live' | 'recorded'
  agenda: string[]
  attendees: number
  status: 'upcoming' | 'live' | 'completed'
}

interface Recording {
  id: string
  title: string
  summary: string
  duration: string
  thumbnail: string
  date: string
  views: number
}

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
}

interface Reminder {
  id: string
  text: string
  urgent: boolean
  time?: string
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
  const [newTask, setNewTask] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState('')
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState('')
  const [newReminderUrgent, setNewReminderUrgent] = useState(false)

  // Mock data
  const upcomingCalls: Call[] = [
    {
      id: '1',
      title: 'Weekly Market Analysis & Strategy Session',
      date: '2025-09-23',
      time: '2:00 PM GMT',
      type: 'live',
      agenda: ['Market Overview', 'Key Levels Analysis', 'Risk Management', 'Q&A Session'],
      attendees: 24,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Advanced Psychology Workshop',
      date: '2025-09-25',
      time: '7:00 PM GMT',
      type: 'live',
      agenda: ['Trading Psychology', 'Bias Recognition', 'Emotional Control', 'Case Studies'],
      attendees: 18,
      status: 'upcoming'
    }
  ]

  const recordings: Recording[] = [
    {
      id: '1',
      title: 'Supply & Demand Masterclass',
      summary: 'Deep dive into institutional supply and demand zones with live chart analysis.',
      duration: '45 min',
      thumbnail: '/api/placeholder/300/200',
      date: '2025-09-20',
      views: 156
    },
    {
      id: '2',
      title: 'Risk Management Fundamentals',
      summary: 'Essential risk management techniques for consistent profitability.',
      duration: '32 min',
      thumbnail: '/api/placeholder/300/200',
      date: '2025-09-18',
      views: 203
    },
    {
      id: '3',
      title: 'Market Structure Analysis',
      summary: 'Understanding market structure and order flow for better entries.',
      duration: '38 min',
      thumbnail: '/api/placeholder/300/200',
      date: '2025-09-15',
      views: 189
    }
  ]

  const tasks: Task[] = [
    { id: '1', title: 'Review EUR/USD analysis from last session', completed: false, priority: 'high', dueDate: '2025-09-23' },
    { id: '2', title: 'Complete trading psychology assessment', completed: true, priority: 'medium' },
    { id: '3', title: 'Practice risk management scenarios', completed: false, priority: 'high' },
    { id: '4', title: 'Watch latest market structure recording', completed: false, priority: 'low' }
  ]

  const reminders: Reminder[] = [
    { id: '1', text: 'Submit weekly trading journal', urgent: true, time: 'Today 5 PM' },
    { id: '2', text: 'Prepare questions for next call', urgent: false, time: 'Tomorrow 10 AM' },
    { id: '3', text: 'Review economic calendar', urgent: false }
  ]

  const economicEvents: EconomicEvent[] = [
    { id: '1', title: 'US CPI Data', impact: 'high', time: '13:30 GMT', currency: 'USD' },
    { id: '2', title: 'ECB Interest Rate Decision', impact: 'high', time: '14:45 GMT', currency: 'EUR' },
    { id: '3', title: 'UK Retail Sales', impact: 'medium', time: '09:30 GMT', currency: 'GBP' },
    { id: '4', title: 'JPY Consumer Confidence', impact: 'low', time: '05:00 GMT', currency: 'JPY' }
  ]

  const progressStats = {
    callsAttended: 12,
    totalCalls: 16,
    goalsCompleted: 8,
    totalGoals: 12,
    recordingsWatched: 24,
    totalRecordings: 30
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const nextCall = upcomingCalls[0]

  const toggleTask = (id: string) => {
    // In a real app, this would update the database
    console.log('Toggle task:', id)
  }

  const deleteTask = (id: string) => {
    // In a real app, this would delete from database
    console.log('Delete task:', id)
  }

  const addTask = () => {
    if (newTask.trim()) {
      // In a real app, this would add to database
      console.log('Add task:', newTask)
      setNewTask('')
      setShowAddTask(false)
    }
  }

  const addReminder = () => {
    if (newReminder.trim()) {
      // In a real app, this would add to database
      console.log('Add reminder:', newReminder)
      setNewReminder('')
      setNewReminderUrgent(false)
      setShowAddReminder(false)
    }
  }

  const quickAdd = () => {
    setShowAddTask(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Premium Mentorship</h1>
                <p className="text-sm text-slate-400">24 Active Members • Elite Trading Program</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button size="sm" onClick={quickAdd} className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8 mt-4">
            {['Calendar', 'Weekly Calls', 'Recordings', 'Tasks', 'Resources', 'Journal', 'Progress'].map((item) => (
              <button
                key={item}
                className="text-sm font-medium text-slate-400 hover:text-yellow-400 transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Next Call Agenda */}
          {nextCall && (
            <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Next Call</h3>
                  <p className="text-sm text-blue-400">Live Session</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white">
                  {nextCall.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(nextCall.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{nextCall.time}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-300">Agenda:</p>
                  {nextCall.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Join Live Call
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Reminders */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Quick Reminders</h3>
                  <p className="text-sm text-slate-400">Important tasks</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddReminder(!showAddReminder)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {showAddReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-slate-700/50 rounded-lg"
              >
                <input
                  type="text"
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="Add reminder..."
                  className="w-full text-sm px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white mb-2"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={newReminderUrgent}
                      onChange={(e) => setNewReminderUrgent(e.target.checked)}
                      className="rounded"
                    />
                    <span>Urgent</span>
                  </label>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={addReminder} className="h-7 px-3 text-sm">
                      Add
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddReminder(false)} className="h-7 px-3 text-sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="space-y-3">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${reminder.urgent ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                  <div className="flex-1">
                    <span className={`text-sm ${reminder.urgent ? 'text-red-400' : 'text-slate-400'}`}>
                      {reminder.text}
                    </span>
                    {reminder.time && (
                      <p className="text-xs text-slate-500 mt-1">{reminder.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* To-Do List */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">To-Do List</h3>
                  <p className="text-sm text-slate-400">Personal tasks</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddTask(!showAddTask)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {showAddTask && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-slate-700/50 rounded-lg"
              >
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add new task..."
                  className="w-full text-sm px-3 py-2 border border-slate-600 rounded bg-slate-800 text-white mb-2"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="ghost" onClick={addTask} className="h-7 px-3 text-sm">
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddTask(false)} className="h-7 px-3 text-sm">
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                    task.completed ? 'bg-green-900/20' : 'bg-slate-700/50 hover:bg-slate-600/50'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className={`w-5 h-5 transition-colors ${
                      task.completed ? 'text-green-500' : 'text-slate-400 hover:text-green-500'
                    }`} />
                  </button>
                  <span className={`text-sm flex-1 ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-300'
                  }`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-green-900/30 text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Calendar Section */}
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">{getMonthName(currentDate)}</h2>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={viewMode === 'month' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('month')}
                  className="text-xs"
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'week' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('week')}
                  className="text-xs"
                >
                  Week
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-400">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`p-3 text-center text-sm rounded-lg transition-colors ${
                    day
                      ? 'text-slate-300 hover:bg-slate-700/50 cursor-pointer'
                      : ''
                  }`}
                >
                  {day && (
                    <div className="flex flex-col items-center space-y-1">
                      <span>{day.getDate()}</span>
                      {/* Show call indicators */}
                      {upcomingCalls.some(call => {
                        const callDate = new Date(call.date)
                        return callDate.getDate() === day.getDate() && 
                               callDate.getMonth() === day.getMonth() &&
                               callDate.getFullYear() === day.getFullYear()
                      }) && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Content Hub */}
        <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Content Hub</h2>
            <div className="flex items-center space-x-2">
              {['recordings', 'notes', 'resources'].map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? 'primary' : 'ghost'}
                  onClick={() => setActiveTab(tab as any)}
                  className="capitalize"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'recordings' && (
              <motion.div
                key="recordings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recordings.map((recording) => (
                  <Card key={recording.id} className="bg-slate-700/30 border-slate-600 overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                          <Play className="w-8 h-8 text-yellow-400 ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                        {recording.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2">{recording.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{recording.summary}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{recording.date}</span>
                        <span>{recording.views} views</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {[
                  { title: 'Market Structure Analysis Notes', preview: 'Key insights from the latest market structure session...', date: '2025-09-20' },
                  { title: 'Risk Management Checklist', preview: 'Essential risk management principles for consistent trading...', date: '2025-09-18' },
                  { title: 'Psychology Session Takeaways', preview: 'Important psychological concepts covered in the workshop...', date: '2025-09-15' }
                ].map((note, index) => (
                  <Card key={index} className="p-4 bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{note.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{note.preview}</p>
                        <span className="text-xs text-slate-500">{note.date}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  { title: 'Trading Psychology Guide', type: 'PDF', size: '2.4 MB', icon: Brain },
                  { title: 'Risk Management Template', type: 'Excel', size: '156 KB', icon: Target },
                  { title: 'Market Analysis Cheat Sheet', type: 'PDF', size: '1.8 MB', icon: TrendingUp },
                  { title: 'Trading Journal Template', type: 'PDF', size: '892 KB', icon: BookOpen },
                  { title: 'Economic Calendar Template', type: 'Excel', size: '234 KB', icon: CalendarDays },
                  { title: 'Position Sizing Calculator', type: 'Excel', size: '445 KB', icon: BarChart2 }
                ].map((resource, index) => (
                  <Card key={index} className="p-4 bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors group">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                        <resource.icon className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{resource.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{resource.type} • {resource.size}</p>
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Engagement Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Tracker */}
          <Card className="p-6 bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Progress Tracker</h3>
                <p className="text-sm text-green-400">Your journey</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Calls Attended</span>
                  <span className="text-white">{progressStats.callsAttended}/{progressStats.totalCalls}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(progressStats.callsAttended / progressStats.totalCalls) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Goals Completed</span>
                  <span className="text-white">{progressStats.goalsCompleted}/{progressStats.totalGoals}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(progressStats.goalsCompleted / progressStats.totalGoals) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Recordings Watched</span>
                  <span className="text-white">{progressStats.recordingsWatched}/{progressStats.totalRecordings}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(progressStats.recordingsWatched / progressStats.totalRecordings) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Weekly Poll */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Weekly Poll</h3>
                <p className="text-sm text-slate-400">Share your thoughts</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-slate-300">What's your biggest trading challenge this week?</p>
              <div className="space-y-2">
                {[
                  { id: 'psychology', label: 'Trading Psychology' },
                  { id: 'analysis', label: 'Market Analysis' },
                  { id: 'risk', label: 'Risk Management' },
                  { id: 'discipline', label: 'Discipline' }
                ].map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="radio"
                      name="poll"
                      value={option.id}
                      checked={selectedPoll === option.id}
                      onChange={(e) => setSelectedPoll(e.target.value)}
                      className="text-blue-500"
                    />
                    <span className="text-slate-300">{option.label}</span>
                  </label>
                ))}
              </div>
              <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Submit Vote
              </Button>
            </div>
          </Card>

          {/* Accountability Partner */}
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Accountability</h3>
                <p className="text-sm text-slate-400">Partner Connect</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Connect with a trading partner for mutual accountability and support
              </p>
              <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                Find Partner
              </Button>
            </div>
          </Card>

          {/* Weekly Market Analysis */}
          <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Market Analysis</h3>
                <p className="text-sm text-blue-400">Weekly Briefing</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-1">EUR/USD</h4>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+0.85%</span>
                </div>
              </div>
              
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-1">GBP/USD</h4>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">-0.42%</span>
                </div>
              </div>
              
              <Button size="sm" variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
                View Full Analysis
              </Button>
            </div>
          </Card>
        </div>

        {/* Economic Events Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 py-2 px-4 z-50"
        >
          <div className="flex items-center space-x-8 overflow-x-auto">
            <div className="flex items-center space-x-2 text-yellow-400 font-medium whitespace-nowrap">
              <Activity className="w-4 h-4" />
              <span>Economic Events</span>
            </div>
            {economicEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-2 text-sm whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full ${
                  event.impact === 'high' ? 'bg-red-500' :
                  event.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></span>
                <span className="text-slate-300">{event.title}</span>
                <span className="text-slate-500">{event.time}</span>
                <span className="text-slate-400">{event.currency}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

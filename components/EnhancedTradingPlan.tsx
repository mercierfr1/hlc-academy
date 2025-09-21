'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Target, 
  TrendingUp, 
  Award, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Quote
} from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  category: string
  completed: boolean
}

interface WorkflowStep {
  id: string
  step: string
  completed: boolean
  details: {
    title: string
    description: string
    checklist: string[]
  }
}

interface EntryModel {
  id: string
  name: string
  imageUrl: string
  description: string
  type: 'entry' | 'example'
  uploadedAt: string
}

const defaultChecklist: ChecklistItem[] = [
  { id: 'market-analysis', label: 'Market Analysis Complete', category: 'Analysis', completed: false },
  { id: 'htf-perspective', label: 'HTF Perspective Identified', category: 'Analysis', completed: false },
  { id: '4h-narrative', label: '4H Narrative Confirmed', category: 'Analysis', completed: false },
  { id: 'm15-bias', label: 'M15 Bias Established', category: 'Analysis', completed: false },
  { id: 'm1-execution', label: 'M1 Execution Setup', category: 'Execution', completed: false },
  { id: 'entry-confirmation', label: 'Entry Confirmation Signals', category: 'Execution', completed: false },
  { id: 'risk-management', label: 'Risk Management Plan', category: 'Risk', completed: false },
  { id: 'position-sizing', label: 'Position Sizing Calculated', category: 'Risk', completed: false },
  { id: 'stop-loss', label: 'Stop Loss Set', category: 'Risk', completed: false },
  { id: 'take-profit', label: 'Take Profit Targets', category: 'Risk', completed: false },
  { id: 'trade-logging', label: 'Trade Logged', category: 'Management', completed: false },
  { id: 'post-trade-review', label: 'Post-Trade Review', category: 'Management', completed: false }
]

const defaultWorkflow: WorkflowStep[] = [
  {
    id: 'weekly-daily',
    step: "Weekly/Daily → HTF Perspective",
    completed: false,
    details: {
      title: "Higher Timeframe Analysis",
      description: "Analyze weekly and daily charts to identify major trends, support/resistance levels, and key market structure.",
      checklist: [
        "Identify major trend direction (bullish/bearish/sideways)",
        "Mark key support and resistance levels",
        "Identify major swing highs and lows",
        "Analyze volume patterns and market sentiment",
        "Check for major news events or economic releases"
      ]
    }
  },
  {
    id: '4h-narrative',
    step: "4H → HTF Narrative",
    completed: false,
    details: {
      title: "4-Hour Market Narrative",
      description: "Use 4-hour charts to confirm the higher timeframe bias and identify potential entry zones.",
      checklist: [
        "Confirm HTF trend direction on 4H",
        "Identify key 4H support/resistance levels",
        "Look for confluences with HTF levels",
        "Analyze 4H candlestick patterns",
        "Check for divergence signals"
      ]
    }
  },
  {
    id: 'm15-bias',
    step: "M15 → MTF Immediate Bias",
    completed: false,
    details: {
      title: "15-Minute Immediate Bias",
      description: "Use 15-minute charts to fine-tune entry timing and confirm immediate market direction.",
      checklist: [
        "Confirm 4H bias on M15 timeframe",
        "Identify M15 support/resistance levels",
        "Look for entry signals and patterns",
        "Check momentum indicators (RSI, MACD)",
        "Identify optimal entry zones"
      ]
    }
  },
  {
    id: 'm1-execution',
    step: "M1 → LTF Execution",
    completed: false,
    details: {
      title: "1-Minute Execution",
      description: "Execute trades on 1-minute charts with precise entry timing and risk management.",
      checklist: [
        "Confirm M15 bias on M1",
        "Wait for precise entry signals",
        "Set stop loss immediately",
        "Enter position at optimal price",
        "Monitor trade execution"
      ]
    }
  }
]

const motivationQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
  { text: "The four most dangerous words in investing are: 'This time it's different.'", author: "Sir John Templeton" },
  { text: "In investing, what is comfortable is rarely profitable.", author: "Robert Arnott" },
  { text: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder" },
  { text: "The market is a voting machine in the short run, but a weighing machine in the long run.", author: "Benjamin Graham" },
  { text: "Don't look for the needle in the haystack. Just buy the haystack!", author: "John Bogle" },
  { text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.", author: "Warren Buffett" },
  { text: "Time in the market beats timing the market.", author: "Unknown" },
  { text: "The intelligent investor is a realist who sells to optimists and buys from pessimists.", author: "Benjamin Graham" },
  { text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.", author: "Albert Einstein" }
]

export default function EnhancedTradingPlan() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(defaultChecklist)
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(defaultWorkflow)
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [editingChecklist, setEditingChecklist] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState(false)
  const [newChecklistItem, setNewChecklistItem] = useState({ label: '', category: '' })
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [entryModels, setEntryModels] = useState<EntryModel[]>([])
  const [currentQuote, setCurrentQuote] = useState(motivationQuotes[0])
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for dark mode preference
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDarkMode(isDark)
    }

    checkDarkMode()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Load saved data
    loadSavedData()
    
    // Auto-rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % motivationQuotes.length)
      setCurrentQuote(motivationQuotes[(quoteIndex + 1) % motivationQuotes.length])
    }, 8000)

    return () => {
      observer.disconnect()
      clearInterval(quoteInterval)
    }
  }, [quoteIndex])

  const loadSavedData = () => {
    const savedChecklist = localStorage.getItem('custom-checklist')
    if (savedChecklist) {
      setChecklistItems(JSON.parse(savedChecklist))
    }

    const savedWorkflow = localStorage.getItem('custom-workflow')
    if (savedWorkflow) {
      setWorkflowSteps(JSON.parse(savedWorkflow))
    }

    const savedModels = localStorage.getItem('entry-models')
    if (savedModels) {
      setEntryModels(JSON.parse(savedModels))
    }
  }

  const saveData = () => {
    localStorage.setItem('custom-checklist', JSON.stringify(checklistItems))
    localStorage.setItem('custom-workflow', JSON.stringify(workflowSteps))
    localStorage.setItem('entry-models', JSON.stringify(entryModels))
  }

  const toggleChecklist = (id: string) => {
    const updatedItems = checklistItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setChecklistItems(updatedItems)
    localStorage.setItem('custom-checklist', JSON.stringify(updatedItems))
  }

  const addChecklistItem = () => {
    if (!newChecklistItem.label.trim()) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      label: newChecklistItem.label,
      category: newChecklistItem.category || 'Custom',
      completed: false
    }

    const updatedItems = [...checklistItems, newItem]
    setChecklistItems(updatedItems)
    setNewChecklistItem({ label: '', category: '' })
    localStorage.setItem('custom-checklist', JSON.stringify(updatedItems))
  }

  const removeChecklistItem = (id: string) => {
    const updatedItems = checklistItems.filter(item => item.id !== id)
    setChecklistItems(updatedItems)
    localStorage.setItem('custom-checklist', JSON.stringify(updatedItems))
  }

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const updateWorkflowStep = (index: number, field: keyof WorkflowStep['details'], value: string | string[]) => {
    const updatedSteps = workflowSteps.map((step, i) => 
      i === index 
        ? { ...step, details: { ...step.details, [field]: value } }
        : step
    )
    setWorkflowSteps(updatedSteps)
    localStorage.setItem('custom-workflow', JSON.stringify(updatedSteps))
  }

  const updateWorkflowChecklist = (stepIndex: number, itemIndex: number, value: string) => {
    const updatedSteps = workflowSteps.map((step, i) => 
      i === stepIndex 
        ? { 
            ...step, 
            details: { 
              ...step.details, 
              checklist: step.details.checklist.map((item, j) => j === itemIndex ? value : item)
            } 
          }
        : step
    )
    setWorkflowSteps(updatedSteps)
    localStorage.setItem('custom-workflow', JSON.stringify(updatedSteps))
  }

  const addWorkflowChecklistItem = (stepIndex: number) => {
    const updatedSteps = workflowSteps.map((step, i) => 
      i === stepIndex 
        ? { 
            ...step, 
            details: { 
              ...step.details, 
              checklist: [...step.details.checklist, 'New checklist item']
            } 
          }
        : step
    )
    setWorkflowSteps(updatedSteps)
    localStorage.setItem('custom-workflow', JSON.stringify(updatedSteps))
  }

  const removeWorkflowChecklistItem = (stepIndex: number, itemIndex: number) => {
    const updatedSteps = workflowSteps.map((step, i) => 
      i === stepIndex 
        ? { 
            ...step, 
            details: { 
              ...step.details, 
              checklist: step.details.checklist.filter((_, j) => j !== itemIndex)
            } 
          }
        : step
    )
    setWorkflowSteps(updatedSteps)
    localStorage.setItem('custom-workflow', JSON.stringify(updatedSteps))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'entry' | 'example') => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newModel: EntryModel = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          imageUrl: e.target?.result as string,
          description: `${type === 'entry' ? 'Entry Model' : 'High Probability Example'}`,
          type,
          uploadedAt: new Date().toISOString()
        }
        
        const updatedModels = [...entryModels, newModel]
        setEntryModels(updatedModels)
        localStorage.setItem('entry-models', JSON.stringify(updatedModels))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeEntryModel = (id: string) => {
    const updatedModels = entryModels.filter(model => model.id !== id)
    setEntryModels(updatedModels)
    localStorage.setItem('entry-models', JSON.stringify(updatedModels))
  }

  const nextQuote = () => {
    const nextIndex = (quoteIndex + 1) % motivationQuotes.length
    setQuoteIndex(nextIndex)
    setCurrentQuote(motivationQuotes[nextIndex])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Trading Checklist */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trading Checklist</h3>
          </div>
          <Button
            onClick={() => setEditingChecklist(!editingChecklist)}
            variant="secondary"
            size="sm"
          >
            {editingChecklist ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {editingChecklist ? 'Save' : 'Edit'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <input 
                type="checkbox" 
                checked={item.completed}
                onChange={() => toggleChecklist(item.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                {editingChecklist ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = checklistItems.map(i => 
                          i.id === item.id ? { ...i, label: e.target.value } : i
                        )
                        setChecklistItems(updated)
                      }}
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const updated = checklistItems.map(i => 
                          i.id === item.id ? { ...i, category: e.target.value } : i
                        )
                        setChecklistItems(updated)
                      }}
                      className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                      placeholder="Category"
                    />
                    <button
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.category}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {editingChecklist && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                placeholder="New checklist item"
                value={newChecklistItem.label}
                onChange={(e) => setNewChecklistItem({ ...newChecklistItem, label: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={newChecklistItem.category}
                onChange={(e) => setNewChecklistItem({ ...newChecklistItem, category: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <Button onClick={addChecklistItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Mapping Workflow */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mapping Workflow</h3>
          </div>
          <Button
            onClick={() => setEditingWorkflow(!editingWorkflow)}
            variant="secondary"
            size="sm"
          >
            {editingWorkflow ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {editingWorkflow ? 'Save' : 'Edit'}
          </Button>
        </div>
        
        <div className="space-y-4">
          {workflowSteps.map((workflow, index) => (
            <div key={workflow.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleStep(index)}
              >
                <span className="text-gray-700 dark:text-gray-300 font-medium">{workflow.step}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${workflow.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">→</span>
                  <div className={`transform transition-transform ${expandedSteps.includes(index) ? 'rotate-180' : ''}`}>
                    {expandedSteps.includes(index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              
              {expandedSteps.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="space-y-4">
                    <div>
                      {editingWorkflow ? (
                        <input
                          type="text"
                          value={workflow.details.title}
                          onChange={(e) => updateWorkflowStep(index, 'title', e.target.value)}
                          className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 mb-2"
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {workflow.details.title}
                        </h4>
                      )}
                      {editingWorkflow ? (
                        <textarea
                          value={workflow.details.description}
                          onChange={(e) => updateWorkflowStep(index, 'description', e.target.value)}
                          className="w-full text-gray-600 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2"
                          rows={2}
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          {workflow.details.description}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 dark:text-white">Checklist:</h5>
                        {editingWorkflow && (
                          <Button onClick={() => addWorkflowChecklistItem(index)} size="sm" variant="secondary">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Item
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {workflow.details.checklist.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                            {editingWorkflow ? (
                              <>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateWorkflowChecklist(index, itemIndex, e.target.value)}
                                  className="flex-1 text-sm text-gray-600 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                                />
                                <button
                                  onClick={() => removeWorkflowChecklistItem(index, itemIndex)}
                                  className="text-red-600 hover:text-red-800 text-xs"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Entry Models and Examples */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Entry Models */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Target className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Entry Models</h3>
            </div>
            <label className="cursor-pointer">
              <Upload className="w-5 h-5 text-blue-600" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'entry')}
                className="hidden"
              />
            </label>
          </div>
          
          {entryModels.filter(model => model.type === 'entry').length > 0 ? (
            <div className="space-y-3">
              {entryModels.filter(model => model.type === 'entry').map((model) => (
                <div key={model.id} className="relative group">
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => removeEntryModel(model.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(model.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Upload Entry Model Screenshots</p>
            </div>
          )}
        </Card>

        {/* High Probability Examples */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Probability Examples</h3>
            </div>
            <label className="cursor-pointer">
              <Upload className="w-5 h-5 text-blue-600" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, 'example')}
                className="hidden"
              />
            </label>
          </div>
          
          {entryModels.filter(model => model.type === 'example').length > 0 ? (
            <div className="space-y-3">
              {entryModels.filter(model => model.type === 'example').map((model) => (
                <div key={model.id} className="relative group">
                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => removeEntryModel(model.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(model.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Upload High Probability Examples</p>
            </div>
          )}
        </Card>
      </div>

      {/* Motivation & Discipline */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Quote className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Motivation & Discipline</h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Plan Adherence Streak</p>
            <p className="text-2xl font-bold">0 days</p>
          </div>
        </div>
        
        <motion.div
          key={currentQuote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <blockquote className="text-lg italic mb-2">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-sm opacity-90">— {currentQuote.author}</p>
        </motion.div>
        
        <div className="text-center">
          <Button 
            onClick={nextQuote}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Next Quote →
          </Button>
        </div>
      </Card>
    </div>
  )
}

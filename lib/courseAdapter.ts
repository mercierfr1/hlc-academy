// Course data model and adapter functions
// TODO: Replace with real API calls when backend is available

export interface CourseModule {
  id: string
  title: string
  description: string
  progressPct: number // 0..100
  xp: number
  status: 'completed' | 'in_progress' | 'locked'
  unlockCondition?: string
  href?: string
  thumbnail?: string
  duration?: string // e.g., "2h 30m"
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

// Mock course data
const mockModules: CourseModule[] = [
  {
    id: 'module-1',
    title: 'Module 1: Mindset Fundamentals',
    description: 'Build the psychological foundation for consistent trading success',
    progressPct: 100,
    xp: 400,
    status: 'completed',
    href: '/course/module-1', // TODO: wire to real course paths
    thumbnail: '/course-thumb-1.jpg',
    duration: '2h 30m',
    difficulty: 'beginner'
  },
  {
    id: 'module-2',
    title: 'Module 2: Market Structure Analysis',
    description: 'Master supply and demand zones for institutional-grade entries',
    progressPct: 67,
    xp: 600,
    status: 'in_progress',
    href: '/course/module-2', // TODO: wire to real course paths
    thumbnail: '/course-thumb-2.jpg',
    duration: '3h 15m',
    difficulty: 'intermediate'
  },
  {
    id: 'module-3',
    title: 'Module 3: Risk Management Systems',
    description: 'Implement bulletproof position sizing and stop-loss strategies',
    progressPct: 0,
    xp: 500,
    status: 'locked',
    unlockCondition: 'Complete Module 2',
    thumbnail: '/course-thumb-3.jpg',
    duration: '2h 45m',
    difficulty: 'intermediate'
  },
  {
    id: 'module-4',
    title: 'Module 4: Advanced Chart Patterns',
    description: 'Identify high-probability setups using institutional patterns',
    progressPct: 0,
    xp: 700,
    status: 'locked',
    unlockCondition: 'Complete Module 3',
    thumbnail: '/course-thumb-4.jpg',
    duration: '4h 10m',
    difficulty: 'advanced'
  },
  {
    id: 'module-5',
    title: 'Module 5: Psychology & Discipline',
    description: 'Overcome emotional trading and maintain consistency',
    progressPct: 0,
    xp: 450,
    status: 'locked',
    unlockCondition: 'Complete Module 4',
    thumbnail: '/course-thumb-5.jpg',
    duration: '2h 20m',
    difficulty: 'intermediate'
  },
  {
    id: 'module-6',
    title: 'Module 6: Live Trading Mastery',
    description: 'Apply everything in real market conditions with live feedback',
    progressPct: 0,
    xp: 800,
    status: 'locked',
    unlockCondition: 'Complete Module 5',
    thumbnail: '/course-thumb-6.jpg',
    duration: '5h 30m',
    difficulty: 'advanced'
  }
]

// Adapter functions
export const fetchCourseModules = async (): Promise<CourseModule[]> => {
  // TODO: Replace with real API call
  // const response = await fetch('/api/course/modules')
  // return response.json()

  // Mock implementation
  return mockModules
}

export const getCourseModules = (): CourseModule[] => {
  // Synchronous version for immediate use
  return mockModules
}

export const updateModuleProgress = async (moduleId: string, progressPct: number): Promise<CourseModule> => {
  // TODO: Replace with real API call
  // const response = await fetch(`/api/course/modules/${moduleId}/progress`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ progressPct })
  // })
  // return response.json()

  // Mock implementation
  const module = mockModules.find(m => m.id === moduleId)
  if (!module) throw new Error('Module not found')
  
  module.progressPct = Math.max(0, Math.min(100, progressPct))
  module.status = progressPct === 100 ? 'completed' : progressPct > 0 ? 'in_progress' : 'locked'
  
  return module
}

export const getCourseOverview = async () => {
  const modules = await fetchCourseModules()
  
  const totalModules = modules.length
  const completedModules = modules.filter(m => m.status === 'completed').length
  const inProgressModules = modules.filter(m => m.status === 'in_progress').length
  const totalXP = modules.reduce((sum, m) => sum + m.xp, 0)
  const earnedXP = modules
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.xp, 0)
  
  return {
    modules,
    stats: {
      totalModules,
      completedModules,
      inProgressModules,
      totalXP,
      earnedXP,
      completionRate: totalModules > 0 ? (completedModules / totalModules) * 100 : 0
    }
  }
}

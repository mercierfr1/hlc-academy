import { fxCourse } from '@/data/fxCourseData';

export interface UserProgress {
  lessonsWatched: Record<string, number>;
  totalXP: number;
  streak: number;
  lastActiveDate: string;
}

export function getStoredProgress(): UserProgress {
  const stored = localStorage.getItem('userProgress');
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    lessonsWatched: {},
    totalXP: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  };
}

export function saveProgress(progress: UserProgress) {
  localStorage.setItem('userProgress', JSON.stringify(progress));
}

export function calculateCourseProgress() {
  const progress = getStoredProgress();
  const totalLessons = fxCourse.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = Object.keys(progress.lessonsWatched).filter(
    lessonId => progress.lessonsWatched[lessonId] >= 90
  ).length;
  
  return {
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    lessonsCompleted: completedLessons,
    totalLessons,
    quizzesCompleted: 0 // Mock data
  };
}

export function getDailyGoalProgress() {
  const progress = getStoredProgress();
  const target = 100; // Daily XP target
  const current = Math.min(progress.totalXP % 1000, target); // Mock current progress
  
  return {
    current,
    target,
    percentage: (current / target) * 100,
    hoursLeft: 24 - new Date().getHours()
  };
}

export function getModuleProgress(moduleId: string) {
  const progress = getStoredProgress();
  const module = fxCourse.modules.find(m => m.id === moduleId);
  if (!module) return { percentage: 0, lessonsCompleted: 0 };
  
  const completedLessons = module.lessons.filter(
    lesson => progress.lessonsWatched[lesson.id] >= 90
  ).length;
  
  return {
    percentage: module.lessons.length > 0 ? Math.round((completedLessons / module.lessons.length) * 100) : 0,
    lessonsCompleted: completedLessons
  };
}

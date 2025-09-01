export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeInVideo: number; // seconds when quiz appears
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  videoUrl: string;
  quizzes: Quiz[];
  completed: boolean;
  watchedPercentage: number;
  quizzesCompleted: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  completedLessons: number;
  totalLessons: number;
  progress: number; // 0-100
}

export interface UserProgress {
  totalXP: number;
  dailyXP: number;
  dailyGoal: number;
  streak: number;
  courseProgress: number; // 0-100
  lessonsCompleted: number;
  totalLessons: number;
  quizAccuracy: number; // 0-100
  lastStudyDate: string;
}

export interface XPGoal {
  name: string;
  value: number;
  description: string;
}

export const XP_GOALS: XPGoal[] = [
  { name: "Basic", value: 20, description: "Perfect for beginners" },
  { name: "Casual", value: 35, description: "Light daily learning" },
  { name: "Regular", value: 50, description: "Steady progress" },
  { name: "Serious", value: 75, description: "Committed learner" },
  { name: "Insane", value: 100, description: "Maximum dedication" },
];
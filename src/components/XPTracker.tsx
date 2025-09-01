import { Trophy, Target } from "lucide-react";
import { getStoredProgress, getDailyGoalProgress } from "@/lib/progress";

export function XPTracker() {
  const userProgress = getStoredProgress();
  const dailyProgress = getDailyGoalProgress();
  
  return (
    <div className="flex items-center gap-4 bg-muted/50 px-3 py-2 rounded-lg">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium">{userProgress.totalXP} XP</span>
      </div>
      <div className="w-px h-6 bg-border" />
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium">
          {dailyProgress.current}/{dailyProgress.target}
        </span>
      </div>
    </div>
  );
}

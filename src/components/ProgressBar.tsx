import { Progress } from "@/components/ui/progress";
import { calculateCourseProgress } from "@/lib/progress";

export function ProgressBar() {
  const courseProgress = calculateCourseProgress();
  
  return (
    <div className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Your Learning Journey</h2>
          <span className="text-sm font-medium text-muted-foreground">
            {courseProgress.percentage}% Complete
          </span>
        </div>
        <Progress value={courseProgress.percentage} className="h-3" />
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>{courseProgress.lessonsCompleted} of {courseProgress.totalLessons} lessons completed</span>
          <span>•</span>
          <span>{courseProgress.totalXP} XP earned</span>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, Target, Flame, TrendingUp, Play, Lock, CheckCircle2, CreditCard, Settings, LogOut, BarChart3 } from "lucide-react";
import { calculateCourseProgress, getDailyGoalProgress, getStoredProgress, getModuleProgress } from "@/lib/progress";
import { fxCourse } from "@/data/fxCourseData";
import { ProgressBar } from "@/components/ProgressBar";
import { XPTracker } from "@/components/XPTracker";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  
  const courseProgress = calculateCourseProgress();
  const dailyProgress = getDailyGoalProgress();
  const userProgress = getStoredProgress();

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoadingPortal(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setLoadingPortal(false);
    }
  };

  // Find next incomplete lesson
  const getNextLesson = () => {
    for (const module of fxCourse.modules) {
      for (const lesson of module.lessons) {
        if (lesson.isLocked) continue; // Skip locked lessons
        const watchedPercentage = userProgress.lessonsWatched[lesson.id] || 0;
        if (watchedPercentage < 90) {
          return { lesson, module };
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to HLC Academy</p>
            </div>
            <div className="flex items-center gap-4">
              <XPTracker />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressBar />

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Status */}
        {subscriptionStatus && (
          <div className="mb-8">
            <Card className={`${subscriptionStatus.subscribed ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subscriptionStatus.subscribed ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
                      <CreditCard className={`w-5 h-5 ${subscriptionStatus.subscribed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {subscriptionStatus.subscribed ? 'Premium Active' : 'Free Trial'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {subscriptionStatus.subscribed 
                          ? `Your subscription is active until ${new Date(subscriptionStatus.current_period_end).toLocaleDateString()}`
                          : subscriptionStatus.trial_end 
                            ? `Trial ends ${new Date(subscriptionStatus.trial_end).toLocaleDateString()}`
                            : 'Subscribe to access premium content'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {subscriptionStatus.subscribed ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleManageSubscription}
                        disabled={loadingPortal}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {loadingPortal ? 'Loading...' : 'Manage'}
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        asChild
                      >
                        <Link to="/pricing">
                          Subscribe Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseProgress.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {courseProgress.lessonsCompleted}/{courseProgress.totalLessons} lessons completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyProgress.current}/{dailyProgress.target}</div>
              <p className="text-xs text-muted-foreground">
                XP gained • {dailyProgress.hoursLeft}h left
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.streak}</div>
              <p className="text-xs text-muted-foreground">
                {userProgress.streak > 0 ? 'days 🔥' : 'Start your streak!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.totalXP}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {nextLesson && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{nextLesson.lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {nextLesson.module.title} • {nextLesson.lesson.duration} min • {nextLesson.lesson.xpValue * 10} XP
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={userProgress.lessonsWatched[nextLesson.lesson.id] || 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/course/fx/lesson/${nextLesson.lesson.slug}`}>
                      Continue
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                My Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Course Progress</span>
                  <span>{courseProgress.percentage}%</span>
                </div>
                <Progress value={courseProgress.percentage} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Goal Progress</span>
                  <span>{Math.min(dailyProgress.percentage, 100)}%</span>
                </div>
                <Progress value={Math.min(dailyProgress.percentage, 100)} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{courseProgress.quizzesCompleted}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{courseProgress.lessonsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Lessons Done</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/course/fx">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View FX Trading Course
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/progress">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Detailed Progress
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/trading">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Trading Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/settings">
                  <Target className="w-4 h-4 mr-2" />
                  Settings & Goals
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Course Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fxCourse.modules.map((module, index) => {
              const moduleProgress = getModuleProgress(module.id);
              const totalDuration = module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
              const unlockedLessons = module.lessons.filter(lesson => !lesson.isLocked);
              const lockedLessons = module.lessons.filter(lesson => lesson.isLocked);
              
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{moduleProgress.percentage}%</div>
                        <Progress value={moduleProgress.percentage} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-primary">
                            {moduleProgress.lessonsCompleted}
                          </div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">
                            {unlockedLessons.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Free</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-orange-600 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            {lockedLessons.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Tier 2</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link to={`/course/fx/module/${module.slug}`}>
                            View Module
                          </Link>
                        </Button>
                        
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="px-4"
                        >
                          Summary
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
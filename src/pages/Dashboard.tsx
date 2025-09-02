import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Trophy, Target, Flame, TrendingUp, Play, Lock, CheckCircle2, CreditCard, Settings, LogOut, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const courseProgress = 25;
  const dailyProgress = 60;
  const userProgress = { completedLessons: 5, totalLessons: 20 };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to HLC Academy</h1>
          <p className="text-muted-foreground">Track your trading education progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{courseProgress}%</span>
                </div>
                <Progress value={courseProgress} />
                <p className="text-sm text-muted-foreground">
                  {userProgress.completedLessons} of {userProgress.totalLessons} lessons completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Progress</span>
                  <span>{dailyProgress}%</span>
                </div>
                <Progress value={dailyProgress} />
                <p className="text-sm text-muted-foreground">
                  Keep up the great work!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">First Lesson Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Week 1 Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Lesson 6: Market Structure</h3>
                      <p className="text-sm text-muted-foreground">Module 2 • 15 min</p>
                    </div>
                  </div>
                  <Button size="sm">Continue</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/pricing">Subscribe Now</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/trading">Trading Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard">View Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
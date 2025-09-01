import React, { useState } from 'react';
import { BarChart3, Target, Calendar, TrendingUp, DollarSign, Settings, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TradeJournal } from '@/components/TradeJournal';
import { TradingGoals } from '@/components/TradingGoals';
import { Link } from 'react-router-dom';

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for overview
  const overviewStats = {
    totalPnl: 3245.80,
    monthlyPnl: 1245.50,
    totalTrades: 156,
    winRate: 72.4,
    activeGoals: 3,
    completedGoals: 8,
    streak: 12
  };

  const recentActivity = [
    { type: 'trade', message: 'EUR/USD trade closed +£156.80', time: '2 hours ago', pnl: 156.80 },
    { type: 'goal', message: 'Monthly profit target 75% complete!', time: '1 day ago', progress: 75 },
    { type: 'milestone', message: 'Reached 70% win rate milestone', time: '2 days ago', achievement: '70% Win Rate' },
    { type: 'trade', message: 'GBP/USD trade closed -£89.20', time: '3 days ago', pnl: -89.20 }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade': return <DollarSign className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      case 'milestone': return <TrendingUp className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, pnl?: number) => {
    if (type === 'trade' && pnl) {
      return pnl > 0 ? 'text-green-600' : 'text-red-600';
    }
    if (type === 'goal') return 'text-blue-600';
    if (type === 'milestone') return 'text-purple-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Trading Dashboard</h1>
              <p className="text-muted-foreground">Track your progress and achieve your goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Premium Upgrade Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Unlock Premium Trading Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Get advanced analytics, unlimited trade entries, and 1-on-1 coaching
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${overviewStats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    £{overviewStats.totalPnl.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{overviewStats.winRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{overviewStats.activeGoals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                  <p className="text-2xl font-bold">{overviewStats.streak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Trade Journal</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity.type, activity.pnl)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.pnl && (
                          <Badge variant={activity.pnl > 0 ? 'default' : 'destructive'}>
                            {activity.pnl > 0 ? '+' : ''}£{activity.pnl.toFixed(2)}
                          </Badge>
                        )}
                        {activity.progress && (
                          <Badge variant="secondary">{activity.progress}%</Badge>
                        )}
                        {activity.achievement && (
                          <Badge variant="outline">{activity.achievement}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Today's Trades
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Create New Goal
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Performance charts coming soon</p>
                    <p className="text-sm">Track your P&L, win rate, and goal progress over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Journal Tab */}
          <TabsContent value="journal">
            <TradeJournal />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <TradingGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

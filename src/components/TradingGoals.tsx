import React, { useState, useEffect } from 'react';
import { Target, Plus, Trophy, TrendingUp, Calendar, DollarSign, BarChart3, CheckCircle, X, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TradingGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  category: 'profit' | 'trades' | 'winrate' | 'consistency';
  milestones: Milestone[];
  createdAt: string;
}

interface Milestone {
  id: string;
  value: number;
  description: string;
  achieved: boolean;
  achievedAt?: string;
}

export function TradingGoals() {
  const [goals, setGoals] = useState<TradingGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<TradingGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'monthly',
    target: 0,
    unit: '£',
    deadline: '',
    category: 'profit'
  });

  // Sample goals data
  useEffect(() => {
    const sampleGoals: TradingGoal[] = [
      {
        id: '1',
        title: 'Monthly Profit Target',
        description: 'Achieve consistent monthly profits',
        type: 'monthly',
        target: 2000,
        current: 1450,
        unit: '£',
        deadline: '2025-09-30',
        status: 'active',
        category: 'profit',
        milestones: [
          { id: '1-1', value: 500, description: 'First £500', achieved: true, achievedAt: '2025-08-15' },
          { id: '1-2', value: 1000, description: 'Halfway there!', achieved: true, achievedAt: '2025-08-22' },
          { id: '1-3', value: 1500, description: 'Almost there', achieved: false },
          { id: '1-4', value: 2000, description: 'Target reached!', achieved: false }
        ],
        createdAt: '2025-08-01'
      },
      {
        id: '2',
        title: 'Win Rate Improvement',
        description: 'Improve overall trading win rate',
        type: 'monthly',
        target: 75,
        current: 68,
        unit: '%',
        deadline: '2025-09-30',
        status: 'active',
        category: 'winrate',
        milestones: [
          { id: '2-1', value: 65, description: 'Above 65%', achieved: true, achievedAt: '2025-08-10' },
          { id: '2-2', value: 70, description: '70% milestone', achieved: false },
          { id: '2-3', value: 75, description: 'Target achieved!', achieved: false }
        ],
        createdAt: '2025-08-01'
      },
      {
        id: '3',
        title: 'Daily Trading Consistency',
        description: 'Trade consistently every weekday',
        type: 'monthly',
        target: 22,
        current: 18,
        unit: 'days',
        deadline: '2025-08-31',
        status: 'active',
        category: 'consistency',
        milestones: [
          { id: '3-1', value: 15, description: '15 trading days', achieved: true, achievedAt: '2025-08-20' },
          { id: '3-2', value: 20, description: '20 trading days', achieved: false },
          { id: '3-3', value: 22, description: 'Full month!', achieved: false }
        ],
        createdAt: '2025-08-01'
      }
    ];
    setGoals(sampleGoals);
  }, []);

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: TradingGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        type: newGoal.type as any,
        target: newGoal.target,
        current: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        status: 'active',
        category: newGoal.category as any,
        milestones: generateMilestones(newGoal.target, newGoal.unit),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        type: 'monthly',
        target: 0,
        unit: '£',
        deadline: '',
        category: 'profit'
      });
      setShowAddGoal(false);
    }
  };

  const generateMilestones = (target: number, unit: string) => {
    const milestones: Milestone[] = [];
    if (unit === '£') {
      milestones.push(
        { id: '1', value: target * 0.25, description: '25% of target', achieved: false },
        { id: '2', value: target * 0.5, description: 'Halfway there!', achieved: false },
        { id: '3', value: target * 0.75, description: '75% complete', achieved: false },
        { id: '4', value: target, description: 'Target reached!', achieved: false }
      );
    } else if (unit === '%') {
      milestones.push(
        { id: '1', value: target * 0.8, description: '80% of target', achieved: false },
        { id: '2', value: target * 0.9, description: '90% of target', achieved: false },
        { id: '3', value: target, description: 'Target achieved!', achieved: false }
      );
    } else {
      milestones.push(
        { id: '1', value: target * 0.5, description: '50% complete', achieved: false },
        { id: '2', value: target * 0.8, description: '80% complete', achieved: false },
        { id: '3', value: target, description: 'Target reached!', achieved: false }
      );
    }
    return milestones;
  };

  const updateGoalProgress = (goalId: string, newCurrent: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => ({
          ...milestone,
          achieved: newCurrent >= milestone.value && !milestone.achieved,
          achievedAt: newCurrent >= milestone.value && !milestone.achieved ? new Date().toISOString() : milestone.achievedAt
        }));

        const status = newCurrent >= goal.target ? 'completed' : 
                      new Date() > new Date(goal.deadline) ? 'overdue' : 'active';

        return {
          ...goal,
          current: newCurrent,
          status,
          milestones: updatedMilestones
        };
      }
      return goal;
    }));
  };

  const getProgressPercentage = (goal: TradingGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profit': return <DollarSign className="h-4 w-4" />;
      case 'trades': return <BarChart3 className="h-4 w-4" />;
      case 'winrate': return <Target className="h-4 w-4" />;
      case 'consistency': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {goals.length > 0 
                    ? Math.round(goals.reduce((sum, g) => sum + getProgressPercentage(g), 0) / goals.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl font-bold">
                  {goals.filter(g => {
                    const daysUntilDeadline = Math.ceil((new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilDeadline <= 7 && g.status === 'active';
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Goals</h2>
        <Button onClick={() => setShowAddGoal(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(goal.category)}
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingGoal(goal)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <Progress value={getProgressPercentage(goal)} className="h-3" />
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{goal.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Deadline:</span>
                  <p className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="text-sm font-medium mb-2">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {milestone.achieved ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className={milestone.achieved ? 'line-through text-muted-foreground' : ''}>
                          {milestone.description}
                        </span>
                      </div>
                      <span className="font-medium">{milestone.value} {goal.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Progress Update */}
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Update progress"
                  className="flex-1"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      updateGoalProgress(goal.id, value);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newValue = goal.current + (goal.unit === '£' ? 100 : goal.unit === '%' ? 5 : 1);
                    updateGoalProgress(goal.id, newValue);
                  }}
                >
                  +{goal.unit === '£' ? '100' : goal.unit === '%' ? '5' : '1'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Add New Trading Goal</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddGoal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
              <Textarea
                placeholder="Goal description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newGoal.type} onValueChange={(value) => setNewGoal({...newGoal, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="trades">Trades</SelectItem>
                    <SelectItem value="winrate">Win Rate</SelectItem>
                    <SelectItem value="consistency">Consistency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Target value"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({...newGoal, target: parseFloat(e.target.value) || 0})}
                />
                <Input
                  placeholder="Unit (£, %, days)"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                />
              </div>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
              <div className="flex space-x-2">
                <Button onClick={addGoal} className="flex-1">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

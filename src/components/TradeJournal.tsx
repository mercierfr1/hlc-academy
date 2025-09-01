import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Plus, TrendingUp, TrendingDown, DollarSign, Target, BarChart3, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface TradeDay {
  date: string;
  pnl: number;
  trades: number;
  strategy: string;
  pair: string;
  timeframe: string;
  notes: string;
  winRate: number;
}

interface JournalFilters {
  strategy: string;
  pair: string;
  timeframe: string;
  dateRange: string;
}

export function TradeJournal() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [filters, setFilters] = useState<JournalFilters>({
    strategy: '',
    pair: '',
    timeframe: '',
    dateRange: '30'
  });
  const [journalData, setJournalData] = useState<TradeDay[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  // Sample data - replace with real data from your backend
  useEffect(() => {
    const sampleData: TradeDay[] = [
      {
        date: '2025-08-31',
        pnl: 245.50,
        trades: 8,
        strategy: 'Supply & Demand',
        pair: 'EUR/USD',
        timeframe: 'H4',
        notes: 'Strong trend day, multiple breakouts',
        winRate: 75
      },
      {
        date: '2025-08-30',
        pnl: -89.20,
        trades: 5,
        strategy: 'Price Action',
        pair: 'GBP/USD',
        timeframe: 'H1',
        notes: 'Choppy market, should have stayed out',
        winRate: 40
      },
      {
        date: '2025-08-29',
        pnl: 156.80,
        trades: 6,
        strategy: 'Supply & Demand',
        pair: 'USD/JPY',
        timeframe: 'H4',
        notes: 'Perfect setup, high probability trade',
        winRate: 83
      }
    ];
    setJournalData(sampleData);
  }, []);

  const getCalendarDays = () => {
    const today = new Date();
    const days = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayData = journalData.find(day => day.date === dateStr);
      days.push({
        date: dateStr,
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        data: dayData
      });
    }
    return days;
  };

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
    if (pnl < 0) return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
  };

  const addNote = () => {
    if (selectedDate && currentNote.trim()) {
      const updatedData = journalData.map(day => 
        day.date === selectedDate 
          ? { ...day, notes: currentNote }
          : day
      );
      setJournalData(updatedData);
      setCurrentNote('');
      setShowAddNote(false);
      setSelectedDate('');
    }
  };

  const filteredData = journalData.filter(day => {
    if (filters.strategy && day.strategy !== filters.strategy) return false;
    if (filters.pair && day.pair !== filters.pair) return false;
    if (filters.timeframe && day.timeframe !== filters.timeframe) return false;
    return true;
  });

  const totalPnl = filteredData.reduce((sum, day) => sum + day.pnl, 0);
  const totalTrades = filteredData.reduce((sum, day) => sum + day.trades, 0);
  const avgWinRate = filteredData.length > 0 
    ? filteredData.reduce((sum, day) => sum + day.winRate, 0) / filteredData.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  £{totalPnl.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Best Day</p>
                <p className="text-2xl font-bold text-green-600">
                  £{Math.max(...filteredData.map(d => d.pnl), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.strategy} onValueChange={(value) => setFilters({...filters, strategy: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Strategies</SelectItem>
                <SelectItem value="Supply & Demand">Supply & Demand</SelectItem>
                <SelectItem value="Price Action">Price Action</SelectItem>
                <SelectItem value="Technical Analysis">Technical Analysis</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.pair} onValueChange={(value) => setFilters({...filters, pair: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Currency Pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Pairs</SelectItem>
                <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                <SelectItem value="USD/JPY">USD/JPY</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.timeframe} onValueChange={(value) => setFilters({...filters, timeframe: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Timeframes</SelectItem>
                <SelectItem value="M15">M15</SelectItem>
                <SelectItem value="H1">H1</SelectItem>
                <SelectItem value="H4">H4</SelectItem>
                <SelectItem value="D1">D1</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Daily P&L Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {getCalendarDays().map((day, index) => (
              <div
                key={day.date}
                className={`p-2 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  day.data ? 'bg-background border-border' : 'bg-muted/30 border-transparent'
                }`}
                onClick={() => {
                  if (day.data) {
                    setSelectedDate(day.date);
                    setCurrentNote(day.data.notes);
                    setShowAddNote(true);
                  }
                }}
              >
                <div className="text-sm font-medium">{day.day}</div>
                {day.data && (
                  <div className={`text-xs px-1 py-0.5 rounded ${getPnlColor(day.data.pnl)}`}>
                    £{day.data.pnl.toFixed(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Trading Days</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredData.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setSelectedDate(day.date);
                  setCurrentNote(day.notes);
                  setShowAddNote(true);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                  <Badge variant="outline">{day.strategy}</Badge>
                  <Badge variant="outline">{day.pair}</Badge>
                  <Badge variant="outline">{day.timeframe}</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    {day.trades} trades • {day.winRate}% win rate
                  </div>
                  <div className={`font-bold ${day.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    £{day.pnl.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Add Note for {new Date(selectedDate).toLocaleDateString()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddNote(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your trading notes for this day..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button onClick={addNote} className="flex-1">
                  Save Note
                </Button>
                <Button variant="outline" onClick={() => setShowAddNote(false)}>
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

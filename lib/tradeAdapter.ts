// Trade data model and adapter functions
// Now using real Supabase API calls

export interface Trade {
  id: string
  date: string // ISODateString
  symbol: string
  side: 'LONG' | 'SHORT'
  size: number
  rr: number // risk:reward achieved
  pnl: number // realized P&L in account currency
  tags: string[]
  journalId?: string
  notes?: string
}

export interface TradeFilters {
  symbols?: string[]
  sides?: ('LONG' | 'SHORT')[]
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  journaledOnly?: boolean
}

export interface DailyAggregation {
  date: string
  totalPnl: number
  tradeCount: number
  avgRr: number
  tags: string[]
  trades: Trade[]
}

export interface WeeklySummary {
  weekStart: string
  weekEnd: string
  totalPnl: number
  winRate: number
  bestDay: { date: string; pnl: number }
  worstDay: { date: string; pnl: number }
  totalTrades: number
  topTag: string
}

// Mock data storage
let mockTrades: Trade[] = [
  {
    id: '1',
    date: '2024-01-15T09:30:00Z',
    symbol: 'EUR/USD',
    side: 'LONG',
    size: 1.5,
    rr: 2.1,
    pnl: 150,
    tags: ['LondonOpen', 'Breakout'],
    journalId: 'journal-1',
    notes: 'Strong breakout above resistance'
  },
  {
    id: '2',
    date: '2024-01-15T14:20:00Z',
    symbol: 'GBP/USD',
    side: 'SHORT',
    size: 1.0,
    rr: 1.5,
    pnl: -75,
    tags: ['News', 'Reversal'],
    journalId: 'journal-2',
    notes: 'FOMC announcement trade'
  },
  {
    id: '3',
    date: '2024-01-16T08:45:00Z',
    symbol: 'USD/JPY',
    side: 'LONG',
    size: 2.0,
    rr: 3.2,
    pnl: 320,
    tags: ['AsianSession', 'Trend'],
    journalId: 'journal-3',
    notes: 'Clean trend following setup'
  },
  {
    id: '4',
    date: '2024-01-17T11:15:00Z',
    symbol: 'EUR/USD',
    side: 'SHORT',
    size: 1.2,
    rr: 1.8,
    pnl: 90,
    tags: ['Range', 'Support'],
    journalId: 'journal-4',
    notes: 'Range trading at key support'
  },
  {
    id: '5',
    date: '2024-01-18T16:30:00Z',
    symbol: 'AUD/USD',
    side: 'LONG',
    size: 0.8,
    rr: 2.5,
    pnl: 120,
    tags: ['Commodity', 'Breakout'],
    journalId: 'journal-5',
    notes: 'Commodity currency breakout'
  }
]

// Adapter functions
export const fetchTrades = async (start: string, end: string, filters?: TradeFilters): Promise<Trade[]> => {
  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail')
  if (!userEmail) {
    console.error('No user email found in localStorage')
    return []
  }

  // Build query parameters
  const params = new URLSearchParams({
    email: userEmail,
    start: start,
    end: end
  })

  if (filters?.symbols && filters.symbols.length > 0) {
    params.append('symbol', filters.symbols[0]) // For now, only support single symbol filter
  }
  if (filters?.sides && filters.sides.length > 0) {
    params.append('side', filters.sides[0]) // For now, only support single side filter
  }

  try {
    const response = await fetch(`/api/trade-journal?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      console.error('API error:', result.error)
      return []
    }

    // Transform Supabase data to Trade interface
    return result.trades.map((trade: any) => ({
      id: trade.id,
      date: trade.trade_date,
      symbol: trade.symbol,
      side: trade.side,
      size: parseFloat(trade.size) || 0,
      rr: parseFloat(trade.rr) || 0,
      pnl: parseFloat(trade.pnl) || 0,
      tags: trade.tags || [],
      journalId: trade.journal_id,
      notes: trade.notes || ''
    }))
  } catch (error) {
    console.error('Error fetching trades:', error)
    return []
  }
}

export const saveTrade = async (trade: Omit<Trade, 'id'>): Promise<Trade> => {
  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail')
  if (!userEmail) {
    throw new Error('No user email found in localStorage')
  }

  try {
    const response = await fetch('/api/trade-journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, trade })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to save trade')
    }

    // Transform Supabase data to Trade interface
    const savedTrade = result.data
    return {
      id: savedTrade.id,
      date: savedTrade.trade_date,
      symbol: savedTrade.symbol,
      side: savedTrade.side,
      size: parseFloat(savedTrade.size) || 0,
      rr: parseFloat(savedTrade.rr) || 0,
      pnl: parseFloat(savedTrade.pnl) || 0,
      tags: savedTrade.tags || [],
      journalId: savedTrade.journal_id,
      notes: savedTrade.notes || ''
    }
  } catch (error) {
    console.error('Error saving trade:', error)
    throw error
  }
}

export const updateTrade = async (id: string, updates: Partial<Trade>): Promise<Trade> => {
  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail')
  if (!userEmail) {
    throw new Error('No user email found in localStorage')
  }

  try {
    const response = await fetch('/api/trade-journal', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: userEmail, 
        tradeId: id, 
        updates: {
          symbol: updates.symbol,
          side: updates.side,
          size: updates.size,
          rr: updates.rr,
          pnl: updates.pnl,
          tags: updates.tags,
          notes: updates.notes,
          journal_id: updates.journalId,
          trade_date: updates.date
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update trade')
    }

    // Transform Supabase data to Trade interface
    const updatedTrade = result.data
    return {
      id: updatedTrade.id,
      date: updatedTrade.trade_date,
      symbol: updatedTrade.symbol,
      side: updatedTrade.side,
      size: parseFloat(updatedTrade.size) || 0,
      rr: parseFloat(updatedTrade.rr) || 0,
      pnl: parseFloat(updatedTrade.pnl) || 0,
      tags: updatedTrade.tags || [],
      journalId: updatedTrade.journal_id,
      notes: updatedTrade.notes || ''
    }
  } catch (error) {
    console.error('Error updating trade:', error)
    throw error
  }
}

export const deleteTrade = async (id: string): Promise<void> => {
  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail')
  if (!userEmail) {
    throw new Error('No user email found in localStorage')
  }

  try {
    const response = await fetch(`/api/trade-journal?email=${encodeURIComponent(userEmail)}&tradeId=${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete trade')
    }
  } catch (error) {
    console.error('Error deleting trade:', error)
    throw error
  }
}

export const getDailyAggregations = async (start: string, end: string, filters?: TradeFilters): Promise<DailyAggregation[]> => {
  const trades = await fetchTrades(start, end, filters)
  
  // Group trades by date
  const tradesByDate: { [date: string]: Trade[] } = {}
  trades.forEach(trade => {
    const date = trade.date.split('T')[0]
    if (!tradesByDate[date]) tradesByDate[date] = []
    tradesByDate[date].push(trade)
  })

  // Calculate aggregations
  const aggregations: DailyAggregation[] = []
  Object.entries(tradesByDate).forEach(([date, dayTrades]) => {
    const totalPnl = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0)
    const tradeCount = dayTrades.length
    const avgRr = dayTrades.reduce((sum, trade) => sum + trade.rr, 0) / tradeCount
    const allTags = dayTrades.flatMap(trade => trade.tags)
    const uniqueTags = Array.from(new Set(allTags))

    aggregations.push({
      date,
      totalPnl,
      tradeCount,
      avgRr,
      tags: uniqueTags,
      trades: dayTrades
    })
  })

  return aggregations.sort((a, b) => a.date.localeCompare(b.date))
}

export const getWeeklySummary = async (weekStart: string, weekEnd: string, filters?: TradeFilters): Promise<WeeklySummary> => {
  const trades = await fetchTrades(weekStart, weekEnd, filters)
  
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  const winningTrades = trades.filter(trade => trade.pnl > 0)
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0
  
  const tradesByDate: { [date: string]: number } = {}
  trades.forEach(trade => {
    const date = trade.date.split('T')[0]
    tradesByDate[date] = (tradesByDate[date] || 0) + trade.pnl
  })
  
  const dailyPnls = Object.entries(tradesByDate).map(([date, pnl]) => ({ date, pnl }))
  const bestDay = dailyPnls.reduce((best, current) => current.pnl > best.pnl ? current : best, { date: '', pnl: -Infinity })
  const worstDay = dailyPnls.reduce((worst, current) => current.pnl < worst.pnl ? current : worst, { date: '', pnl: Infinity })
  
  const allTags = trades.flatMap(trade => trade.tags)
  const tagCounts: { [tag: string]: number } = {}
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })
  const topTag = Object.entries(tagCounts).reduce((top, [tag, count]) => 
    count > (tagCounts[top] || 0) ? tag : top, 'None'
  )

  return {
    weekStart,
    weekEnd,
    totalPnl,
    winRate,
    bestDay,
    worstDay,
    totalTrades: trades.length,
    topTag
  }
}

export const exportTradesToCSV = (trades: Trade[]): string => {
  const headers = ['Date', 'Symbol', 'Side', 'Size', 'R:R', 'P&L', 'Tags', 'Notes']
  const rows = trades.map(trade => [
    trade.date,
    trade.symbol,
    trade.side,
    trade.size.toString(),
    trade.rr.toString(),
    trade.pnl.toString(),
    trade.tags.join(';'),
    trade.notes || ''
  ])
  
  return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
}

export const importTradesFromCSV = (csvContent: string): Trade[] => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
  
  const trades: Trade[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, ''))
    if (values.length >= 6) {
      trades.push({
        id: `imported-${Date.now()}-${i}`,
        date: values[0],
        symbol: values[1],
        side: values[2] as 'LONG' | 'SHORT',
        size: parseFloat(values[3]) || 0,
        rr: parseFloat(values[4]) || 0,
        pnl: parseFloat(values[5]) || 0,
        tags: values[6] ? values[6].split(';').filter(t => t.trim()) : [],
        notes: values[7] || ''
      })
    }
  }
  
  return trades
}

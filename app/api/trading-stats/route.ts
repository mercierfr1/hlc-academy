import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user ID
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get trades from trade_journal table
    const { data: trades, error: tradesError } = await supabase
      .from('trade_journal')
      .select('pnl, trade_date')
      .eq('email', email)
      .order('trade_date', { ascending: false })

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    // Calculate statistics
    const totalTrades = trades.length
    const totalPnL = trades.reduce((sum, trade) => sum + parseFloat(trade.pnl || '0'), 0)
    const winningTrades = trades.filter(trade => parseFloat(trade.pnl || '0') > 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calculate trades this month
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const tradesThisMonth = trades.filter(trade => {
      const tradeDate = new Date(trade.trade_date)
      return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear
    }).length

    // Calculate current streak (consecutive winning days)
    let currentStreak = 0
    if (trades.length > 0) {
      const tradesByDate = trades.reduce((acc, trade) => {
        const date = trade.trade_date.split('T')[0]
        if (!acc[date]) acc[date] = []
        acc[date].push(parseFloat(trade.pnl || '0'))
        return acc
      }, {} as Record<string, number[]>)

      const sortedDates = Object.keys(tradesByDate).sort().reverse()
      let streakCount = 0
      
      for (const date of sortedDates) {
        const dayPnL = tradesByDate[date].reduce((sum, pnl) => sum + pnl, 0)
        if (dayPnL > 0) {
          streakCount++
        } else {
          break
        }
      }
      currentStreak = streakCount
    }

    const stats = {
      totalPnL: totalPnL,
      winRate: winRate,
      tradesThisMonth: tradesThisMonth,
      currentStreak: currentStreak,
      totalTrades: totalTrades
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Trading stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

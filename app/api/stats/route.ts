import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    // Get trading statistics
    const { data: trades, error: tradesError } = await supabase
      .from('trade_journal')
      .select('outcome, pnl, trade_date')
      .eq('user_id', user.id)
      .gte('trade_date', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    if (tradesError) {
      return NextResponse.json(
        { error: tradesError.message },
        { status: 500 }
      )
    }

    // Calculate trading stats
    const totalTrades = trades.length
    const winningTrades = trades.filter(t => t.outcome === 'Win').length
    const losingTrades = trades.filter(t => t.outcome === 'Loss').length
    const breakEvenTrades = trades.filter(t => t.outcome === 'Break Even').length
    
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    
    const totalPnL = trades.reduce((sum, trade) => sum + (parseFloat(trade.pnl?.toString() || '0')), 0)
    const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0

    // Get study statistics
    const { data: studyTime, error: studyError } = await supabase
      .from('user_section_progress')
      .select('time_spent_minutes')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())

    if (studyError) {
      return NextResponse.json(
        { error: studyError.message },
        { status: 500 }
      )
    }

    const totalStudyTime = studyTime.reduce((sum, section) => sum + (section.time_spent_minutes || 0), 0)

    // Get XP statistics
    const { data: xpTransactions, error: xpError } = await supabase
      .from('xp_transactions')
      .select('amount, source')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())

    if (xpError) {
      return NextResponse.json(
        { error: xpError.message },
        { status: 500 }
      )
    }

    const totalXP = xpTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)

    // Get user profile for current level and XP
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp_points, level')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    // Calculate XP progress to next level
    const currentLevelXP = (profile.level - 1) * 1000
    const nextLevelXP = profile.level * 1000
    const xpProgress = ((profile.xp_points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

    return NextResponse.json({
      trading: {
        totalTrades,
        winningTrades,
        losingTrades,
        breakEvenTrades,
        winRate: Math.round(winRate * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        avgPnL: Math.round(avgPnL * 100) / 100,
      },
      study: {
        totalStudyTime,
        avgStudyTimePerDay: Math.round(totalStudyTime / parseInt(period) * 10) / 10,
      },
      xp: {
        currentXP: profile.xp_points,
        currentLevel: profile.level,
        xpProgress: Math.round(xpProgress * 100) / 100,
        xpToNextLevel: nextLevelXP - profile.xp_points,
        totalXPEarned: totalXP,
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

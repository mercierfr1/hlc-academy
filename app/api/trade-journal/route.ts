import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, trade } = await req.json()

    if (!email || !trade) {
      return NextResponse.json(
        { error: 'Email and trade data are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the user ID from the email
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

    // Insert the trade
    const tradeToInsert = {
      user_id: userData.id,
      email: email,
      symbol: trade.symbol,
      side: trade.side || trade.type?.toUpperCase() || 'LONG',
      size: trade.size || 1,
      rr: trade.rr || trade.riskReward || 1,
      pnl: trade.pnl,
      entry_price: trade.entryPrice || trade.entry_price,
      exit_price: trade.exitPrice || trade.exit_price,
      quantity: trade.quantity || trade.size || 1,
      tags: Array.isArray(trade.tags) ? trade.tags : (trade.tags ? [trade.tags] : []),
      notes: trade.notes,
      emotions: Array.isArray(trade.emotions) ? trade.emotions : (trade.emotions ? [trade.emotions] : []),
      lessons: trade.lessons,
      journal_id: trade.journalId || trade.journal_id,
      trade_date: trade.date || trade.trade_date || new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('trade_journal')
      .insert(tradeToInsert)
      .select()

    if (error) {
      console.error('Error saving trade:', error)
      return NextResponse.json(
        { error: 'Failed to save trade' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trade saved successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('Trade journal API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const symbol = searchParams.get('symbol')
    const side = searchParams.get('side')

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

    // Build query
    let query = supabase
      .from('trade_journal')
      .select('*')
      .eq('email', email)

    if (startDate) {
      query = query.gte('trade_date', startDate)
    }
    if (endDate) {
      query = query.lte('trade_date', endDate)
    }
    if (symbol) {
      query = query.eq('symbol', symbol)
    }
    if (side) {
      query = query.eq('side', side)
    }

    query = query.order('trade_date', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching trades:', error)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      trades: data || []
    })

  } catch (error) {
    console.error('Trade journal GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, tradeId, updates } = await req.json()

    if (!email || !tradeId || !updates) {
      return NextResponse.json(
        { error: 'Email, tradeId, and updates are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the user ID from the email
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

    // Update the trade
    const { data, error } = await supabase
      .from('trade_journal')
      .update(updates)
      .eq('id', tradeId)
      .eq('user_id', userData.id)
      .select()

    if (error) {
      console.error('Error updating trade:', error)
      return NextResponse.json(
        { error: 'Failed to update trade' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trade updated successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('Trade journal PUT API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const tradeId = searchParams.get('tradeId')

    if (!email || !tradeId) {
      return NextResponse.json(
        { error: 'Email and tradeId parameters are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the user ID from the email
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

    // Delete the trade
    const { error } = await supabase
      .from('trade_journal')
      .delete()
      .eq('id', tradeId)
      .eq('user_id', userData.id)

    if (error) {
      console.error('Error deleting trade:', error)
      return NextResponse.json(
        { error: 'Failed to delete trade' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trade deleted successfully'
    })

  } catch (error) {
    console.error('Trade journal DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const symbol = searchParams.get('symbol')

    let query = supabase
      .from('trade_journal')
      .select('*')
      .eq('user_id', user.id)
      .order('trade_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (symbol) {
      query = query.eq('symbol', symbol)
    }

    const { data: trades, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ trades })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const tradeData = await request.json()

    const { data: trade, error } = await supabase
      .from('trade_journal')
      .insert({
        user_id: user.id,
        ...tradeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Award XP for trade journal entry
    await supabase
      .from('xp_transactions')
      .insert({
        user_id: user.id,
        amount: 10,
        source: 'trade_journal',
        description: 'Added trade journal entry',
        reference_id: trade.id,
      })

    return NextResponse.json({ 
      trade,
      message: 'Trade added successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

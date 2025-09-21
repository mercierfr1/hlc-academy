import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { email, goals } = await req.json()

    if (!email || !goals) {
      return NextResponse.json(
        { error: 'Email and goals are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

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

    // Delete existing goals for this user
    const { error: deleteError } = await supabase
      .from('trading_goals')
      .delete()
      .eq('user_id', userData.id)

    if (deleteError) {
      console.error('Error deleting existing goals:', deleteError)
    }

    // Insert new goals
    const goalsToInsert = goals.map((goal: any) => ({
      user_id: userData.id,
      email: email,
      title: goal.title,
      description: goal.description,
      target_date: goal.targetDate,
      priority: goal.priority,
      completed: goal.completed,
      created_at: goal.createdAt || new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('trading_goals')
      .insert(goalsToInsert)
      .select()

    if (error) {
      console.error('Error saving trading goals:', error)
      return NextResponse.json(
        { error: 'Failed to save trading goals' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Trading goals saved successfully',
      data
    })

  } catch (error) {
    console.error('Trading goals API error:', error)
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

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get trading goals for the user
    const { data, error } = await supabase
      .from('trading_goals')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching trading goals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch trading goals' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      goals: data || []
    })

  } catch (error) {
    console.error('Trading goals GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

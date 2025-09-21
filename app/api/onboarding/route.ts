import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { email, responses } = await req.json()

    if (!email || !responses) {
      return NextResponse.json(
        { error: 'Email and responses are required' },
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

    // Save onboarding responses
    const { data, error } = await supabase
      .from('onboarding_responses')
      .upsert({
        user_id: userData.id,
        email: email,
        trading_experience: responses.tradingExperience,
        current_profitability: responses.currentProfitability,
        biggest_challenge: responses.biggestChallenge,
        account_size: responses.accountSize,
        time_commitment: responses.timeCommitment,
        primary_goal: responses.primaryGoal,
        motivation_level: responses.motivationLevel,
        preferred_learning_style: responses.preferredLearningStyle,
        completed_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error saving onboarding responses:', error)
      return NextResponse.json(
        { error: 'Failed to save onboarding responses' },
        { status: 500 }
      )
    }

    // Update user profile to mark onboarding as completed
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding responses saved successfully',
      data
    })

  } catch (error) {
    console.error('Onboarding API error:', error)
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

    // Get onboarding responses for the user
    const { data, error } = await supabase
      .from('onboarding_responses')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { completed: false },
          { status: 200 }
        )
      }
      console.error('Error fetching onboarding responses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch onboarding responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      completed: true,
      data
    })

  } catch (error) {
    console.error('Onboarding GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        course_sections (
          *,
          user_section_progress!inner (
            status,
            time_spent_minutes,
            completed_at
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (courseError) {
      return NextResponse.json(
        { error: courseError.message },
        { status: 404 }
      )
    }

    // Get user's course progress
    const { data: progress } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', params.id)
      .single()

    return NextResponse.json({ 
      course,
      progress: progress || {
        status: 'Not Started',
        progress_percentage: 0,
        time_spent_minutes: 0
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

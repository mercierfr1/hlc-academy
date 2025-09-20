import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    // Get user's plan if authenticated
    let userPlan = 'Kickstart'
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
      
      userPlan = profile?.plan || 'Kickstart'
    }

    // Get courses based on user's plan
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_sections (
          id,
          title,
          description,
          duration_minutes,
          order_index
        )
      `)
      .order('order_index')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Filter courses based on user's plan
    const filteredCourses = courses.filter(course => {
      if (!course.is_premium) return true
      if (userPlan === 'Mastery') return true
      if (userPlan === 'Scale Up' && course.required_plan !== 'Mastery') return true
      if (userPlan === 'Kickstart' && course.required_plan === 'Kickstart') return true
      return false
    })

    return NextResponse.json({ courses: filteredCourses })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

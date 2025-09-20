import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(
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

    const { sectionId, timeSpent, completed } = await request.json()

    // Update section progress
    if (sectionId) {
      const { error: sectionError } = await supabase
        .from('user_section_progress')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          time_spent_minutes: timeSpent || 0,
          status: completed ? 'Completed' : 'In Progress',
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })

      if (sectionError) {
        return NextResponse.json(
          { error: sectionError.message },
          { status: 500 }
        )
      }
    }

    // Calculate overall course progress
    const { data: sections } = await supabase
      .from('course_sections')
      .select('id')
      .eq('course_id', params.id)

    const { data: completedSections } = await supabase
      .from('user_section_progress')
      .select('section_id')
      .eq('user_id', user.id)
      .eq('status', 'Completed')
      .in('section_id', sections?.map(s => s.id) || [])

    const progressPercentage = sections 
      ? Math.round((completedSections?.length || 0) / sections.length * 100)
      : 0

    const courseStatus = progressPercentage === 100 ? 'Completed' : 
                        progressPercentage > 0 ? 'In Progress' : 'Not Started'

    // Update course progress
    const { data: course, error: courseError } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: user.id,
        course_id: params.id,
        status: courseStatus,
        progress_percentage: progressPercentage,
        completed_at: courseStatus === 'Completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (courseError) {
      return NextResponse.json(
        { error: courseError.message },
        { status: 500 }
      )
    }

    // Award XP if course is completed
    if (courseStatus === 'Completed') {
      const { data: courseData } = await supabase
        .from('courses')
        .select('xp_reward')
        .eq('id', params.id)
        .single()

      if (courseData?.xp_reward) {
        await supabase
          .from('xp_transactions')
          .insert({
            user_id: user.id,
            amount: courseData.xp_reward,
            source: 'course_completion',
            description: `Completed course: ${params.id}`,
            reference_id: params.id,
          })
      }
    }

    return NextResponse.json({ 
      progress: course,
      message: 'Progress updated successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

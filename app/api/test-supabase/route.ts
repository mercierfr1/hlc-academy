import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    
    const supabase = await createClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          message: 'Supabase connection failed',
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Supabase connection successful',
      courses: data,
      count: data?.length || 0
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { 
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

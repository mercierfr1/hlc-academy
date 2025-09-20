import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('GoHighLevel Webhook received:', JSON.stringify(body, null, 2))

    // Handle payment success webhook from GoHighLevel
    if (body.type === 'PaymentSuccess' || body.event === 'payment.success') {
      const { contact, payment, funnel } = body.data || body
      
      if (contact && payment) {
        // Extract customer information
        const customerEmail = contact.email || contact.email_address
        const customerName = contact.first_name && contact.last_name 
          ? `${contact.first_name} ${contact.last_name}`
          : contact.first_name || contact.full_name || 'Customer'
        
        // Determine plan from payment amount or funnel
        let plan = 'kickstart' // default
        if (payment.amount) {
          const amount = parseFloat(payment.amount)
          if (amount >= 279) {
            plan = 'mastery'
          } else if (amount >= 97) {
            plan = 'scaleup'
          } else {
            plan = 'kickstart'
          }
        }

        // Store payment information in database
        const supabase = await createClient()
        
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customerEmail)
          .single()

        if (existingUser) {
          // Update existing user's plan
          await supabase
            .from('profiles')
            .update({ 
              plan: plan,
              updated_at: new Date().toISOString()
            })
            .eq('email', customerEmail)
        } else {
          // Create new user profile (they'll complete registration later)
          await supabase
            .from('profiles')
            .insert({
              id: contact.id || `ghl_${Date.now()}`,
              email: customerEmail,
              full_name: customerName,
              plan: plan,
              level: 1,
              xp: 0,
              phone: contact.phone || contact.phone_number || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
        }

        console.log(`✅ Payment processed for ${customerEmail} - Plan: ${plan}`)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error) {
    console.error('GoHighLevel webhook error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (webhook verification)
  return NextResponse.json({ 
    message: 'GoHighLevel webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
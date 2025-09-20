// GoHighLevel Configuration
// Replace these URLs with your actual GoHighLevel account URLs

export const GHL_CONFIG = {
  // Your GoHighLevel subdomain
  subdomain: 'your-ghl-account', // Replace with your actual GHL subdomain
  
  // Payment URLs for each plan
  paymentUrls: {
    kickstart: 'https://your-ghl-account.gohighlevel.com/calendar/booking/kickstart-plan',
    scaleup: 'https://your-ghl-account.gohighlevel.com/calendar/booking/scaleup-plan', 
    mastery: 'https://your-ghl-account.gohighlevel.com/calendar/booking/mastery-plan'
  },
  
  // Webhook configuration
  webhook: {
    // Your webhook endpoint URL
    url: '/api/ghl-webhook',
    // Secret key for webhook verification (set in environment variables)
    secret: process.env.GHL_WEBHOOK_SECRET || 'your-webhook-secret'
  },
  
  // Success redirect URL (where users go after successful payment)
  successRedirect: '/payment-success'
}

// Helper function to get payment URL for a plan
export function getPaymentUrl(planId: string): string {
  return GHL_CONFIG.paymentUrls[planId as keyof typeof GHL_CONFIG.paymentUrls] || GHL_CONFIG.paymentUrls.kickstart
}

// Helper function to update subdomain in all URLs
export function updateSubdomain(newSubdomain: string) {
  GHL_CONFIG.subdomain = newSubdomain
  GHL_CONFIG.paymentUrls = {
    kickstart: `https://${newSubdomain}.gohighlevel.com/calendar/booking/kickstart-plan`,
    scaleup: `https://${newSubdomain}.gohighlevel.com/calendar/booking/scaleup-plan`,
    mastery: `https://${newSubdomain}.gohighlevel.com/calendar/booking/mastery-plan`
  }
}

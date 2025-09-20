#!/usr/bin/env node

console.log('🧪 Testing Payment Success Page\n')

// Test the payment success page with GoHighLevel parameters
const testUrl = 'http://localhost:3000/payment-success?plan=kickstart&success=true&contact=test123&email=test@example.com'

console.log('📋 Testing Payment Success Page...')
console.log('URL:', testUrl)
console.log('')

// Test parameters
const params = {
  plan: 'kickstart',
  success: 'true', 
  contact: 'test123',
  email: 'test@example.com'
}

console.log('✅ Expected Parameters:')
Object.entries(params).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`)
})

console.log('')
console.log('🔍 What to check:')
console.log('1. Page loads without errors')
console.log('2. Shows "Payment Successful!" message')
console.log('3. Displays registration prompt after 2 seconds')
console.log('4. Shows "Create Account" and "Login" buttons')
console.log('5. Pre-fills email if provided')
console.log('')

console.log('🌐 Open this URL in your browser:')
console.log(testUrl)
console.log('')

console.log('✅ Payment Success Page Test Complete!')
console.log('The page should show payment confirmation and registration prompt.')

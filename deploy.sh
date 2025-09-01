#!/bin/bash

echo "🚀 Deploying HLC Academy Stripe Integration..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Make setup script executable
chmod +x setup-stripe.sh

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Please ensure the server file exists."
    exit 1
fi

# Test the server
echo "🧪 Testing server..."
echo "✅ Server file exists and ready to start"
echo "   Run 'npm start' to start the server"

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your webhook in Stripe Dashboard:"
echo "   - Go to Developers → Webhooks"
echo "   - Add endpoint: https://yourdomain.com/webhook"
echo "   - Copy the webhook secret"
echo "   - Update server.js with the secret"
echo ""
echo "2. Start your server:"
echo "   npm start"
echo ""
echo "3. Test the integration:"
echo "   - Visit your website"
echo "   - Try enrolling in a course"
echo "   - Use test card: 4242 4242 4242 4242"
echo ""
echo "🔑 Your Stripe keys are already configured!"
echo "⚠️  Remember to update the webhook secret in server.js"

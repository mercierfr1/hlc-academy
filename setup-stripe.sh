#!/bin/bash

echo "🚀 Setting up HLC Academy Stripe Integration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your Stripe integration is ready."
echo ""
echo "📋 Next steps:"
echo "1. Create your Stripe products and get Price IDs"
echo "2. Update the server-example.js with your Price IDs"
echo "3. Set up webhooks in your Stripe dashboard"
echo "4. Run: npm start"
echo ""
echo "🔑 Configure your API keys in environment variables:"
echo "   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here"
echo "   STRIPE_SECRET_KEY=sk_test_your_secret_key_here"
echo ""
echo "⚠️  IMPORTANT: Keep your secret key secure and never share it!"

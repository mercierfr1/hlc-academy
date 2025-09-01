#!/bin/bash

# HLC Academy - Deploy to Vercel Script
# This script helps you deploy your HLC Academy to Vercel

echo "🚀 HLC Academy Deployment to Vercel"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI found"
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Please run this script from your project root directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📄 Found index.html: ✅"

# Create vercel.json configuration
echo "⚙️  Creating Vercel configuration..."
cat > vercel.json << EOF
{
  "version": 2,
  "name": "hlc-academy",
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "*.css",
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    },
    {
      "src": "backend-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend-server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

echo "✅ Vercel configuration created"

# Create .vercelignore
echo "📝 Creating .vercelignore..."
cat > .vercelignore << EOF
node_modules
.env
.env.local
.env.production
*.log
.DS_Store
.git
.gitignore
README.md
*.md
database-setup.sql
auth-system.js
backend-package.json
env-example.txt
deploy-to-vercel.sh
EOF

echo "✅ .vercelignore created"

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if vercel whoami &> /dev/null; then
    echo "✅ Already logged in to Vercel"
else
    echo "🔑 Please log in to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "This may take a few minutes..."

vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables:"
echo "   - DATABASE_URL (from Supabase)"
echo "   - JWT_SECRET (generate a random string)"
echo "   - STRIPE_SECRET_KEY (from Stripe)"
echo "   - STRIPE_WEBHOOK_SECRET (from Stripe)"
echo "3. Test your deployment"
echo "4. Set up custom domain (optional)"
echo ""
echo "🔗 Your site is now live at: https://your-project.vercel.app"
echo ""
echo "📚 For more help, see DEPLOYMENT_GUIDE.md"

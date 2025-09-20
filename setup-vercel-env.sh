#!/bin/bash

# 🚀 Setup Vercel Environment Variables for HLC Academy

echo "🔧 Setting up Vercel environment variables..."

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first..."
    vercel login
fi

echo "📝 Setting environment variables..."

# Set Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://mwrtykejdzvnlckmqbbn.supabase.co"

# Set Supabase Anon Key (you'll need to enter this manually)
echo "🔑 Please enter your Supabase Anon Key:"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Set Supabase Service Role Key (you'll need to enter this manually)
echo "🔑 Please enter your Supabase Service Role Key:"
vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "✅ Environment variables set!"
echo ""
echo "🚀 Now redeploy with:"
echo "vercel --prod"

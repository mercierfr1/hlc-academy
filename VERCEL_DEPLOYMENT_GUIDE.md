# 🚀 **Vercel Deployment Guide for HLC Academy**

## **✅ Build Status**
Your project builds successfully locally! The deployment failed because environment variables need to be configured in Vercel.

## **🔧 Step 1: Set Environment Variables in Vercel**

### **Via Vercel Dashboard:**
1. **Go to:** [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Find your project:** `hlc-academy1` (or similar)
3. **Click:** Settings → Environment Variables
4. **Add these variables:**

| **Variable Name** | **Value** | **Environment** |
|------------------|-----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mwrtykejdzvnlckmqbbn.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |

### **Via Vercel CLI:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## **🚀 Step 2: Redeploy**

After setting environment variables, redeploy:

```bash
vercel --prod
```

## **📋 Current Deployment URLs**

- **Production:** https://hlc-academy1-flzcxlhao-mercierfr1s-projects.vercel.app
- **Inspect:** https://vercel.com/mercierfr1s-projects/hlc-academy1/64ARaic1dvXWgrKxFRq7qvqUW6tw

## **🔗 Step 3: Update GoHighLevel Success URL**

Once deployed successfully, update your GoHighLevel Success URL to:

```
https://your-actual-domain.vercel.app/payment-success?plan={{plan_name}}&success=true&email={{email}}
```

Replace `your-actual-domain` with your actual Vercel domain.

## **⚠️ Troubleshooting**

### **If Build Still Fails:**
1. **Check environment variables** are set correctly
2. **Verify Supabase keys** are valid
3. **Check Vercel logs** for specific errors

### **If Supabase Connection Fails:**
1. **Verify URL format:** `https://mwrtykejdzvnlckmqbbn.supabase.co`
2. **Check anon key** is correct
3. **Ensure service role key** has admin permissions

## **🎯 Next Steps After Successful Deployment**

1. **Test the live site** with a real payment
2. **Update GoHighLevel** with your production URL
3. **Monitor logs** for any issues
4. **Set up custom domain** if needed

## **📊 Deployment Status**

- ✅ **Local Build:** Working
- ❌ **Vercel Build:** Failed (missing env vars)
- 🔄 **Next Action:** Set environment variables and redeploy

Your project is ready to deploy - just need to configure the environment variables! 🚀

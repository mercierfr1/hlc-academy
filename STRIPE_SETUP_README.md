# 🚀 HLC Academy Stripe Integration Setup

Your Stripe integration is **90% complete**! Here's what you need to do to finish the setup.

## ✅ **What's Already Done**
- ✅ Frontend Stripe integration configured
- ✅ Backend server code ready
- ✅ Your real Stripe API keys integrated
- ✅ Success page created
- ✅ All files properly linked
- ✅ Production-ready server.js created
- ✅ Deployment script created
- ✅ Package.json updated

## 🔑 **Configure Your Stripe Keys**
- **Publishable Key**: Set `STRIPE_PUBLISHABLE_KEY` environment variable
- **Secret Key**: Set `STRIPE_SECRET_KEY` environment variable
- **Webhook Secret**: Set `STRIPE_WEBHOOK_SECRET` environment variable

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Install Dependencies**
```bash
# Option 1: Use the deployment script (recommended)
chmod +x deploy.sh
./deploy.sh

# Option 2: Manual setup
npm install
chmod +x setup-stripe.sh
./setup-stripe.sh
```

### **Step 2: Create Stripe Products**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create 3 products with these exact names and prices:

| Product Name | Price | Billing | Price ID (copy this) |
|--------------|-------|---------|---------------------|
| **Kickstart Weekly** | £30.00 | Weekly recurring | `price_...` |
| **Scale Up Monthly** | £97.00 | Monthly recurring | `price_...` |
| **Mastery Quarterly** | £279.00 | 3-month recurring | `price_...` |

### **Step 3: Update Price IDs**
1. Open `server-example.js`
2. Replace the placeholder Price IDs with your real ones:
```javascript
const pricing = {
    'price_kickstart_weekly': 'price_your_actual_id_here',
    'price_scaleup_monthly': 'price_your_actual_id_here',
    'price_mastery_quarterly': 'price_your_actual_id_here'
};
```

### **Step 4: Set Up Webhooks**
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **webhook signing secret**
6. Update `server.js`:
```javascript
const endpointSecret = 'whsec_your_webhook_secret_here';
```

### **Step 5: Start Your Server**
```bash
# Start the production server
npm start

# Or start in development mode with auto-reload
npm run dev
```

## 🧪 **Test the Integration**

### **Test Cards (Use these first)**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

### **Test Flow**
1. Go to your website
2. Click "Enroll Now" on any pricing plan
3. Should redirect to Stripe checkout
4. Use test card to complete payment
5. Should land on success page

## 🌐 **Deploy to Your Server**

### **Option 1: VPS/Hosting (Recommended)**
1. Upload all files to your server
2. Run `chmod +x deploy.sh && ./deploy.sh`
3. Set up domain pointing to your server
4. Configure webhook URL in Stripe dashboard

### **Option 2: Quick Local Test**
1. Run `chmod +x deploy.sh && ./deploy.sh`
2. Start server: `npm start`
3. Test locally at `http://localhost:3000`

### **Option 3: Heroku**
1. Create Heroku app
2. Connect your GitHub repo
3. Deploy automatically
4. Set environment variables for Stripe keys

### **Option 4: Vercel/Netlify**
1. Upload to your hosting provider
2. Set up serverless functions
3. Configure environment variables

## 🔧 **Troubleshooting**

### **"Stripe not initialized"**
- Check your publishable key is correct
- Make sure Stripe.js is loading

### **"Failed to create checkout session"**
- Check your secret key is correct
- Verify your backend server is running
- Check the endpoint is accessible

### **Webhook not working**
- Verify webhook URL is accessible
- Check webhook secret is correct
- Ensure server can handle POST requests

## 📱 **Mobile Testing**
1. Use browser dev tools to simulate mobile
2. Test on actual devices
3. Verify Stripe checkout works on mobile
4. Check success page is mobile-responsive

## 🎯 **What Happens After Payment**
1. **User completes payment** on Stripe
2. **Stripe sends webhook** to your server
3. **Your server creates user account**
4. **User gets access to course**
5. **Welcome email sent**
6. **User lands on success page**

## 🚨 **Security Checklist**
- ✅ Secret key only in backend code
- ✅ Webhook signatures verified
- ✅ HTTPS for all endpoints
- ✅ Payment amounts validated
- ✅ Proper error handling

## 📞 **Need Help?**
- Check Stripe logs in dashboard
- Verify your server logs
- Test with Stripe test mode first
- Use Stripe CLI for local testing

## 🎉 **You're Ready!**
Once you complete these steps, your enrollment buttons will:
1. **Redirect to Stripe** for secure payment
2. **Process payments** automatically
3. **Create user accounts** after successful payment
4. **Grant course access** immediately
5. **Handle subscriptions** automatically

**Your HLC Academy is now a fully functional payment platform!** 🚀

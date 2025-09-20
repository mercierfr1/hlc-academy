# 🔗 **How to Link GoHighLevel with Your Success Page**

## **🎯 Quick Setup Steps**

### **Step 1: Access Your GoHighLevel Payment Form**

1. **Login** to your GoHighLevel dashboard at `https://app.gohighlevel.com`
2. **Navigate** to "FastPay Direct" in your left sidebar
3. **Find** your payment form (ID: `68b75a8c67ee3b3dca68bf37`)
4. **Click** "Edit" or "Settings" on your form

### **Step 2: Set the Success URL**

In your FastPay Direct form settings, find the **"Success URL"** or **"Redirect URL"** field and enter:

```
https://yourdomain.com/payment-success?plan={{plan_name}}&success=true&email={{email}}
```

**For Local Testing:**
```
http://localhost:3000/payment-success?plan={{plan_name}}&success=true&email={{email}}
```

### **Step 3: Save and Test**

1. **Save** your form settings
2. **Test** with a small payment to verify the redirect works

## **🔍 Where to Find Success URL Setting**

### **Option 1: FastPay Direct Form Settings**
- **Location:** FastPay Direct → Your Form → Settings/Edit
- **Field Name:** "Success URL", "Redirect URL", or "Thank You Page URL"

### **Option 2: Campaign Builder**
- **Location:** Campaigns → Your Campaign → FastPay Direct Step
- **Field Name:** "Success Page URL" or "Redirect URL"

### **Option 3: Funnel Builder**
- **Location:** Funnels → Your Funnel → Payment Step
- **Field Name:** "Success Redirect URL" or "Thank You Page"

## **📋 Exact Configuration**

### **Production URL (replace yourdomain.com):**
```
https://yourdomain.com/payment-success?plan={{plan_name}}&success=true&email={{email}}
```

### **Local Testing URL:**
```
http://localhost:3000/payment-success?plan={{plan_name}}&success=true&email={{email}}
```

### **Important Notes:**
- **Keep the `{{variable}}` syntax** exactly as shown - GoHighLevel will replace these
- **Use HTTPS** for production (required by Supabase)
- **Test thoroughly** before going live

## **🧪 Testing Your Setup**

### **Test URLs (for verification):**
```
http://localhost:3000/payment-success?plan=kickstart&success=true&email=test@example.com
http://localhost:3000/payment-success?plan=scaleup&success=true&email=user@test.com
http://localhost:3000/payment-success?plan=mastery&success=true&email=master@test.com
```

### **Expected Flow:**
1. **User selects plan** on your pricing page
2. **Redirected to GoHighLevel** payment form
3. **User enters email** and completes payment
4. **GoHighLevel redirects** to your success page with parameters
5. **Email is pre-filled** in registration form
6. **User creates account** with just a password
7. **Email verification** sent automatically by Supabase

## **⚠️ Troubleshooting**

### **If Redirect Doesn't Work:**
1. **Check URL format** - make sure it matches exactly
2. **Verify HTTPS** - required for production
3. **Test with localhost** first
4. **Check GoHighLevel logs** for redirect errors

### **If Email Isn't Passed:**
1. **Verify `{{email}}` parameter** in Success URL
2. **Check GoHighLevel form** has email field
3. **Test with manual URL** to verify your page works

### **If Success Page Shows Error:**
1. **Check URL parameters** are correct
2. **Verify your domain** is accessible
3. **Test localhost version** first

## **🎯 GoHighLevel Variables Available**

| **Variable** | **What It Contains** | **Example** |
|-------------|---------------------|-------------|
| `{{plan_name}}` | Plan selected | `kickstart`, `scaleup`, `mastery` |
| `{{email}}` | Customer email | `user@example.com` |
| `{{contact_id}}` | GoHighLevel contact ID | `12345` |
| `{{payment_id}}` | Payment transaction ID | `pay_abc123` |

## **✅ Final Checklist**

- [ ] **Success URL set** in GoHighLevel form
- [ ] **URL format correct** with `{{variables}}`
- [ ] **HTTPS used** for production
- [ ] **Tested locally** first
- [ ] **Real payment tested** for full flow
- [ ] **Email parameter verified** in redirect

## **🚀 Ready to Go Live!**

Once you've set the Success URL in your GoHighLevel form, your payment flow will be complete:

**Payment → GoHighLevel → Your Success Page → Registration → Dashboard**

Your users will have a seamless experience from payment to account creation! 🎉

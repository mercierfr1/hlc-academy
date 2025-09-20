# 🎯 **Single Form Payment Setup Guide**

## **Current Configuration**

You're using **one payment form** for all three plans:
- **Payment Link:** `https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37`
- **Current Plan:** Kickstart Plan (£30/week)
- **All Plans Redirect:** To the same payment form

## **🔧 GoHighLevel Configuration**

### **Step 1: Set Success URL in Your Payment Form**

1. **Login** to your GoHighLevel dashboard
2. **Go to** FastPay Direct
3. **Find** your payment form (ID: `68b75a8c67ee3b3dca68bf37`)
4. **Edit** the form settings
5. **Set Success URL** to:

```
https://yourdomain.com/payment-success?plan={{plan_name}}&success=true
```

**For Local Testing:**
```
http://localhost:3000/payment-success?plan={{plan_name}}&success=true
```

### **Step 2: How It Works**

1. **User selects** Kickstart, Scale Up, or Mastery plan
2. **Redirected** to the same GoHighLevel payment form
3. **User sees** the current form (Kickstart £30/week)
4. **User completes** payment
5. **GoHighLevel redirects** to your success page with plan info
6. **User creates** account and accesses dashboard

## **⚠️ Important Considerations**

### **Current Limitations**
- **Same Pricing:** All users see £30/week regardless of selected plan
- **Same Features:** All users get Kickstart plan features
- **Manual Tracking:** You'll need to track which plan they actually wanted

### **Workarounds**

#### **Option 1: Update Payment Form Description**
Update your GoHighLevel form to show:
```
"HLC Academy - Selected Plan: [PLAN_NAME]"
```

#### **Option 2: Use Contact Tags**
Set up contact tags in GoHighLevel based on the success URL parameter.

#### **Option 3: Accept Current Setup**
Keep it simple - all users get Kickstart plan features regardless of selection.

## **📋 Success URL Examples**

**Kickstart Plan:**
```
https://yourdomain.com/payment-success?plan=kickstart&success=true
```

**Scale Up Plan:**
```
https://yourdomain.com/payment-success?plan=scaleup&success=true
```

**Mastery Plan:**
```
https://yourdomain.com/payment-success?plan=mastery&success=true
```

## **🧪 Testing**

### **Test URLs**
```
http://localhost:3000/payment-success?plan=kickstart&success=true
http://localhost:3000/payment-success?plan=scaleup&success=true
http://localhost:3000/payment-success?plan=mastery&success=true
```

### **Test Flow**
1. **Go to** pricing page: `http://localhost:3000`
2. **Click** any plan button
3. **Should redirect** to GoHighLevel payment form
4. **Complete** a test payment
5. **Should redirect** to your success page
6. **Should show** registration prompt

## **✅ Benefits of Single Form**

- **Simple Setup** - One form to manage
- **Easy Maintenance** - Single point of configuration
- **Consistent Experience** - All users get same payment flow
- **Quick Deployment** - Ready to use immediately

## **🎯 Ready to Go!**

Your system is configured for single form payment. Just set the Success URL in your GoHighLevel form and you're ready to accept payments!

**Next Steps:**
1. ✅ Set Success URL in GoHighLevel
2. ✅ Test the payment flow
3. ✅ Go live with your payment system

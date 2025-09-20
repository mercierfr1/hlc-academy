# 🔗 **GoHighLevel Payment Links Configuration**

## **Separate Payment Links for Each Plan**

Replace the placeholder IDs below with your actual GoHighLevel FastPay Direct payment link IDs:

### **Kickstart Plan**
```
https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37
```

### **Scale Up Plan**  
```
https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37
```

### **Mastery Plan**
```
https://link.fastpaydirect.com/payment-link/68b75a8c67ee3b3dca68bf37
```

> **Note:** Currently using the same payment link for all plans. For better tracking and management, consider creating separate payment forms for each plan in GoHighLevel.

## **How to Get Your Payment Link IDs**

1. **Login** to your GoHighLevel dashboard
2. **Go to** FastPay Direct
3. **Create** separate payment forms for each plan:
   - Kickstart Plan Form
   - Scale Up Plan Form  
   - Mastery Plan Form
4. **Copy** the payment link ID from each form
5. **Replace** the placeholder IDs in the Pricing component

## **Success URL Configuration**

For each payment form, set the Success URL to:

```
https://yourdomain.com/payment-success?plan={{plan_name}}&success=true
```

**Where:**
- Replace `yourdomain.com` with your actual domain
- `{{plan_name}}` will be automatically replaced with: `kickstart`, `scaleup`, or `mastery`

## **Example Success URLs**

**Kickstart Plan Success URL:**
```
https://yourdomain.com/payment-success?plan=kickstart&success=true
```

**Scale Up Plan Success URL:**
```
https://yourdomain.com/payment-success?plan=scaleup&success=true
```

**Mastery Plan Success URL:**
```
https://yourdomain.com/payment-success?plan=mastery&success=true
```

## **Benefits of Separate Links**

✅ **Simpler Setup** - No complex parameter mapping  
✅ **Better Tracking** - Each plan has its own payment link  
✅ **Easier Management** - Individual plan settings  
✅ **User-Friendly** - Users fill in their own email  
✅ **Flexible** - Easy to modify individual plans  

## **Updated Flow**

1. **User selects plan** on pricing page
2. **Redirected** to specific plan payment page
3. **User fills in** their email and payment details
4. **Completes payment** on GoHighLevel
5. **Redirected** to your success page with plan info
6. **Creates account** using their own email
7. **Accesses** trading dashboard

## **Testing**

Test each payment link separately:
- Kickstart: `http://localhost:3000/payment-success?plan=kickstart&success=true`
- Scale Up: `http://localhost:3000/payment-success?plan=scaleup&success=true`  
- Mastery: `http://localhost:3000/payment-success?plan=mastery&success=true`

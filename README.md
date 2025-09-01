# 🎯 HLC Academy - Premium Trading Education Platform

> **Transform your trading journey with professional-grade education, tools, and community support.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hlc-academy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 **Live Demo**
- **Website**: [hlcacademy.com](https://hlcacademy.com) (coming soon)
- **Demo**: [hlc-academy.vercel.app](https://hlc-academy.vercel.app)

## 📋 **Overview**

HLC Academy is a comprehensive trading education platform designed for serious traders who want to:

- 📚 **Learn** from professional trading strategies
- 📊 **Track** their progress with advanced analytics
- 🎯 **Set** and achieve trading goals
- 📝 **Journal** their trades for continuous improvement
- 💰 **Scale** their trading business systematically

## ✨ **Key Features**

### 🎓 **Educational Content**
- **Comprehensive Curriculum** - From beginner to advanced
- **Video Lessons** - High-quality, professional content
- **Interactive Modules** - Hands-on learning experience
- **Progress Tracking** - Monitor your learning journey

### 📊 **Trading Dashboard**
- **Real-time Analytics** - Track your performance
- **Trade Journal** - Log and analyze every trade
- **Goal Setting** - Set and track trading objectives
- **Trading Plan** - Structured approach to trading

### 💳 **Subscription Management**
- **Stripe Integration** - Secure payment processing
- **Multiple Plans** - Weekly, monthly, and annual options
- **Customer Portal** - Manage your subscription
- **Webhook Handling** - Automated subscription management

### 🔐 **Security & Authentication**
- **JWT Authentication** - Secure user sessions
- **Password Hashing** - bcrypt with 12 rounds
- **Rate Limiting** - Protection against abuse
- **Input Validation** - XSS and SQL injection protection

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Supabase** - Database hosting and management

### **Payment Processing**
- **Stripe** - Payment gateway
- **Webhooks** - Real-time payment events
- **Customer Portal** - Subscription management

### **Deployment**
- **Vercel** - Frontend hosting
- **Supabase** - Database hosting
- **GitHub** - Version control
- **CI/CD** - Automated deployment

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ installed
- GitHub account
- Supabase account (free)
- Stripe account (free)

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/hlc-academy.git
cd hlc-academy
```

### **2. Set Up Database**
1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Run the SQL schema from `database-setup.sql`
4. Get your database URL and API keys

### **3. Configure Environment**
```bash
# Copy environment template
cp env-example.txt .env

# Edit .env with your actual values
nano .env
```

### **4. Install Dependencies**
```bash
# Install backend dependencies
cp backend-package.json package.json
npm install
```

### **5. Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📁 **Project Structure**

```
hlc-academy/
├── 📄 Frontend Files
│   ├── index.html              # Landing page
│   ├── dashboard.html          # User dashboard
│   ├── trading-dashboard.html  # Trading tools
│   ├── course.html            # Course content
│   ├── pricing.html           # Pricing plans
│   └── *.css                  # Stylesheets
│
├── 🔧 Backend Files
│   ├── backend-server.js      # Main server
│   ├── auth-system.js         # Authentication
│   └── database-setup.sql     # Database schema
│
├── 📚 Documentation
│   ├── README.md              # This file
│   ├── DEPLOYMENT_GUIDE.md    # Deployment instructions
│   └── DATA_STORAGE_SETUP.md  # Database setup
│
└── 🚀 Deployment
    ├── deploy-to-vercel.sh    # Deployment script
    └── vercel.json            # Vercel configuration
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=3001
NODE_ENV=production
```

### **Stripe Setup**
1. Create products in Stripe dashboard
2. Set up webhooks for payment events
3. Configure customer portal
4. Test with Stripe test cards

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Protected Routes**
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update profile
- `GET /api/protected/goals` - Get trading goals
- `POST /api/protected/goals` - Create goal
- `GET /api/protected/trades` - Get trade entries
- `POST /api/protected/trades` - Create trade entry

### **Webhooks**
- `POST /api/webhooks/stripe` - Stripe payment events

## 🎨 **Customization**

### **Branding**
- Update logo in navigation and footer
- Modify color scheme in CSS variables
- Customize typography and spacing

### **Content**
- Add your own course content
- Update pricing plans
- Modify trading strategies

### **Features**
- Add new trading tools
- Implement additional analytics
- Create custom reports

## 🔒 **Security**

- **Password Requirements**: 8+ characters, mixed case, numbers, symbols
- **JWT Tokens**: 24-hour expiration with secure secrets
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: XSS and SQL injection protection
- **HTTPS**: Automatic SSL certificates
- **CORS**: Configured for your domain

## 📈 **Performance**

- **CDN**: Global content delivery
- **Caching**: Optimized asset delivery
- **Database Indexes**: Fast query performance
- **Image Optimization**: Compressed and responsive
- **Lazy Loading**: Improved page load times

## 🧪 **Testing**

### **Manual Testing**
- User registration and login
- Payment processing
- Trading dashboard functionality
- Mobile responsiveness

### **Automated Testing**
```bash
# Run tests
npm test

# Test API endpoints
npm run test:api
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Deploy with one command
./deploy-to-vercel.sh
```

### **Manual Deployment**
1. Push code to GitHub
2. Connect Vercel to repository
3. Configure environment variables
4. Deploy automatically

## 📱 **Mobile Support**

- **Responsive Design** - Works on all devices
- **PWA Ready** - Can be installed as app
- **Touch Optimized** - Mobile-friendly interactions
- **Fast Loading** - Optimized for mobile networks

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check the guides in this repository
- **Issues**: Report bugs on GitHub Issues
- **Email**: support@hlcacademy.com
- **Discord**: Join our community server

## 🎯 **Roadmap**

### **Phase 1** ✅
- [x] Basic website structure
- [x] User authentication
- [x] Stripe integration
- [x] Trading dashboard

### **Phase 2** 🚧
- [ ] Mobile app (PWA)
- [ ] Advanced analytics
- [ ] Community features
- [ ] Live trading signals

### **Phase 3** 📋
- [ ] AI-powered insights
- [ ] Automated trading tools
- [ ] Advanced reporting
- [ ] Enterprise features

## 💰 **Pricing**

- **Weekly Plan**: £35/week
- **Monthly Plan**: £120/month
- **Annual Plan**: £1,200/year (2 months free)

## 🌟 **Why Choose HLC Academy?**

- ✅ **Professional Grade** - Enterprise-level security and performance
- ✅ **Comprehensive** - Everything you need in one platform
- ✅ **Scalable** - Grows with your trading business
- ✅ **Support** - Dedicated customer success team
- ✅ **Community** - Connect with like-minded traders
- ✅ **Results** - Proven strategies and methodologies

---

**Ready to transform your trading?** [Get Started Today](https://hlcacademy.com) 🚀

---

*Built with ❤️ for serious traders who want to succeed.*
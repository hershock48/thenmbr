# Environment Setup Guide - NMBR Platform

## 🔧 **Required Environment Variables**

### **1. Supabase Configuration (Required)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**How to get these:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and API keys

### **2. Stripe Configuration (For Payments)**
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get these:**
1. Go to Stripe Dashboard
2. Navigate to Developers → API Keys
3. Copy the publishable and secret keys
4. Set up webhook endpoint for donation processing

### **3. Email Configuration (For Newsletters)**
```bash
# Choose one:
RESEND_API_KEY=re_...
# OR
SENDGRID_API_KEY=SG...
```

**Recommended: Resend** (better for transactional emails)

### **4. Security Configuration**
```bash
NEXTAUTH_SECRET=your_random_secret_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_32_character_encryption_key
```

**Generate secrets:**
```bash
# Generate random secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For ENCRYPTION_KEY
```

## 🚀 **Quick Setup Steps**

### **Step 1: Copy Environment Template**
```bash
cp .env.example .env.local
```

### **Step 2: Fill in Your Values**
Edit `.env.local` with your actual credentials

### **Step 3: Test Configuration**
```bash
npm run dev
```

### **Step 4: Verify Database Connection**
Visit: `http://localhost:3000/api/health`

## 🔒 **Security Best Practices**

### **Environment File Security**
- ✅ Never commit `.env.local` to git
- ✅ Use different credentials for dev/staging/prod
- ✅ Rotate secrets regularly
- ✅ Use strong, random secrets

### **Production Environment**
- ✅ Use environment-specific configs
- ✅ Enable all security features
- ✅ Set up monitoring and alerting
- ✅ Regular security audits

## 📊 **Environment Validation**

### **Check if all required variables are set:**
```bash
# Run this script to validate your environment
node -e "
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}
"
```

## 🐛 **Troubleshooting**

### **Common Issues:**
1. **Supabase connection fails** → Check URL and keys
2. **Stripe payments not working** → Verify webhook configuration
3. **Email sending fails** → Check API key and permissions
4. **Database queries fail** → Verify RLS policies

### **Debug Mode:**
```bash
DEBUG=* npm run dev
```

## 📋 **Next Steps After Setup**

1. **Run database migrations** (subscription-schema-fixed.sql)
2. **Test all API endpoints**
3. **Verify email functionality**
4. **Test payment processing**
5. **Set up monitoring**

---

**Need help?** Check the troubleshooting section or review the API documentation.

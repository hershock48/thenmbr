# Resend Email Setup Guide for NMBR

## 🚀 Quick Setup (5 minutes)

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### 2. Get API Key
1. Go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it "NMBR Production" (or similar)
4. Copy the API key

### 3. Add to Environment Variables
Add to your `.env.local` file:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 4. Set Up Domain (Optional but Recommended)
1. Go to [Domains](https://resend.com/domains)
2. Add your domain (e.g., `thenmbr.com`)
3. Add the DNS records to your domain provider
4. Wait for verification (usually 5-10 minutes)

### 5. Update Email From Address
In `lib/email-templates/trial-conversion.ts`, change:
```typescript
from: 'NMBR Platform <onboarding@thenmbr.com>'
```
To your verified domain:
```typescript
from: 'NMBR Platform <hello@yourdomain.com>'
```

## 📧 Email Templates Already Set Up

Your trial conversion emails are ready to go:

### Email Sequence:
- **Day 1**: Welcome & setup guide
- **Day 3**: Analytics feature spotlight  
- **Day 7**: Upgrade teaser with usage stats
- **Day 12**: Urgency with 20% discount
- **Day 14**: Final push with 30% discount

### Features:
- ✅ Professional HTML templates
- ✅ Responsive design
- ✅ Personalized content
- ✅ Call-to-action buttons
- ✅ Branded styling

## 🔧 Testing Your Setup

### Test Single Email
```bash
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day1_welcome&org=Test%20Org"
```

### Test All Templates
```bash
# Day 1 Welcome
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day1_welcome&org=Test%20Org"

# Day 3 Analytics
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day3_analytics&org=Test%20Org"

# Day 7 Upgrade Teaser
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day7_upgrade_teaser&org=Test%20Org"

# Day 12 Urgency
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day12_urgency&org=Test%20Org"

# Day 14 Final
curl "http://localhost:3001/api/email/trial-sequence?email=test@example.com&template=day14_final&org=Test%20Org"
```

## 📊 Analytics & Tracking

Resend provides built-in analytics:
- ✅ Open rates
- ✅ Click rates  
- ✅ Bounce rates
- ✅ Spam complaints
- ✅ Delivery status

View analytics at: [resend.com/emails](https://resend.com/emails)

## 🎯 Best Practices

### 1. Email Deliverability
- Use verified domain (not `@resend.dev`)
- Keep sending volume consistent
- Monitor bounce rates
- Clean email lists regularly

### 2. Content Optimization
- A/B test subject lines
- Test different send times
- Personalize content
- Include clear CTAs

### 3. Compliance
- Include unsubscribe links
- Follow CAN-SPAM guidelines
- Respect user preferences
- Handle bounces gracefully

## 💰 Pricing

### Free Tier (Perfect for Testing)
- 3,000 emails/month
- 100 emails/day
- Basic analytics
- Resend branding

### Pro Plan ($20/month)
- 50,000 emails/month
- Custom domain
- Advanced analytics
- Priority support
- API access

### Scale Plan ($80/month)
- 200,000 emails/month
- Everything in Pro
- Dedicated IP
- Custom integrations

## 🚨 Troubleshooting

### Common Issues:

**1. "Invalid API Key"**
- Check your `.env.local` file
- Restart your development server
- Verify API key in Resend dashboard

**2. "Domain not verified"**
- Use `@resend.dev` for testing
- Verify domain in Resend dashboard
- Check DNS records

**3. "Rate limit exceeded"**
- Free tier: 100 emails/day
- Upgrade to Pro for higher limits
- Implement email queuing

**4. "Emails going to spam"**
- Use verified domain
- Avoid spam trigger words
- Test with multiple email providers

## 🔄 Next Steps

### 1. Set Up Automated Triggers
Create cron jobs or scheduled functions to automatically send emails based on trial days.

### 2. A/B Testing
Test different subject lines, content, and send times to optimize conversion rates.

### 3. Advanced Analytics
Integrate with your analytics platform to track email → conversion funnel.

### 4. Segmentation
Send different email sequences based on user behavior, organization type, or trial activity.

## 📞 Support

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: [resend.com/support](https://resend.com/support)
- **Community**: [GitHub Discussions](https://github.com/resend/resend/discussions)

---

**Ready to start converting more trials?** 🚀

Your email system is fully set up and ready to dramatically improve your trial-to-paid conversion rates!

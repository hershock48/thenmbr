# NMBR Platform - Comprehensive Testing Checklist

## 🚀 PRE-TESTING SETUP
- [ ] Run database schema update in Supabase
- [ ] Verify all environment variables are set
- [ ] Clear browser cache and cookies

## 🏠 HOMEPAGE TESTING
- [ ] Page loads without errors
- [ ] "Sign In" button navigates to /login
- [ ] "Get Started" button navigates to /signup
- [ ] "Try Live Demo" button navigates to /demo
- [ ] All sections display properly
- [ ] Mobile responsive design works
- [ ] Professional copy and messaging clear

## 🎯 DEMO PAGE TESTING
- [ ] Page loads without errors
- [ ] "Try Live Widget" button works
- [ ] Copy URL buttons work
- [ ] Copy embed code button works
- [ ] Widget preview iframe loads
- [ ] Backend management section displays
- [ ] All widget type cards show properly

## 🔍 WIDGET FUNCTIONALITY TESTING
- [ ] Widget loads with demo-org-123
- [ ] Search for NMBR "1" shows Maria's water story
- [ ] Search for NMBR "2" shows Ahmed's education story
- [ ] Search for NMBR "3" shows Sarah's medical story
- [ ] Story photos display properly
- [ ] Progress bars show correct percentages
- [ ] Subscribe button works (shows success message)
- [ ] Donate button works (redirects to Stripe)
- [ ] Error handling for invalid codes
- [ ] Mobile responsive design

## 📝 SIGNUP FLOW TESTING
- [ ] Page loads without errors
- [ ] Enter "www.beanumber.org" - auto-converts to https://
- [ ] Enter "https://beanumber.org" - works as-is
- [ ] Fill all required fields
- [ ] Submit creates account successfully
- [ ] Redirects to dashboard after signup
- [ ] Error handling for duplicate emails
- [ ] Password validation works

## 🔐 LOGIN FLOW TESTING
- [ ] Page loads without errors
- [ ] Login with created account
- [ ] Success animation and confetti displays
- [ ] Redirects to dashboard
- [ ] Error handling for invalid credentials
- [ ] Loading states work properly

## 📊 DASHBOARD FUNCTIONALITY TESTING
- [ ] Dashboard loads with user's organization data
- [ ] Stats cards display properly
- [ ] Stories list shows (if any exist)
- [ ] Navigation works (all sidebar links)
- [ ] Branding customization works
- [ ] Analytics dashboard works
- [ ] Subscriber management works
- [ ] Billing/Stripe integration works

## 🎨 BRANDING CUSTOMIZATION TESTING
- [ ] Upload logo works
- [ ] Color picker works
- [ ] Font selection works
- [ ] Preview updates in real-time
- [ ] Save changes works
- [ ] Widget reflects branding changes

## 📈 ANALYTICS TESTING
- [ ] Charts display properly
- [ ] Data loads correctly
- [ ] Date range filters work
- [ ] Export functionality works
- [ ] Real-time updates work

## 🔧 EDGE CASES TESTING
- [ ] Invalid NMBR codes show error
- [ ] Network errors handled gracefully
- [ ] Empty states display properly
- [ ] Loading states work
- [ ] Error boundaries catch errors

## 📱 MOBILE TESTING
- [ ] All pages work on mobile
- [ ] Touch interactions work
- [ ] Forms are mobile-friendly
- [ ] Widgets are responsive
- [ ] Navigation works on mobile

## 🌐 CROSS-BROWSER TESTING
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works

## ✅ FINAL VERIFICATION
- [ ] All critical paths work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] User experience is smooth
- [ ] Professional appearance maintained

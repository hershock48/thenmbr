# NMBR Platform - v0 Design Brief

## 🎯 **Project Overview**
A comprehensive fundraising platform that connects donors to personalized impact stories via NMBR codes. The platform includes a widget for story discovery, subscription management, newsletter creation, and donation processing.

**GitHub Repository**: `https://github.com/hershock48/nmbr-widget.git`

---

## 🎨 **Design System & Brand Guidelines**

### **Primary Colors**
- **Primary**: `#2563eb` (Blue)
- **Secondary**: `#ffffff` (White)
- **Accent**: `#60a5fa` (Light Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### **Typography**
- **Headings**: Inter (Bold, 600-700 weight)
- **Body**: Inter (Regular, 400 weight)
- **Code**: JetBrains Mono

### **Design Principles**
- **Modern & Professional**: Clean, contemporary design
- **Trustworthy**: Financial/charity sector appropriate
- **Accessible**: WCAG 2.1 AA compliant
- **Mobile-First**: Responsive across all devices
- **Conversion-Focused**: Optimized for donations and subscriptions

---

## 🚀 **v0 Design Tasks**

### **1. Newsletter Builder Interface** ⭐ **PRIORITY**
**File**: `components/dashboard/newsletter-builder.tsx`

**Current State**: Basic drag-and-drop interface with limited styling
**Goal**: Create a Mailchimp/Squarespace-level newsletter builder

**Specific Asks**:
- **Modern Drag-and-Drop**: Smooth, intuitive drag-and-drop with visual feedback
- **Template Gallery**: Professional, categorized templates (Fundraising, Updates, Thank You, etc.)
- **Real-time Preview**: Live preview that updates as user builds
- **Block Library**: Rich content blocks (Text, Image, Button, Divider, Social, etc.)
- **Typography Controls**: Font size, weight, color, alignment controls
- **Image Management**: Drag-and-drop image upload with cropping/resizing
- **Button Builder**: Customizable CTA buttons with hover states
- **Color Picker**: Brand color integration with custom color support
- **Mobile Preview**: Toggle between desktop/mobile views
- **Undo/Redo**: Full history management
- **Auto-save**: Save progress automatically
- **Export Options**: HTML, PDF, print-ready formats

**Inspiration**: Mailchimp, Squarespace, ConvertKit, Bee Free

---

### **2. Widget Redesign** ⭐ **PRIORITY**
**File**: `components/widget/widget-container.tsx`

**Current State**: Basic form with subscription flow
**Goal**: Create an engaging, conversion-optimized widget

**Specific Asks**:
- **Hero Section**: Compelling visual with story image and progress bar
- **Progress Visualization**: Animated progress bars, milestone celebrations
- **Social Proof**: Recent donors, supporter count, testimonials
- **Urgency Elements**: Countdown timers, limited-time offers
- **Micro-interactions**: Hover effects, button animations, form validation
- **Mobile Optimization**: Touch-friendly, thumb-accessible design
- **Loading States**: Skeleton screens, progress indicators
- **Error Handling**: Beautiful error states with helpful messages
- **Success Animation**: Celebration animations for successful actions
- **Accessibility**: Screen reader support, keyboard navigation
- **Customization**: Easy theming for different organizations

**Inspiration**: Stripe Checkout, GoFundMe, Kickstarter, Patreon

---

### **3. Dashboard Layout & Components**
**File**: `app/dashboard/page.tsx`

**Current State**: Basic stats cards and navigation
**Goal**: Professional, data-rich dashboard

**Specific Asks**:
- **Data Visualization**: Charts, graphs, progress indicators
- **KPI Cards**: Animated counters, trend indicators
- **Quick Actions**: Prominent action buttons for common tasks
- **Recent Activity**: Timeline of recent actions and updates
- **Performance Metrics**: Revenue, subscribers, engagement stats
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Dark Mode**: Toggle between light and dark themes
- **Search & Filter**: Global search and filtering capabilities
- **Notifications**: Toast notifications and alert system
- **Sidebar Navigation**: Collapsible, organized navigation
- **Breadcrumbs**: Clear navigation hierarchy

**Inspiration**: Stripe Dashboard, Vercel Dashboard, Linear, Notion

---

### **4. Email Templates**
**File**: `lib/email-templates.ts`

**Current State**: Basic text templates
**Goal**: Professional, responsive email templates

**Specific Asks**:
- **Story Update Template**: Rich layout with images, progress bars, impact metrics
- **Welcome Series**: Multi-step onboarding email sequence
- **Donation Receipt**: Professional receipt with tax information
- **Milestone Celebration**: Exciting celebration emails for goal achievements
- **Newsletter Template**: Magazine-style layout with multiple stories
- **Mobile Responsive**: Perfect rendering across all email clients
- **Brand Consistency**: Consistent with platform design system
- **Personalization**: Dynamic content insertion
- **A/B Testing**: Multiple variations for optimization
- **Unsubscribe Flow**: Clean, compliant unsubscribe process

**Inspiration**: Charity Water, Doctors Without Borders, UNICEF, WWF

---

### **5. Subscriber Management Interface**
**File**: `app/dashboard/subscribers/page.tsx`

**Current State**: Basic table with subscriber data
**Goal**: Comprehensive subscriber management system

**Specific Asks**:
- **Advanced Table**: Sortable, filterable, searchable data table
- **Bulk Actions**: Select multiple subscribers for batch operations
- **Segmentation**: Create and manage subscriber segments
- **Import/Export**: CSV import/export functionality
- **Subscriber Profiles**: Detailed view of individual subscribers
- **Engagement Tracking**: Open rates, click rates, donation history
- **Tag System**: Organize subscribers with custom tags
- **Communication History**: Timeline of all communications
- **Analytics**: Subscriber growth, engagement metrics
- **Compliance Tools**: GDPR compliance, unsubscribe management

**Inspiration**: Mailchimp, ConvertKit, ActiveCampaign, HubSpot

---

### **6. Media Upload & Management**
**File**: `components/dashboard/media-upload.tsx`

**Current State**: Basic file upload
**Goal**: Professional media management system

**Specific Asks**:
- **Drag & Drop Upload**: Intuitive file upload with progress bars
- **Image Gallery**: Grid view with search and filtering
- **Image Editor**: Basic cropping, resizing, filters
- **File Organization**: Folders, tags, collections
- **Bulk Operations**: Select multiple files for batch actions
- **Preview System**: Lightbox preview for images and videos
- **Storage Management**: Usage tracking and optimization
- **CDN Integration**: Fast loading and delivery
- **Format Support**: Images, videos, documents, PDFs
- **Accessibility**: Alt text management, screen reader support

**Inspiration**: Unsplash, Pexels, Dropbox, Google Photos

---

### **7. Mobile App Components**
**New Files**: Mobile-specific components

**Goal**: Create mobile-optimized versions of key components

**Specific Asks**:
- **Touch-Optimized Widget**: Large buttons, swipe gestures
- **Mobile Dashboard**: Card-based layout for mobile screens
- **Push Notifications**: In-app notification system
- **Offline Support**: Basic offline functionality
- **App-like Experience**: PWA capabilities
- **Gesture Navigation**: Swipe, pinch, tap gestures
- **Mobile Forms**: Optimized form inputs and validation
- **Camera Integration**: Photo capture for stories
- **Location Services**: Location-based features
- **Performance**: Fast loading, smooth animations

**Inspiration**: Instagram, TikTok, GoFundMe Mobile, Charity Navigator

---

## 🎯 **Success Metrics**

### **Conversion Optimization**
- **Widget Conversion**: Increase subscription rate by 25%
- **Donation Conversion**: Increase donation completion by 30%
- **Email Engagement**: Increase open rates by 20%
- **User Retention**: Increase return visits by 40%

### **User Experience**
- **Page Load Speed**: < 2 seconds
- **Mobile Performance**: 90+ Lighthouse score
- **Accessibility**: WCAG 2.1 AA compliance
- **Cross-browser**: Support for all major browsers

### **Design Quality**
- **Professional Appearance**: Match or exceed industry standards
- **Brand Consistency**: Unified design language
- **Modern Aesthetics**: Contemporary, clean design
- **User Feedback**: Positive user experience feedback

---

## 🔧 **Technical Requirements**

### **Framework Compatibility**
- **Next.js 14**: App router, server components
- **React 18**: Hooks, concurrent features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling

### **Browser Support**
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Mobile

### **Performance**
- **Core Web Vitals**: All green scores
- **Bundle Size**: Optimized for production
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Lazy loading where appropriate

---

## 📋 **v0 Prompt Examples**

### **For Newsletter Builder**
\`\`\`
"Create a modern newsletter builder interface similar to Mailchimp. Include drag-and-drop functionality, real-time preview, template gallery, and professional styling. Use the brand colors #2563eb and #ffffff. Make it intuitive for non-technical users to create beautiful newsletters."
\`\`\`

### **For Widget Redesign**
\`\`\`
"Design a conversion-optimized fundraising widget that encourages donations and subscriptions. Include progress bars, social proof, urgency elements, and smooth animations. Focus on mobile-first design with touch-friendly interactions."
\`\`\`

### **For Dashboard**
\`\`\`
"Create a professional dashboard for managing fundraising campaigns. Include data visualization, KPI cards, quick actions, and responsive design. Make it feel like a premium SaaS product with modern UI patterns."
\`\`\`

### **For Email Templates**
\`\`\`
"Design responsive email templates for a fundraising platform. Include story updates, donation receipts, welcome series, and newsletter layouts. Ensure perfect rendering across all email clients with mobile optimization."
\`\`\`

---

## 🚀 **Implementation Strategy**

### **Phase 1: Core Components** (Week 1)
1. Newsletter Builder Interface
2. Widget Redesign
3. Basic Dashboard Improvements

### **Phase 2: Advanced Features** (Week 2)
1. Email Templates
2. Subscriber Management
3. Media Upload System

### **Phase 3: Polish & Optimization** (Week 3)
1. Mobile Components
2. Performance Optimization
3. Accessibility Improvements

### **Phase 4: Testing & Refinement** (Week 4)
1. User Testing
2. A/B Testing
3. Final Polish

---

## 📞 **Contact & Support**

**Developer**: Kevin Hershock
**Repository**: https://github.com/hershock48/nmbr-widget
**Platform**: NMBR Platform v2

---

*This document serves as a comprehensive guide for v0 to understand the project requirements and deliver high-quality design improvements that align with the platform's goals and user needs.*

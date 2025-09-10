# AI Integration Setup Guide

## OpenAI API Integration

The newsletter builder now includes real AI-powered content review and optimization. To enable this feature:

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Set Environment Variable
Add to your `.env.local` file:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Install OpenAI Package
```bash
npm install openai
```

### 4. Features Enabled
With OpenAI integration, the AI Review feature provides:
- **Real content analysis** - AI analyzes your newsletter content
- **Engagement optimization** - Suggestions for better donor engagement
- **Tone and clarity** - Recommendations for clearer communication
- **Call-to-action improvement** - Better conversion-focused CTAs
- **Subject line generation** - AI-generated compelling subject lines

### 5. Fallback Behavior
If OpenAI is not configured, the system falls back to:
- Mock suggestions (basic rule-based recommendations)
- Clear error messaging
- Graceful degradation of functionality

### 6. Cost Considerations
- OpenAI API calls are made only when using AI Review
- Typical cost: $0.01-0.05 per newsletter review
- No charges for mock suggestions

### 7. Testing
1. Create a newsletter with some content
2. Click "AI Review" button
3. If OpenAI is configured: Real AI suggestions appear
4. If not configured: Mock suggestions with helpful fallback message

## Email Service Integration

The newsletter builder also supports real email sending via Resend:

### 1. Get Resend API Key
1. Visit [Resend](https://resend.com/)
2. Create an account
3. Get your API key from the dashboard

### 2. Set Environment Variable
Add to your `.env.local` file:
```
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Install Resend Package
```bash
npm install resend
```

### 4. Features Enabled
- Real email sending
- Delivery tracking
- Bounce handling
- Professional email templates

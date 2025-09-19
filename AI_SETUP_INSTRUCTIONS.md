# AI Integration Setup Instructions

## Quick Setup (2 minutes)

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Add to Environment
Create/edit `.env.local` in your project root:
\`\`\`bash
OPENAI_API_KEY=sk-your-key-here
\`\`\`

### 3. Restart Development Server
\`\`\`bash
npm run dev
\`\`\`

## What the AI Review Does

The AI Review feature analyzes your newsletter content and provides:

- **Tone & Voice**: Ensures consistent, donor-friendly messaging
- **Clarity**: Improves readability and removes jargon
- **Engagement**: Suggests emotional hooks and storytelling elements
- **Call-to-Actions**: Optimizes donation buttons and links
- **Length**: Balances detail with brevity
- **Subject Lines**: Improves email open rates

## Usage Limits

- **Free Tier**: 10 AI reviews per month
- **Starter**: 100 reviews per month  
- **Growth**: 500 reviews per month
- **Pro**: Unlimited reviews

## How It Works

1. Click "AI Review" in newsletter builder
2. AI analyzes your content in 2-3 seconds
3. Review suggestions with before/after examples
4. Apply changes with one click
5. Usage automatically tracked

## Troubleshooting

**"AI Review not available"** = No API key set
**"Monthly limit reached"** = Upgrade plan or wait for reset
**"Analysis failed"** = Falls back to mock suggestions

## Cost

- OpenAI charges ~$0.01-0.05 per analysis
- Very affordable for nonprofit use
- Free tier covers most small organizations

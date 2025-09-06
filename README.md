# NMBR Widget Platform

A comprehensive widget platform for nonprofits to embed story search, donation, and subscription functionality on their websites.

## Features

- **Story Search Widget**: Search and display stories by NMBR code
- **Donate Widget**: Stripe-powered donations with platform fees
- **Subscribe Widget**: Email capture for nonprofit updates
- **White-label Support**: Custom branding per organization
- **Easy Integration**: Simple copy-paste JavaScript snippet

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Connect
- **Deployment**: Vercel

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Platform Configuration
NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE=5
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Update your environment variables with Supabase credentials

### 3. Stripe Setup

1. Create a Stripe account
2. Set up Stripe Connect for platform fees
3. Add your Stripe keys to environment variables
4. Configure webhook endpoint: `https://your-domain.com/api/webhooks/stripe`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/demo` to see the widgets in action.

## Widget Integration

### Automatic Initialization

Add the widget script and use data attributes:

```html
<script src="https://app.thenmbr.com/nmbr.js"></script>

<!-- Story Search Widget -->
<div 
  data-nmbr-org="your-org-id"
  data-nmbr-type="story-search"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 400px;"
></div>

<!-- Donate Widget -->
<div 
  data-nmbr-org="your-org-id"
  data-nmbr-type="donate"
  data-nmbr-amount="25"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 500px;"
></div>

<!-- Subscribe Widget -->
<div 
  data-nmbr-org="your-org-id"
  data-nmbr-type="subscribe"
  data-nmbr-powered="true"
  style="width: 100%; min-height: 300px;"
></div>
```

### Manual Initialization

```javascript
// Wait for NMBR to load
window.addEventListener('load', function() {
  if (window.NMBR) {
    // Initialize widget
    window.NMBR.init('container-id', {
      org: 'your-org-id',
      type: 'story-search',
      powered: true
    });
  }
});
```

## API Endpoints

### Stories
- `GET /api/stories?org={id}&nmbr={code}` - Get stories for organization

### Organizations
- `GET /api/org/{id}` - Get organization details and branding

### Subscriptions
- `POST /api/subscribe` - Create new subscription

### Donations
- `POST /api/donate` - Create Stripe checkout session

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## Database Schema

### Nonprofits
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Organization name
- `logo_url` (TEXT) - Logo image URL
- `brand_color` (VARCHAR) - Brand color hex code
- `stripe_account_id` (VARCHAR) - Connected Stripe account

### Stories
- `id` (UUID) - Primary key
- `org_id` (UUID) - Foreign key to nonprofits
- `nmbr_code` (VARCHAR) - Unique story code
- `title` (VARCHAR) - Story title
- `description` (TEXT) - Story description
- `photo_url` (TEXT) - Story image URL

### Subscribers
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Subscriber email
- `org_id` (UUID) - Foreign key to nonprofits
- `story_id` (UUID) - Optional foreign key to stories

### Donations
- `id` (UUID) - Primary key
- `org_id` (UUID) - Foreign key to nonprofits
- `story_id` (UUID) - Optional foreign key to stories
- `amount` (INTEGER) - Amount in cents
- `platform_fee` (INTEGER) - Platform fee in cents
- `donor_email` (VARCHAR) - Donor email
- `stripe_txn_id` (VARCHAR) - Stripe transaction ID
- `status` (VARCHAR) - Payment status

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Update `NEXT_PUBLIC_BASE_URL` to your production domain:
```env
NEXT_PUBLIC_BASE_URL=https://app.thenmbr.com
```

## Widget Configuration

### Supported Parameters

- `org` (required) - Organization ID
- `type` (required) - Widget type: `story-search`, `donate`, `subscribe`
- `nmbr` (optional) - Pre-filled NMBR code for story search
- `amount` (optional) - Pre-filled amount for donate widget
- `powered` (optional) - Show "Powered by The NMBR" footer (default: true)

### Customization

Widgets automatically adapt to organization branding:
- Logo display
- Brand color theming
- Organization name

## Development

### Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── widget/        # Widget page
│   └── demo/          # Demo page
├── components/        # React components
├── lib/              # Utilities (Supabase, Stripe)
└── types/            # TypeScript types
```

### Adding New Widget Types

1. Create component in `src/components/`
2. Add type to `WidgetProps` interface
3. Update widget page routing
4. Add to widget loader script

## License

MIT License - see LICENSE file for details.
# Real Dropship Integration Setup

## Overview

The NMBR marketplace connects to real dropship services to provide actual products you can sell. No more fake data - these are real products from real suppliers.

## Supported Providers

### 1. Printful (Recommended)
- **Products**: 1000+ items (apparel, drinkware, accessories)
- **Quality**: High-quality print-on-demand
- **Shipping**: 3-7 business days (US), 7-14 days (international)
- **Pricing**: Competitive, transparent
- **Setup**: Easy API integration

### 2. Gooten
- **Products**: 500+ items
- **Quality**: Good quality, global network
- **Shipping**: 5-10 business days
- **Pricing**: Competitive
- **Setup**: Moderate complexity

### 3. CustomInk
- **Products**: 200+ items
- **Quality**: High-quality custom products
- **Shipping**: 7-14 business days
- **Pricing**: Premium
- **Setup**: Advanced features

## Quick Setup (5 minutes)

### Step 1: Get API Keys

#### Printful
1. Go to https://www.printful.com/
2. Sign up for a free account
3. Go to Settings → API → Create API Key
4. Copy the key (starts with `pf_`)

#### Gooten
1. Go to https://www.gooten.com/
2. Sign up for a free account
3. Go to API Settings → Generate Key
4. Copy the key

#### CustomInk
1. Go to https://www.customink.com/
2. Sign up for a free account
3. Go to Developer → API Access
4. Copy the key

### Step 2: Add to Environment

Create/edit `.env.local` in your project root:

```bash
# Dropship Service API Keys
PRINTFUL_API_KEY=pf_your_key_here
GOOTEN_API_KEY=your_gooten_key_here
CUSTOMINK_API_KEY=your_customink_key_here
```

### Step 3: Restart Application

```bash
npm run dev
```

## What Happens Next

1. **Real Products Load**: The marketplace will show actual products from connected services
2. **Live Inventory**: Real stock levels and pricing
3. **Real Orders**: You can place actual orders that get fulfilled
4. **NMBR Integration**: Each product can have a NMBR code added
5. **Tracking**: Real tracking numbers and delivery estimates

## Features

### Product Management
- Real product images and descriptions
- Live pricing and availability
- Size and color options
- Shipping estimates

### Order Processing
- Real order placement
- Payment processing
- Shipping and tracking
- Customer notifications

### NMBR Integration
- Add NMBR codes to any product
- Custom design uploads
- Story connection
- Donor tracking

## Cost Structure

### Printful
- **Setup**: Free
- **Products**: Base cost + your markup
- **Shipping**: Customer pays
- **Fees**: 2-3% per order

### Gooten
- **Setup**: Free
- **Products**: Base cost + your markup
- **Shipping**: Customer pays
- **Fees**: 1-2% per order

### CustomInk
- **Setup**: Free
- **Products**: Base cost + your markup
- **Shipping**: Customer pays
- **Fees**: 3-5% per order

## Testing

### Demo Mode
- Without API keys, you'll see demo products
- Clearly labeled as "Demo Only"
- No real orders can be placed

### Live Mode
- With API keys, you'll see real products
- Real orders can be placed
- Live inventory and pricing

## Troubleshooting

**"No products found"** = No API keys configured
**"Products not loading"** = Check API key validity
**"Order failed"** = Check API key permissions
**"Demo only"** = Product not available for real orders

## Security

- API keys are stored securely
- Never commit keys to version control
- Use environment variables only
- Rotate keys regularly

## Support

- **Printful**: https://www.printful.com/api-docs
- **Gooten**: https://www.gooten.com/api-docs
- **CustomInk**: https://www.customink.com/api-docs
- **NMBR Support**: Contact us for integration help

## Next Steps

1. Set up at least one dropship service
2. Test with a small order
3. Add NMBR codes to products
4. Start selling real products with stories!

---

**Ready to connect real products to real stories? Let's make it happen!** 🚀

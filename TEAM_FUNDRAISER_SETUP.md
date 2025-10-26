# Team-Based Fundraiser Setup

## Overview
This document outlines the new team-based fundraising infrastructure added to The NMBR Platform for student trip fundraising (e.g., YOTERA Uganda Impact Trip 2025).

## Database Changes

Run the migration: `setup-teams-fundraisers.sql`

### New Tables
1. **teams** - Represents a group trip/campaign (e.g., "Uganda Impact Trip 2025")
2. **fundraisers** - Individual student fundraiser pages with unique NMBR codes

### Updated Tables
- **donations** - Now supports `team_id` and `fundraiser_id` for attribution

## New Routes

### Public Pages
- `/t/[slug]` - Team page showing all fundraisers (e.g., `/t/uganda-impact-2025`)
- `/f/[handle]` - Individual fundraiser page (e.g., `/f/emma-uganda-2025`)

## Architecture

```
Organization (YOTERA x Be A Number)
  └── Team (Uganda Impact Trip 2025)
       ├── Fundraiser #1001 (Emma)
       ├── Fundraiser #1002 (Jack)
       └── Fundraiser #1003 (Lucy)
           └── Donations
```

## TypeScript Types

Added to `types/index.ts`:
- `Team` interface
- `Fundraiser` interface

## Next Steps

1. **Run Database Migration**
   ```bash
   # Connect to your Supabase instance
   # Run: setup-teams-fundraisers.sql
   ```

2. **Seed Data** (Create manually or via SQL)
   - Create Organization (YOTERA x Be A Number)
   - Create Team (Uganda Impact Trip 2025)
   - Create 3 Fundraisers (Emma, Jack, Lucy)

3. **Integrate Stripe Checkout**
   - Update `/app/f/[handle]/page.tsx` donate button
   - Create `/app/api/checkout/route.ts` for fundraiser donations
   - Update Stripe webhook to handle fundraiser donations

4. **Build Dashboards**
   - Fundraiser Dashboard: `/app/dashboard/fundraiser/page.tsx`
   - Team Admin Dashboard: `/app/dashboard/team/[id]/page.tsx`

## API Endpoints Needed

- `POST /api/checkout` - Create Stripe checkout session for fundraiser
- `POST /api/stripe/webhook` - Handle fundraiser donations
- `GET /api/teams/[slug]` - Get team data
- `GET /api/fundraisers/[handle]` - Get fundraiser data

## Features Implemented

✅ Team page with multiple fundraisers
✅ Individual fundraiser pages
✅ Progress bars and donor counts
✅ Responsive design
✅ TypeScript types

## Features TODO

- [ ] Stripe checkout integration
- [ ] QR code generation for fundraisers
- [ ] Email receipts for fundraiser donations
- [ ] Fundraiser dashboard (view donations, post updates)
- [ ] Team admin dashboard (approve fundraisers, track totals)
- [ ] Update tracking (story updates for fundraisers)
- [ ] Social sharing
- [ ] Donor thank you emails

## Pilot Data Structure

```sql
-- Organization
INSERT INTO nonprofits (name, organization_type, brand_color)
VALUES ('YOTERA x Be A Number', 'nonprofit', '#3B82F6');

-- Team
INSERT INTO teams (org_id, name, slug, goal_cents, visibility)
VALUES ('org-uuid', 'Uganda Impact Trip 2025', 'uganda-impact-2025', 1500000, 'public');

-- Fundraiser
INSERT INTO fundraisers (team_id, nmbr_code, handle, page_title, page_subtitle, goal_cents, status)
VALUES ('team-uuid', '1001', 'emma-uganda-2025', 'Emma's Uganda Journey', 'Help me make a difference', 500000, 'live');
```

## Running the App

```bash
npm run dev
```

Visit: http://localhost:3000/t/uganda-impact-2025


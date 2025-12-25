# Visitor Analytics Implementation

## Overview
Added comprehensive visitor analytics with geographic heatmap visualization to the admin dashboard using ip-api.com for geolocation.

## What Was Added

### 1. Database Model (`PageView`)
- Tracks visitor page views with location data
- Fields: pathname, ipHash (SHA-256 for privacy), country, countryCode, region, city, latitude, longitude, userAgent
- Indexed for optimal query performance

### 2. Tracking System
**Files:**
- `src/app/api/track/route.ts` - API endpoint to receive page view data
- `src/hooks/usePageTracking.ts` - Client hook that fires on page navigation
- `src/components/PageTracker.tsx` - Component added to root layout
- `src/utils/geolocation.ts` - IP geolocation utilities using ip-api.com

**How it works:**
1. PageTracker component runs on every page
2. On navigation, sends POST to `/api/track` with pathname
3. Server extracts IP from headers, hashes it for privacy
4. Fetches geolocation from ip-api.com (free, 45 req/min)
5. Stores everything in PageView table

**Privacy:**
- IP addresses are hashed (SHA-256) before storage
- Cannot reverse-engineer individual IPs
- Can still count unique visitors

### 3. Analytics tRPC Router
**File:** `src/server/api/routers/analytics.ts`

**Available Queries:**
- `getStats({ days })` - Total views, unique visitors, views in last N days
- `getGeographicData()` - All locations with visitor counts (for heatmap)
- `getPopularPages({ limit, days })` - Top pages by views
- `getTopCountries({ limit })` - Countries by visitor count
- `getViewsOverTime({ days })` - Daily view counts (for charts)

### 4. Admin Dashboard Components
**Files:**
- `src/components/admin/VisitorMap.tsx` - Interactive Leaflet map with circle markers
- `src/components/admin/AnalyticsDashboard.tsx` - Full analytics UI

**Features:**
- 3 stat cards: Total Views, Unique Visitors, Countries
- Interactive world map with bubble markers sized by visitor count
- Popular pages list (top 5)
- Top countries list with flag emojis (top 5)

**Map Details:**
- Uses OpenStreetMap tiles
- Circle markers sized 10-40px based on visitor count
- Orange/amber color scheme matching site design
- Hover tooltips show country name and visit count

### 5. Dashboard Integration
**File:** `src/app/admin/page.tsx`

Added "Visitor Analytics" section below existing admin cards. Full-width section with proper spacing.

## Dependencies Added
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.x"
}
```

## Environment Variables
None required! ip-api.com is free with no API key needed (45 requests/minute).

## Usage

### Viewing Analytics
1. Navigate to `/admin`
2. Scroll to "Visitor Analytics" section
3. View stats, map, popular pages, and top countries

### Testing Locally
- Local IPs (127.0.0.1, 192.168.x.x) show as "Local" / "Development"
- Deploy to production to see real visitor locations

### API Usage (if needed)
```typescript
// Get stats
const stats = await trpc.analytics.getStats.query({ days: 30 });

// Get map data
const geoData = await trpc.analytics.getGeographicData.query();

// Get popular pages
const pages = await trpc.analytics.getPopularPages.query({ limit: 10 });
```

## Notes
- Admin pages (`/admin/*`) and API routes are NOT tracked
- Tracking happens client-side on navigation (works with both server/client routing)
- Failed tracking requests fail silently (won't disrupt user experience)
- Geolocation API call happens server-side, not client-side
- Rate limit: 45 requests/minute (ip-api.com free tier)

## Future Enhancements
- Add date range picker for time-filtered stats
- Add charts for views over time (currently data is available via `getViewsOverTime`)
- Add device/browser breakdown stats
- Add referrer tracking
- Add heatmap for page sections (click tracking)

# PWA Configuration Guide for Raksha

This document outlines the Progressive Web App (PWA) support added to Raksha.

## Features Enabled

### 1. **Service Worker Registration**

- Automatic service worker registration via `next-pwa`
- Configured to work in production (disabled in development for easier debugging)
- Automatic skip waiting and client claim for instant updates

### 2. **Smart Caching Strategies**

#### Cache First (for static assets):

- **Google Fonts** - Cached for 1 year
- **CDN resources** - Cached for 1 week
- **Images** - Cached for 30 days
- **Next.js static assets** - Cached for 1 year

#### Network First (for API calls):

- API calls attempt network first, fall back to cache
- Cache expires after 1 hour
- Maximum 50 cached API responses

### 3. **Offline Support**

- Fallback document at `/offline.html` when users go offline
- Cached assets remain accessible offline
- Service worker handles offline scenarios gracefully

### 4. **Web App Manifest**

Located at `/public/manifest.json`

- App name, short name, and description
- Theme and background colors
- Display mode: `standalone` (app-like experience)
- Multiple icon sizes and maskable icons support
- App shortcuts for quick access to:
  - Emergency SOS
  - Legal Chat Support
  - Community
  - Travel Companion

### 5. **Installation Prompt**

- Custom PWA install prompt component (`PWAInstallPrompt.jsx`)
- Beautiful gradient UI with install and dismiss options
- Respects user preferences (dismissal for a week)

### 6. **PWA Utilities**

Helper functions in `/utils/pwaUtils.js`:

```javascript
import {
  registerServiceWorker, // Manual SW registration
  checkPWAInstalled, // Check if app is installed
  requestNotificationPermission, // Request push notifications
  sendNotification, // Send notifications
  shareApp, // Native share functionality
  checkCacheStatus, // Check what's cached
  clearAllCaches, // Clear all caches
  setupPWA, // One-time PWA setup
} from "@/utils/pwaUtils";
```

## Setup Instructions

### Prerequisites

```bash
npm install next-pwa
```

### Current Configuration

The PWA is already configured! Here's what's in place:

**`next.config.mjs`**

- PWA plugin is active
- Runtime caching strategies configured
- Fallback document set

**`public/manifest.json`**

- Complete manifest with all required fields
- App shortcuts configured
- Icons specified for different sizes

**`src/app/layout.js`**

- PWA install prompt component included
- Proper meta tags for mobile web apps
- Apple web app configuration

**`src/components/PWAInstallPrompt.jsx`**

- Beautiful custom install prompt
- Handles beforeinstallprompt event
- Dismissible with localStorage tracking

## Usage Examples

### Initialize PWA on App Load

```javascript
"use client";
import { useEffect } from "react";
import { setupPWA } from "@/utils/pwaUtils";

export default function App() {
  useEffect(() => {
    setupPWA();
  }, []);

  return <div>App content</div>;
}
```

### Send Push Notifications

```javascript
import { sendNotification } from "@/utils/pwaUtils";

sendNotification("Emergency Alert!", {
  body: "Your SOS has been triggered",
  icon: "/raksha-logo.svg",
  badge: "/raksha-logo.svg",
  tag: "emergency",
  requireInteraction: true,
});
```

### Check Installation Status

```javascript
import { checkPWAInstalled } from "@/utils/pwaUtils";

if (checkPWAInstalled()) {
  console.log("App is installed as PWA");
}
```

### Use Native Share

```javascript
import { shareApp } from "@/utils/pwaUtils";

await shareApp({
  text: "Join me on Raksha!",
});
```

### Manage Cache

```javascript
import { checkCacheStatus, clearAllCaches } from "@/utils/pwaUtils";

// Check what's cached
const caches = await checkCacheStatus();
console.log("Cached data:", caches);

// Clear all caches
await clearAllCaches();
```

## Testing PWA Features

### 1. **Test Installation Prompt**

- Open app in Chrome/Edge on mobile or desktop
- You'll see an install prompt at bottom-right
- Click "Install" to add to home screen

### 2. **Test Offline Mode**

- Install the app
- Go to DevTools → Application → Service Workers → Offline
- Navigate between pages - they should load from cache

### 3. **Test Notifications**

- Call `requestNotificationPermission()`
- Send a notification with `sendNotification()`
- Check notification appears even when tab is closed

### 4. **Test App Shortcuts**

- Install the app
- Long-press the app icon on home screen
- Shortcuts should appear for SOS, Chat, Community, Travel

### 5. **Verify Caching**

- DevTools → Application → Cache Storage
- Check different caches for assets

## Browser Support

| Feature            | Chrome | Firefox | Safari | Edge |
| ------------------ | ------ | ------- | ------ | ---- |
| Service Workers    | ✅     | ✅      | ✅     | ✅   |
| Web App Manifest   | ✅     | ✅      | ⚠️     | ✅   |
| Install Prompt     | ✅     | ✅      | ⚠️     | ✅   |
| Offline Support    | ✅     | ✅      | ✅     | ✅   |
| Push Notifications | ✅     | ✅      | ⚠️     | ✅   |

_⚠️ Safari has limited PWA support on iOS; use Web Clips instead_

## Important Notes

### Development vs Production

- PWA features are **disabled in development** for easier debugging
- Enable by setting `NODE_ENV=production` for testing
- Build and preview with `npm run build && npm start`

### Updates

- Service workers skip waiting by default
- Clients claim active immediately
- Users see new content on page refresh

### Security

- All external resources are cached with version control
- API responses are cached for 1 hour only
- Critical data should be fetched fresh from server

## Troubleshooting

### Install Prompt Not Showing

- Check browser compatibility (Chrome 51+, Edge 79+)
- Ensure HTTPS in production
- Check if app is already installed
- Clear browser cache and try again

### Service Worker Not Registering

- Check `/public/sw.js` exists (auto-generated by next-pwa)
- Verify HTTPS in production
- Check browser console for errors
- Disable AdBlocker and try again

### Cache Issues

- Clear all caches with `clearAllCaches()`
- DevTools → Application → Cache Storage → Delete
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Next Steps

1. **Add Push Notifications Backend**

   - Set up Firebase Cloud Messaging (FCM)
   - Subscribe users to notifications
   - Send alerts from backend

2. **Enhance Offline Experience**

   - Pre-cache critical pages
   - Store user data locally
   - Sync when online

3. **Monitor Performance**

   - Track cache hit rates
   - Monitor service worker updates
   - Analyze user engagement metrics

4. **Add More App Shortcuts**
   - Add shortcuts for other key features
   - Update as app evolves

## Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)

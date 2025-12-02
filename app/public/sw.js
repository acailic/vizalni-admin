// PWA Service Worker for vizualni-admin
const CACHE_NAME = 'vizualni-admin-v1';
const STATIC_CACHE_NAME = 'vizualni-admin-static-v1';
const DYNAMIC_CACHE_NAME = 'vizualni-admin-dynamic-v1';

// Cache strategy configuration
const CACHE_STRATEGIES = {
  // Cache first for static assets
  STATIC: {
    cacheName: STATIC_CACHE_NAME,
    strategy: 'cacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
  // Network first for API calls
  API: {
    cacheName: DYNAMIC_CACHE_NAME,
    strategy: 'networkFirst',
    maxAge: 5 * 60, // 5 minutes
  },
  // Cache first with network fallback for images
  IMAGES: {
    cacheName: DYNAMIC_CACHE_NAME,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60, // 1 week
  },
};

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/static/',
  '/icons/',
  '/fonts/',
  // Add other static assets
];

// API routes to cache
const API_ROUTES = [
  '/api/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(request.url)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle static assets (CSS, JS, fonts)
async function handleStaticAsset(request) {
  return cacheFirst(request, CACHE_STRATEGIES.STATIC);
}

// Handle API requests
async function handleAPIRequest(request) {
  return networkFirst(request, CACHE_STRATEGIES.API);
}

// Handle image requests
async function handleImageRequest(request) {
  return cacheFirst(request, CACHE_STRATEGIES.IMAGES);
}

// Handle navigation requests (HTML pages)
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation requests
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fallback to cache for offline access
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page if available
    return caches.match('/offline.html') || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache-first strategy
async function cacheFirst(request, config) {
  const cache = await caches.open(config.cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
    // Update cache in background
    updateCacheInBackground(request, config);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Network error', {
      status: 408,
      statusText: 'Request Timeout'
    });
  }
}

// Network-first strategy
async function networkFirst(request, config) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(config.cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cache = await caches.open(config.cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
      return cachedResponse;
    }

    return new Response('Network error', {
      status: 408,
      statusText: 'Request Timeout'
    });
  }
}

// Update cache in background
async function updateCacheInBackground(request, config) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(config.cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.debug('Background cache update failed:', error);
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('/static/') ||
         url.includes('/icons/') ||
         url.includes('/fonts/') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url.endsWith('.woff') ||
         url.endsWith('.woff2') ||
         url.endsWith('.ttf');
}

function isAPIRequest(url) {
  return url.includes('/api/');
}

function isImageRequest(url) {
  return url.includes('/_next/image') ||
         url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i);
}

function isExpired(response, maxAgeSeconds) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;

  const responseTime = new Date(dateHeader).getTime();
  const currentTime = Date.now();
  const ageSeconds = (currentTime - responseTime) / 1000;

  return ageSeconds > maxAgeSeconds;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline-to-online sync operations
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();

    for (const request of requests) {
      if (request.url.includes('/api/')) {
        try {
          // Retry failed API requests
          await fetch(request);
          // Remove from cache after successful retry
          await cache.delete(request);
        } catch (error) {
          console.debug('Background sync failed for:', request.url);
        }
      }
    }
  } catch (error) {
    console.debug('Background sync error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Vizualni Admin', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Cache cleanup on storage quota exceeded
self.addEventListener('quotaexceeded', (event) => {
  console.log('Storage quota exceeded, cleaning up old caches');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();

          // Remove oldest entries
          if (requests.length > 100) {
            const toDelete = requests.slice(0, 50);
            return Promise.all(
              toDelete.map(request => cache.delete(request))
            );
          }
        })
      );
    })
  );
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = Date.now();

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Log slow requests
        if (duration > 2000) {
          console.warn(`Slow request detected: ${event.request.url} took ${duration}ms`);
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.error(`Request failed: ${event.request.url} after ${duration}ms`, error);
        throw error;
      }
    })()
  );
});
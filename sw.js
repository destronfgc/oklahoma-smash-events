const CACHE_NAME = 'ok-smash-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './images/wereOK-logo.png'
];

// Install the service worker and cache the static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
    // DO NOT cache API calls to Start.gg or Twitch embeds, we always want those fresh!
    if (event.request.url.includes('api.start.gg') || event.request.url.includes('twitch.tv') || event.request.url.includes('leaflet')) {
        return;
    }
    
    // For everything else (HTML, images), try to load from cache first for speed, 
    // then fall back to the network if it's not cached.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

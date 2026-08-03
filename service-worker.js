const CACHE_NAME = "gym-app-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",

    "./assets/icons/LiftLogIcon-128x128.png",
    "./assets/icons/LiftLogIcon-180x180.png",
    "./assets/icons/LiftLogIcon-192x192.png",
    "./assets/icons/LiftLogIcon-512x512.png",

    "./assets/icons/accessibility-outline.svg",
    "./assets/icons/add-outline.svg",
    "./assets/icons/arrow-back-circle-outline.svg",
    "./assets/icons/arrow-back-outline.svg",
    "./assets/icons/barbell-outline.svg",
    "./assets/icons/bookmark-outline.svg",
    "./assets/icons/close-outline.svg",
    "./assets/icons/podium-outline.svg",
    "./assets/icons/reader-outline.svg",
    "./assets/icons/trash-outline.svg",        
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
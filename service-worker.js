let fileCacheName = 'pwa-practice-file-cache-1';
let filesToCache = [
    '/',
    '/fonts/material-icons/MaterialIcons-Regular.ttf',
    '/fonts/material-icons/MaterialIcons-Regular.woff',
    '/fonts/material-icons/MaterialIcons-Regular.woff2',
    '/fonts/roboto/Roboto-Regular.woff',
    '/fonts/roboto/Roboto-Regular.woff2',
    '/images/me.jpg',
    '/images/space.jpg',
    '/scripts/app.js',
    '/scripts/dexie.js',
    '/scripts/event-handler.js',
    '/scripts/jquery-3.2.1.min.js',
    '/scripts/jquery.justifiedGallery.min.js',
    '/scripts/materialize.min.js',
    '/styles/inline.css',
    '/styles/justifiedGallery.min.css',
    '/styles/materialize.min.css',
    '/index.html'
];

let dataCacheName = 'flickr-cache-1';

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(fileCacheName).then((cache) => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== fileCacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
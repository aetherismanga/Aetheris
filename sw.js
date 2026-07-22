const CACHE_NAME = 'aetheris-core-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Rajdhani:wght@500;600;700&display=swap'
];

// Installation : Mise en cache des fichiers de base
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // Force le nouveau SW à s'activer
});

// Interception des requêtes (Stratégie: Cache en premier, réseau ensuite)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Nettoyage des vieux caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

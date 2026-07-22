// Service worker désactivé temporairement pour éviter les bugs de cache
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

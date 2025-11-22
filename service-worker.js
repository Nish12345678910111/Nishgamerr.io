// service-worker.js
// Place this file at the root of your site so it's reachable at /service-worker.js

self.addEventListener('install', (evt) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

// Push event: show notification from payload (expects JSON)
self.addEventListener('push', function(event) {
  let data = { title: 'New Chat Message', body: 'You have a new message', url: '/' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    // ignore parse error
  }

  const options = {
    body: data.body || '',
    icon: '/icon-192x192.png',    // optional: add to repo root or adjust path
    badge: '/icon-192x192.png',
    tag: 'chat-notification',
    data: { url: data.url || '/' },
    renotify: false
  };

  event.waitUntil(self.registration.showNotification(data.title || 'New Chat Message', options));
});

// When user clicks the notification, focus or open the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If there's already a client open to the URL, focus it
        if (client.url === url && 'focus' in client) return client.focus();
      }
      // Otherwise open a new window/tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Optional: clean up stale caches if you decide to add caching later
self.addEventListener('message', (event) => {
  // can handle messages from page if needed (e.g., trigger skipWaiting)
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

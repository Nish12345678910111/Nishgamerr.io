// service-worker.js
self.addEventListener('install', (evt) => { self.skipWaiting(); });
self.addEventListener('activate', (evt) => { evt.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event) {
  let data = { title: 'New Chat Message', body: 'You have a new message', url: '/' };
  try { if (event.data) data = event.data.json(); } catch (e) {}
  const options = {
    body: data.body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'chat-notification',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'New Chat Message', options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

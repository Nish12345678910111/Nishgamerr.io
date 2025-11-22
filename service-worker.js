self.addEventListener('install', (evt) => {
// Activate immediately so the worker can start receiving pushes
self.skipWaiting();
});
self.addEventListener('activate', (evt) => {
// Claim clients so pages under scope are controlled immediately
evt.waitUntil(self.clients.claim());
});


self.addEventListener('push', function(event) {
let data = { title: 'New Chat Message', body: 'You have a new message', url: '/' };
try { if (event.data) data = event.data.json(); } catch (e) { /* ignore parse errors */ }


const options = {
body: data.body || '',
icon: '/icon-192x192.png', // optional: add this file to your repo
badge: '/icon-192x192.png',
tag: 'chat-notification',
data: { url: data.url || '/' }
};


event.waitUntil(self.registration.showNotification(data.title || 'New Chat Message', options));
});


self.addEventListener('notificationclick', function(event) {
event.notification.close();
const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
event.waitUntil(
clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
// Try to focus an existing window
for (let i = 0; i < windowClients.length; i++) {
const client = windowClients[i];
if (client.url === url && 'focus' in client) return client.focus();
}
// Otherwise open a new one
if (clients.openWindow) return clients.openWindow(url);
})
);
});

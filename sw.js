// sw.js
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://nish12345678910111.github.io/Nishgamerr.io/icon.png' // Optional
  });
});

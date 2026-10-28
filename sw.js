self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Только GET и только своё происхождение: Firestore, CDN и POST не трогаем
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || new Response('Offline', { status: 503 })))
  );
});

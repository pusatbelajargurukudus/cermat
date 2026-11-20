/* Pembersih sementara: melepas service worker LAPORAN CERMAT yang sempat
 * terpasang di portal CERMAT karena salah unggah (20 Nov 2026).
 * Tidak menyimpan apa pun. Boleh dihapus setelah sekitar 2 minggu. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k === 'laporan-cermat-v6').map(k => caches.delete(k)));
    await self.registration.unregister();
    const tabs = await self.clients.matchAll({ type: 'window' });
    tabs.forEach(t => t.navigate(t.url));
  })());
});

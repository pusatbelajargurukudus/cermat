/* Service worker portal CERMAT (Pustaka Digital).
 * - Tampilan (halaman, CSS, JS, logo) disimpan agar portal tetap terbuka saat sinyal lemah.
 * - data.json SELALU diambil terbaru dari internet; salinan tersimpan hanya dipakai saat offline.
 *   Daftar folder yang diubah lewat Mode Admin tetap tersimpan di GitHub dan tidak tersentuh.
 * - Mode Admin (api.github.com) tidak pernah lewat cache.
 * - Petunjuk (panduan/) disimpan di HP saat pertama dibuka; pembukaan berikutnya langsung dari HP
 *   (juga offline) dan diperbarui diam-diam saat ada sinyal. PDF petunjuk tidak disimpan otomatis.
 * Naikkan CACHE bila index.html, assets/style.css, assets/app.js, atau fonts/ diubah.
 * Naikkan PANDUAN bila isi folder panduan/ diganti. */
const CACHE = 'cermat-pustaka-v13';
const PANDUAN = 'cermat-panduan-v6';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'data.json',
  'assets/style.css?v=12', 'assets/app.js?v=15', 'assets/logo.png', 'fonts/fonts.css?v=1',
  'fonts/jakarta-400.woff2', 'fonts/jakarta-500.woff2', 'fonts/jakarta-600.woff2', 'fonts/jakarta-700.woff2', 'fonts/jakarta-800.woff2',
  'fonts/cormorant-600.woff2', 'fonts/cormorant-500i.woff2', 'fonts/cormorant-600i.woff2',
  'assets/logo-pbg.png', 'assets/logo-kemenag.png', 'assets/logo-disdikpora.png', 'assets/logo-djarum.png',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  // berkas disimpan satu per satu: satu berkas gagal tidak menggagalkan pemasangan
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys
    // hanya cache milik portal ini, plus sisa salah unggah LAPORAN CERMAT (20 Nov 2026); cache aplikasi lain tidak disentuh
    .filter(k => (k.indexOf('cermat-pustaka-') === 0 && k !== CACHE) || (k.indexOf('cermat-panduan-') === 0 && k !== PANDUAN) || k === 'laporan-cermat-v6')
    .map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; };

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => put(req, res))));
    return;
  }
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  // petunjuk: tampil dari HP bila sudah pernah dibuka, sambil diperbarui di belakang layar
  if (url.pathname.indexOf('/panduan/') >= 0) {
    if (/\.pdf$/i.test(url.pathname)) return;
    const key = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    e.respondWith(caches.open(PANDUAN).then(c => c.match(key).then(r => {
      const net = fetch(req).then(res => { if (res && res.ok) c.put(key, res.clone()); return res; }).catch(() => r);
      if (r) { e.waitUntil(net.catch(() => null)); return r; }
      return net;
    })));
    return;
  }
  // data.json & halaman: jaringan dulu, cadangan dari cache saat offline
  if (req.mode === 'navigate' || url.pathname.endsWith('/data.json')) {
    e.respondWith(fetch(req).then(res => put(url.pathname.endsWith('/data.json') ? 'data.json' : req, res))
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match(req.mode === 'navigate' ? 'index.html' : 'data.json'))));
    return;
  }
  // tampilan: ambil dari cache, sambil memperbarui di belakang layar
  e.respondWith(caches.match(req).then(r => {
    const net = fetch(req).then(res => put(req, res)).catch(() => r);
    return r || net;
  }));
});

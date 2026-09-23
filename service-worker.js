/* Yateem TV — service worker (ทำให้ติดตั้งเป็นแอพ + โหลดเร็ว/ออฟไลน์เบื้องต้น) */
const CACHE = 'yateem-tv-v12';
const ASSETS = [
  './', './index.html', './manifest.json', './icon.jpg', './logo.png', './icon-192.png', './icon-512.png',
  './fb_like.png', './fb_love.png', './fb_care.png', './fb_haha.png', './fb_wow.png', './fb_sad.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // เฉพาะ same-origin (หน้าเว็บ/ไฟล์เรา) — network-first แล้ว fallback cache
  // ปล่อยผ่านทั้งหมดสำหรับ cross-origin: สตรีมวิดีโอ (plathong), Firebase, Cloudinary, YouTube ฯลฯ
  if (url.origin !== location.origin) return;
  // ไม่แคช: range request (วิดีโอ/PDF โหลดบางส่วน = 206) และไฟล์ PDF ใหญ่ (กุรอาน ~29MB)
  const isRange = req.headers.has('range');
  const isBig = /\.pdf($|\?)/i.test(url.pathname);
  e.respondWith(
    fetch(req)
      .then((r) => {
        // แคชเฉพาะ response ปกติที่สำเร็จ (200 / basic) และไม่ใช่ range/PDF
        if (!isRange && !isBig && r && r.ok && r.status === 200 && r.type === 'basic') {
          const cp = r.clone();
          caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {});
        }
        return r;
      })
      .catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
  );
});

/* Guarda uma cópia da página e do leitor de códigos no telemóvel,
   para que a página abra mesmo sem rede.
   - A página: tenta sempre a versão mais recente; sem rede usa a cópia.
   - O leitor de códigos (biblioteca externa): usa a cópia guardada.
   - Os pedidos ao Apps Script (Google) nunca passam por aqui. */

const CACHE = 'stock-livros-v1';
const LEITOR = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(['./', './index.html', LEITOR].map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Biblioteca do leitor: cópia guardada primeiro
  if (e.request.url === LEITOR) {
    e.respondWith(caches.match(LEITOR).then(r => r || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(LEITOR, copia));
      return resp;
    })));
    return;
  }

  // Ficheiros deste site: versão mais recente primeiro, cópia se não houver rede
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(e.request).then(resp => {
      if (resp.ok) { const copia = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return resp;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then(r => r || caches.match('./index.html'))));
  }
  // Tudo o resto (ex.: Google Apps Script) segue normalmente pela rede
});

// Relative registration works at both / and /petal-pusher/. No external requests.
const Offline = { message: 'Open online once to prepare offline play.' };
if ('serviceWorker' in navigator && (location.protocol === 'https:' ||
    ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname))) {
  Offline.message = 'Preparing this game for offline play…';
  navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
    .then(() => navigator.serviceWorker.ready)
    .then(() => { Offline.message = 'Ready to play offline on this device. Keep a progress code as a backup.'; })
    .catch(() => { Offline.message = 'Offline play could not be prepared. Open online and try again.'; });
}

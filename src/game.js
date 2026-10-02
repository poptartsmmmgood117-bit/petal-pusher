// Petal Pusher boot: config, save, haptics, Phaser game.
const TITLE = 'Petal Pusher';
const Z = 1.5; // canvas pixels per world unit (world is 720x1560) -> crisp on retina phones

const Save = {
  key: 'petalpusher.save',
  data: { v: 1, best: 0, found: {}, muted: false },
  load() {
    try {
      const d = JSON.parse(localStorage.getItem(this.key) || 'null');
      if (d && d.v === 1) this.data = { ...this.data, ...d, found: { ...(d.found || {}) } };
    } catch (e) { console.warn('save unreadable, starting fresh', e); }
  },
  write() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) { /* private mode */ } },
};
Save.load();
if (LV.migrate()) Save.write(); // older saves get a shelf key; a not-yet-started Golden shelf becomes a brand-new shelf
// iOS can kill a backgrounded app without warning: keep play time and the Princess pity counter.
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Save.write(); });
addEventListener('pagehide', () => Save.write());
SFX.setMuted(!!Save.data.muted);

// iPhone has no navigator.vibrate; iOS 18+ Safari gives a light tick when a switch toggles.
const hapticEl = document.getElementById('haptic');
function haptic() {
  try { if (navigator.vibrate) navigator.vibrate(8); else if (hapticEl) hapticEl.click(); } catch (e) { /* optional */ }
}
['touchend', 'pointerup', 'click'].forEach(ev => document.addEventListener(ev, () => SFX.unlock(), { passive: true }));
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('gesturestart', e => e.preventDefault());

class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    this.cameras.main.setZoom(Z).centerOn(LAYOUT.W / 2, LAYOUT.H / 2);
    const t = this.add.text(LAYOUT.W / 2, LAYOUT.H / 2, 'growing…', { fontFamily: 'system-ui', fontSize: '40px', color: '#e9dcff', resolution: Z }).setOrigin(0.5);
    ART.build(this, Z * 1.25)
      .then(() => this.scene.start('Play'))
      .catch(e => { console.error(e); t.setText('Could not load art.\nPlease refresh.'); });
  }
}

window.GAME = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2a1640',
  width: LAYOUT.W * Z,
  height: LAYOUT.H * Z,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'matter', matter: { gravity: { x: 0, y: 0 }, autoUpdate: false, positionIterations: 8, velocityIterations: 6 } },
  input: { activePointers: 2 },
  scene: [Boot, Play],
  // Phaser stops its frame loop for good on any uncaught error (the whole game freezes).
  // Keep running instead, and keep the last error for the next bug report.
  callbacks: {
    postBoot: game => {
      const step = game.step;
      let logged = 0;
      game.step = function (time, delta) {
        try { step.call(this, time, delta); } catch (e) {
          if (logged++ < 5) {
            console.error(e);
            try { localStorage.setItem('petalpusher.lastError', new Date().toISOString() + ' ' + String((e && e.stack) || e).slice(0, 1500)); } catch (e2) { /* full */ }
          }
        }
      };
    },
  },
});

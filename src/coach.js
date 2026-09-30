// First-run coach: friendly one-time tips triggered by what she actually does (saved in Save.data.tips).
const COACH = {
  drop:   { text: 'Tap the shelf to drop a plant 🌱', y: 640, hand: 'tap' },
  push:   { text: 'The planter pushes plants toward the chute ↓', y: 760, ms: 4200 },
  win:    { text: 'You won it! Prizes fill up MY SHELF below 💜', y: 960, ms: 4200 },
  big:    { text: 'Try holding your finger down for a BIG Surprise Box (3 ♥)', y: 640, hand: 'hold', ms: 9000 },
  gutter: { text: 'Oops! The side gutters eat plants. Aim for the middle', y: 760, ms: 4200 },
  hearts: { text: 'Winning prizes gives hearts back. At 0, wait a moment and they refill ♥', y: 1250, ms: 5000 },
  royal:  { text: '👑 Psst… the Princess box can now show up in BIG drops!', y: 640, ms: 5000 },
};
const TIPS = [
  'Aim for the middle. The side gutters eat plants!',
  'Hold your finger down for a BIG Surprise Box.',
  'Tap a slot on MY SHELF to see how to find it.',
  'The Princess box hides in BIG drops.',
  'Collect all 9 prizes to unlock a new shelf.',
  'Out of hearts? Wait a moment and they refill.',
];

Object.assign(Play.prototype, {
  onEvent(ev, info = {}) {
    if (ev === 'start') this.coach('drop');
    else if (ev === 'drop') {
      this.coachDone('drop');
      if (info.big) this.coachDone('big');
      else if (this.stats.drops >= 8 && this.hearts >= CFG.bigCost) this.coach('big');
    } else if (ev === 'land' && this.stats.drops === 1) this.coach('push');
    else if (ev === 'win') { this.coachDone('push'); this.coach('win'); }
    else if (ev === 'lost') this.coach('gutter');
    else if (ev === 'lowHearts') this.coach('hearts');
    else if (ev === 'royal') this.coach('royal');
  },

  coach(key) {
    const tips = (Save.data.tips = Save.data.tips || {});
    if (tips[key] || AUTO || !this.started) return;
    this.coachQ = this.coachQ || [];
    if (this.coachKey) { if (this.coachKey !== key && !this.coachQ.includes(key)) this.coachQ.push(key); return; }
    tips[key] = 1; Save.write();
    const c = COACH[key], L = LAYOUT;
    this.coachKey = key;
    this.coachBox = this.bubble(c.text, L.W / 2, c.y, 0, 0xff8fc8);
    this.coachFx = [];
    if (c.hand) {
      const h = txt(this, L.W / 2 + 36, c.y + 120, '👆', 72).setOrigin(0.5).setDepth(56);
      this.coachFx.push(h);
      if (c.hand === 'tap') this.tweens.add({ targets: h, y: h.y - 26, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      else {
        const ring = this.add.circle(L.W / 2 + 20, c.y + 78, 34).setStrokeStyle(6, 0xffd35a, 1).setDepth(56);
        this.coachFx.push(ring);
        this.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 900, repeat: -1 });
      }
    }
    if (c.ms) this.coachTimer = this.time.delayedCall(c.ms, () => this.coachDone(key));
  },

  // She did the thing (or the tip timed out): hide it, or drop it from the queue for good.
  coachDone(key) {
    if (this.coachKey !== key) {
      if (this.coachQ && this.coachQ.includes(key)) { this.coachQ = this.coachQ.filter(k => k !== key); (Save.data.tips = Save.data.tips || {})[key] = 1; }
      else if (Save.data.tips && !Save.data.tips[key] && (key === 'big' || key === 'drop')) Save.data.tips[key] = 1; // learned it before the tip
      return;
    }
    this.fadeOut(this.coachBox);
    this.coachFx.forEach(o => { this.tweens.killTweensOf(o); o.destroy(); });
    if (this.coachTimer) this.coachTimer.remove();
    this.coachKey = null;
    const next = this.coachQ.shift();
    if (next) this.time.delayedCall(600, () => this.coach(next));
  },
});

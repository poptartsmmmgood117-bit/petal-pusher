// Daily gift: once per local calendar day, a wrapped box to tap open for bonus hearts on a 7-day streak.
// Saved as Save.data.daily = { last: <local day number>, streak: <days in a row> }. Absent on old saves = never opened.
const DAILY = {
  // Day 1..7; every day after 7 stays at 15. A full week = 55 hearts. Day 7 = one level-up (+15).
  REWARDS: [3, 4, 5, 7, 9, 12, 15],
  dayNum(ms) { // local calendar day as an integer (DST-safe: counts dates, not hours)
    const d = new Date(ms);
    const n = Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    return Number.isFinite(n) ? n : null;
  },
  reward(streak) { return DAILY.REWARDS[Math.min(Math.max(streak | 0, 1), 7) - 1]; },
  // Today's gift, or null when there is nothing new (opened today already, or the clock went backwards).
  status(sv, ms = Date.now()) {
    const today = DAILY.dayNum(ms), g = sv.daily;
    if (today === null) return null;
    const last = g && Number.isFinite(g.last) ? g.last : null;
    if (last !== null && today <= last) return null;
    const streak = last !== null && today - last === 1 ? (Number(g.streak) || 0) + 1 : 1;
    return { today, streak, reward: DAILY.reward(streak) };
  },
  claim(sv, ms = Date.now()) {
    const st = DAILY.status(sv, ms);
    if (st) sv.daily = { last: st.today, streak: st.streak };
    return st;
  },
  // If the clock once jumped far ahead and came back, the gift would stay locked for months.
  // More than 7 days in "the future": re-anchor to today with no gift today (winding the clock never pays).
  sanitize(sv, ms = Date.now()) {
    const today = DAILY.dayNum(ms), g = sv.daily;
    if (today !== null && g && Number.isFinite(g.last) && g.last > today + 7) { sv.daily = { last: today, streak: 0 }; return true; }
    return false;
  },
};

Object.assign(Play.prototype, {
  // Wait until the first-run tips, level-ups, other cards and her finger are all clear.
  giftReady() {
    const tips = Save.data.tips || {}, now = this.time.now;
    if (AUTO || !this.started || this.levelingUp || this.aiming || this.cardUp()) return false;
    if (this.coachKey || (this.coachQ && this.coachQ.length)) return false;
    if (!tips.win && !(Save.data.best > 0) && !Save.data.level) return false; // brand new: learn the game first
    return now - this.startedAt > 3500 && now - this.lastWin > 2500 && now - this.lastDrop > 1200;
  },

  giftTick() {
    if (this.giftShown || !this.giftReady()) return;
    if (DAILY.sanitize(Save.data)) Save.write();
    const st = DAILY.status(Save.data);
    if (st) this.showGift(st); else this.giftShown = true; // nothing today: stop checking this session
  },

  showGift(st) {
    const L = LAYOUT, o = this.add.container(0, 0).setDepth(58);
    this.giftShown = true;
    const dim = this.add.rectangle(L.W / 2, L.H / 2, L.W, L.H, 0x1c0d30, 0.78).setInteractive();
    const card = this.add.container(L.W / 2, 700).setScale(0.3).setAlpha(0);
    const bg = this.add.graphics().fillStyle(0xffffff, 0.97).fillRoundedRect(-300, -330, 600, 660, 48)
      .lineStyle(8, 0xff8fc8, 1).strokeRoundedRect(-300, -330, 600, 660, 48);
    const t1 = txt(this, 0, -262, 'A little gift for you!', 44, '#5b2f9e').setOrigin(0.5);
    const shown = Math.min(st.streak, 7);
    const t2 = txt(this, 0, -202, st.streak > 7 ? `${st.streak} days in a row! 🔥` : `Day ${shown} of 7`, 34, '#ff4fa3').setOrigin(0.5);
    const d = ART.ITEMS.surprise, box = this.add.image(0, -20, 'item_surprise').setScale(d.texScale * 2);
    const dots = Array.from({ length: 7 }, (_, i) => {
      const lit = i < shown;
      return this.add.circle(-150 + i * 50, 170, 15, lit ? 0xffd35a : 0xe9dcff).setStrokeStyle(4, lit ? 0xe8a92a : 0xc9a8f5);
    });
    const t3 = txt(this, 0, 250, 'tap to open', 32, '#8e5cd6').setOrigin(0.5);
    card.add([bg, t1, t2, box, ...dots, t3]);
    o.add([dim, card]);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 420, ease: 'Back.easeOut' });
    const wiggle = this.tweens.add({ targets: box, angle: { from: -6, to: 6 }, duration: 260, yoyo: true, repeat: -1, repeatDelay: 700, ease: 'Sine.easeInOut' });
    SFX.special(); haptic();
    let stage = 0;
    const kill = () => { o.destroy(true); if (stage === 0) this.giftShown = false; }; // unopened: offer it again later
    const tap = () => {
      if (stage === 0) {
        stage = 1; wiggle.remove(); box.angle = 0;
        const got = DAILY.claim(Save.data), n = got ? got.reward : 0;
        this.hearts += n; Save.write();
        SFX.bonus(); haptic();
        this.tweens.add({ targets: box, scale: box.scale * 1.5, alpha: 0, duration: 320, ease: 'Back.easeIn' });
        const e = this.add.particles(L.W / 2, 680, 'heart', {
          speed: { min: 160, max: 420 }, lifespan: 900, gravityY: 500, scale: { start: 1.1, end: 0 },
          tint: [0xff8fc8, 0xffd35a, 0xffffff], emitting: false,
        }).setDepth(59);
        e.explode(20); this.time.delayedCall(1300, () => e.destroy());
        const win = txt(this, 0, -30, `+${n} ♥`, 104, '#ff4fa3', { stroke: '#ffffff', strokeThickness: 10 }).setOrigin(0.5).setScale(0.4);
        card.add(win);
        this.tweens.add({ targets: win, scale: 1, duration: 360, delay: 200, ease: 'Back.easeOut' });
        t3.setText(`Come back tomorrow for +${DAILY.reward((got ? got.streak : 0) + 1)} ♥\ntap to keep playing`).setFontSize(30).setY(262);
        this.refreshHud(true);
        this.time.delayedCall(600, () => { stage = 2; });
      } else if (stage === 2) {
        stage = 3;
        this.tweens.add({ targets: o, alpha: 0, duration: 220, onComplete: () => o.destroy(true) });
        this.closeModal();
      }
    };
    dim.on('pointerup', tap);
    this.openModal('gift', kill);
  },
});

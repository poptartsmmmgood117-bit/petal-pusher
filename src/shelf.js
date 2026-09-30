// Petal Pusher collection shelf, level ups, prize hints and the How-to-play card (mixed into Play).
Object.assign(Play.prototype, {
  // Pop an object's scale and land EXACTLY back on its base scale, even when pops overlap.
  pop(obj, k = 1.12, dur = 90) {
    if (obj.baseSX === undefined) { obj.baseSX = obj.scaleX; obj.baseSY = obj.scaleY; }
    this.tweens.killTweensOf(obj);
    obj.setScale(obj.baseSX, obj.baseSY);
    this.tweens.add({ targets: obj, scaleX: obj.baseSX * k, scaleY: obj.baseSY * k, duration: dur, yoyo: true });
  },

  buildShelf() {
    const L = LAYOUT;
    for (const s of Object.values(this.slots || {})) [s.img, s.badge, s.q, s.hit].forEach(o => o.destroy());
    this.slots = {};
    const mk = (id, x, plankY, h) => {
      const d = ART.ITEMS[id], s = (h / d.size) * d.texScale, y = plankY - h / 2 + 6;
      const img = this.add.image(x, y, 'item_' + id).setScale(s).setDepth(6);
      img.baseSX = img.baseSY = s;
      const badge = txt(this, x + h * 0.36, plankY + 4, '', 24, '#fff', { stroke: '#3a1f4f', strokeThickness: 6 }).setOrigin(0.5).setDepth(7);
      const q = txt(this, x, y, '?', 46, '#e9dcff', { stroke: '#2a1640', strokeThickness: 8 }).setOrigin(0.5).setDepth(7);
      const hit = this.add.zone(x, y, h + 24, h + 24).setInteractive();
      hit.on('pointerdown', () => this.showHint(id, x, plankY - h - 24));
      this.slots[id] = { img, badge, q, hit, s };
    };
    const set = LV.set();
    set.slice(0, 5).forEach((id, i) => mk(id, 120 + i * 120, L.plank1, 82));
    set.slice(5).forEach((id, i) => mk(id, 135 + i * 150, L.plank2, i >= 2 ? 100 : 86));
    this.floorTint.setFillStyle(LV.gold() ? 0xffd35a : LV.def().floor, LV.index() ? 0.2 : 0);
  },

  refreshShelf() {
    const found = Save.data.found, gold = LV.gold();
    let n = 0;
    for (const id of LV.set()) {
      const s = this.slots[id], c = found[id] || 0;
      if (c) { n++; s.img.setTint(gold ? 0xfff0b8 : 0xffffff).setAlpha(1); s.badge.setText('×' + c); s.q.setVisible(false); }
      else { s.img.setTint(0x6b4f96).setAlpha(0.55); s.badge.setText(''); s.q.setVisible(true); }
    }
    this.shelfTitle.setText(`Lv ${LV.index() + 1} · ${LV.title()}   ${n}/9`);
  },

  flyToShelf(id, x) {
    const slot = this.slots[id];
    if (!slot) return; // a prize from an earlier shelf still on the pile: points only
    const d = ART.ITEMS[id], first = !Save.data.found[id];
    Save.data.found[id] = (Save.data.found[id] || 0) + 1;
    const fly = this.add.image(x, LAYOUT.edgeY + 60, 'item_' + id).setScale(d.texScale * 0.8).setDepth(12);
    this.tweens.add({ targets: fly, x: slot.img.x, duration: 560, ease: 'Sine.easeInOut' });
    this.tweens.add({
      targets: fly, y: slot.img.y, scale: slot.s, duration: 560, ease: 'Back.easeIn',
      onComplete: () => {
        fly.destroy(); this.refreshShelf(); this.pop(slot.img, 1.25, 110);
        if (!first) return;
        this.sparkleAt(slot.img.x, slot.img.y, 12); this.toast(`New prize: ${d.name}!`, '#9be7b4');
        if (!this.levelingUp && LV.set().every(k => Save.data.found[k])) {
          this.levelingUp = true; // wait for the jackpot banner to finish when the Princess completes the shelf
          this.time.delayedCall(d.mega ? 3900 : 900, () => this.levelUp());
        }
      },
    });
  },

  levelUp() {
    const L = LAYOUT;
    Save.data.albums = [...(Save.data.albums || []), { name: LV.title(), found: Save.data.found }];
    Save.data.level = LV.index() + 1; Save.data.found = {};
    this.hearts += CFG.levelUpHearts; Save.write();
    SFX.mega(); this.confetti(); haptic(40);
    const o = this.add.container(0, 0).setDepth(62);
    const dim = this.add.rectangle(L.W / 2, L.H / 2, L.W, L.H, 0x1c0d30, 0.6).setInteractive();
    const card = this.add.container(L.W / 2, 660).setScale(0.3).setAlpha(0);
    const bg = this.add.graphics().fillStyle(0xffffff, 0.97).fillRoundedRect(-310, -300, 620, 600, 48)
      .lineStyle(8, 0x9be7b4, 1).strokeRoundedRect(-310, -300, 620, 600, 48);
    const t1 = txt(this, 0, -232, 'Shelf complete! 🎉', 48, '#5b2f9e').setOrigin(0.5);
    const t2 = txt(this, 0, -164, `Level ${LV.index() + 1}: ${LV.title()}`, 40, '#ff4fa3').setOrigin(0.5);
    const icons = LV.set().map((id, i) => {
      const d = ART.ITEMS[id], row = i < 5 ? 0 : 1, col = row ? i - 5 : i;
      return this.add.image((row ? -157 : -210) + col * 105, -50 + row * 118, 'item_' + id)
        .setScale((86 / d.size) * d.texScale).setTint(0x6b4f96).setAlpha(0.7);
    });
    const t3 = txt(this, 0, 176, `9 new prizes to find!   ♥ +${CFG.levelUpHearts}`, 32, '#3a1f4f').setOrigin(0.5);
    const t4 = txt(this, 0, 238, 'tap to continue', 26, '#8e5cd6').setOrigin(0.5);
    card.add([bg, t1, t2, ...icons, t3, t4]);
    o.add([dim, card]);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 420, ease: 'Back.easeOut' });
    let done = false;
    const close = () => {
      if (done) return; done = true;
      this.tweens.add({ targets: o, alpha: 0, duration: 250, onComplete: () => o.destroy(true) });
      this.buildShelf(); this.refreshShelf(); this.rollNext(); this.refreshHud(true);
      this.levelingUp = false;
      this.toast('New plants are dropping! 🌱', '#9be7b4');
    };
    this.time.delayedCall(700, () => dim.once('pointerup', close));
    this.time.delayedCall(8000, close);
  },

  confetti(ms = 1800) {
    const conf = this.add.particles(0, 0, 'confetti', {
      x: { min: 40, max: 680 }, y: 150, speedY: { min: 240, max: 520 }, speedX: { min: -140, max: 140 },
      rotate: { min: 0, max: 360 }, lifespan: 2600, gravityY: 260, scale: { min: 0.8, max: 1.6 },
      tint: [0xff8fc8, 0xc9a8f5, 0xffd35a, 0xffffff, 0x9be7b4], quantity: 3, frequency: 25, duration: ms,
    }).setDepth(61); // above the jackpot banner, behind the level-up card
    this.time.delayedCall(ms + 3000, () => conf.destroy());
  },

  // Speech bubble; ms = 0 keeps it until someone fades it out.
  bubble(text, x, y, ms = 2400, border = 0xc9a8f5) {
    const t = txt(this, 0, 0, text, 28, '#3a1f4f', { wordWrap: { width: 480 } }).setOrigin(0.5);
    const w = t.width + 48, h = t.height + 30;
    const g = this.add.graphics().fillStyle(0xffffff, 0.97).fillRoundedRect(-w / 2, -h / 2, w, h, 24)
      .lineStyle(5, border, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
    const cx = Phaser.Math.Clamp(x, w / 2 + 14, LAYOUT.W - w / 2 - 14);
    const c = this.add.container(cx, y, [g, t]).setDepth(56).setScale(0.7).setAlpha(0);
    this.tweens.add({ targets: c, scale: 1, alpha: 1, duration: 170, ease: 'Back.easeOut' });
    if (ms) this.time.delayedCall(ms, () => this.fadeOut(c));
    return c;
  },
  fadeOut(c) { if (c && c.active) this.tweens.add({ targets: c, alpha: 0, duration: 200, onComplete: () => c.destroy(true) }); },

  showHint(id, x, y) {
    const d = ART.ITEMS[id], n = Save.data.found[id] || 0, royal = (Save.data.playSecs || 0) >= CFG.megaAfterSecs;
    const hint = n ? `${d.name}  ×${n}`
      : d.mega ? (royal ? '👑 Hiding inside BIG drops. Keep trying!' : '👑 Shows up in BIG drops after a few minutes of play')
      : d.big ? 'Hold your finger down to drop a BIG Surprise Box'
      : d.rare ? '✨ Rare! Sometimes drops instead of a normal plant'
      : 'A common plant. Keep pushing!';
    this.fadeOut(this.hintBox);
    this.hintBox = this.bubble(hint, x, y);
    haptic();
  },

  showHelp() {
    HomeUI.help(this);
  },
});

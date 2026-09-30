// Petal Pusher HUD, juice, collection shelf, title screen (mixed into Play).
const FONT = '"ui-rounded", "SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif';
const txt = (s, x, y, str, size, color = '#fff', extra = {}) =>
  s.add.text(x, y, str, { fontFamily: FONT, fontSize: size + 'px', fontStyle: '900', color, resolution: Z, align: 'center', ...extra });

Object.assign(Play.prototype, {
  buildHud() {
    const L = LAYOUT;
    this.titleText = txt(this, L.W / 2, 60, TITLE, 56, '#ffffff', { stroke: '#5b2f9e', strokeThickness: 10 }).setOrigin(0.5).setDepth(20);
    this.titleText.setShadow(0, 5, '#2a1640', 0, true, true);
    this.scoreText = txt(this, L.W / 2, 110, '', 34, '#ffffff', { stroke: '#3a1f4f', strokeThickness: 5 }).setOrigin(0.5).setDepth(20);
    this.muteBtn = txt(this, 648, 76, SFX.muted ? '🔇' : '🔊', 38).setOrigin(0.5).setDepth(21).setInteractive({ useHandCursor: true });
    this.muteBtn.on('pointerdown', () => {
      const m = !SFX.muted; SFX.setMuted(m); Save.data.muted = m; Save.write(); this.muteBtn.setText(m ? '🔇' : '🔊');
    });
    const help = this.add.circle(72, 76, 30, 0x7a4bd0).setStrokeStyle(4, 0xffffff).setDepth(20).setInteractive({ useHandCursor: true });
    txt(this, 72, 76, '?', 40, '#ffffff').setOrigin(0.5).setDepth(21);
    help.on('pointerdown', () => this.showHelp());
    this.chuteLabel = txt(this, L.W / 2, L.edgeY + 62, '♥   PRIZE CHUTE   ♥', 30, '#f1e6ff', { stroke: '#12071f', strokeThickness: 5 }).setOrigin(0.5).setAlpha(0.7).setDepth(1);

    // dropper: ring + next-prize preview riding the aim X
    this.aimLine = this.add.rectangle(L.W / 2, (272 + L.pusherMax + 40) / 2, 6, L.pusherMax + 40 - 272, 0xffffff, 0.16).setDepth(8);
    this.dropper = this.add.container(L.W / 2, 208).setDepth(10);
    const ring = this.add.circle(0, 0, 60, 0xffffff, 0.22).setStrokeStyle(5, 0xffffff, 0.9);
    this.dropImg = this.add.image(0, 0, 'item_monstera');
    this.chargeG = this.add.graphics();
    this.dropper.add([ring, this.dropImg, this.chargeG]);

    // collection shelf (rebuilt on level up, see shelf.js)
    this.shelfTitle = txt(this, 60, L.dispTop + 12, '', 38, '#ffffff', { align: 'left', stroke: '#2a1640', strokeThickness: 7 }).setDepth(6);
    this.floorTint = this.add.rectangle(L.W / 2, (L.shelfTop + L.edgeY) / 2, L.shelfR - L.shelfL, L.edgeY - L.shelfTop, 0xffffff, 0).setDepth(0.5);
    this.buildShelf();

    // control panel
    const py = L.panelTop + 92;
    this.heartIcon = this.add.image(104, py, 'heart').setDisplaySize(92, 92).setTint(0xff6fb3).setDepth(20);
    this.heartsText = txt(this, 164, py, '', 72, '#ffffff', { stroke: '#3a1f4f', strokeThickness: 8 }).setOrigin(0, 0.5).setDepth(20);
    txt(this, 104, py + 66, 'hearts', 26, '#e0ccff').setOrigin(0.5).setDepth(20);
    this.bigG = this.add.graphics().setDepth(20);
    this.bigText = txt(this, 520, py - 14, 'BIG DROP', 40, '#ffffff').setOrigin(0.5).setDepth(21);
    this.bigSub = txt(this, 520, py + 28, 'costs 3 ♥ · or hold', 25, '#f3ecff').setOrigin(0.5).setDepth(21);
    this.add.zone(520, py, 290, 124).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      this.bigMode = !this.bigMode; haptic(); SFX.drop(this.bigMode); this.drawBig(); this.updateDropper();
    });
    this.drawBig();
    this.refreshShelf();
    this.refreshHud(false);
  },

  drawBig() {
    const g = this.bigG, py = LAYOUT.panelTop + 92, on = this.bigMode;
    g.clear();
    g.fillStyle(on ? 0xffd35a : 0x7a4bd0, 1).fillRoundedRect(375, py - 62, 290, 124, 34);
    g.lineStyle(5, on ? 0xffffff : 0xc9a8f5, 1).strokeRoundedRect(375, py - 62, 290, 124, 34);
    this.bigText.setColor(on ? '#5b2f9e' : '#ffffff');
    this.bigSub.setColor(on ? '#7a4bd0' : '#e9dcff').setText(on ? 'ON · each tap = 3 ♥' : 'costs 3 ♥ · or hold');
  },

  refreshHud(punch) {
    this.scoreText.setText(`Score ${this.score}  ·  Best ${Math.max(Save.data.best, this.score)}`);
    this.fitText(this.scoreText, 360); // stay between the album and music buttons
    this.heartsText.setText(String(this.hearts));
    if (punch) { this.pop(this.heartsText); this.pop(this.heartIcon); } // absolute pops: no size ratchet
    if (this.started && this.hearts < CFG.bigCost) this.onEvent('lowHearts');
  },

  fitText(t, maxW) { t.setScale(Math.min(1, maxW / t.width)); },

  updateDropper() {
    if (!this.dropImg) return;
    const id = this.bigMode ? 'surprise' : this.nextId, d = ART.ITEMS[id];
    this.dropImg.setTexture('item_' + id).setScale((92 / d.size) * d.texScale);
  },

  animateHud(time) {
    this.dropper.y = 208 + Math.sin(time / 300) * 5;
    this.chuteLabel.setAlpha(Math.min(1, 0.65 + 0.1 * Math.sin(time / 500) + (time - this.lastWin < 400 ? 0.35 : 0)));
  },

  startCharge() {
    const g = this.chargeG;
    this.chargeTween = this.tweens.addCounter({
      from: 0, to: 1, duration: CFG.longPress, delay: 120,
      onUpdate: tw => { const v = tw.getValue(); g.clear().lineStyle(8, 0xffd35a, 1).beginPath().arc(0, 0, 68, -Math.PI / 2, -Math.PI / 2 + v * Math.PI * 2).strokePath(); },
    });
  },
  stopCharge(fired) {
    if (this.chargeTween) this.chargeTween.remove();
    this.chargeG.clear();
    if (fired) { SFX.charge(); this.sparkleAt(this.aimX, 208, 10); }
  },

  toast(msg, color = '#ffffff') {
    const L = LAYOUT, n = (this.toasts = (this.toasts || []).filter(t => t.active)).length;
    const t = txt(this, L.W / 2, 560 + n * 64, msg, 36, color, { stroke: '#2a1640', strokeThickness: 9 }).setOrigin(0.5).setDepth(40).setScale(0.6).setAlpha(0);
    this.toasts.push(t);
    this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, alpha: 0, y: t.y - 40, delay: 1300, duration: 350, onComplete: () => t.destroy() });
  },

  popText(x, str, color) {
    const t = txt(this, x, LAYOUT.edgeY + 40, str, 40, color, { stroke: '#2a1640', strokeThickness: 8 }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: t, y: t.y - 90, alpha: 0, duration: 800, ease: 'Cubic.easeOut', onComplete: () => t.destroy() });
  },

  burst(x, key, n, tint, y = LAYOUT.edgeY + 10) {
    const e = this.add.particles(x, y, key, {
      speed: { min: 180, max: 420 }, angle: { min: 200, max: 340 }, lifespan: 750, gravityY: 700,
      scale: { start: 0.9, end: 0 }, rotate: { min: -90, max: 90 }, tint, emitting: false,
    }).setDepth(25);
    e.explode(n);
    this.time.delayedCall(1200, () => e.destroy());
  },
  sparkleAt(x, y, n) {
    const e = this.add.particles(x, y, 'spark', {
      speed: { min: 60, max: 240 }, lifespan: 600, scale: { start: 1.1, end: 0 }, tint: [0xffffff, 0xffe27a, 0xf6c6ff], emitting: false,
    }).setDepth(25);
    e.explode(n);
    this.time.delayedCall(900, () => e.destroy());
  },
  puff(x, y, size) {
    const c = this.add.circle(x, y, size * 0.45, 0xffffff, 0.35).setDepth(1.5);
    this.tweens.add({ targets: c, scale: 1.6, alpha: 0, duration: 260, onComplete: () => c.destroy() });
  },
  nudge(obj) { // shake sideways and land exactly on the original x (no drift when repeated)
    if (obj.baseX === undefined) obj.baseX = obj.x;
    this.tweens.killTweensOf(obj); obj.x = obj.baseX;
    if (obj.baseSX !== undefined) obj.setScale(obj.baseSX, obj.baseSY);
    this.tweens.add({ targets: obj, x: obj.baseX + 10, duration: 50, yoyo: true, repeat: 2 });
  },

  bigWin(x) {
    SFX.bigWin(); this.burst(x, 'spark', 22, [0xffd35a, 0xffffff, 0xc9a8f5]);
    this.cameras.main.shake(160, 0.004);
    this.toast(`Surprise! +50  ♥+${ART.ITEMS.surprise.refund}`, '#ffd35a');
  },

  megaWin() {
    const L = LAYOUT;
    SFX.mega(); this.cameras.main.flash(350, 255, 200, 240); this.cameras.main.shake(260, 0.006);
    this.confetti();
    const box = this.add.container(L.W / 2, 600).setDepth(46).setScale(0.3).setAlpha(0);
    const bg = this.add.graphics().fillStyle(0xffffff, 0.96).fillRoundedRect(-300, -210, 600, 420, 44)
      .lineStyle(8, 0xff8fc8, 1).strokeRoundedRect(-300, -210, 600, 420, 44);
    const pd = ART.ITEMS.princess, pic = this.add.image(0, -100, 'item_princess').setScale((160 / pd.size) * pd.texScale);
    const t1 = txt(this, 0, 30, 'JACKPOT!', 44, '#ff4fa3').setOrigin(0.5);
    const t2 = txt(this, 0, 100, 'Princess Angel Baby\nSubscriber Gift Box', 36, '#5b2f9e', { lineSpacing: 4 }).setOrigin(0.5);
    const t3 = txt(this, 0, 176, '+250   ♥+15', 40, '#e8a92a', { stroke: '#ffffff', strokeThickness: 4 }).setOrigin(0.5);
    box.add([bg, pic, t1, t2, t3]);
    this.tweens.add({ targets: box, scale: 1, alpha: 1, duration: 420, ease: 'Back.easeOut' });
    this.tweens.add({ targets: pic, y: -112, angle: 6, duration: 500, yoyo: true, repeat: 4, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: box, alpha: 0, scale: 0.9, delay: 3200, duration: 400, onComplete: () => box.destroy() });
  },

  showTitle() {
    const L = LAYOUT, o = this.add.container(0, 0).setDepth(60);
    const dim = this.add.rectangle(L.W / 2, L.H / 2, L.W, L.H, 0x1c0d30, 0.84).setInteractive();
    const t = txt(this, L.W / 2, 380, TITLE, 92, '#ffffff', { stroke: '#8e5cd6', strokeThickness: 14 }).setOrigin(0.5);
    t.setShadow(0, 8, '#120820', 0, true, true);
    const sub = txt(this, L.W / 2, 482, 'a tiny plant-lady arcade 💜', 34, '#e9dcff').setOrigin(0.5);
    const nm = LV.normals(), icons = [nm[0], nm[1], 'princess', nm[2], nm[3]].map((id, i) => {
      const d = ART.ITEMS[id];
      return this.add.image(160 + i * 100, 640, 'item_' + id).setScale((92 / d.size) * d.texScale);
    });
    icons.forEach((im, i) => this.tweens.add({ targets: im, y: 622, duration: 700, yoyo: true, repeat: -1, delay: i * 120, ease: 'Sine.easeInOut' }));
    const how = txt(this, L.W / 2, 830, 'Tap to drop a prize\nHold for a BIG surprise box\nPush prizes into the chute to win them!', 32, '#ffffff', { lineSpacing: 14 }).setOrigin(0.5);
    const rec = txt(this, L.W / 2, 1000, `Best ${Save.data.best}   ·   Lv ${LV.index() + 1} ${LV.title()}  ${LV.foundCount()}/9`, 28, '#c9a8f5').setOrigin(0.5);
    const tip = txt(this, L.W / 2, 1310, '💡 ' + pick(TIPS), 26, '#e9dcff', { wordWrap: { width: 600 } }).setOrigin(0.5);
    const btn = this.add.graphics().fillStyle(0xffd35a, 1).fillRoundedRect(L.W / 2 - 200, 1110, 400, 120, 60)
      .lineStyle(6, 0xffffff, 1).strokeRoundedRect(L.W / 2 - 200, 1110, 400, 120, 60);
    const bt = txt(this, L.W / 2, 1170, 'Tap to Play', 50, '#5b2f9e').setOrigin(0.5);
    this.tweens.add({ targets: bt, scale: 1.07, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    o.add([dim, t, sub, ...icons, how, rec, btn, bt, tip]);
    dim.once('pointerup', () => {
      SFX.unlock(); SFX.bonus(); haptic();
      this.tweens.add({ targets: o, alpha: 0, duration: 300, onComplete: () => o.destroy(true) });
      this.time.delayedCall(250, () => { this.started = true; this.onEvent('start'); });
    });
    if (AUTO) this.time.delayedCall(300, () => dim.emit('pointerup'));
  },
});

// Petal Pusher core loop: planter pusher, drops, top-down Matter physics, fall-offs.
const CFG = {
  startHearts: 25, cost: 1, bigCost: 3, cooldown: 220, bigCooldown: 700, megaAfterSecs: 180, longPress: 480, maxOnShelf: 30,
  cycle: 5.6, bonusEvery: 250, bonusHearts: 3, dipperChance: 0.015, megaChance: 0.08, megaPity: 8, megaChanceAfter: 0.01, levelUpHearts: 15,
  refillIdle: 6000, refillHearts: 5, prePile: 10, fa: 0.1, faBig: 0.14,
};
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[(Math.random() * a.length) | 0];
const radiusOf = d => d.r || Math.max(d.w, d.h) / 2;
const AUTO = /[?&]auto=1/.test(location.search); // attract/test mode

class Play extends Phaser.Scene {
  constructor() { super('Play'); }

  create() {
    const L = LAYOUT;
    this.MB = Phaser.Physics.Matter.Matter.Body;
    this.cameras.main.setZoom(Z).centerOn(L.W / 2, L.H / 2);
    this.add.image(0, 0, 'bg').setOrigin(0).setScale(1 / ART.RES).setDepth(0);
    Object.assign(this, {
      hearts: CFG.startHearts, score: 0, nextBonus: CFG.bonusEvery, items: [], falling: 0,
      lastDrop: -1e9, lastWin: -1e9, combo: 0, bigMode: false, bigSinceMega: 0, acc: 0, simT: 0,
      started: false, idleSince: null, aimX: L.W / 2, aiming: null, stats: { drops: 0, wins: 0 },
    });
    this.buildWalls();
    this.pusher = this.matter.add.rectangle(L.W / 2, L.pusherMin - L.pusherH / 2, L.shelfR - L.shelfL, L.pusherH,
      { isStatic: true, friction: 0.02, label: 'pusher' });
    this.pusherShadow = this.add.image(L.W / 2, 0, 'shadow').setDisplaySize(700, 64).setDepth(3).setAlpha(0.9);
    this.pusherImg = this.add.image(L.W / 2, 0, 'pusher').setScale(1 / ART.RES).setDepth(4);

    this.buildHud();
    this.rollNext();
    this.prePile();
    this.movePusher();
    this.syncSprites();
    this.bindInput();
    this.showTitle();
  }

  // ---------- world ----------
  buildWalls() { // side walls stop short of the edge: the last `gutter` units are open side gutters (house edge)
    const L = LAYOUT, wall = { isStatic: true, friction: 0, restitution: 0.1, label: 'wall' };
    (this.walls || []).forEach(w => this.matter.world.remove(w));
    const top = L.shelfTop - 300, h = L.edgeY - L.gutter - top;
    this.walls = [this.matter.add.rectangle(L.shelfL - 30, top + h / 2, 60, h, wall),
      this.matter.add.rectangle(L.shelfR + 30, top + h / 2, 60, h, wall)];
  }
  pusherBottom(t = this.simT) {
    const L = LAYOUT, mid = (L.pusherMin + L.pusherMax) / 2, amp = (L.pusherMax - L.pusherMin) / 2;
    return mid - amp * Math.cos((2 * Math.PI * t) / CFG.cycle);
  }
  movePusher() {
    this.MB.setPosition(this.pusher, { x: LAYOUT.W / 2, y: this.pusherBottom() - LAYOUT.pusherH / 2 }, true);
  }

  spawn(id, x, y) {
    const d = ART.ITEMS[id];
    const o = { friction: 0.06, frictionStatic: 0.3, frictionAir: d.big ? CFG.faBig : CFG.fa, restitution: 0.05,
      density: d.density || 0.0015, label: 'item' };
    const body = d.body === 'circle' ? this.matter.add.circle(x, y, d.r, o)
      : this.matter.add.rectangle(x, y, d.w, d.h, { ...o, chamfer: { radius: 12 } });
    this.MB.setAngle(body, rnd(-0.35, 0.35));
    const shadow = this.add.image(x + 5, y + 9, 'shadow').setDisplaySize(d.size * 1.25, d.size * 1.1).setDepth(1);
    const sprite = this.add.image(x, y, 'item_' + id).setScale(d.texScale).setDepth(d.big ? 2.5 : 2);
    const rec = { id, d, body, sprite, shadow };
    this.items.push(rec);
    return rec;
  }

  prePile() {
    const L = LAYOUT, placed = [];
    const place = (id, y0, y1) => {
      const r = radiusOf(ART.ITEMS[id]);
      for (let k = 0; k < 80; k++) {
        const x = rnd(L.shelfL + r + 4, L.shelfR - r - 4), y = rnd(y0, y1);
        if (placed.every(p => (p.x - x) ** 2 + (p.y - y) ** 2 > (p.r + r + 3) ** 2)) {
          placed.push({ x, y, r }); this.spawn(id, x, y); return;
        }
      }
    };
    place('surprise', 640, 720);
    for (let i = 0; i < CFG.prePile; i++) place(pick(LV.normals()), L.pusherMax + 30, L.edgeY - 25);
  }

  findFreeY(x, r, y0) {
    for (let y = y0; y < LAYOUT.pusherMax + 240; y += 8) {
      const clear = this.items.every(it => {
        const p = it.body.position, rr = radiusOf(it.d) + r + 2;
        return (p.x - x) ** 2 + (p.y - y) ** 2 >= rr * rr;
      });
      if (clear) return y;
    }
    return y0;
  }

  rollBig() { // Princess: unlocks after `megaAfterSecs` of total play; the pity timer only runs while this shelf still needs her
    const sv = Save.data;
    if ((sv.playSecs || 0) < CFG.megaAfterSecs) return 'surprise';
    if (sv.found && sv.found.princess) return Math.random() < CFG.megaChanceAfter ? 'princess' : 'surprise';
    sv.sinceMega = (sv.sinceMega || 0) + 1;
    if (sv.sinceMega >= CFG.megaPity || Math.random() < CFG.megaChance) { sv.sinceMega = 0; return 'princess'; }
    return 'surprise';
  }

  rollNext() {
    this.nextId = Math.random() < CFG.dipperChance ? LV.rare() : pick(LV.normals());
    this.updateDropper();
  }

  onEvent() {} // game events for the first-run coach (coach.js replaces this)

  // ---------- input ----------
  bindInput() {
    const toWorld = p => this.cameras.main.getWorldPoint(p.x, p.y);
    this.input.on('pointerdown', (p, over) => {
      SFX.unlock();
      if (!this.started || over.length) return;
      const w = toWorld(p);
      this.aiming = { id: p.id, x0: w.x, moved: false, consumed: false, t0: performance.now() };
      this.setAim(w.x);
      this.startCharge();
      this.chargeTimer = this.time.delayedCall(CFG.longPress, () => {
        const a = this.aiming;
        if (!a || a.moved || a.consumed) return;
        a.consumed = true; this.stopCharge(true); this.tryDrop(this.aimX, true);
      });
    });
    this.input.on('pointermove', p => {
      const a = this.aiming;
      if (!a || p.id !== a.id) return;
      const w = toWorld(p);
      if (!a.moved && Math.abs(w.x - a.x0) > 18) { a.moved = true; this.stopCharge(false); }
      this.setAim(w.x);
    });
    const up = p => {
      const a = this.aiming;
      if (!a || p.id !== a.id) return;
      this.aiming = null; if (this.chargeTimer) this.chargeTimer.remove(); this.stopCharge(false);
      if (a.consumed) return;
      // real-time fallback: if frames lagged and the hold timer didn't fire, a long hold is still BIG
      const heldBig = !a.moved && performance.now() - a.t0 >= CFG.longPress;
      haptic(); this.tryDrop(this.aimX, this.bigMode || heldBig);
    };
    this.input.on('pointerup', up);
    this.input.on('pointerupoutside', up);
  }

  setAim(x) {
    const L = LAYOUT;
    this.aimX = Phaser.Math.Clamp(x, L.shelfL + 42, L.shelfR - 42);
    this.dropper.x = this.aimX; this.aimLine.x = this.aimX;
  }

  tryDrop(x, big) {
    const now = this.time.now;
    if (!this.started || now - this.lastDrop < CFG.cooldown || (big && now - (this.lastBig || -1e9) < CFG.bigCooldown)) return false;
    const cost = big ? CFG.bigCost : CFG.cost;
    if (big && this.bigMode && this.hearts < cost && this.hearts >= CFG.cost) {
      this.bigMode = false; this.drawBig(); this.updateDropper(); SFX.denied();
      this.toast('Not enough ♥ for BIG. Tap to drop a plant', '#ffb3d9');
      return false;
    }
    if (this.hearts < cost) {
      SFX.denied(); this.nudge(this.heartsText);
      this.toast(big && this.hearts > 0 ? 'A BIG drop needs 3 ♥' : 'Out of hearts… win a prize!', '#ffb3d9');
      return false;
    }
    if (this.items.length + this.falling >= CFG.maxOnShelf) { SFX.denied(); this.toast('Shelf is full! Let it push', '#ffb3d9'); return false; }
    this.lastDrop = now; this.hearts -= cost; this.stats.drops++;
    let id = big ? 'surprise' : this.nextId;
    if (big) { this.lastBig = now; id = this.rollBig(); }
    if (!big) this.rollNext();
    this.dropAnim(id, x);
    SFX.drop(big);
    this.refreshHud(false);
    this.onEvent('drop', { big });
    return true;
  }

  dropX(x, r) { return Phaser.Math.Clamp(x, LAYOUT.shelfL + r + 2, LAYOUT.shelfR - r - 2); } // big stickers never land inside a wall

  dropAnim(id, x0) {
    const d = ART.ITEMS[id], r = radiusOf(d), dur = 260, x = this.dropX(x0, r);
    const y = this.findFreeY(x, r, this.pusherBottom(this.simT + dur / 1000) + r + 8);
    this.falling++;
    const spr = this.add.image(x, LAYOUT.shelfTop + 30, 'item_' + id).setScale(d.texScale * 1.2).setDepth(9);
    const sh = this.add.image(x + 5, y + 9, 'shadow').setDisplaySize(d.size * 0.5, d.size * 0.45).setDepth(1).setAlpha(0.3);
    this.tweens.add({ targets: sh, displayWidth: d.size * 1.25, displayHeight: d.size * 1.1, alpha: 1, duration: dur });
    this.tweens.add({
      targets: spr, y, scale: d.texScale, duration: dur, ease: 'Quad.easeIn',
      onComplete: () => { spr.destroy(); sh.destroy(); this.falling--; this.onLand(id, x, y); },
    });
  }

  onLand(id, x, y) {
    const rec = this.spawn(id, x, y), s = rec.d.texScale;
    SFX.land(rec.d.big);
    this.tweens.add({ targets: rec.sprite, scaleX: s * 1.14, scaleY: s * 0.88, duration: 70, yoyo: true });
    this.puff(x, y, rec.d.size);
    if (id === 'princess') { SFX.special(); this.sparkleAt(x, y, 16); this.toast('✨ Something very special landed…', '#ffe27a'); }
    else if (ART.ITEMS[id].rare) this.sparkleAt(x, y, 8);
    this.onEvent('land');
  }

  // ---------- loop ----------
  update(time, delta) {
    const dt = 1000 / 60;
    this.acc = Math.min(this.acc + delta, dt * 5);
    while (this.acc >= dt) {
      this.acc -= dt; this.simT += dt / 1000;
      this.movePusher();
      this.matter.world.step(dt);
      this.checkFalls();
    }
    this.syncSprites();
    this.animateHud(time);
    if (this.started) Save.data.playSecs = (Save.data.playSecs || 0) + delta / 1000;
    if (this.started && !this.royalSeen && Save.data.playSecs >= CFG.megaAfterSecs) { this.royalSeen = true; this.onEvent('royal'); }
    if (this.started) this.idleRefill(time);
    if (AUTO && this.started && time - this.lastDrop > 330) this.tryDrop(rnd(110, 610), this.hearts > 12 && Math.random() < 0.15);
  }

  syncSprites() {
    for (const it of this.items) {
      const p = it.body.position;
      it.sprite.setPosition(p.x, p.y).setRotation(it.body.angle);
      it.shadow.setPosition(p.x + 5, p.y + 9);
    }
    const py = this.pusher.position.y;
    this.pusherImg.y = py;
    this.pusherShadow.y = py + LAYOUT.pusherH / 2 + 2;
  }

  checkFalls() {
    const L = LAYOUT, top = this.pusherBottom();
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i], p = it.body.position;
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) { this.MB.setPosition(it.body, { x: L.W / 2, y: top + 60 }); continue; }
      if (p.x < L.shelfL - 8 || p.x > L.shelfR + 8) { this.items.splice(i, 1); this.matter.world.remove(it.body); if (it.d.mega) this.fallOff(it); else this.lost(it); } // the jackpot is never eaten by a gutter
      else if (p.y > L.edgeY) { this.items.splice(i, 1); this.matter.world.remove(it.body); this.fallOff(it); }
      else if (p.y < top - radiusOf(it.d) * 0.4) this.MB.setPosition(it.body, { x: p.x, y: top + radiusOf(it.d) + 2 });
    }
  }

  fallOff(it) {
    const d = it.d, x = it.sprite.x, now = this.time.now;
    this.tweens.add({
      targets: it.sprite, y: LAYOUT.edgeY + 80, scale: d.texScale * 0.7, alpha: 0, angle: it.sprite.angle + rnd(-50, 50),
      duration: 360, ease: 'Quad.easeIn', onComplete: () => it.sprite.destroy(),
    });
    this.tweens.add({ targets: it.shadow, alpha: 0, duration: 140, onComplete: () => it.shadow.destroy() });
    this.combo = now - this.lastWin < 1400 ? this.combo + 1 : 0;
    this.lastWin = now; this.stats.wins++;
    this.score += d.pts; this.hearts += d.refund;
    if (d.mega) this.megaWin(); else if (d.big) this.bigWin(x);
    else if (d.rare) { SFX.rare(); this.burst(x, 'spark', 18, 0xffe27a); this.toast(`✨ ${d.name}! +${d.pts}`, '#ffe27a'); }
    else { SFX.win(this.combo); this.burst(x, 'heart', 6, 0xff8fc8); }
    this.popText(x, `+${d.pts}`, d.big || d.rare ? '#ffd35a' : '#ffffff');
    this.flyToShelf(it.id, x);
    while (this.score >= this.nextBonus) {
      this.nextBonus += CFG.bonusEvery; this.hearts += CFG.bonusHearts;
      this.time.delayedCall(260, () => { SFX.bonus(); this.toast(`+${CFG.bonusHearts} bonus hearts!`, '#ff8fc8'); });
    }
    if (this.score > Save.data.best) Save.data.best = this.score;
    Save.write();
    this.refreshHud(true);
    this.onEvent('win');
  }

  lost(it) { // slipped into a side gutter: no prize
    const out = it.body.position.x < LAYOUT.W / 2 ? -60 : 60;
    this.stats.lost = (this.stats.lost || 0) + 1;
    this.tweens.add({ targets: it.sprite, x: it.sprite.x + out, scale: it.d.texScale * 0.6, alpha: 0, duration: 380, ease: 'Quad.easeIn', onComplete: () => it.sprite.destroy() });
    this.tweens.add({ targets: it.shadow, alpha: 0, duration: 140, onComplete: () => it.shadow.destroy() });
    SFX.lost();
    this.onEvent('lost');
  }

  idleRefill(time) {
    if (this.hearts >= CFG.cost || this.falling > 0) { this.idleSince = null; return; }
    if (this.idleSince === null) this.idleSince = time;
    if (time - this.idleSince > CFG.refillIdle) {
      this.idleSince = null; this.hearts += CFG.refillHearts;
      SFX.bonus(); this.toast('The plants got watered! +5 ♥', '#9be7b4'); this.refreshHud(true);
    }
  }
}

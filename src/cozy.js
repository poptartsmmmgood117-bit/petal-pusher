// Cozy extras glue: album + music buttons in the HUD, the album card, modal handling (mixed into Play).
// Load after coach.js, daily.js and music.js.
const COZY = { perPage: 4, sticker: 56 };

(() => {
  const P = Play.prototype, base = { buildHud: P.buildHud, update: P.update, onEvent: P.onEvent, coach: P.coach, levelUp: P.levelUp, tryDrop: P.tryDrop };

  Object.assign(P, {
    buildHud() {
      base.buildHud.call(this);
      MUSIC.setOn(Save.data.music !== false); // new field; absent on old saves = on
      const btn = (x, glyph, fn) => {
        const c = this.add.circle(x, 84, 28, 0x7a4bd0).setStrokeStyle(4, 0xffffff).setDepth(20);
        const t = txt(this, x, 84, glyph, 32).setOrigin(0.5).setDepth(21);
        const z = this.add.zone(x, 102, 88, 84).setDepth(21).setInteractive({ useHandCursor: true }); // y 60..144: clear of the status bar
        z.on('pointerup', () => { if (!this.modal && !this.levelingUp) { haptic(); fn(); } });
        return { c, t, z };
      };
      this.albumBtn = btn(150, '📖', () => this.showAlbum());
      this.musicBtn = btn(574, '🎵', () => {
        const v = !MUSIC.on; MUSIC.setOn(v); Save.data.music = v; Save.write(); this.drawMusicBtn();
      });
      this.musicSlash = this.add.graphics().setDepth(22);
      this.drawMusicBtn();
    },

    drawMusicBtn() {
      const on = MUSIC.on, b = this.musicBtn;
      b.c.setFillStyle(on ? 0x7a4bd0 : 0x4a2f78); b.t.setAlpha(on ? 1 : 0.45);
      this.musicSlash.clear();
      if (!on) this.musicSlash.lineStyle(5, 0xff8fc8, 1).lineBetween(574 - 18, 84 - 18, 574 + 18, 84 + 18);
    },

    update(time, delta) {
      if (this.modal) { this.acc = 0; this.animateHud(time); return; } // a cozy card is up: the cabinet waits
      base.update.call(this, time, delta);
      if ((this.giftCheck = (this.giftCheck || 0) + delta) > 500) { this.giftCheck = 0; this.giftTick(); }
    },

    tryDrop(x, big) { return this.modal ? false : base.tryDrop.call(this, x, big); }, // no drops behind a card

    levelUp() { // a shelf finished while a cozy card was up: put the card away first (an unopened gift comes back later)
      if (this.modal) { if (this.modalKill) this.modalKill(); this.closeModal(); }
      return base.levelUp.call(this);
    },

    onEvent(ev, info) {
      if (ev === 'start') this.startedAt = this.time.now;
      return base.onEvent.call(this, ev, info);
    },

    // Coach tips wait behind our cards instead of popping up underneath them.
    coach(key) {
      if (this.modal && !(Save.data.tips || {})[key]) {
        this.coachQ = this.coachQ || [];
        if (this.coachKey !== key && !this.coachQ.includes(key)) this.coachQ.push(key);
        return;
      }
      return base.coach.call(this, key);
    },
    coachFlush() {
      if (!this.coachKey && this.coachQ && this.coachQ.length) this.time.delayedCall(600, () => {
        if (!this.coachKey && !this.modal && this.coachQ.length) this.coach(this.coachQ.shift());
      });
    },

    // Any full-screen card up? (title 60, level-up 62, help 70, or one of ours)
    cardUp() { return !!this.modal || this.children.list.some(o => o.active && o.depth >= 60); },
    openModal(kind, kill) {
      if (this.aiming) { if (this.chargeTimer) this.chargeTimer.remove(); this.stopCharge(false); this.aiming = null; }
      this.modal = kind; this.modalKill = kill;
    },
    closeModal() { this.modal = null; this.modalKill = null; this.acc = 0; this.coachFlush(); },

    albumPages() { return Math.max(1, Math.ceil((Save.data.albums || []).length / COZY.perPage)); },

    showAlbum(page = 0) {
      const L = LAYOUT, o = this.add.container(0, 0).setDepth(66), opened = this.time.now;
      const dim = this.add.rectangle(L.W / 2, L.H / 2, L.W, L.H, 0x1c0d30, 0.85).setInteractive();
      const bg = this.add.graphics().fillStyle(0xffffff, 0.97).fillRoundedRect(36, 170, 648, 1190, 44)
        .lineStyle(8, 0xc9a8f5, 1).strokeRoundedRect(36, 170, 648, 1190, 44);
      o.add([dim, bg, txt(this, L.W / 2, 240, 'My Album 📖', 52, '#5b2f9e').setOrigin(0.5)]);
      const x0 = L.W / 2 - 4 * 64;
      const row = (ids, found, y, gold) => ids.forEach((id, i) => {
        const d = ART.ITEMS[id]; if (!d || !d.texScale) return;
        const x = x0 + i * 64, c = found[id] || 0;
        const im = this.add.image(x, y, 'item_' + id).setScale((COZY.sticker / d.size) * d.texScale);
        if (!c) im.setTint(0x6b4f96).setAlpha(0.45); else if (gold) im.setTint(0xfff0b8);
        o.add(im);
        if (c) o.add(txt(this, x + 18, y + 30, '×' + c, 20, '#ffffff', { stroke: '#3a1f4f', strokeThickness: 5 }).setOrigin(0.5));
      });
      // this shelf, in progress
      const n = LV.set().filter(id => Save.data.found[id]).length;
      o.add(txt(this, 76, 318, `Lv ${LV.index() + 1} · ${LV.title()}  (now)`, 28, '#3a1f4f', { align: 'left' }).setOrigin(0, 0.5));
      o.add(txt(this, 644, 318, `${n}/9`, 32, '#ff4fa3').setOrigin(1, 0.5));
      row(LV.set(), Save.data.found, 386, LV.gold());
      o.add(this.add.rectangle(L.W / 2, 452, 560, 4, 0xe9dcff));
      // finished shelves, newest first
      const albums = Save.data.albums || [], pages = this.albumPages(), pg = Math.min(Math.max(page, 0), pages - 1);
      o.add(txt(this, L.W / 2, 490, albums.length ? `Finished shelves: ${albums.length}` : 'Finished shelves', 30, '#8e5cd6').setOrigin(0.5));
      if (!albums.length) {
        o.add(txt(this, L.W / 2, 700, '🌱\nNothing here yet!\nFill all 9 spots on your shelf\nand it gets saved in this album 💜', 32, '#3a1f4f', { lineSpacing: 12 }).setOrigin(0.5));
      }
      albums.map((a, i) => ({ a, i })).reverse().slice(pg * COZY.perPage, (pg + 1) * COZY.perPage).forEach(({ a, i }, k) => {
        const y = 540 + k * 168, gold = /^Golden /.test(a.name || ''), lv = LEVELS.findIndex(l => l.name === String(a.name || '').replace(/^Golden /, ''));
        const card = this.add.graphics().fillStyle(gold ? 0xfff6d6 : 0xf6f0ff, 1).fillRoundedRect(60, y, 600, 152, 26)
          .lineStyle(gold ? 5 : 3, gold ? 0xffd35a : 0xe0d0fa, 1).strokeRoundedRect(60, y, 600, 152, 26);
        o.add(card);
        o.add(txt(this, 84, y + 30, `${gold ? '⭐ ' : ''}Lv ${i + 1} · ${a.name || 'Shelf'}`, 28, gold ? '#b07a00' : '#3a1f4f', { align: 'left' }).setOrigin(0, 0.5));
        const f = a.found || {}, ids = lv >= 0 ? LV.set(lv) : Object.keys(f).slice(0, 9);
        o.add(txt(this, 636, y + 30, `${ids.filter(id => f[id]).length}/9`, 26, gold ? '#b07a00' : '#8e5cd6').setOrigin(1, 0.5));
        row(ids, f, y + 94, gold);
      });
      // pages + close
      if (pages > 1) {
        const arrow = (x, label, to, ok) => {
          const b = this.add.graphics().fillStyle(ok ? 0x8e5cd6 : 0xe9dcff, 1).fillRoundedRect(x - 60, 1206, 120, 88, 36);
          o.add([b, txt(this, x, 1250, label, 40, '#ffffff').setOrigin(0.5)]);
          if (ok) o.add(this.add.zone(x, 1250, 130, 96).setInteractive().on('pointerup', () => { haptic(); o.destroy(true); this.modal = null; this.showAlbum(to); }));
        };
        arrow(170, '◀', pg - 1, pg > 0); arrow(550, '▶', pg + 1, pg < pages - 1);
        o.add(txt(this, L.W / 2, 1250, `page ${pg + 1} of ${pages}`, 28, '#8e5cd6').setOrigin(0.5));
      }
      o.add(txt(this, L.W / 2, pages > 1 ? 1322 : 1262, 'tap anywhere to keep playing', 28, '#8e5cd6').setOrigin(0.5));
      const x = this.add.circle(640, 214, 34, 0x8e5cd6).setStrokeStyle(4, 0xffffff);
      o.add([x, txt(this, 640, 214, '✕', 34, '#ffffff').setOrigin(0.5)]);
      const close = () => {
        if (this.modal !== 'album' || this.time.now - opened < 250) return;
        this.tweens.add({ targets: o, alpha: 0, duration: 160, onComplete: () => o.destroy(true) });
        this.closeModal();
      };
      o.add(this.add.zone(640, 214, 96, 96).setInteractive().on('pointerup', close));
      dim.on('pointerup', close);
      if (!page) { o.setAlpha(0); this.tweens.add({ targets: o, alpha: 1, duration: 160 }); }
      this.openModal('album', () => o.destroy(true));
      this.albumBox = o;
    },
  });
})();

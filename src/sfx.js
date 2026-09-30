// Procedural WebAudio SFX (no audio files). iOS: context is created/resumed inside a real
// touch handler (see unlock); the ringer switch mutes web audio on iPhone by design.
const SFX = (() => {
  let ctx = null, master = null, muted = false;
  const PENTA = [0, 2, 4, 7, 9]; // major pentatonic steps

  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 0.55;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state !== 'running') ctx.resume();
    // iOS needs a sound started inside the gesture to fully unlock
    const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
    s.buffer = b; s.connect(master); s.start(0);
    if (typeof MUSIC !== 'undefined') MUSIC.attach(ctx); // background music rides the same unlocked context
  }

  const hz = semis => 523.25 * Math.pow(2, semis / 12); // C5 based
  function tone(f, { t = 0, dur = 0.25, type = 'sine', vol = 0.3, slideTo = null, attack = 0.005 } = {}) {
    if (!ctx || muted) return;
    const now = ctx.currentTime + t;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, now);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(master); o.start(now); o.stop(now + dur + 0.05);
  }
  const bell = (f, t = 0, vol = 0.22, dur = 0.5) => {
    tone(f, { t, dur, vol });
    tone(f * 2, { t, dur: dur * 0.6, vol: vol * 0.35, type: 'triangle' });
    tone(f * 3.01, { t, dur: dur * 0.3, vol: vol * 0.12 });
  };
  function noiseBurst(t = 0, dur = 0.3, vol = 0.08, hp = 6000) {
    if (!ctx || muted) return;
    const now = ctx.currentTime + t, n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = hp; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(master); s.start(now);
  }

  return {
    unlock,
    get muted() { return muted; },
    setMuted(m) { muted = m; if (master) master.gain.value = m ? 0 : 0.55; },
    drop(big) { const f = big ? 330 : 700 + Math.random() * 160; tone(f, { dur: 0.12, slideTo: f * 0.55, vol: big ? 0.3 : 0.18, type: 'triangle' }); },
    land(big) { tone(big ? 120 : 190 + Math.random() * 40, { dur: 0.09, vol: big ? 0.28 : 0.14, type: 'triangle', slideTo: big ? 80 : 140 }); },
    win(combo) {
      const step = Math.min(combo, 12), a = PENTA[step % 5] + 12 * Math.floor(step / 5);
      bell(hz(a), 0, 0.2, 0.45); bell(hz(a + 7), 0.07, 0.14, 0.5);
    },
    bigWin() { if (typeof MUSIC !== 'undefined') MUSIC.duck(1.2); [0, 4, 7, 12, 16].forEach((s, i) => bell(hz(s), i * 0.07, 0.2, 0.6)); noiseBurst(0.3, 0.4, 0.05); },
    rare() { [7, 12, 16, 19].forEach((s, i) => bell(hz(s), i * 0.06, 0.18, 0.7)); },
    mega() {
      if (typeof MUSIC !== 'undefined') MUSIC.duck(3); // jackpot + level-up fanfare
      [0, 4, 7, 11, 12, 16, 19, 23, 24].forEach((s, i) => bell(hz(s), i * 0.08, 0.2, 0.9));
      [0, 4, 7].forEach(s => tone(hz(s - 12), { t: 0.7, dur: 1.6, vol: 0.12, attack: 0.3, type: 'triangle' }));
      noiseBurst(0.72, 0.9, 0.06, 7000);
    },
    special() { [12, 16, 19, 24].forEach((s, i) => tone(hz(s), { t: i * 0.05, dur: 0.3, vol: 0.12 })); },
    bonus() { bell(hz(12), 0, 0.16, 0.35); bell(hz(16), 0.08, 0.16, 0.35); bell(hz(19), 0.16, 0.18, 0.5); },
    lost() { tone(210, { dur: 0.22, slideTo: 110, vol: 0.12, type: 'sine' }); },
    denied() { tone(240, { dur: 0.16, slideTo: 170, vol: 0.14, type: 'sine' }); },
    charge() { tone(420, { dur: 0.35, slideTo: 880, vol: 0.08, type: 'sine', attack: 0.05 }); },
  };
})();

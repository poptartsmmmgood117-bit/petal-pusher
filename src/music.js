// Background music: a soft procedural music box over a warm pad (WebAudio, no files).
// Notes are scheduled ~2.5 s ahead on the AudioContext clock by a timer that wakes every 0.8 s:
// no per-frame work. It rides SFX's context (iOS unlock) on its own bus, so the SFX mute is untouched.
function makeMusic({ listen = true } = {}) {
  const VOL = 0.11, LOOK = 2.5, TICK = 800;
  const SCALE = [0, 2, 4, 5, 7, 9, 11];
  const PROGS = [[0, 5, 3, 4], [0, 2, 3, 0], [5, 3, 0, 4], [3, 0, 4, 5], [0, 3, 5, 4], [0, 4, 5, 3], [3, 4, 2, 5], [0, 5, 1, 4]];
  const KEYS = [0, 5, 7, -3, 2, -5]; // C F G A D G(low): all gentle, moved between by small steps
  let ctx = null, out = null, bus = null, duckG = null, echo = null, padLP = null;
  let on = true, hidden = listen && typeof document !== 'undefined' && document.visibilityState === 'hidden', timer = null, nextT = 0, duckUntil = -1;
  let st = null; // song state: section, bar, step, key, prog, tempo, density, melody degree
  const stats = { notes: 0, pads: 0, ticks: 0, sections: 0 };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pickOther = (a, not) => { let v; do v = a[(Math.random() * a.length) | 0]; while (a.length > 1 && v === not); return v; };
  const hz = semis => 261.63 * Math.pow(2, semis / 12); // C4 based
  const deg = (d, key) => key + SCALE[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7);

  function newSection() {
    const s = st || { key: 0, prog: null, mel: 7 };
    stats.sections++;
    st = {
      key: Math.random() < 0.3 ? pickOther(KEYS, s.key) : s.key,
      prog: pickOther(PROGS, s.prog),
      stepDur: 60 / rnd(64, 76) / 2, // eighth notes, 64-76 bpm
      density: Math.random() < 0.2 ? rnd(0.12, 0.25) : rnd(0.35, 0.62), // now and then a sparse "breathing" section
      lift: Math.random() < 0.3 ? -7 : 0, // melody an octave lower (warmer) sometimes
      bars: 8, bar: 0, step: 0, mel: s.mel,
    };
  }

  function build(c, dest) {
    ctx = c;
    out = c.createGain(); out.gain.value = 0; // fades in on start
    duckG = c.createGain(); duckG.gain.value = 1;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
    bus = c.createGain(); bus.gain.value = 1;
    bus.connect(lp); lp.connect(duckG); duckG.connect(out); out.connect(dest || c.destination);
    // soft echo for the music box
    echo = c.createDelay(1); echo.delayTime.value = 0.36;
    const fb = c.createGain(); fb.gain.value = 0.26;
    const elp = c.createBiquadFilter(); elp.type = 'lowpass'; elp.frequency.value = 1800;
    echo.connect(elp); elp.connect(fb); fb.connect(echo); elp.connect(bus);
    padLP = c.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 900; padLP.connect(bus);
  }

  function boxNote(f, t, v) { // music-box pluck: sine + faint octave, fast attack, long decay
    const g = ctx.createGain(), o = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = ctx.createGain();
    o.frequency.value = f; o2.frequency.value = f * 2.005; g2.gain.value = 0.22;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus); g.connect(echo);
    o.start(t); o2.start(t); o.stop(t + 1.75); o2.stop(t + 1.75);
    stats.notes++;
  }

  function padChord(root, key, t, dur) { // warm triangle triad, slow swell
    [0, 2, 4].forEach((k, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = hz(deg(root + k, key) - 12 - (i ? 0 : 12));
      o.detune.value = rnd(-6, 6);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(i ? 0.045 : 0.06, t + dur * 0.35);
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.2);
      o.connect(g); g.connect(padLP); o.start(t); o.stop(t + dur + 1.3);
    });
    stats.pads++;
  }

  function scheduleStep(t) {
    const s = st, root = s.prog[s.bar % 4];
    if (s.step === 0) padChord(root, s.key, t, s.stepDur * 8);
    const strong = s.step % 4 === 0, p = strong ? s.density + 0.25 : s.step % 2 ? s.density * 0.6 : s.density;
    if (Math.random() < p) {
      if (strong) { // land on a chord tone near the current melody note
        const tones = [0, 2, 4, 7, 9, 11].map(k => root + k).filter(d => d >= 5 && d <= 14);
        s.mel = tones.reduce((a, b) => (Math.abs(b - s.mel) < Math.abs(a - s.mel) || (Math.abs(b - s.mel) === Math.abs(a - s.mel) && Math.random() < 0.5) ? b : a));
      } else s.mel = Math.max(4, Math.min(15, s.mel + [-2, -1, -1, 1, 1, 2, 0][(Math.random() * 7) | 0]));
      boxNote(hz(deg(s.mel + s.lift, s.key)), t + rnd(0, 0.012), strong ? rnd(0.085, 0.1) : rnd(0.05, 0.075));
    }
    if (++s.step >= 8) { s.step = 0; if (++s.bar >= s.bars) newSection(); }
  }

  function fill(until) { // schedule every step that starts before `until` (context seconds)
    if (!ctx) return;
    if (!st) newSection();
    if (nextT < ctx.currentTime + 0.05) nextT = ctx.currentTime + 0.1; // after a pause: never burst the backlog
    while (nextT < until) { scheduleStep(nextT); nextT += st.stepDur; }
  }

  function tick() {
    timer = null;
    if (!ctx || !on || hidden) return;
    stats.ticks++;
    fill(ctx.currentTime + LOOK);
    timer = setTimeout(tick, TICK);
  }

  function fade(to, tc) {
    if (!ctx) return;
    const now = ctx.currentTime;
    out.gain.cancelScheduledValues(now); out.gain.setTargetAtTime(to, now, tc);
  }
  const playing = () => !!ctx && on && !hidden;
  function sync() { // start or stop to match (on, hidden)
    if (playing()) { fade(VOL, 0.8); if (!timer) tick(); }
    else { if (timer) { clearTimeout(timer); timer = null; } fade(0, 0.12); }
  }

  if (listen && typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', () => {
      hidden = document.visibilityState === 'hidden';
      if (!hidden && ctx && ctx.state !== 'running') { try { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* next tap unlocks */ } }
      sync();
    });
  }

  return {
    VOL, LOOK, TICK, stats,
    attach(c, dest) { if (!ctx && c) { build(c, dest); sync(); } }, // called from SFX.unlock (first gesture)
    setOn(v) { on = !!v; sync(); },
    get on() { return on; },
    get hidden() { return hidden; },
    get playing() { return playing() && !!timer; },
    get ducked() { return !!ctx && ctx.currentTime < duckUntil; },
    get scheduledUntil() { return nextT; },
    duck(sec = 2.5) { // dip under a fanfare, then swell back
      if (!ctx) return;
      const now = ctx.currentTime, g = duckG.gain;
      duckUntil = now + sec + 1.4;
      g.cancelScheduledValues(now); g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.2, now + 0.12); g.setValueAtTime(0.2, now + sec);
      g.linearRampToValueAtTime(1, now + sec + 1.4);
    },
    _fill: fill, // test hook: schedule ahead to a context time (offline render)
    _setHidden(h) { hidden = !!h; sync(); }, // test hook
  };
}
const MUSIC = makeMusic();

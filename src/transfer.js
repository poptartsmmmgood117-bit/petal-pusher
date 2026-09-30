// Local-only progress codes. The checksum catches damaged copies, not deliberate edits.
const Transfer = {
  prefix: 'PETAL1',
  checksum(json) {
    let hash = 0x811c9dc5;
    for (const byte of new TextEncoder().encode(json)) hash = Math.imul(hash ^ byte, 0x01000193);
    return (hash >>> 0).toString(16).padStart(8, '0');
  },
  encode(data) {
    const json = JSON.stringify(data);
    this.validate(JSON.parse(json));
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return `${this.prefix}.${this.checksum(json)}.${btoa(binary)}`;
  },
  decode(code) {
    const clean = code.replace(/\s/g, '');
    if (clean.length > 1000000) throw new Error('This code is too long. Please copy a new one.');
    const parts = clean.split('.');
    if (parts.length !== 3 || parts[0] !== this.prefix || !/^[0-9a-f]{8}$/.test(parts[1]))
      throw new Error('That does not look like a Petal Pusher code. Copy the whole code and try again.');
    let json, data;
    try {
      const binary = atob(parts[2]);
      json = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
      if (this.checksum(json) !== parts[1]) throw new Error('checksum');
      data = JSON.parse(json);
    } catch (e) { throw new Error('This code looks incomplete or changed. Please copy it again — your progress is safe.'); }
    this.validate(data);
    return data;
  },
  validate(data) {
    const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    const count = v => Number.isSafeInteger(v) && v >= 0;
    const found = v => object(v) && Object.values(v).every(count);
    const fail = () => { throw new Error('This save cannot be restored by this version. Your progress has not changed.'); };
    // Retain unknown fields for forward-compatible round trips, but reject dangerous keys at every depth.
    const safe = (v, depth = 0) => {
      if (depth > 30) fail();
      if (v && typeof v === 'object') for (const key of Object.keys(v)) {
        if (['__proto__', 'prototype', 'constructor'].includes(key)) fail();
        safe(v[key], depth + 1);
      }
    };
    safe(data);
    if (!object(data) || data.v !== 1 || !count(data.best) || !found(data.found)) fail();
    for (const key of ['level', 'sinceMega']) if (key in data && !count(data[key])) fail();
    if ('level' in data && data.level >= Number.MAX_SAFE_INTEGER) fail();
    if ('playSecs' in data && !(Number.isFinite(data.playSecs) && data.playSecs >= 0)) fail();
    for (const key of ['muted', 'musicMuted']) if (key in data && typeof data[key] !== 'boolean') fail();
    if ('tips' in data && (!object(data.tips) || !Object.values(data.tips).every(v => v === 0 || v === 1 || typeof v === 'boolean'))) fail();
    if ('albums' in data && (!Array.isArray(data.albums) || !data.albums.every(a =>
      object(a) && typeof a.name === 'string' && found(a.found)))) fail();
  },
  preview(data) {
    const level = data.level || 0, n = LV.set(level).filter(id => data.found[id]).length;
    return `Level ${level + 1} · ${LV.title(level)}\n${n}/9 prizes found · ${(data.albums || []).length} completed ${(data.albums || []).length === 1 ? 'shelf' : 'shelves'}\nBest score ${data.best}\n${CFG.startHearts} hearts in the new round`;
  },
  restore(data) {
    this.validate(data);
    const json = JSON.stringify(data), old = Save.data;
    // Save.write deliberately swallows storage errors. Verify persistence before replacing memory/reloading.
    try {
      localStorage.setItem(Save.key, json);
      if (localStorage.getItem(Save.key) !== json) throw new Error('storage');
    } catch (e) {
      Save.data = old;
      throw new Error('Your browser could not save this. Free a little space or leave private browsing, then try again.');
    }
    Save.data = data;
  },
};

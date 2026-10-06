// Shelf levels: each level is a new set of 9 prizes (6 plants + a rare + Surprise Box + Princess box).
// The first three are listed here; shelf 4 and up register themselves with ART.addShelf (art4.js, ...).
// Brand-new shelves always come first, in order. Once she has finished every shelf, they repeat as
// "Golden" shelves, so there is always a next level.
// Every shelf has its own name and its own signature flower species (ART.FLOWERS, drawn in art*.js).
// `was` lists names a shelf had in older versions, so old album entries without a key still match.
const LEVELS = [
  { key: 'windowsill', name: 'Violet Windowsill', was: ['Windowsill'], flower: 'violet', normals: ['monstera', 'lily', 'succulent', 'pothos', 'candy', 'giftmini'], rare: 'dipper', floor: 0xffffff },
  { key: 'sunroom', name: 'Hibiscus Sunroom', was: ['Sunroom'], flower: 'hibiscus', normals: ['snake', 'cactus', 'orchid', 'fern', 'aloe', 'pearls'], rare: 'bonsai', floor: 0xffe28a },
  { key: 'secret', name: 'Secret Rose Garden', was: ['Secret Garden'], flower: 'rose', normals: ['pinkphilo', 'flytrap', 'paradise', 'lavender', 'calathea', 'toadstool'], rare: 'rainbowrose', floor: 0x9be7b4 },
  ...ART.SHELVES.map(d => ({ ...d, was: { meadow: ['Sunny Meadow'], greenhouse: ['Rainy Greenhouse'] }[d.key] || [] })),
];
LEVELS.forEach((l, i) => {
  const dupe = LEVELS.findIndex(o => o.name === l.name || o.flower === l.flower) !== i;
  if (dupe || !ART.FLOWERS[l.flower]) console.error(`shelf ${l.key}: needs a unique name and its own flower species`);
});
// The current shelf is saved as Save.data.shelf = { key, gold }. Any LV helper takes a save object (default: hers).
const LV = {
  index: (sv = Save.data) => sv.level || 0,
  byKey: k => LEVELS.find(l => l.key === k),
  byName(n) {
    const bare = String(n || '').replace(/^Golden /, '');
    return LEVELS.find(l => l.name === bare || (l.was || []).includes(bare));
  },
  // Saves from before shelf keys (or with a key this version doesn't know) use the old 3-shelf rotation.
  cur(sv = Save.data) {
    const d = sv.shelf && LV.byKey(sv.shelf.key);
    if (d) return { def: d, gold: !!sv.shelf.gold };
    const i = LV.index(sv);
    return { def: LEVELS[i % 3], gold: i >= 3 };
  },
  // Every shelf she has finished at least once. Anyone past level 3 finished the first three.
  done(sv = Save.data) {
    const keys = new Set((sv.albums || []).map(a => a.key || (LV.byName(a.name) || {}).key).filter(Boolean));
    if (LV.index(sv) >= 3) LEVELS.slice(0, 3).forEach(l => keys.add(l.key));
    return keys;
  },
  fresh: (sv, skip) => LEVELS.find(l => l.key !== skip && !LV.done(sv).has(l.key)),
  // After this shelf: the first shelf she has never finished, else the Golden version of the next one in line.
  next(sv = Save.data) {
    const c = LV.cur(sv), f = LV.fresh(sv, c.def.key);
    return f ? { key: f.key, gold: false } : { key: LEVELS[(LEVELS.indexOf(c.def) + 1) % LEVELS.length].key, gold: true };
  },
  // At boot: give the save a shelf key. A Golden shelf with no plants found yet makes way for a brand-new shelf,
  // so new shelves show up right away. Surprise/Princess counts carry over (every shelf has them). Returns true if changed.
  migrate(sv = Save.data) {
    const c = LV.cur(sv), f = c.gold && LV.fresh(sv);
    const started = LV.setOf(c.def).slice(0, 7).some(id => (sv.found || {})[id]);
    const shelf = f && !started ? { key: f.key, gold: false } : { key: c.def.key, gold: c.gold };
    if (sv.shelf && sv.shelf.key === shelf.key && !!sv.shelf.gold === shelf.gold) return false;
    sv.shelf = shelf;
    return true;
  },
  def: sv => LV.cur(sv).def,
  gold: sv => LV.cur(sv).gold,
  title: sv => (LV.gold(sv) ? 'Golden ' : '') + LV.def(sv).name,
  // This shelf's signature flower: { id, name, texScale }.
  flower: sv => ({ id: LV.def(sv).flower, ...ART.FLOWERS[LV.def(sv).flower] }),
  normals: () => LV.def().normals,
  rare: () => LV.def().rare,
  setOf: d => [...d.normals, d.rare, 'surprise', 'princess'],
  set: sv => LV.setOf(LV.def(sv)),
  foundCount: () => LV.set().filter(id => Save.data.found[id]).length,
};

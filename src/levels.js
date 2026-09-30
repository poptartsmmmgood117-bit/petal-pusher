// Shelf levels: each level is a new set of 9 prizes (6 plants + a rare + Surprise Box + Princess box).
// After the last set, the sets repeat as "Golden" shelves, so there is always a next level.
const LEVELS = [
  { name: 'Windowsill', normals: ['monstera', 'lily', 'succulent', 'pothos', 'candy', 'giftmini'], rare: 'dipper', floor: 0xffffff },
  { name: 'Sunroom', normals: ['snake', 'cactus', 'orchid', 'fern', 'aloe', 'pearls'], rare: 'bonsai', floor: 0xffe28a },
  { name: 'Secret Garden', normals: ['pinkphilo', 'flytrap', 'paradise', 'lavender', 'calathea', 'toadstool'], rare: 'rainbowrose', floor: 0x9be7b4 },
];
const LV = {
  index: () => Save.data.level || 0,
  def: (i = LV.index()) => LEVELS[i % LEVELS.length],
  gold: (i = LV.index()) => i >= LEVELS.length,
  title: (i = LV.index()) => (LV.gold(i) ? 'Golden ' : '') + LV.def(i).name,
  normals: () => LV.def().normals,
  rare: () => LV.def().rare,
  set: (i = LV.index()) => [...LV.def(i).normals, LV.def(i).rare, 'surprise', 'princess'],
  foundCount: () => LV.set().filter(id => Save.data.found[id]).length,
};

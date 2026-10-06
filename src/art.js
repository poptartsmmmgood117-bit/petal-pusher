// Petal Pusher art: hand-authored SVG stickers, rasterized to textures at boot.
// All art is original (see CREDITS.md). No external images.
const ART = (() => {
  const C = {
    ink: '#3a1f4f', blush: '#ff9ecf', leaf: '#3fae6a', leafD: '#23804a', leafL: '#8fe0a6',
    purple: '#8e5cd6', purpleD: '#5b2f9e', lav: '#c9a8f5', pink: '#ff8fc8', gold: '#ffd35a',
  };
  const svg = (inner, defs = '', vb = '0 0 100 100') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
  const ring = (n, fn) => Array.from({ length: n }, (_, i) => fn(i, (i * 360) / n)).join('');
  const star4 = (x, y, r, fill) =>
    `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${fill}"/>`;
  // Big shiny eyes (readable at phone size): ink ovals, a bright catchlight and a small second sparkle.
  const eye = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="${C.ink}"/>
    <circle cx="${x + r * 0.32}" cy="${y - r * 0.38}" r="${r * 0.42}" fill="#fff"/><circle cx="${x - r * 0.38}" cy="${y + r * 0.42}" r="${r * 0.18}" fill="#fff"/>`;
  const face = (cx, cy, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})">
    <ellipse cx="-14" cy="6" rx="4.6" ry="2.8" fill="${C.blush}" opacity=".9"/>
    <ellipse cx="14" cy="6" rx="4.6" ry="2.8" fill="${C.blush}" opacity=".9"/>
    ${eye(-9, -1.5, 5.8)}${eye(9, -1.5, 5.8)}
    <path d="M-3.6 4.6Q0 8.6 3.6 4.6" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  const heartPath = 'M0 6C-10-2-12-12-5-15C-2-16 0-14 0-11C0-14 2-16 5-15C12-12 10-2 0 6Z';

  const S = {};
  S.monstera = svg(
    `<g mask="url(#m)"><path d="M50 6C78 6 96 30 93 54C90 78 70 94 50 95C30 94 10 78 7 54C4 30 22 6 50 6Z" fill="${C.leaf}"/>
     <path d="M50 6C78 6 96 30 93 54C90 78 70 94 50 95Z" fill="${C.leafL}" opacity=".35"/>
     <path d="M50 12L50 90" stroke="${C.leafD}" stroke-width="2.6" stroke-linecap="round"/></g>
     <path d="M50 90L50 99" stroke="${C.leafD}" stroke-width="3.2" stroke-linecap="round"/>`,
    `<mask id="m"><rect width="100" height="100" fill="#fff"/><g stroke="#000" stroke-width="5.5" stroke-linecap="round">
     <path d="M96 38L69 45"/><path d="M96 60L67 60"/><path d="M85 85L62 72"/><path d="M4 38L31 45"/><path d="M4 60L33 60"/><path d="M15 85L38 72"/></g>
     <ellipse cx="60" cy="28" rx="3" ry="6.5" fill="#000"/><ellipse cx="40" cy="28" rx="3" ry="6.5" fill="#000"/></mask>`);

  S.lily = svg(
    ring(6, (i, a) => `<g transform="rotate(${a} 50 50)"><path d="M50 50C38 38 38 14 50 3C62 14 62 38 50 50Z" fill="#f6c6ff"/>
      <path d="M50 47C45 36 45 18 50 8C55 18 55 36 50 47Z" fill="#e2459f"/>
      <circle cx="46.5" cy="30" r="1.7" fill="#9c0f5e"/><circle cx="53.5" cy="24" r="1.5" fill="#9c0f5e"/><circle cx="47.5" cy="18" r="1.2" fill="#9c0f5e"/></g>`) +
    ring(6, (i, a) => `<g transform="rotate(${a + 30} 50 50)"><path d="M50 50L50 34" stroke="#d6eeb8" stroke-width="1.6"/><ellipse cx="50" cy="32.5" rx="2.1" ry="3.6" fill="#b5552b"/></g>`) +
    `<circle cx="50" cy="50" r="4.5" fill="#d9f2c4"/>`);

  const pot = (body, rim) => `<path d="M22 52L78 52L72 91Q71 96 65 96L35 96Q29 96 28 91Z" fill="${body}"/>
    <rect x="17" y="46" width="66" height="13" rx="6.5" fill="${rim}"/>${face(50, 75, 0.95)}`;
  S.succulent = svg(
    [-68, -34, 34, 68].map(a => `<g transform="rotate(${a} 50 50)"><ellipse cx="50" cy="30" rx="8.5" ry="19" fill="#5fb87a"/><ellipse cx="50" cy="14" rx="4.2" ry="5" fill="#b98be8"/></g>`).join('') +
    [-50, -17, 17, 50, 0].map(a => `<g transform="rotate(${a} 50 50)"><ellipse cx="50" cy="31" rx="8" ry="18" fill="#8fd6a2"/><ellipse cx="50" cy="16" rx="4" ry="4.8" fill="#c9a2f2"/></g>`).join('') +
    pot(C.purple, '#a77be6'));

  const leafAt = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="${heartPath}" fill="#4fb566"/>
    <path d="M0 4C-1-4 1-9 -2-13" stroke="#e6e27a" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  S.pothos = svg(
    [[50, 26, 180, 1.25], [33, 33, 150, 1.1], [67, 33, 210, 1.1], [19, 50, 115, 1], [81, 50, 245, 1], [12, 70, 95, .85], [88, 72, 265, .85]]
      .map(l => leafAt(...l)).join('') + pot('#6f47b8', '#8a63d1'));

  S.candy = svg(
    `<path d="M30 50L7 35Q2 50 7 65Z" fill="#c38cf2"/><path d="M70 50L93 35Q98 50 93 65Z" fill="#c38cf2"/>
     <circle cx="50" cy="50" r="25" fill="#8f4fd6"/>
     <path d="M33 38Q50 29 67 38M28 51Q50 41 72 51M33 64Q50 55 67 64" stroke="#d9b8ff" stroke-width="4.5" fill="none" stroke-linecap="round"/>
     <ellipse cx="40" cy="38" rx="6.5" ry="3.5" fill="#fff" opacity=".6" transform="rotate(-25 40 38)"/>`);

  const box = (body, lid, ribbon, bow) => `<rect x="14" y="38" width="72" height="54" rx="8" fill="${body}"/>
    <rect x="9" y="27" width="82" height="18" rx="6" fill="${lid}"/><rect x="44" y="27" width="12" height="65" fill="${ribbon}"/>
    <path d="M50 28C35 7 18 15 33 28ZM50 28C65 7 82 15 67 28Z" fill="${ribbon}"/><circle cx="50" cy="28" r="6" fill="${bow}"/>`;
  S.giftmini = svg(box('#b58cf0', '#caa7ff', '#ff8fc8', '#ff6fb3') + `<circle cx="28" cy="64" r="3.5" fill="#d8c0ff"/><circle cx="72" cy="76" r="3.5" fill="#d8c0ff"/>`);

  S.surprise = svg(box('#7b3fd1', '#9457e6', C.gold, '#ffc21f') +
    `<circle cx="27" cy="60" r="4" fill="#9a66ea"/><circle cx="72" cy="58" r="4" fill="#9a66ea"/><circle cx="30" cy="82" r="3.5" fill="#9a66ea"/><circle cx="70" cy="82" r="3.5" fill="#9a66ea"/>` +
    star4(14, 14, 7, '#fff3c4') + star4(88, 10, 5.5, '#fff3c4') + star4(92, 50, 4, '#fff'));

  S.dipper = svg(
    `<path d="M66 54L90 30L96 36L72 64Z" fill="#7a4bd0"/><ellipse cx="93" cy="32" rx="6" ry="3.4" fill="#a57ff5" transform="rotate(-45 93 32)"/>
     <path d="M26 38Q20 14 42 14L58 14Q80 14 72 38" stroke="#5a2fa6" stroke-width="6.5" fill="none" stroke-linecap="round"/>
     <rect x="12" y="36" width="64" height="56" rx="13" fill="#6d3fc0"/><rect x="12" y="36" width="64" height="11" rx="5.5" fill="#8a5de0"/>
     <path d="M22 54L32 57L42 59L50 65L64 63L66 77L52 79L50 65" stroke="#ffe9a8" stroke-width="1.3" fill="none" opacity=".75"/>` +
    [[22, 54, 4.6], [32, 57, 3], [42, 59, 3], [50, 65, 3.2], [64, 63, 3.2], [66, 77, 3.2], [52, 79, 3.2]].map(s => star4(...s, '#ffe27a')).join('') +
    star4(8, 18, 5, '#fff3c4') + star4(86, 84, 4, '#fff3c4'));

  S.princess = svg(
    `<path d="M20 64C1 58 -1 34 12 32C15 43 21 50 26 54Z" fill="#fff" stroke="#d9b8ff" stroke-width="2.2"/>
     <path d="M80 64C99 58 101 34 88 32C85 43 79 50 74 54Z" fill="#fff" stroke="#d9b8ff" stroke-width="2.2"/>
     <rect x="18" y="50" width="64" height="45" rx="9" fill="#f59bd3"/><rect x="13" y="40" width="74" height="14" rx="6" fill="#ffc0e6"/>
     <path d="M50 41C37 26 25 32 38 41ZM50 41C63 26 75 32 62 41Z" fill="#fff"/><circle cx="50" cy="41" r="4.5" fill="#ff6fb3"/>
     <path d="M36 35L39 21L45 29L50 17L55 29L61 21L64 35Z" fill="${C.gold}" stroke="#e8a92a" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="50" cy="19" r="2.2" fill="#ff6fb3"/><circle cx="39" cy="23" r="1.6" fill="#9ad8ff"/><circle cx="61" cy="23" r="1.6" fill="#9ad8ff"/>
     <ellipse cx="50" cy="9" rx="17" ry="4.5" fill="none" stroke="#ffe27a" stroke-width="3.2"/>` +
    face(50, 73, 1.05) +
    `<g transform="translate(28 88) scale(.35)"><path d="${heartPath}" fill="#ff6fb3"/></g><g transform="translate(72 88) scale(.35)"><path d="${heartPath}" fill="#ff6fb3"/></g>` +
    star4(8, 12, 6, '#fff') + star4(93, 16, 5, '#fff') + star4(94, 90, 4.5, '#ffe27a') + star4(5, 88, 4, '#ffe27a'));

  // --- Prize catalog: id -> name, points, heart refund, body. size = on-screen px in world units.
  const ITEMS = {
    monstera:  { name: 'Monstera Leaf',  size: 114,  body: 'circle', r: 54, pts: 10,  refund: 1 },
    lily:      { name: 'Stargazer Lily', size: 114,  body: 'circle', r: 57, pts: 10,  refund: 1 },
    succulent: { name: 'Sunny Succulent',size: 114,  body: 'circle', r: 53, pts: 10,  refund: 1 },
    pothos:    { name: 'Golden Pothos',  size: 114,  body: 'circle', r: 54, pts: 10,  refund: 1 },
    candy:     { name: 'Grape Candy',    size: 105,  body: 'circle', r: 48, pts: 10,  refund: 1 },
    giftmini:  { name: 'Mini Gift',      size: 105,  body: 'rect',   w: 97, h: 88, pts: 10, refund: 1 },
    dipper:    { name: 'Little Dipper',  size: 125,  body: 'circle', r: 58, pts: 100, refund: 3, rare: true },
    surprise:  { name: 'Surprise Box',   size: 146, body: 'rect',   w: 125, h: 112, pts: 50, refund: 2, big: true, density: 0.0026 },
    princess:  { name: 'Princess Angel Baby Subscriber Gift Box', size: 161, body: 'rect', w: 127, h: 120, pts: 250, refund: 15, big: true, mega: true, density: 0.0026 },
  };
  const ORDER = ['monstera', 'lily', 'succulent', 'pothos', 'candy', 'giftmini', 'dipper', 'surprise', 'princess'];

  // Shelf flowers: every level has its own signature flower species (an emblem, not a prize).
  // Shown next to the level name in the HUD, on the title card and on the level-up card. id -> { name, svg }.
  const FLOWERS = {};
  const addFlower = (id, name, art) => { if (FLOWERS[id]) console.error(`addFlower ${id}: duplicate id`); else FLOWERS[id] = { name, svg: art }; };

  // Windowsill flower: an African Violet rosette, velvety leaves and a cluster of purple blooms.
  const violetBloom = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    ${[[-7, -7, 6.5], [7, -7, 6.5], [-9, 5, 8], [9, 5, 8], [0, 10, 8]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#8a4fd8"/>`).join('')}
    ${[[-7, -7, 3.6], [7, -7, 3.6], [-9, 5, 4.6], [9, 5, 4.6], [0, 10, 4.6]].map(([a, b, r]) => `<circle cx="${a * 1.1}" cy="${b * 1.1 - 1}" r="${r}" fill="#b98af5"/>`).join('')}
    <circle cx="0" cy="1" r="4.6" fill="#f6ecff"/><ellipse cx="-1.8" cy="1" rx="1.8" ry="2.8" fill="${C.gold}"/><ellipse cx="1.8" cy="1" rx="1.8" ry="2.8" fill="${C.gold}"/></g>`;
  addFlower('violet', 'African Violet', svg(
    [-70, -35, 0, 35, 70, -52, 52].map((a, i) => `<g transform="rotate(${a} 50 92)"><ellipse cx="50" cy="66" rx="${i < 5 ? 15 : 13}" ry="${i < 5 ? 22 : 19}" fill="${i < 5 ? '#3f8f4f' : '#4fae62'}"/>
      <ellipse cx="50" cy="64" rx="${i < 5 ? 9 : 7}" ry="${i < 5 ? 14 : 12}" fill="#6fc07c" opacity=".45"/><path d="M50 88L50 50" stroke="#2a6a38" stroke-width="2" stroke-linecap="round"/></g>`).join('') +
    violetBloom(30, 44, 1.15) + violetBloom(70, 42, 1.15) + violetBloom(50, 24, 1.3) +
    star4(10, 12, 6, '#fff3c4') + star4(90, 14, 4.5, '#fff')));

  const loadImg = (svgStr, w, h) => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr.replace('<svg ', `<svg width="${w}" height="${h}" `));
  });

  // White sticker border with a thin purple rim outside it (keeps stickers apart in a pile), then the art on top.
  function sticker(img, px, border, rim) {
    const pad = Math.ceil(border + rim) + 2, W = px + pad * 2;
    const silOf = color => {
      const sil = document.createElement('canvas'); sil.width = sil.height = W;
      const sg = sil.getContext('2d');
      sg.drawImage(img, pad, pad, px, px);
      sg.globalCompositeOperation = 'source-in'; sg.fillStyle = color; sg.fillRect(0, 0, W, W);
      return sil;
    };
    const c = document.createElement('canvas'); c.width = c.height = W;
    const g = c.getContext('2d');
    const stamp = (sil, r) => { for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; g.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); } };
    stamp(silOf('rgba(91,47,158,0.55)'), border + rim); stamp(silOf('#fff'), border);
    g.drawImage(img, pad, pad, px, px);
    return { canvas: c, pad };
  }

  function shadowTex(scene) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 8, 64, 64, 62);
    grd.addColorStop(0, 'rgba(40,10,70,0.45)'); grd.addColorStop(1, 'rgba(40,10,70,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    scene.textures.addCanvas('shadow', c);
  }

  function dotTex(scene, key, draw, size = 32) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size);
    scene.textures.addCanvas(key, c);
  }

  // Build every texture. RES = texture pixels per world unit (crisp on retina).
  async function build(scene, RES) {
    api.RES = RES;
    const jobs = ORDER.map(async id => {
      const it = ITEMS[id], px = Math.round(it.size * RES);
      const img = await loadImg(S[id], px, px);
      const st = sticker(img, px, 5 * RES, 1.6 * RES);
      scene.textures.addCanvas('item_' + id, st.canvas);
      it.texScale = 1 / RES; // sprite scale to show `size` world units (+ border)
    });
    for (const [id, f] of Object.entries(FLOWERS)) jobs.push(loadImg(f.svg, Math.round(120 * RES), Math.round(120 * RES)).then(img => {
      const st = sticker(img, Math.round(120 * RES), 5 * RES, 1.6 * RES);
      scene.textures.addCanvas('flower_' + id, st.canvas);
      f.texScale = 1 / RES; // shows 120 world units
    }));
    jobs.push(loadImg(BG.svg, BG.w * RES, BG.h * RES).then(img => {
      const c = document.createElement('canvas'); c.width = BG.w * RES; c.height = BG.h * RES;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      scene.textures.addCanvas('bg', c);
    }));
    jobs.push(loadImg(PUSHER.svg, PUSHER.w * RES, PUSHER.h * RES).then(img => {
      const c = document.createElement('canvas'); c.width = PUSHER.w * RES; c.height = PUSHER.h * RES;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      scene.textures.addCanvas('pusher', c);
    }));
    shadowTex(scene);
    dotTex(scene, 'spark', (g, s) => { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(s / 2, 0); g.quadraticCurveTo(s / 2, s / 2, s, s / 2); g.quadraticCurveTo(s / 2, s / 2, s / 2, s); g.quadraticCurveTo(s / 2, s / 2, 0, s / 2); g.quadraticCurveTo(s / 2, s / 2, s / 2, 0); g.fill(); });
    dotTex(scene, 'heart', (g, s) => { g.fillStyle = '#fff'; g.translate(s / 2, s * 0.62); g.scale(s / 34, s / 34); g.fill(new Path2D(heartPath)); });
    dotTex(scene, 'confetti', (g, s) => { g.fillStyle = '#fff'; g.fillRect(s * 0.3, 0, s * 0.4, s); }, 24);
    await Promise.all(jobs);
  }

  // Shelf pipeline for shelf 4 and up (art4.js, art5.js, ...): one call adds 7 stickers and the level.
  //   ART.addShelf({ key, name, floor, flower: { id, name, svg }, plants: { id: { name, svg }, ...6 }, rare: { id: { name, svg } } })
  // flower is the shelf's own signature species (see FLOWERS); it must not be used by any other shelf.
  // Optional per item: size, r (circle body) or body: 'rect' + w, h. levels.js picks the shelves up in load order.
  const SHELVES = [];
  function addShelf({ key, name, floor = 0xffffff, flower, plants = {}, rare = {} }) {
    const pIds = Object.keys(plants), rIds = Object.keys(rare), ids = [...pIds, ...rIds];
    const clash = ids.find(id => ITEMS[id] || !(plants[id] || rare[id]).svg);
    const bad = pIds.length !== 6 ? 'needs exactly 6 plants' : rIds.length !== 1 ? 'needs exactly 1 rare'
      : SHELVES.some(s => s.key === key) ? 'duplicate key' : clash ? `"${clash}" is taken or has no svg`
      : !flower || !flower.svg || !flower.name ? 'needs a flower { id, name, svg }' : FLOWERS[flower.id] ? `flower "${flower.id}" is taken` : '';
    if (bad) { console.error(`addShelf ${key}: ${bad} (shelf skipped)`); return; }
    for (const id of ids) {
      const { svg: art, ...d } = plants[id] || rare[id];
      S[id] = art;
      ITEMS[id] = rare[id] ? { size: 125, body: 'circle', r: 58, pts: 100, refund: 3, ...d, rare: true }
        : { size: 114, body: 'circle', r: 54, pts: 10, refund: 1, ...d };
      ORDER.push(id);
    }
    addFlower(flower.id, flower.name, flower.svg);
    SHELVES.push({ key, name, floor, flower: flower.id, normals: pIds, rare: rIds[0] });
  }

  const api = { C, S, ITEMS, ORDER, SHELVES, FLOWERS, addShelf, addFlower, build, heartPath, svg, star4, ring, face, eye, RES: 1 };
  return api;
})();

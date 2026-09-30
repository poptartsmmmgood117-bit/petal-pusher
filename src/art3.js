// Petal Pusher art, shelf 3 "Secret Garden": original hand-authored SVG stickers (see CREDITS.md).
(() => {
  const { C, S, ITEMS, ORDER, svg, ring, star4, face, eye, potF, at } = ART;

  const pp = 'M50 92C20 70 6 44 16 26C24 12 42 12 50 24C58 12 76 12 84 26C94 44 80 70 50 92Z';
  S.pinkphilo = svg(`<path d="M50 24C50 14 56 6 63 3" stroke="#5a2f4f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <g clip-path="url(#ppc)"><path d="${pp}" fill="#2f5a45"/>
    <path d="M50 20L100 0L100 100L56 100C64 72 60 44 50 20Z" fill="#ff9ecf"/>
    <ellipse cx="30" cy="48" rx="7" ry="3.2" fill="#ffc0e0" transform="rotate(-30 30 48)"/><ellipse cx="38" cy="70" rx="5" ry="2.4" fill="#ffc0e0" transform="rotate(-40 38 70)"/>
    <path d="M50 24L50 90M50 44L28 34M50 60L30 56M50 44L72 34M50 60L70 56" stroke="#1f4535" stroke-width="1.8" fill="none" opacity=".55"/></g>`,
    `<clipPath id="ppc"><path d="${pp}"/></clipPath>`);

  const toothY = x => 34 + 6 * Math.sin((Math.PI * (x - 18)) / 64);
  S.flytrap = svg(potF('#b07ee8', '#c9a8f5', false) +
    `<path d="M18 34C20 56 80 56 82 34C70 42 30 42 18 34Z" fill="#5fb65c"/>
     <path d="M21 32C28 44 72 44 79 32Z" fill="#ff6fa8"/>
     <path d="M18 33C18 6 82 6 82 33Z" fill="#7fd07a"/>
     ${Array.from({ length: 9 }, (_, i) => { const x = 23 + i * 6.6; return `<path d="M${x} 33L${x + 2.6} 39L${x + 5.2} 33Z" fill="#f2ffe6"/>`; }).join('')}
     ${Array.from({ length: 7 }, (_, i) => { const x = 26 + i * 7.3, y = toothY(x + 2.6).toFixed(1); return `<path d="M${x} ${y}L${x + 2.6} ${y - 5}L${x + 5.2} ${y}Z" fill="#f2ffe6"/>`; }).join('')}
     <ellipse cx="27" cy="27" rx="4.6" ry="2.6" fill="${C.blush}" opacity=".9"/><ellipse cx="73" cy="27" rx="4.6" ry="2.6" fill="${C.blush}" opacity=".9"/>
     ${eye(39, 20, 5.8)}${eye(61, 20, 5.8)}`);

  S.paradise = svg(`<ellipse cx="24" cy="60" rx="14" ry="32" fill="${C.leaf}" transform="rotate(-18 24 60)"/>
    <path d="M28 90L20 32" stroke="${C.leafD}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M42 97C42 86 43 78 45 70" stroke="#3f8f4f" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M48 57C40 38 40 18 46 3C55 19 57 39 56 57Z" fill="#ff8a2a"/>
    <path d="M54 57C54 35 62 19 75 7C73 27 67 43 61 59Z" fill="#ffa53f"/>
    <path d="M58 59C64 43 77 33 93 27C85 43 75 53 63 61Z" fill="#ffc15a"/>
    <path d="M58 61C68 55 81 53 97 53C85 59 73 63 60 65Z" fill="#5b6cff"/>
    <path d="M5 71C28 59 62 55 98 59C72 71 40 77 5 71Z" fill="#5f8f45"/>
    <path d="M10 71C36 64 64 61 94 60" stroke="#c78de0" stroke-width="3" fill="none"/>`);

  S.lavender = svg([[24, 18], [37, 10], [50, 6], [63, 10], [76, 18]].map(([x1, y1]) => {
    const dx = x1 - 50, dy = y1 - 88, ang = ((Math.atan2(dx, -dy) * 180) / Math.PI).toFixed(1);
    let s = `<path d="M50 88L${x1} ${y1}" stroke="#6fae5a" stroke-width="2.2"/>`;
    for (let t = 0.5; t <= 1.001; t += 0.07) {
      const x = 50 + dx * t, y = 88 + dy * t, a = (x - 2.4).toFixed(1), b = (x + 2.4).toFixed(1), yy = y.toFixed(1), y2 = (y - 2).toFixed(1);
      s += `<ellipse cx="${a}" cy="${yy}" rx="3" ry="4.4" fill="#9b6ee0" transform="rotate(${ang} ${a} ${yy})"/>`
        + `<ellipse cx="${b}" cy="${y2}" rx="3" ry="4.4" fill="#b894f0" transform="rotate(${ang} ${b} ${y2})"/>`;
    }
    return s;
  }).join('') +
    `<path d="M50 72C38 60 28 68 37 76C42 79 46 77 50 72ZM50 72C62 60 72 68 63 76C58 79 54 77 50 72Z" fill="${C.pink}"/>
     <path d="M48 73L41 90L45 88L48 92ZM52 73L59 90L55 88L52 92Z" fill="#ff6fb3"/><circle cx="50" cy="72" r="4" fill="#ff6fb3"/>`);

  const cl = 'M50 52C36 44 34 22 50 5C66 22 64 44 50 52Z';
  const calLeaf = (a, s, col) => `<g transform="${at(a, s)}"><g clip-path="url(#clc)"><path d="${cl}" fill="${col}"/>
    ${[12, 19, 26, 33, 40].map(y => `<path d="M50 ${y + 7}L34 ${y}M50 ${y + 9.5}L34 ${y + 2.5}M50 ${y + 7}L66 ${y}M50 ${y + 9.5}L66 ${y + 2.5}" stroke="#ff9ecf" stroke-width="1.6"/>`).join('')}
    <path d="M50 7L50 50" stroke="#ffd0e6" stroke-width="1.8"/></g></g>`;
  S.calathea = svg(calLeaf(-40, 0.86, '#2b5a41') + calLeaf(40, 0.86, '#2b5a41') + calLeaf(0, 1, '#2f6a4a') + potF('#ff9ecf', '#ffc0e0'),
    `<clipPath id="clc"><path d="${cl}"/></clipPath>`);

  S.toadstool = svg(`<path d="M22 92C30 86 38 88 42 94M58 94C62 88 70 86 78 92" stroke="${C.leaf}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M34 54C32 72 34 86 38 94L62 94C66 86 68 72 66 54Z" fill="#fff1dc"/>
    <path d="M10 54C10 16 90 16 90 54C90 60 10 60 10 54Z" fill="#ff5f95"/>
    <path d="M18 44C22 28 40 20 56 20" stroke="#ff9cc0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    ${[[30, 36, 6], [52, 30, 5], [70, 40, 6.5], [44, 48, 4], [80, 52, 3.5], [20, 52, 3.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}` +
    face(50, 74, 0.95));

  const RB = ['#ff6fa8', '#ff9a4d', '#ffd35a', '#7bd88f', '#6fb7ff', '#b07ee8'];
  S.rainbowrose = svg(`<path d="M50 74C36 72 24 80 18 94C34 94 46 86 50 74ZM50 74C64 72 76 80 82 94C66 94 54 86 50 74Z" fill="${C.leaf}"/>
    ${ring(6, (i, a) => `<circle cx="50" cy="20" r="15" fill="${RB[i]}" stroke="#fff" stroke-width="1.2" stroke-opacity=".6" transform="rotate(${a} 50 46)"/>`)}
    ${ring(5, (i, a) => `<circle cx="50" cy="32" r="11" fill="${RB[(i + 3) % 6]}" stroke="#fff" stroke-width="1.2" stroke-opacity=".6" transform="rotate(${a + 36} 50 46)"/>`)}
    <circle cx="50" cy="46" r="10" fill="#ff8fc8"/><path d="M50 40C56 40 58 46 54 49C50 52 45 49 46 45C47 42 51 42 52 45" stroke="#e2459f" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    star4(12, 14, 6, '#fff3c4') + star4(88, 12, 5, '#fff3c4') + star4(90, 70, 4, '#fff'));

  Object.assign(ITEMS, {
    pinkphilo:   { name: 'Pink Princess Leaf', size: 114, body: 'circle', r: 54, pts: 10, refund: 1 },
    flytrap:     { name: 'Venus Flytrap',      size: 114, body: 'circle', r: 54, pts: 10, refund: 1 },
    paradise:    { name: 'Bird of Paradise',   size: 116, body: 'circle', r: 55, pts: 10, refund: 1 },
    lavender:    { name: 'Lavender Bunch',     size: 114, body: 'circle', r: 51, pts: 10, refund: 1 },
    calathea:    { name: 'Rose Calathea',      size: 114, body: 'circle', r: 54, pts: 10, refund: 1 },
    toadstool:   { name: 'Happy Toadstool',    size: 111, body: 'circle', r: 53, pts: 10, refund: 1 },
    rainbowrose: { name: 'Rainbow Rose',       size: 125, body: 'circle', r: 58, pts: 100, refund: 3, rare: true },
  });
  ORDER.push('pinkphilo', 'flytrap', 'paradise', 'lavender', 'calathea', 'toadstool', 'rainbowrose');
})();

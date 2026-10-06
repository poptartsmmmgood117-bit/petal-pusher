// Petal Pusher art, shelf 2 "Hibiscus Sunroom": original hand-authored SVG stickers (see CREDITS.md).
(() => {
  const { C, S, ITEMS, ORDER, svg, ring, star4, face } = ART;
  // Pot with optional face; plants sit above y≈50. Shared with art3.js.
  const potF = (body, rim, withFace = true) => `<path d="M22 52L78 52L72 91Q71 96 65 96L35 96Q29 96 28 91Z" fill="${body}"/>
    <rect x="17" y="46" width="66" height="13" rx="6.5" fill="${rim}"/>${withFace ? face(50, 75, 0.95) : ''}`;
  const at = (a, s, cx = 50, cy = 52) => `rotate(${a} ${cx} ${cy}) translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
  ART.potF = potF; ART.at = at;

  const blade = (a, s) => `<g transform="${at(a, s)}"><path d="M50 52C43 40 43 16 50 4C57 16 57 40 50 52Z" fill="#3f8f4f" stroke="#e6e27a" stroke-width="2.4"/>
    <path d="M46.6 40Q50 38 53.4 40M46.2 30Q50 28 53.8 30M46.8 20Q50 18 53.2 20" stroke="#2a6a38" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;
  S.snake = svg(blade(-26, 0.74) + blade(24, 0.8) + blade(-12, 0.92) + blade(11, 0.95) + blade(0, 1.02) + potF('#f29bc4', '#ffb8da'));

  S.cactus = svg(`<path d="M37 40C28 40 25 34 26 25C26.5 20 33 20 33 25C33 30 34 32 37 32Z" fill="#4fae66"/>
    <path d="M63 36C71 36 74 31 73 24C72.5 19.5 67 19.5 67 24C67 28 66 30 63 30Z" fill="#4fae66"/>
    <path d="M35 52C33 32 38 16 50 16C62 16 67 32 65 52Z" fill="#5dbb73"/>
    <path d="M43 50C42 34 45 22 50 18M57 50C58 34 55 22 50 18" stroke="#8fe0a6" stroke-width="2.2" fill="none"/>
    ${[[40, 30], [45, 42], [55, 26], [60, 40], [50, 34], [29, 29], [70, 26]].map(([x, y]) => `<path d="M${x - 2} ${y}L${x + 2} ${y}M${x} ${y - 2}L${x} ${y + 2}" stroke="#fffbe6" stroke-width="1.3"/>`).join('')}
    ${ring(5, (i, a) => `<ellipse cx="50" cy="8.5" rx="3.8" ry="6.5" fill="${C.pink}" transform="rotate(${a} 50 15)"/>`)}<circle cx="50" cy="15" r="3.2" fill="${C.gold}"/>` +
    potF('#f3a86b', '#ffc592'));

  const orchid = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    ${[0, 120, 240].map(a => `<ellipse cx="0" cy="-12" rx="7" ry="12" fill="#ffffff" transform="rotate(${a})"/>`).join('')}
    <ellipse cx="-11" cy="1" rx="11" ry="9" fill="#b27cf0"/><ellipse cx="11" cy="1" rx="11" ry="9" fill="#b27cf0"/>
    <ellipse cx="0" cy="8" rx="6" ry="7" fill="#d6358f"/><circle cx="0" cy="3" r="2.6" fill="${C.gold}"/></g>`;
  S.orchid = svg(potF('#f4ecff', '#ffffff') +
    `<ellipse cx="30" cy="50" rx="20" ry="7.5" fill="${C.leaf}" transform="rotate(-18 30 50)"/>
     <ellipse cx="70" cy="51" rx="19" ry="7" fill="${C.leafD}" transform="rotate(16 70 51)"/>
     <path d="M50 50C46 36 48 24 62 12" stroke="#4d8f3a" stroke-width="3" fill="none" stroke-linecap="round"/>
     <circle cx="85" cy="9" r="4" fill="#d9c2fb"/>` + orchid(40, 27, 0.95) + orchid(72, 18, 0.62));

  const frond = (a, len, col) => {
    let out = `<g transform="rotate(${a} 50 54)"><path d="M50 54L50 ${54 - len}" stroke="${col}" stroke-width="2"/>`;
    for (let i = 1; i <= 8; i++) {
      const y = 54 - (len * i) / 9, s = 1 - i / 12, lx = 50 - 5 * s, rx = 50 + 5 * s;
      out += `<ellipse cx="${lx}" cy="${y}" rx="${5.5 * s}" ry="${2.3 * s}" fill="${col}" transform="rotate(25 ${lx} ${y})"/>`
        + `<ellipse cx="${rx}" cy="${y}" rx="${5.5 * s}" ry="${2.3 * s}" fill="${col}" transform="rotate(-25 ${rx} ${y})"/>`;
    }
    return out + '</g>';
  };
  S.fern = svg([[-72, 40], [72, 40], [-48, 44], [48, 44], [-24, 47], [24, 47], [0, 48]]
    .map(([a, l], i) => frond(a, l, i % 2 ? '#4fb566' : '#6fcf7f')).join('') + potF('#8ec5f0', '#b3dcff'));

  const aloeLeaf = (a, s, col) => `<g transform="${at(a, s, 50, 54)}"><path d="M50 54C42 42 45 20 50 6C55 20 58 42 50 54Z" fill="${col}"/>
    ${[[48, 40], [52, 32], [49, 24], [51, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#eafff4"/>`).join('')}
    <path d="M45 44L42.5 43M55 40L57.5 39M46 32L44 31M54 28L56 27" stroke="#eafff4" stroke-width="1.4" stroke-linecap="round"/></g>`;
  S.aloe = svg(aloeLeaf(-58, 0.78, '#63b894') + aloeLeaf(58, 0.78, '#63b894') + aloeLeaf(-30, 0.9, '#7cc9a8') +
    aloeLeaf(30, 0.9, '#7cc9a8') + aloeLeaf(0, 1, '#8fd6b6') + potF('#ffb38a', '#ffcfae'));

  const strand = (x0, n) => {
    const pts = Array.from({ length: n + 1 }, (_, i) => [+(x0 + Math.sin(i * 0.9 + x0) * 3).toFixed(1), 58 + i * 6]);
    return `<path d="M${pts.map(p => p.join(' ')).join('L')}" stroke="#6b9a4a" stroke-width="1.2" fill="none"/>` +
      pts.slice(1).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.3" fill="#7fcf8a"/><circle cx="${x - 1}" cy="${y - 1}" r="1" fill="#e6ffe9"/>`).join('');
  };
  S.pearls = svg(`<path d="M50 6L27 33M50 6L73 33" stroke="#c9a8f5" stroke-width="2"/><circle cx="50" cy="6" r="3.5" fill="none" stroke="#c9a8f5" stroke-width="2.2"/>` +
    [[36, 5], [43, 6], [50, 6], [57, 6], [64, 5]].map(([x, n]) => strand(x, n)).join('') +
    `<path d="M28 34L72 34L66 56Q65 60 60 60L40 60Q35 60 34 56Z" fill="#c29af2"/><rect x="24" y="30" width="52" height="9" rx="4.5" fill="#d8c0ff"/>` + face(50, 48.5, 0.8));

  S.bonsai = svg(`<path d="M47 72C40 60 58 54 50 42C45 34 51 28 57 22" stroke="#8a5a3c" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M50 50C60 48 66 45 72 38M48 58C38 56 32 52 27 46" stroke="#8a5a3c" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${[[57, 19, 12], [73, 34, 10], [26, 42, 10], [42, 29, 9]].map(([x, y, r]) => `<circle cx="${x - r * 0.6}" cy="${y + 2}" r="${r * 0.75}" fill="#3f9e5a"/><circle cx="${x + r * 0.6}" cy="${y + 2}" r="${r * 0.75}" fill="#3f9e5a"/><circle cx="${x}" cy="${y - 2}" r="${r * 0.85}" fill="#57b870"/><circle cx="${x - 2}" cy="${y - 4}" r="${r * 0.35}" fill="#8fe0a6"/>`).join('')}
    ${[[52, 14], [66, 22], [78, 30], [20, 40], [34, 44], [46, 24], [62, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#ff9ecf"/>`).join('')}
    <path d="M17 71L83 71L79 92Q78 96 74 96L26 96Q22 96 21 92Z" fill="#7a4bd0"/><rect x="12" y="64" width="76" height="10" rx="5" fill="#a57ff5"/>` +
    face(50, 83.5, 0.82) + star4(10, 14, 6, '#fff3c4') + star4(90, 60, 5, '#fff3c4') + star4(88, 10, 4, '#fff'));

  // Sunroom flower: a big Pink Hibiscus with a long dotted stamen.
  ART.addFlower('hibiscus', 'Pink Hibiscus', svg(`<ellipse cx="18" cy="78" rx="17" ry="9" fill="${C.leaf}" transform="rotate(-35 18 78)"/>
    <ellipse cx="82" cy="80" rx="17" ry="9" fill="${C.leafD}" transform="rotate(35 82 80)"/>
    ${ring(5, (i, a) => `<g transform="rotate(${a + 18} 50 52)"><path d="M50 52C30 44 24 14 40 8C46 5 50 9 50 9C50 9 54 5 60 8C76 14 70 44 50 52Z" fill="#ff7eb6"/>
      <path d="M50 50C42 40 40 24 44 14M50 50C58 40 60 24 56 14M50 50L50 12" stroke="#ffc0dc" stroke-width="1.6" fill="none" opacity=".8"/></g>`)}
    <circle cx="50" cy="52" r="11" fill="#d6246e"/><circle cx="50" cy="52" r="6" fill="#a8124f"/>
    <path d="M50 52Q60 40 70 26" stroke="#fff0f6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    ${[[56, 43], [60, 37], [64, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${C.gold}"/>`).join('')}
    ${[[70, 24], [74, 27], [67, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#e2245f"/>`).join('')}` +
    star4(12, 14, 6, '#fff3c4') + star4(88, 58, 4.5, '#fff')));

  Object.assign(ITEMS, {
    snake:  { name: 'Snake Plant',      size: 114, body: 'circle', r: 53, pts: 10, refund: 1 },
    cactus: { name: 'Blooming Cactus',  size: 114, body: 'circle', r: 53, pts: 10, refund: 1 },
    orchid: { name: 'Moth Orchid',      size: 116, body: 'circle', r: 55, pts: 10, refund: 1 },
    fern:   { name: 'Boston Fern',      size: 116, body: 'circle', r: 55, pts: 10, refund: 1 },
    aloe:   { name: 'Aloe Vera',        size: 114, body: 'circle', r: 54, pts: 10, refund: 1 },
    pearls: { name: 'String of Pearls', size: 114, body: 'circle', r: 53, pts: 10, refund: 1 },
    bonsai: { name: 'Blossom Bonsai',   size: 125, body: 'circle', r: 58, pts: 100, refund: 3, rare: true },
  });
  ORDER.push('snake', 'cactus', 'orchid', 'fern', 'aloe', 'pearls', 'bonsai');
})();

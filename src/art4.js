// Petal Pusher art, shelf 4 "Sunny Meadow": original hand-authored SVG stickers (see CREDITS.md).
// Template for new shelves: copy this file to artN.js, change key/name/ids/art, add the script tag (index.html + sw.js).
(() => {
  const { C, svg, ring, star4, face, potF, heartPath } = ART;

  const sunflower = svg(`<ellipse cx="17" cy="86" rx="15" ry="7" fill="${C.leaf}" transform="rotate(-30 17 86)"/>
    <ellipse cx="83" cy="86" rx="15" ry="7" fill="${C.leafD}" transform="rotate(30 83 86)"/>
    ${ring(14, (i, a) => `<ellipse cx="50" cy="16" rx="8.5" ry="14" fill="#ffbf2e" transform="rotate(${a} 50 48)"/>`)}
    ${ring(14, (i, a) => `<ellipse cx="50" cy="20" rx="6.5" ry="11" fill="#ffe066" transform="rotate(${a + 360 / 28} 50 48)"/>`)}
    <circle cx="50" cy="48" r="22" fill="#d9965a"/>
    ${ring(18, (i, a) => `<circle cx="50" cy="29.5" r="1.7" fill="#9a5a26" transform="rotate(${a} 50 48)"/>`)}` +
    face(50, 49, 0.84));

  const tulip = (x, y, rot, col, hi) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1.25)">
    <path d="M-10 -2C-12 -14 -9 -22 -6 -20L-3 -14L0 -22L3 -14L6 -20C9 -22 12 -14 10 -2Q0 6 -10 -2Z" fill="${col}"/>
    <path d="M-3 -14L0 -22L3 -14C4 -6 -4 -6 -3 -14Z" fill="${hi}"/><ellipse cx="-5" cy="-6" rx="1.8" ry="4" fill="#fff" opacity=".45"/></g>`;
  const tulips = svg(`<path d="M50 50Q48 40 50 32M40 50Q36 42 29 36M60 50Q64 42 71 36" stroke="#3f8f4f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M27 52C19 40 21 30 25 26C31 34 33 44 33 52Z" fill="#4fb566"/><path d="M73 52C81 40 79 30 75 26C69 34 67 44 67 52Z" fill="#4fb566"/>` +
    tulip(29, 37, -16, '#ffd35a', '#fff0a0') + tulip(71, 37, 16, '#c38cf2', '#e6d2ff') + tulip(50, 32, 0, '#ff5f8f', '#ffa8c6') +
    potF('#5cc8a0', '#8fe0c0'));

  const berry = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 14C-9 10 -12 -2 -10 -6C-6 -10 6 -10 10 -6C12 -2 9 10 0 14Z" fill="#ff4f6e"/>
    ${[[-5, -2], [0, -4], [5, -2], [-3, 4], [3, 4], [0, 9], [-7, -5], [7, -5]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx=".9" ry="1.4" fill="#ffe9a8"/>`).join('')}
    <path d="M-8 -7L-4 -11L-1 -8L0 -13L1 -8L4 -11L8 -7L3 -6L0 -8L-3 -6Z" fill="#3fae6a"/>
    <ellipse cx="-4.5" cy="1" rx="1.6" ry="3.2" fill="#fff" opacity=".45"/></g>`;
  const sLeaf = a => `<g transform="rotate(${a} 50 50)"><ellipse cx="50" cy="29" rx="10" ry="16" fill="${a % 2 ? '#4fb566' : '#5fc077'}"/>
    <path d="M50 44L50 15" stroke="#2f8a4a" stroke-width="1.6"/></g>`;
  const strawberry = svg([-54, -19, 19, 54].map(sLeaf).join('') +
    ring(5, (i, a) => `<circle cx="50" cy="15.5" r="4.2" fill="#fff" transform="rotate(${a} 50 20)"/>`) + `<circle cx="50" cy="20" r="2.8" fill="${C.gold}"/>` +
    potF('#fff1dc', '#ffd9b0') + berry(19, 60, 1.25, 18) + berry(81, 60, 1.25, -18));

  const cLeaf = (a, s) => `<g transform="rotate(${a} 50 30)"><g transform="translate(50 ${30 - 6 * s}) scale(${s})">
    <path d="${heartPath}" fill="#4fb566"/><path d="M0 2C-6 -3 -7 -9 -3 -11M0 2C6 -3 7 -9 3 -11" stroke="#a6eab5" stroke-width="1.4" fill="none" stroke-linecap="round"/></g></g>`;
  const clover = svg(`<path d="M50 50Q51 40 50 31" stroke="#3f8f4f" stroke-width="3.2" stroke-linecap="round"/>` +
    [-45, 45, 135, 225].map(a => cLeaf(a, 1.22)).join('') + `<circle cx="50" cy="30" r="2.6" fill="#2f8a4a"/>` +
    potF('#ffc94a', '#ffe08a') + star4(86, 12, 6, '#fff3c4') + star4(13, 18, 4, '#fff'));

  // Lit from the top left: florets get lighter toward (36, 28) so the ball looks round.
  const HY = ['#dcd2ff', '#bfc4ff', '#a6b2ff', '#9aa0f4'], florets = [];
  for (let r = 0, y = 18; y <= 74; y += 13, r++) for (let x = 14 + (r % 2) * 7.5; x <= 86; x += 15)
    if ((x - 50) ** 2 + (y - 44) ** 2 <= 29 ** 2) florets.push([x, y, HY[Math.min(3, Math.floor(Math.hypot(x - 36, y - 28) / 15))]]);
  const hydrangea = svg(`<ellipse cx="22" cy="80" rx="19" ry="10" fill="${C.leaf}" transform="rotate(-35 22 80)"/>
    <ellipse cx="78" cy="80" rx="19" ry="10" fill="${C.leafD}" transform="rotate(35 78 80)"/>
    <path d="M10 88L32 74M90 88L68 74" stroke="#1f6b3c" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="50" cy="44" r="37" fill="#7d86e0"/>` +
    florets.map(([x, y, c]) => `<g fill="${c}" stroke="#6d74d0" stroke-width="1">${[0, 90, 180, 270].map(a =>
      `<ellipse cx="${x}" cy="${y - 5.4}" rx="4.8" ry="5.8" transform="rotate(${a + 45} ${x} ${y})"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="2" fill="#fff6c4"/>`).join(''));

  const seed = (x, y, a, len) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0L0 ${-len}" stroke="#b49ad8" stroke-width="1.3"/>
    <path d="M0 ${-len}L-4 ${-len - 5}M0 ${-len}L0 ${-len - 6}M0 ${-len}L4 ${-len - 5}" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="0" cy="${-len}" r="1.2" fill="#a98bd6"/></g>`;
  const dandelion = svg(`<path d="M50 70Q46 84 50 98" stroke="#6fae5a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M48 96C36 92 26 84 22 74L30 78L28 70L36 78L36 70L44 84Z" fill="#5fb65c"/>
    <path d="M52 96C64 92 74 84 78 74L70 78L72 70L64 78L64 70L56 84Z" fill="#4fa85a"/>
    <circle cx="50" cy="40" r="35" fill="#efe6ff"/><circle cx="50" cy="40" r="35" fill="none" stroke="#d9c6fb" stroke-width="2"/>` +
    ring(20, (i, a) => `<g transform="rotate(${a} 50 40)">${seed(50, 22, 0, 9)}</g>`) +
    `<circle cx="50" cy="40" r="16" fill="#fff8e0"/>` + face(50, 41, 0.78));

  const lp = 'M50 74C38 64 37 42 50 24C63 42 62 64 50 74Z';
  const moonlotus = svg(`<path d="M50 80L92 74C96 88 70 96 50 95C24 95 4 88 8 76Z" fill="#3fae6a"/>
    <path d="M50 80L92 74C88 84 70 88 50 88C30 88 12 84 8 76Z" fill="#5fc077"/><path d="M50 80L66 94L58 95Z" fill="#2f8a4a"/>
    ${[-62, 62, -34, 34].map((a, i) => `<path d="${lp}" fill="${i < 2 ? '#d9c2fb' : '#ecdcff'}" transform="rotate(${a} 50 74)"/>`).join('')}
    ${[-14, 14].map(a => `<path d="${lp}" fill="#f9c6e8" transform="rotate(${a} 50 74)"/>`).join('')}
    <path d="${lp}" fill="#ffd9f0"/><path d="M50 70C45 60 45 44 50 32C55 44 55 60 50 70Z" fill="#fff" opacity=".55"/>
    <circle cx="50" cy="68" r="5" fill="${C.gold}"/>
    <path d="M24 4A14 14 0 0 0 24 32A20 20 0 0 1 24 4Z" fill="#ffe27a" stroke="#e8a92a" stroke-width="1.2" transform="rotate(-18 24 18)"/>` +
    star4(86, 12, 6, '#fff3c4') + star4(92, 46, 4.5, '#fff') + star4(8, 50, 4.5, '#fff3c4') + star4(74, 30, 3.5, '#fff'));

  ART.addShelf({
    key: 'meadow', name: 'Sunny Meadow', floor: 0xd6f5a0,
    plants: {
      sunflower:  { name: 'Smiley Sunflower', svg: sunflower, size: 116, r: 55 },
      tulips:     { name: 'Tulip Trio',       svg: tulips },
      strawberry: { name: 'Strawberry Pot',   svg: strawberry },
      clover:     { name: 'Lucky Clover',     svg: clover },
      hydrangea:  { name: 'Blue Hydrangea',   svg: hydrangea, size: 116, r: 55 },
      dandelion:  { name: 'Dandelion Puff',   svg: dandelion },
    },
    rare: { moonlotus: { name: 'Moon Lotus', svg: moonlotus } },
  });
})();

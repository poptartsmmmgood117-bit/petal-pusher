// Petal Pusher art, shelf 5 "Rainy Greenhouse": original hand-authored SVG stickers (see CREDITS.md).
(() => {
  const { C, svg, star4, face, eye, potF, heartPath } = ART;
  const heart = (x, y, s, fill, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="${heartPath}" fill="${fill}" ${extra}/></g>`;

  const drops = [[40, 22, 0.62], [53, 15, 0.74], [66, 15, 0.86], [78, 22, 1]];
  const bleedingheart = svg(`<ellipse cx="26" cy="40" rx="8" ry="15" fill="${C.leaf}" transform="rotate(-30 26 40)"/>
    <ellipse cx="38" cy="38" rx="6" ry="13" fill="#4fb566" transform="rotate(-8 38 38)"/>
    <path d="M30 50C30 22 62 6 86 30" stroke="#6f9a3f" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    drops.map(([x, y, s]) => `<path d="M${x} ${y}L${x} ${y + 5}" stroke="#6f9a3f" stroke-width="1.6"/>` +
      heart(x, y + 5 + 15 * s, s, '#ff6fa8') + `<ellipse cx="${x}" cy="${y + 5 + 22 * s}" rx="${1.6 * s + 0.6}" ry="${2.6 * s + 0.8}" fill="#fff"/>`).join('') +
    potF('#6cc4c4', '#9ee0e0'));

  const stalk = (x, top, h) => `<rect x="${x - 4.5}" y="${top}" width="9" height="${52 - top}" rx="4.5" fill="#7fcf6a"/>
    <rect x="${x - 2.5}" y="${top + 2}" width="2.2" height="${48 - top}" rx="1.1" fill="#b8ec9a"/>
    ${Array.from({ length: h }, (_, i) => `<path d="M${x - 4.5} ${top + 10 + i * 11}L${x + 4.5} ${top + 10 + i * 11}" stroke="#4f9a44" stroke-width="2"/>`).join('')}`;
  const bLeaf = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4.2" fill="#4fb566" transform="rotate(${a} ${x} ${y})"/>`;
  const bamboo = svg(stalk(36, 14, 3) + stalk(64, 20, 3) + stalk(50, 5, 4) +
    bLeaf(26, 12, -30) + bLeaf(73, 16, 28) + bLeaf(60, 6, 24) + bLeaf(40, 4, -20) +
    `<rect x="28" y="28" width="44" height="6" rx="3" fill="${C.pink}"/>
     <path d="M50 31C38 18 26 26 36 35C41 38 46 36 50 31ZM50 31C62 18 74 26 64 35C59 38 54 36 50 31Z" fill="#ff6fb3"/><circle cx="50" cy="31" r="3.8" fill="#ffc0e0"/>` +
    potF('#e8735a', '#f39a84'));

  const spike = (a, len, w) => `<g transform="rotate(${a} 50 62)"><path d="M${50 - w} 62Q${50 - w * 0.6} ${62 - len * 0.6} 50 ${62 - len}Q${50 + w * 0.6} ${62 - len * 0.6} ${50 + w} 62Z" fill="#76b585"/>
    <path d="M50 ${62 - len}L${50 - 1.4} ${62 - len + 7}L${50 + 1.4} ${62 - len + 7}Z" fill="#ff8fc8"/></g>`;
  const ridges = [-36, -24, -12, 0, 12, 24, 36].map(dx => `<path d="M50 94L${50 + dx * 1.05} ${60 - Math.cos(dx / 40) * 8 + Math.abs(dx) * 0.28}" stroke="#f0a890" stroke-width="2.2" stroke-linecap="round"/>`).join('');
  const airplant = svg([[-58, 34, 4], [58, 34, 4], [-34, 44, 4.5], [34, 44, 4.5], [-14, 52, 5], [14, 50, 5], [0, 56, 5]].map(a => spike(...a)).join('') +
    `<path d="M50 96L11 66Q50 32 89 66Z" fill="#ffd9c8"/>${ridges}
     <path d="M11 66Q50 32 89 66" stroke="#ffe9de" stroke-width="3" fill="none"/>
     <path d="M40 96L44 89L56 89L60 96Z" fill="#f5b8a0"/>` + face(50, 72, 0.9));

  const jLeaf = (x, y, a, s = 1) => `<ellipse cx="${x}" cy="${y}" rx="${6.5 * s}" ry="${9.5 * s}" fill="#5fb87a" stroke="#ff8f8f" stroke-width="1.6" transform="rotate(${a} ${x} ${y})"/>
    <ellipse cx="${x - 1.6 * s}" cy="${y - 2.6 * s}" rx="${1.6 * s}" ry="${3 * s}" fill="#b8ecc4" transform="rotate(${a} ${x} ${y})"/>`;
  const jade = svg(`<path d="M50 50L50 34M50 40L32 26M50 38L68 22" stroke="#9a6a44" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    [[50, 22, 0, 1.1], [42, 30, -40], [58, 28, 40], [24, 20, -50], [34, 14, -15], [26, 34, -80], [68, 12, 15], [78, 20, 55], [76, 34, 85], [50, 8, 0, 0.9]]
      .map(a => jLeaf(...a)).join('') + potF('#c3a6f0', '#dcc8ff'));

  const pitcherTube = 'M34 94C26 72 28 44 37 30L63 30C72 44 74 72 66 94Z';
  const pitcher = svg(`<ellipse cx="84" cy="80" rx="11" ry="6" fill="${C.leaf}" transform="rotate(-30 84 80)"/>
    <ellipse cx="16" cy="82" rx="11" ry="6" fill="${C.leafD}" transform="rotate(30 16 82)"/>
    <g transform="translate(76 46) scale(.42)"><path d="${pitcherTube}" transform="translate(-50 -60)" fill="#a8cc5a"/></g>
    <path d="M69 34C80 24 92 26 94 34C86 32 78 34 71 38Z" fill="#8fbf4a"/>
    <path d="${pitcherTube}" fill="#bcdc6e"/>
    <path d="M40 40C36 58 38 76 42 92M50 36L50 94M60 40C64 58 62 76 58 92M36 60L64 60" stroke="#d0605a" stroke-width="1.6" fill="none" opacity=".55"/>
    <ellipse cx="50" cy="30" rx="15" ry="5" fill="#d9534f"/><ellipse cx="50" cy="29" rx="10" ry="2.6" fill="#7a2a3a"/>
    <path d="M38 24C38 8 66 4 72 14C62 14 48 18 38 24Z" fill="#9cc75a"/><path d="M42 20C50 14 60 12 66 13" stroke="#d0605a" stroke-width="1.4" fill="none" opacity=".6"/>` +
    face(50, 66, 0.95));

  const hoya = svg(potF('#ffd0e4', '#ffe4f0', false) +
    heart(50, 39, 2.35, '#4fae66', 'stroke="#c8eaa0" stroke-width="1.6"') +
    `<path d="M50 52L50 8" stroke="#3a8a50" stroke-width="2" stroke-linecap="round" opacity=".6"/>
     <ellipse cx="33" cy="12" rx="6" ry="3.6" fill="#8fe0a6" opacity=".7" transform="rotate(-35 33 12)"/>
     <ellipse cx="34" cy="30" rx="4.6" ry="2.8" fill="${C.blush}" opacity=".9"/><ellipse cx="66" cy="30" rx="4.6" ry="2.8" fill="${C.blush}" opacity=".9"/>
     ${eye(41, 23, 5.8)}${eye(59, 23, 5.8)}<path d="M46.4 29.6Q50 33.6 53.6 29.6" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);

  const bell = (x, y, s, a) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 -6L0 0" stroke="#5f9a4a" stroke-width="1.6"/>
    <path d="M-8 10C-8 -2 8 -2 8 10L10 16Q5 13 3 17Q0 13 -3 17Q-5 13 -10 16Z" fill="#8fc8ff" stroke="#5a8fe0" stroke-width="1.2"/>
    <ellipse cx="-3.6" cy="6" rx="1.8" ry="4" fill="#fff" opacity=".75"/><circle cx="0" cy="17" r="1.6" fill="#fff6c4"/></g>`;
  const bluebell = svg(`<path d="M30 97C14 80 12 60 18 44C26 60 32 78 36 96Z" fill="${C.leaf}"/>
    <path d="M60 97C74 84 84 72 92 62C88 78 78 90 66 98Z" fill="${C.leafD}"/>
    <path d="M42 96C36 60 44 22 76 10" stroke="#5f9a4a" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    bell(41, 54, 1.7, 4) + bell(50, 28, 1.5, -6) + bell(66, 16, 1.3, -16) +
    star4(14, 14, 7, '#fff3c4') + star4(90, 34, 5.5, '#fff') + star4(84, 86, 5, '#fff3c4'));

  ART.addShelf({
    key: 'greenhouse', name: 'Rainy Greenhouse', floor: 0xa8d8ff,
    plants: {
      bleedingheart: { name: 'Bleeding Heart',  svg: bleedingheart },
      bamboo:        { name: 'Lucky Bamboo',    svg: bamboo },
      airplant:      { name: 'Seashell Air Plant', svg: airplant },
      jade:          { name: 'Jade Plant',      svg: jade },
      pitcher:       { name: 'Pitcher Plant',   svg: pitcher },
      hoya:          { name: 'Sweetheart Hoya', svg: hoya },
    },
    rare: { bluebell: { name: 'Starry Bluebell', svg: bluebell } },
  });
})();

// Cabinet background + planter-box pusher (world units; rasterized by ART.build).
const LAYOUT = {
  W: 720, H: 1560,
  shelfL: 60, shelfR: 660, shelfTop: 160, edgeY: 900, gutter: 155,
  pusherH: 170, pusherMin: 330, pusherMax: 600, // pusher bottom edge travel (tuned by sim: ~0.97 wins/drop)
  dispTop: 1036, plank1: 1172, plank2: 1312, panelTop: 1360,
};

const BG = (() => {
  const L = LAYOUT, { svg } = ART;
  const leaf = (x, y, r, s, a = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${a}">
    <path d="M0-48C28-48 46-24 43 0C40 24 20 40 0 41C-20 40-40 24-43 0C-46-24-28-48 0-48Z" fill="#3fae6a"/>
    <path d="M0-48C28-48 46-24 43 0C40 24 20 40 0 41Z" fill="#8fe0a6" opacity=".3"/>
    <path d="M0-42L0 38" stroke="#23804a" stroke-width="3"/>
    <g stroke="#2a1640" stroke-width="5" stroke-linecap="round"><path d="M46-10L20-5"/><path d="M44 12L18 10"/><path d="M-46-10L-20-5"/><path d="M-44 12L-18 10"/></g></g>`;
  const inner = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b1d5c"/><stop offset="1" stop-color="#1c0d30"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".45" r=".65"><stop offset="0" stop-color="#9a62e8" stop-opacity=".45"/><stop offset="1" stop-color="#9a62e8" stop-opacity="0"/></radialGradient>
    <linearGradient id="shelf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7c2fb"/><stop offset="1" stop-color="#f1e9ff"/></linearGradient>
    <pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="3.2" fill="#c3a6f2" opacity=".6"/><circle cx="33" cy="33" r="3.2" fill="#c3a6f2" opacity=".6"/></pattern>
    <linearGradient id="slot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f6bd0"/><stop offset="1" stop-color="#b79ae8"/></linearGradient>
    <linearGradient id="chute" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10061c"/><stop offset="1" stop-color="#3a1d5e"/></linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4d2c78"/><stop offset="1" stop-color="#2c174d"/></linearGradient>
    <linearGradient id="marq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3aa8"/><stop offset="1" stop-color="#4f2a86"/></linearGradient>
  </defs>
  <rect width="720" height="1560" fill="url(#bg)"/><rect width="720" height="1560" fill="url(#glow)"/>
  ${leaf(30, 1380, -35, 1.5, .9)}${leaf(695, 1395, 40, 1.35, .9)}
  <rect x="26" y="146" width="668" height="${L.edgeY + 124 - 146}" rx="36" fill="#43246b" stroke="#c9a8f5" stroke-width="6"/>
  <rect x="26" y="${L.dispTop}" width="668" height="${L.panelTop - L.dispTop - 12}" rx="30" fill="#341b55" stroke="#8f6bd0" stroke-width="4"/>
  ${[L.plank1, L.plank2].map(y => `<rect x="52" y="${y}" width="616" height="18" rx="6" fill="#d9a877"/><rect x="52" y="${y + 12}" width="616" height="8" rx="4" fill="#a8764c"/>
    <path d="M90 ${y + 20}L90 ${y + 40}L112 ${y + 20}Z M630 ${y + 20}L630 ${y + 40}L608 ${y + 20}Z" fill="#8a5d3b"/>`).join('')}
  <rect x="${L.shelfL - 4}" y="${L.shelfTop}" width="${L.shelfR - L.shelfL + 8}" height="${L.edgeY - L.shelfTop + 4}" rx="10" fill="url(#shelf)"/>
  <rect x="${L.shelfL - 4}" y="${L.shelfTop}" width="${L.shelfR - L.shelfL + 8}" height="${L.edgeY - L.shelfTop + 4}" rx="10" fill="url(#dots)"/>
  <rect x="${L.shelfL - 4}" y="${L.shelfTop}" width="${L.shelfR - L.shelfL + 8}" height="${L.pusherMin - L.shelfTop}" fill="url(#slot)"/>
  <g fill="#a584e0" opacity=".8">${[0, 1, 2].map(i => [150, 360, 570].map(x => `<path d="M${x - 22} ${L.pusherMin + 40 + i * 70}L${x} ${L.pusherMin + 62 + i * 70}L${x + 22} ${L.pusherMin + 40 + i * 70}L${x + 22} ${L.pusherMin + 52 + i * 70}L${x} ${L.pusherMin + 74 + i * 70}L${x - 22} ${L.pusherMin + 52 + i * 70}Z"/>`).join('')).join('')}</g>
  ${[[28, L.edgeY - L.gutter], [658, L.edgeY - L.gutter]].map(([x, y]) => `<rect x="${x}" y="${y}" width="34" height="${L.gutter + 14}" rx="12" fill="#12071f" stroke="#ff8fc8" stroke-width="3.5"/>
    ${[0, 1, 2].map(i => `<path d="M${x + 9} ${y + 28 + i * 36}L${x + 17} ${y + 38 + i * 36}L${x + 25} ${y + 28 + i * 36}" stroke="#ff8fc8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`).join('')}`).join('')}
  <rect x="44" y="${L.shelfTop}" width="16" height="${L.edgeY - L.gutter - L.shelfTop}" rx="8" fill="#b48cf0"/>
  <rect x="660" y="${L.shelfTop}" width="16" height="${L.edgeY - L.gutter - L.shelfTop}" rx="8" fill="#b48cf0"/>
  ${[44, 660].map(x => `<rect x="${x + 5}" y="${L.shelfTop + 6}" width="6" height="${L.pusherMax - L.shelfTop}" rx="3" fill="#6f45bd"/>
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="${x + 8}" cy="${L.shelfTop + 40 + i * 80}" r="3" fill="#e9dcff"/>`).join('')}`).join('')}
  <rect x="50" y="${L.edgeY - 2}" width="620" height="13" rx="6.5" fill="#ffd35a"/>
  <rect x="50" y="${L.edgeY + 7}" width="620" height="4" rx="2" fill="#e8a92a"/>
  <rect x="60" y="${L.edgeY + 14}" width="600" height="96" rx="16" fill="url(#chute)"/>
  ${leaf(58, 118, -50, 1.25)}${leaf(664, 112, 48, 1.2)}
  <rect x="26" y="16" width="668" height="120" rx="32" fill="url(#marq)" stroke="#c9a8f5" stroke-width="5"/>
  <rect x="26" y="${L.panelTop}" width="668" height="${L.H - L.panelTop - 16}" rx="32" fill="url(#panel)" stroke="#8f6bd0" stroke-width="4"/>`;
  return { w: LAYOUT.W, h: LAYOUT.H, svg: svg(inner, '', `0 0 ${LAYOUT.W} ${LAYOUT.H}`) };
})();

const PUSHER = (() => {
  const { svg, face, star4 } = ART;
  const W = 600, H = LAYOUT.pusherH;
  let plants = '';
  for (let i = 0; i < 10; i++) {
    const x = 36 + i * 59, k = i % 4;
    if (k === 0) plants += `<g transform="translate(${x} 64)"><path d="M0 34C-4 6-24-2-26-22C-6-22 2-6 0 34Z" fill="#46b36b"/><path d="M0 34C4 6 24-2 26-22C6-22-2-6 0 34Z" fill="#3a9d5c"/><path d="M0 34C-2 10 -1-10 0-30C1-10 2 10 0 34Z" fill="#5cc47e"/></g>`;
    if (k === 1) plants += `<g transform="translate(${x} 60)"><path d="M-8 38Q-14 4-6-30Q-2 4 -2 38Z" fill="#3f8f4f"/><path d="M0 38Q-3 0 4-40Q8 0 6 38Z" fill="#4f9f5f"/><path d="M8 38Q14 6 16-24Q12 8 12 38Z" fill="#3f8f4f"/><path d="M4-40Q8 0 6 38" stroke="#e6e27a" stroke-width="2" fill="none"/></g>`;
    if (k === 2) plants += `<g transform="translate(${x} 58)"><path d="M0 40L0 6" stroke="#4f9f5f" stroke-width="4"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6.5" ry="11" fill="#e98bff" transform="rotate(${a} 0 4)"/>`).join('')}<circle cx="0" cy="4" r="5" fill="#ffd35a"/></g>`;
    if (k === 3) plants += `<g transform="translate(${x} 62)"><circle cx="-12" cy="4" r="15" fill="#5cc47e"/><circle cx="12" cy="0" r="16" fill="#46b36b"/><circle cx="0" cy="-14" r="15" fill="#6fd08e"/><circle cx="4" cy="-16" r="4" fill="#fff" opacity=".35"/></g>`;
  }
  const F = H - 62; // top of the front (pushing) face
  const inner = `
    <rect x="0" y="0" width="${W}" height="${F + 10}" rx="16" fill="#6f45bd"/>
    <rect x="12" y="8" width="${W - 24}" height="${F - 4}" rx="12" fill="#5e3d2e"/>
    <g fill="#7a5442">${Array.from({ length: 26 }, (_, i) => `<circle cx="${24 + i * 22}" cy="${F - 14 + (i % 3) * 5}" r="3"/>`).join('')}</g>
    <g transform="translate(0 ${F - 90})">${plants}</g>
    <rect x="0" y="${F}" width="${W}" height="${H - F}" rx="16" fill="#a47cf0"/>
    <rect x="0" y="${F}" width="${W}" height="12" rx="6" fill="#c3a0ff"/>
    <g stroke="#8f66dc" stroke-width="2">${[100, 200, 400, 500].map(x => `<path d="M${x} ${F + 16}L${x} ${H - 8}"/>`).join('')}</g>
    <rect x="6" y="${H - 10}" width="${W - 12}" height="8" rx="4" fill="#7d52c9"/>
    ${face(300, F + 30, 1.55)}
    ${[60, 130, 470, 540].map(x => `<path d="M${x - 16} ${F + 20}L${x} ${F + 34}L${x + 16} ${F + 20}M${x - 16} ${F + 32}L${x} ${F + 46}L${x + 16} ${F + 32}" stroke="#fff3c4" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}`;
  return { w: W, h: H, svg: svg(inner, '', `0 0 ${W} ${H}`) };
})();

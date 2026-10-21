/* Hello Fox! — Level 2 drawings (same flat style and palette as art.js). Adds to window.ART. */
(function () {
  "use strict";
  const K = window.ART_KIT, A = window.ART;
  if (!K || !A) return;
  const { C, S, shadow, txt, heartPath, badgeHeart, fig, kid, person, bird, hand } = K;

  // ---------- characters ----------
  const fox = `${shadow(30)}<path d="M26 50 L34 12 L58 36 Z" fill="#E8661F"/><path d="M94 50 L86 12 L62 36 Z" fill="#E8661F"/>
    <path d="M33 40 L37 22 L50 36Z" fill="#FFD9BD"/><path d="M87 40 L83 22 L70 36Z" fill="#FFD9BD"/>
    <path d="M18 54 Q60 12 102 54 Q106 86 60 108 Q14 86 18 54Z" fill="#F4862C"/>
    <path d="M24 68 Q44 72 60 90 Q76 72 96 68 Q92 98 60 110 Q28 98 24 68Z" fill="#FFF6EC"/>
    <circle cx="44" cy="60" r="5.5" fill="${C.ink}"/><circle cx="76" cy="60" r="5.5" fill="${C.ink}"/><circle cx="45.5" cy="58" r="1.8" fill="#fff"/><circle cx="77.5" cy="58" r="1.8" fill="#fff"/>
    <ellipse cx="60" cy="82" rx="6" ry="4.5" fill="${C.ink}"/><path d="M52 92 Q60 100 68 92" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="32" cy="76" r="5" fill="#FF9E8F" opacity=".5"/><circle cx="88" cy="76" r="5" fill="#FF9E8F" opacity=".5"/>`;
  const mouse = `${shadow(30)}<circle cx="34" cy="44" r="18" fill="#B8B2C8"/><circle cx="86" cy="44" r="18" fill="#B8B2C8"/><circle cx="34" cy="44" r="10" fill="${C.pink}" opacity=".7"/><circle cx="86" cy="44" r="10" fill="${C.pink}" opacity=".7"/>
    <path d="M90 92 Q112 96 108 76" fill="none" stroke="#B8B2C8" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="60" cy="74" rx="32" ry="28" fill="#CFC9DC"/><circle cx="49" cy="68" r="4.5" fill="${C.ink}"/><circle cx="71" cy="68" r="4.5" fill="${C.ink}"/>
    <circle cx="60" cy="82" r="5" fill="${C.pink}"/><path d="M40 82 h-14 M40 88 l-12 4 M80 82 h14 M80 88 l12 4" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" opacity=".5"/>`;
  // two children waving: friends / nice to meet you
  const friends = `<g transform="translate(-26 8) scale(.92)">${person({ hair: "puffs", shirt: C.purple, mouth: "big" })}</g>
    <g transform="translate(36 8) scale(.92)">${person({ hair: "short", shirt: C.green, mouth: "big", skin: "#C68642" })}</g>
    ${heartPath(60, 22, 0.9, C.red)}`;

  // ---------- numbers 6-10 (same tiles as 1-5) ----------
  const tile = (n, col) => S(`<rect x="18" y="12" width="84" height="84" rx="22" fill="${col}"/>${txt(60, 76, String(n), n > 9 ? 50 : 60, "#fff")}
    ${Array.from({ length: n }, (_, i) => `<circle cx="${60 - (n - 1) * 5.5 + i * 11}" cy="108" r="4.5" fill="${col}"/>`).join("")}`);

  // ---------- actions ----------
  const water = (y) => `<path d="M0 ${y} Q15 ${y - 6} 30 ${y} T60 ${y} T90 ${y} T120 ${y} V120 H0Z" fill="#7CC2FF" opacity=".8"/>`;
  const swim = S(`<rect width="120" height="120" rx="16" fill="#E8F4FF"/>${water(74)}
    <circle cx="60" cy="58" r="15" fill="${C.skin}"/><path d="M45 56 Q60 34 75 56 Q60 46 45 56Z" fill="${C.hair}"/>
    <circle cx="55" cy="59" r="2" fill="${C.ink}"/><circle cx="65" cy="59" r="2" fill="${C.ink}"/><path d="M55 65 Q60 69 65 65" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
    <path d="M44 74 Q30 60 20 68 M76 74 Q90 60 100 68" fill="none" stroke="${C.skin}" stroke-width="8" stroke-linecap="round"/>
    <path d="M10 92 q10 -6 20 0 M86 98 q10 -6 20 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);
  const dance = S(fig({ by: 44, hy: 28, br: -10, legL: "M54 76 L44 92 L36 104", legR: "M66 76 L70 104", armL: "M50 50 L32 34", armR: "M70 52 L90 62",
    after: `<path d="M98 26 v16 a5 5 0 1 1 -3 -4.5 V22 l10 -3 v14 a5 5 0 1 1 -3 -4.5 V24z" fill="${C.purple}"/><path d="M14 52 v12 a4 4 0 1 1 -2.5 -3.6 V48 l8 -2" fill="none" stroke="${C.pink}" stroke-width="3"/>` }));
  const sing = S(`${kid("", { mouth: "o" })}<path d="M94 18 v22 a6 6 0 1 1 -4 -5.5 V14 l14 -4 v20 a6 6 0 1 1 -4 -5.5 V16z" fill="${C.purple}"/>
    <path d="M14 30 v14 a5 5 0 1 1 -3 -4.5 V26 l10 -3" fill="none" stroke="${C.pink}" stroke-width="3.5" stroke-linecap="round"/>`);
  const fly = S(`<rect width="120" height="120" rx="16" fill="#E8F4FF"/><path d="M8 96 q12 -10 24 0 q12 -10 24 0" fill="#fff"/><path d="M70 30 q10 -8 20 0 q10 -8 20 0" fill="#fff"/>
    <g transform="translate(0 -6)"><path d="M54 60 Q30 22 12 30 Q30 46 46 66Z" fill="#3A86D9"/><ellipse cx="62" cy="66" rx="26" ry="20" fill="${C.blue}"/>
    <path d="M66 60 Q86 20 104 26 Q90 46 74 66Z" fill="#6DB4FF"/><circle cx="78" cy="60" r="4" fill="${C.ink}"/><path d="M88 64 l12 3 l-12 5z" fill="${C.orange}"/><ellipse cx="62" cy="74" rx="14" ry="8" fill="#fff" opacity=".6"/></g>`);

  // ---------- food ----------
  const iceCream = `${shadow(22)}<path d="M40 60 L60 108 L80 60Z" fill="#E9B872"/><path d="M44 66 L76 66 M48 76 L72 76 M52 86 L68 86" stroke="#C99550" stroke-width="2.5"/>
    <circle cx="48" cy="52" r="16" fill="${C.pink}"/><circle cx="72" cy="52" r="16" fill="#FFF0D6"/><circle cx="60" cy="36" r="17" fill="#8B5A3C"/><circle cx="60" cy="18" r="6" fill="${C.red}"/>
    <ellipse cx="52" cy="30" rx="4" ry="6" fill="#fff" opacity=".3"/>`;
  const cake = `${shadow(40)}<rect x="20" y="56" width="80" height="46" rx="10" fill="${C.pink}"/><path d="M20 70 Q30 78 40 70 T60 70 T80 70 T100 70 V62 Q100 56 94 56 H26 Q20 56 20 62Z" fill="#fff"/>
    <rect x="20" y="88" width="80" height="14" rx="6" fill="#E8668A"/>
    ${[40, 60, 80].map((x) => `<rect x="${x - 3}" y="34" width="6" height="22" rx="2" fill="${C.blue}"/><path d="M${x} 22 q6 8 0 12 q-6 -4 0 -12z" fill="${C.yellow}"/>`).join("")}`;

  // ---------- in / on / under ----------
  const box = (y) => `<rect x="26" y="${y}" width="68" height="46" rx="5" fill="#C9935A"/><rect x="26" y="${y}" width="68" height="10" fill="#B07C46"/><path d="M60 ${y} v46" stroke="#B07C46" stroke-width="3"/>`;
  const ballAt = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#E6D8BF" stroke-width="2"/><path d="M${x} ${y - r} A${r} ${r} 0 0 1 ${x + r} ${y} L${x} ${y}Z" fill="${C.red}"/><path d="M${x} ${y + r} A${r} ${r} 0 0 1 ${x - r} ${y} L${x} ${y}Z" fill="${C.blue}"/><path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x} ${y - r} L${x} ${y}Z" fill="${C.yellow}"/>`;
  const arrow = (x, y) => `<path d="M${x} ${y - 16} v12 M${x - 6} ${y - 9} l6 6 l6 -6" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const inBox = S(`${shadow(40)}${ballAt(60, 52, 14)}<path d="M26 54 h68 v46 a5 5 0 0 1 -5 5 h-58 a5 5 0 0 1 -5 -5z" fill="#C9935A"/><path d="M26 54 l-10 -12 h22z M94 54 l10 -12 h-22z" fill="#B07C46"/>${arrow(60, 30)}`);
  const table = `<rect x="16" y="56" width="88" height="9" rx="3" fill="#C9935A"/><path d="M24 65 v42 M96 65 v42" stroke="#B07C46" stroke-width="7" stroke-linecap="round"/>`;
  const onBox = S(`${shadow(46)}${table}${ballAt(60, 40, 15)}`);
  const underBox = S(`${shadow(46)}${table}${ballAt(60, 92, 14)}${arrow(60, 82)}`);
  const plainBox = S(`${shadow(40)}${box(46)}<path d="M26 46 l-12 -14 h28z M94 46 l12 -14 h-28z" fill="#B07C46"/>${txt(60, 84, "?", 30, "#fff")}`);

  // ---------- weather ----------
  const sun = (x, y, r) => `<g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, i) => `<rect x="-3" y="${-r - 14}" width="6" height="10" rx="3" fill="#FFB000" transform="rotate(${i * 45})"/>`).join("")}<circle r="${r}" fill="${C.yellow}"/></g>`;
  const cloud = (x, y, col) => `<g transform="translate(${x} ${y})" fill="${col || "#fff"}"><circle cx="-18" cy="4" r="14"/><circle cx="0" cy="-6" r="18"/><circle cx="20" cy="4" r="13"/><rect x="-32" y="4" width="64" height="14" rx="7"/></g>`;
  const sunny = S(`<rect width="120" height="120" rx="16" fill="#DFF1FF"/>${sun(60, 56, 24)}<path d="M50 60 Q60 70 70 60" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="50" r="3" fill="${C.ink}"/><circle cx="68" cy="50" r="3" fill="${C.ink}"/>`);
  const rainy = S(`<rect width="120" height="120" rx="16" fill="#E3E8F2"/>${cloud(60, 42, "#A9B4C8")}
    ${[[34, 74], [54, 84], [74, 72], [94, 86], [44, 98], [84, 102]].map(([x, y]) => `<path d="M${x} ${y} c0 0 6 8 6 11 a6 6 0 0 1 -12 0 c0 -3 6 -11 6 -11z" fill="${C.blue}"/>`).join("")}`);
  const cold = S(`<rect width="120" height="120" rx="16" fill="#E8F4FF"/>
    <g transform="translate(60 60)" stroke="#4A9FF5" stroke-width="6" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M0 -38 V38 M-10 -28 L0 -18 L10 -28 M-10 28 L0 18 L10 28" fill="none" transform="rotate(${a})"/>`).join("")}</g>`);
  const hot = S(`<rect width="120" height="120" rx="16" fill="#FFF0D6"/>${sun(36, 34, 16)}
    <g transform="translate(70 70)"><circle r="30" fill="${C.skin}"/><path d="M-30 -4 Q-30 -32 0 -32 Q30 -32 30 -4 Q22 -20 0 -20 Q-22 -20 -30 -4Z" fill="${C.hair}"/>
    <path d="M-14 -2 h8 M6 -2 h8" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M-10 12 Q0 4 10 12" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M24 -14 c0 0 6 8 6 11 a6 6 0 0 1 -12 0 c0 -3 6 -11 6 -11z" fill="${C.blue}"/></g>`);

  // ---------- clothes ----------
  const hat = S(`${shadow(44)}<ellipse cx="60" cy="84" rx="50" ry="14" fill="#E8473B"/><path d="M30 84 Q30 34 60 34 Q90 34 90 84Z" fill="${C.red}"/><rect x="30" y="68" width="60" height="10" fill="${C.yellow}"/>`);
  const coat = S(`${shadow(40)}<path d="M40 18 L60 26 L80 18 L104 34 L96 58 L86 54 L86 108 L34 108 L34 54 L24 58 L16 34Z" fill="${C.red}"/>
    <path d="M60 26 L60 108" stroke="#B8322A" stroke-width="3"/><path d="M40 18 L60 40 L80 18" fill="none" stroke="#B8322A" stroke-width="4" stroke-linejoin="round"/>
    ${[56, 72, 88].map((y) => `<circle cx="66" cy="${y}" r="3.5" fill="${C.yellow}"/>`).join("")}<rect x="38" y="76" width="14" height="10" rx="3" fill="#B8322A"/><rect x="70" y="76" width="14" height="10" rx="3" fill="#B8322A" opacity="0"/>`);
  const shoe = (x, col) => `<path d="M${x} 62 h20 v14 q20 2 26 12 q2 8 -6 8 h-40 q-4 0 -4 -4z" fill="${col}"/><path d="M${x} 92 h46" stroke="#fff" stroke-width="4"/><path d="M${x + 6} 72 l8 -4 M${x + 8} 80 l8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  const shoes = S(`${shadow(46)}<g transform="translate(-2 -14)">${shoe(14, C.blue)}</g><g transform="translate(46 4)">${shoe(14, C.blue)}</g>`);
  const tshirt = S(`${shadow(40)}<path d="M38 20 Q60 32 82 20 L108 36 L98 56 L86 50 L86 104 L34 104 L34 50 L22 56 L12 36Z" fill="${C.yellow}"/><path d="M46 22 Q60 36 74 22" fill="none" stroke="#E0A800" stroke-width="4"/>${heartPath(60, 66, 1.2, C.red)}`);

  // ---------- places & transport ----------
  const tree = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k || 1})"><rect x="-4" y="0" width="8" height="24" fill="${C.stem}"/><circle cy="-8" r="18" fill="${C.leaf}"/><circle cx="-12" cy="2" r="12" fill="#35995D"/><circle cx="12" cy="2" r="12" fill="#35995D"/></g>`;
  const park = S(`<rect width="120" height="120" rx="16" fill="#DFF1FF"/><path d="M0 84 Q60 70 120 84 V120 H0Z" fill="#9EDB8A"/>${tree(30, 62)}${tree(94, 66, .8)}
    <rect x="46" y="84" width="34" height="5" rx="2" fill="${C.brown}"/><rect x="46" y="76" width="34" height="5" rx="2" fill="${C.brown}"/><path d="M50 89 v10 M76 89 v10" stroke="${C.brown}" stroke-width="4"/>${sun(100, 20, 9)}`);
  const house = S(`${shadow(46)}<path d="M18 56 L60 18 L102 56Z" fill="${C.red}"/><rect x="26" y="54" width="68" height="52" fill="#FFE2B0"/><rect x="52" y="74" width="18" height="32" rx="3" fill="${C.brown}"/>
    <rect x="32" y="64" width="14" height="14" rx="2" fill="#CFE9FF"/><rect x="76" y="64" width="14" height="14" rx="2" fill="#CFE9FF"/><rect x="78" y="26" width="10" height="20" fill="${C.brown}"/>`);
  const school = S(`${shadow(50)}<rect x="14" y="46" width="92" height="60" fill="#FFD7A0"/><path d="M8 50 L60 18 L112 50Z" fill="${C.blue}"/>
    <circle cx="60" cy="38" r="9" fill="#fff"/><path d="M60 32 v6 l4 3" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="50" y="76" width="20" height="30" rx="3" fill="${C.purple}"/>${[22, 84].map((x) => `<rect x="${x}" y="58" width="14" height="14" rx="2" fill="#CFE9FF"/><rect x="${x}" y="80" width="14" height="14" rx="2" fill="#CFE9FF"/>`).join("")}
    <path d="M60 10 v-6 l10 3 l-10 3" fill="${C.red}" stroke="${C.ink}" stroke-width="1.5"/>`);
  const shop = S(`${shadow(50)}<rect x="16" y="44" width="88" height="62" fill="#fff" stroke="#E6D8BF" stroke-width="3"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${12 + i * 16} 30 h16 v14 a8 8 0 0 1 -16 0z" fill="${i % 2 ? "#fff" : C.green}" stroke="${C.green}" stroke-width="2"/>`).join("")}
    <rect x="26" y="62" width="36" height="26" rx="3" fill="#CFE9FF"/><circle cx="36" cy="80" r="6" fill="${C.red}"/><circle cx="50" cy="80" r="6" fill="${C.orange}"/>
    <rect x="70" y="62" width="24" height="44" rx="3" fill="${C.brown}"/><circle cx="88" cy="86" r="2.5" fill="${C.yellow}"/>`);
  const bus = S(`${shadow(50)}<rect x="10" y="30" width="100" height="60" rx="12" fill="${C.yellow}"/><rect x="10" y="74" width="100" height="6" fill="#E0A800"/>
    ${[18, 42, 66].map((x) => `<rect x="${x}" y="40" width="18" height="18" rx="3" fill="#CFE9FF"/>`).join("")}<rect x="90" y="40" width="14" height="30" rx="3" fill="#CFE9FF"/>
    <circle cx="32" cy="92" r="11" fill="${C.ink}"/><circle cx="32" cy="92" r="4.5" fill="#C7CCD8"/><circle cx="88" cy="92" r="11" fill="${C.ink}"/><circle cx="88" cy="92" r="4.5" fill="#C7CCD8"/>`);
  const bike = S(`${shadow(50)}${[30, 90].map((x) => `<circle cx="${x}" cy="80" r="20" fill="none" stroke="${C.ink}" stroke-width="5"/><circle cx="${x}" cy="80" r="3" fill="${C.ink}"/>`).join("")}
    <path d="M30 80 L50 52 L80 52 L90 80 M50 52 L60 80 L80 52 M60 80 L30 80" fill="none" stroke="${C.red}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M46 46 h12 M80 52 L76 38 h10" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`);

  // ---------- colours (paint splats like Level 1) ----------
  const splat = (col, stroke) => S(`${shadow(36)}<path d="M60 14 C74 14 76 26 88 26 C102 26 108 40 102 52 C98 60 108 66 104 78 C100 92 86 92 78 100 C70 108 52 108 44 100 C36 92 20 94 16 80 C12 68 22 60 18 50 C14 38 26 26 38 26 C48 26 48 14 60 14Z" fill="${col}"${stroke ? ` stroke="${stroke}" stroke-width="3"` : ""}/>
    <circle cx="104" cy="96" r="7" fill="${col}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ""}/><circle cx="16" cy="22" r="5" fill="${col}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ""}/><ellipse cx="44" cy="44" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 44 44)"/>`);

  // ---------- big & small ----------
  const ballSvg = A["ball"];
  const sized = (k) => S(`${shadow(32 * k)}<g transform="translate(60 62) scale(${k}) translate(-60 -62)">${ballSvg.replace(/^<svg[^>]*>|<\/svg>$/g, "").replace(/<ellipse cx="60" cy="110"[^>]*\/>/, "")}</g>`);

  const like = (svg) => svg.replace("</svg>", badgeHeart + "</svg>");
  Object.assign(A, {
    "fox": S(fox), "mouse": S(mouse), "friends": S(friends),
    "six": tile(6, "#E8668A"), "seven": tile(7, "#2BA59B"), "eight": tile(8, C.orange), "nine": tile(9, "#5B6BD9"), "ten": tile(10, C.green),
    "swim": swim, "dance": dance, "sing": sing, "fly": fly,
    "ice cream": S(iceCream), "I like ice cream": like(S(iceCream)), "cake": S(cake),
    "box": plainBox, "in": inBox, "on": onBox, "under": underBox, "table": S(`${shadow(46)}${table}`),
    "sunny": sunny, "rainy": rainy, "cold": cold, "hot": hot,
    "hat": hat, "coat": coat, "shoes": shoes, "T-shirt": tshirt,
    "park": park, "house": house, "home": house, "school": school, "shop": shop, "bus": bus, "bike": bike,
    "pink": splat(C.pink), "purple": splat(C.purple), "black": splat("#2E2E3A"), "white": splat("#FFFFFF", "#D9D2C4"),
    "big": sized(1.15), "small": sized(.45), "big ball": sized(1.15), "small ball": sized(.45),
    "a white cat": S(K.cat("#F4F1EA", "#7CC2FF"))
  });
})();

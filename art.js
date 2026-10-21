/* Hello Fox! — drawn pictures for the word cards (flat style, same palette as the fox).
   window.ART[word] = inline SVG string. Words without a drawing fall back to their emoji. */
(function () {
  "use strict";
  const C = { ink: "#1E2742", red: "#E8473B", orange: "#F4862C", yellow: "#FFD23F", green: "#3FAE6B", blue: "#4A9FF5",
    purple: "#8E5BD9", brown: "#8A5A35", pink: "#FF8FA3", grey: "#9AA3B5", white: "#FFFFFF", cream: "#FFF6EC",
    skin: "#9A5B34", skinD: "#7A4426", hair: "#2B1D16", leaf: "#3FAE6B", stem: "#7A4B2A" };
  const S = (inner) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const shadow = (rx) => `<ellipse cx="60" cy="110" rx="${rx || 32}" ry="5" fill="#1E2742" opacity=".08"/>`;
  const txt = (x, y, s, size, fill, w) => `<text x="${x}" y="${y}" font-family="Fredoka, Nunito, sans-serif" font-weight="${w || 700}" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
  const heartPath = (x, y, k, fill) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 -6 C-3 -14 -16 -12 -14 -2 C-12 6 0 12 0 14 C0 12 12 6 14 -2 C16 -12 3 -14 0 -6Z" fill="${fill || C.red}"/>`;
  const badgeHeart = `<circle cx="96" cy="24" r="16" fill="#fff"/>${heartPath(96, 23, 0.85)}`;

  // ---------- faces & people ----------
  function hairFor(style) {
    switch (style) {
      case "puffs": return `<circle cx="30" cy="36" r="14" fill="${C.hair}"/><circle cx="90" cy="36" r="14" fill="${C.hair}"/><path d="M28 58 Q30 24 60 24 Q90 24 92 58 Q82 40 60 40 Q38 40 28 58Z" fill="${C.hair}"/>`;
      case "short": return `<path d="M27 60 Q28 24 60 24 Q92 24 93 60 Q84 38 60 38 Q36 38 27 60Z" fill="${C.hair}"/>`;
      case "bun": return `<circle cx="60" cy="22" r="12" fill="${C.hair}"/><path d="M26 74 Q22 26 60 26 Q98 26 94 74 Q88 42 60 42 Q32 42 26 74Z" fill="${C.hair}"/>`;
      case "pigtails": return `<circle cx="22" cy="58" r="11" fill="${C.hair}"/><circle cx="98" cy="58" r="11" fill="${C.hair}"/><circle cx="29" cy="52" r="4" fill="${C.pink}"/><circle cx="91" cy="52" r="4" fill="${C.pink}"/><path d="M28 60 Q30 24 60 24 Q90 24 92 60 Q82 38 60 38 Q38 38 28 60Z" fill="${C.hair}"/>`;
      default: return "";
    }
  }
  function eyesFor(kind) {
    if (kind === "happy") return `<path d="M42 62 Q48 55 54 62" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M66 62 Q72 55 78 62" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    if (kind === "sleepy") return `<path d="M42 62 Q48 66 54 62" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M66 62 Q72 66 78 62" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    return `<circle cx="48" cy="61" r="5" fill="${C.ink}"/><circle cx="72" cy="61" r="5" fill="${C.ink}"/><circle cx="49.5" cy="59" r="1.6" fill="#fff"/><circle cx="73.5" cy="59" r="1.6" fill="#fff"/>`;
  }
  function mouthFor(kind) {
    switch (kind) {
      case "big": return `<path d="M46 76 Q60 96 74 76 Z" fill="#7A2318"/><path d="M52 84 Q60 92 68 84 Q60 88 52 84Z" fill="${C.pink}"/>`;
      case "sad": return `<path d="M48 86 Q60 76 72 86" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
      case "flat": return `<path d="M51 82 L69 82" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
      case "tongue": return `<path d="M46 76 Q60 94 74 76 Z" fill="#7A2318"/><ellipse cx="67" cy="85" rx="7" ry="6" fill="${C.pink}"/>`;
      case "o": return `<ellipse cx="60" cy="82" rx="6" ry="7" fill="#7A2318"/>`;
      default: return `<path d="M48 78 Q60 90 72 78" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    }
  }
  // A child's face filling the card (feelings)
  const face = (o) => `<circle cx="60" cy="64" r="34" fill="${o.skin || C.skin}"/>${hairFor(o.hair || "puffs")}
    ${eyesFor(o.eyes)}<circle cx="40" cy="74" r="5" fill="${C.pink}" opacity=".45"/><circle cx="80" cy="74" r="5" fill="${C.pink}" opacity=".45"/>${mouthFor(o.mouth)}${o.extra || ""}`;
  // A person: head + shoulders, scaled into the card
  const person = (o) => `<path d="M24 118 Q26 90 60 90 Q94 90 96 118Z" fill="${o.shirt || C.blue}"/>
    <g transform="translate(60 52) scale(.78) translate(-60 -64)">${face(o)}${o.beard ? `<path d="M34 76 Q60 108 86 76 Q80 98 60 100 Q40 98 34 76Z" fill="${C.hair}"/>` : ""}${o.earrings ? `<circle cx="27" cy="76" r="4" fill="${C.yellow}"/><circle cx="93" cy="76" r="4" fill="${C.yellow}"/>` : ""}</g>`;
  const kid = (extra, o) => person(Object.assign({ hair: "puffs", shirt: C.purple, mouth: "smile" }, o || {})) + (extra || "");
  const bubble = (inner, x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 h40 a10 10 0 0 1 10 10 v18 a10 10 0 0 1 -10 10 h-24 l-8 8 v-8 h-8 a10 10 0 0 1 -10 -10 v-18 a10 10 0 0 1 10 -10z" fill="#fff" stroke="#E6D8BF" stroke-width="2"/>${inner}</g>`;

  // ---------- hands ----------
  const palm = (fill) => `<rect x="-17" y="-36" width="34" height="38" rx="13" fill="${fill}"/>
    <rect x="-17" y="-62" width="9" height="30" rx="4.5" fill="${fill}"/><rect x="-7" y="-68" width="9" height="36" rx="4.5" fill="${fill}"/>
    <rect x="3" y="-66" width="9" height="34" rx="4.5" fill="${fill}"/><rect x="12" y="-58" width="8" height="26" rx="4" fill="${fill}"/>
    <rect x="14" y="-30" width="9" height="24" rx="4.5" fill="${fill}" transform="rotate(-40 18 -18)"/>`;
  const hand = (x, y, rot, k, fill) => `<g transform="translate(${x} ${y}) rotate(${rot || 0}) scale(${k || 1})">${palm(fill || C.skin)}</g>`;
  const thumb = (down) => `<g transform="translate(60 64) ${down ? "rotate(180)" : ""}">
    <rect x="-24" y="-8" width="44" height="36" rx="14" fill="${C.skin}"/>
    <rect x="-18" y="-2" width="34" height="5" rx="2.5" fill="${C.skinD}" opacity=".35"/><rect x="-18" y="8" width="34" height="5" rx="2.5" fill="${C.skinD}" opacity=".35"/><rect x="-18" y="18" width="30" height="5" rx="2.5" fill="${C.skinD}" opacity=".35"/>
    <rect x="-22" y="-42" width="15" height="44" rx="7.5" fill="${C.skin}"/></g>`;
  const motion = `<path d="M92 30 Q100 40 96 52" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/><path d="M100 22 Q112 38 106 56" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;

  // ---------- figures (actions) ----------
  const fig = (o) => {
    const s = C.skin, sh = o.shirt || C.orange, pa = o.pants || C.blue;
    const limb = (d, col, w) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w || 9}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `${o.ground === false ? "" : shadow(26)}${o.before || ""}
      ${limb(o.legL, pa)}${limb(o.legR, pa)}
      <rect x="${o.bx || 46}" y="${o.by || 44}" width="28" height="34" rx="11" fill="${sh}" transform="rotate(${o.br || 0} ${(o.bx || 46) + 14} ${(o.by || 44) + 17})"/>
      ${limb(o.armL, s, 8)}${limb(o.armR, s, 8)}
      <circle cx="${o.hx || 60}" cy="${o.hy || 30}" r="15" fill="${s}"/><path d="M${(o.hx || 60) - 15} ${(o.hy || 30) - 2} Q${o.hx || 60} ${(o.hy || 30) - 24} ${(o.hx || 60) + 15} ${(o.hy || 30) - 2} Q${o.hx || 60} ${(o.hy || 30) - 10} ${(o.hx || 60) - 15} ${(o.hy || 30) - 2}Z" fill="${C.hair}"/>
      <circle cx="${(o.hx || 60) - 5}" cy="${(o.hy || 30) + 1}" r="2" fill="${C.ink}"/><circle cx="${(o.hx || 60) + 5}" cy="${(o.hy || 30) + 1}" r="2" fill="${C.ink}"/>
      <path d="M${(o.hx || 60) - 5} ${(o.hy || 30) + 7} Q${o.hx || 60} ${(o.hy || 30) + 11} ${(o.hx || 60) + 5} ${(o.hy || 30) + 7}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>${o.after || ""}`;
  };

  // ---------- animals ----------
  const cat = (fur, eye) => `${shadow()}<path d="M28 44 L34 14 L54 34 Z" fill="${fur}"/><path d="M92 44 L86 14 L66 34 Z" fill="${fur}"/>
    <path d="M34 34 L37 22 L47 32Z" fill="${C.pink}" opacity=".7"/><path d="M86 34 L83 22 L73 32Z" fill="${C.pink}" opacity=".7"/>
    <ellipse cx="60" cy="66" rx="40" ry="36" fill="${fur}"/><ellipse cx="60" cy="80" rx="20" ry="13" fill="#fff" opacity=".85"/>
    <ellipse cx="45" cy="60" rx="7" ry="9" fill="${eye || "#9BD35A"}"/><ellipse cx="75" cy="60" rx="7" ry="9" fill="${eye || "#9BD35A"}"/>
    <ellipse cx="45" cy="61" rx="2.5" ry="7" fill="${C.ink}"/><ellipse cx="75" cy="61" rx="2.5" ry="7" fill="${C.ink}"/>
    <path d="M55 73 h10 l-5 6 z" fill="${C.pink}"/><path d="M60 79 q-5 6 -10 3 M60 79 q5 6 10 3" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M20 72 h18 M22 80 l16 -4 M100 72 h-18 M98 80 l-16 -4" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
  const dog = (fur, ear) => `${shadow()}<ellipse cx="60" cy="64" rx="36" ry="38" fill="${fur}"/>
    <ellipse cx="24" cy="58" rx="12" ry="26" fill="${ear}" transform="rotate(18 24 58)"/><ellipse cx="96" cy="58" rx="12" ry="26" fill="${ear}" transform="rotate(-18 96 58)"/>
    <ellipse cx="60" cy="82" rx="22" ry="17" fill="#F3DCC0"/><circle cx="46" cy="56" r="5.5" fill="${C.ink}"/><circle cx="74" cy="56" r="5.5" fill="${C.ink}"/>
    <circle cx="47.5" cy="54" r="1.8" fill="#fff"/><circle cx="75.5" cy="54" r="1.8" fill="#fff"/><ellipse cx="60" cy="73" rx="9" ry="6.5" fill="${C.ink}"/>
    <path d="M60 79 v5 M52 86 q8 6 16 0" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M56 88 q4 10 8 0z" fill="${C.pink}"/>`;
  const bird = (body) => `${shadow(24)}<path d="M76 92 l-4 14 M66 92 l2 14" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 64 Q12 50 18 34 Q30 48 44 52Z" fill="${body}" opacity=".85"/><ellipse cx="66" cy="66" rx="34" ry="30" fill="${body}"/>
    <ellipse cx="70" cy="76" rx="20" ry="14" fill="#fff" opacity=".7"/><path d="M50 62 Q62 80 78 66 Q66 70 50 62Z" fill="#000" opacity=".12"/>
    <circle cx="80" cy="54" r="5" fill="${C.ink}"/><circle cx="81.5" cy="52.5" r="1.6" fill="#fff"/><path d="M96 58 l16 4 l-16 6z" fill="${C.orange}"/>`;
  const lion = (face) => `${shadow()}<g fill="#C9621A">${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<circle cx="${(60 + Math.cos(a) * 36).toFixed(1)}" cy="${(62 + Math.sin(a) * 36).toFixed(1)}" r="14"/>`; }).join("")}</g>
    <circle cx="60" cy="62" r="40" fill="#C9621A"/><circle cx="60" cy="64" r="30" fill="${face}"/>
    <circle cx="36" cy="38" r="7" fill="${face}"/><circle cx="84" cy="38" r="7" fill="${face}"/>
    <circle cx="49" cy="58" r="4.5" fill="${C.ink}"/><circle cx="71" cy="58" r="4.5" fill="${C.ink}"/><ellipse cx="60" cy="78" rx="12" ry="9" fill="#FFF0C8"/>
    <path d="M54 70 h12 l-6 6z" fill="#7A3A12"/><path d="M60 76 v4 M53 83 q7 5 14 0" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`;

  // ---------- fruit & food ----------
  const apple = `${shadow(30)}<path d="M60 38 C40 26 16 38 18 66 C20 92 42 108 60 98 C78 108 100 92 102 66 C104 38 80 26 60 38Z" fill="${C.red}"/>
    <path d="M60 38 C60 28 62 20 66 14" fill="none" stroke="${C.stem}" stroke-width="5" stroke-linecap="round"/><path d="M66 24 C74 12 90 12 94 18 C86 28 74 30 66 24Z" fill="${C.leaf}"/>
    <ellipse cx="38" cy="60" rx="7" ry="12" fill="#fff" opacity=".35"/>`;
  const banana = `${shadow(32)}<path d="M20 36 C26 86 76 104 106 70 C96 72 70 82 50 64 C38 53 32 42 34 30Z" fill="${C.yellow}" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/>
    <path d="M20 36 L28 26 L34 30" fill="${C.stem}" stroke="${C.stem}" stroke-width="4" stroke-linejoin="round"/><path d="M42 56 C56 74 80 78 96 72" fill="none" stroke="#E0A800" stroke-width="3" stroke-linecap="round" opacity=".6"/>`;
  const car = (col) => `${shadow(46)}<path d="M14 78 Q14 62 28 60 L40 40 Q44 34 52 34 L78 34 Q86 34 90 40 L100 58 Q110 60 110 72 L110 84 Q110 88 106 88 L18 88 Q14 88 14 84Z" fill="${col}"/>
    <path d="M46 42 L42 58 L64 58 L64 42Z M70 42 L70 58 L94 58 L86 44 Q84 42 80 42Z" fill="#CFE9FF"/>
    <circle cx="36" cy="90" r="12" fill="${C.ink}"/><circle cx="36" cy="90" r="5" fill="#C7CCD8"/><circle cx="88" cy="90" r="12" fill="${C.ink}"/><circle cx="88" cy="90" r="5" fill="#C7CCD8"/>
    <rect x="102" y="66" width="8" height="6" rx="2" fill="${C.yellow}"/>`;
  const frog = `${shadow()}<ellipse cx="60" cy="72" rx="42" ry="32" fill="${C.green}"/><circle cx="38" cy="44" r="16" fill="${C.green}"/><circle cx="82" cy="44" r="16" fill="${C.green}"/>
    <circle cx="38" cy="44" r="10" fill="#fff"/><circle cx="82" cy="44" r="10" fill="#fff"/><circle cx="40" cy="45" r="5" fill="${C.ink}"/><circle cx="80" cy="45" r="5" fill="${C.ink}"/>
    <path d="M34 76 Q60 98 86 76" fill="none" stroke="#1F6B3E" stroke-width="4" stroke-linecap="round"/><circle cx="30" cy="70" r="6" fill="${C.pink}" opacity=".5"/><circle cx="90" cy="70" r="6" fill="${C.pink}" opacity=".5"/>`;
  const water = `${shadow(24)}<path d="M32 26 L88 26 L80 104 Q79 108 75 108 L45 108 Q41 108 40 104Z" fill="#E8F4FF" stroke="#B9D9F5" stroke-width="3"/>
    <path d="M36 54 L84 54 L79 102 Q78 104 75 104 L45 104 Q42 104 41 102Z" fill="#7CC2FF"/><path d="M44 62 L46 96" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>
    <path d="M94 30 C94 30 104 44 104 50 A10 10 0 0 1 84 50 C84 44 94 30 94 30Z" fill="${C.blue}"/>`;

  const art = {
    // greetings & phrases
    "hello": S(`${hand(70, 98, -14, 1)}${motion}${bubble(txt(24, 25, "hi!", 18, C.orange), 13, 6)}`),
    "goodbye": S(`${hand(64, 98, 14, 1)}<path d="M28 36 Q18 46 22 58 M20 28 Q8 44 14 62" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>${bubble(txt(24, 25, "bye!", 16, C.purple), 66, 4)}`),
    "yes": S(`${shadow(28)}${thumb(false)}<circle cx="98" cy="24" r="14" fill="${C.green}"/><path d="M91 24 l5 5 l9 -10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`),
    "no": S(`${shadow(28)}${thumb(true)}<circle cx="98" cy="24" r="14" fill="${C.red}"/><path d="M92 18 l12 12 M104 18 l-12 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
    "name": S(`${shadow(40)}<rect x="12" y="26" width="96" height="70" rx="12" fill="#fff" stroke="#E6D8BF" stroke-width="3"/><path d="M12 38 a12 12 0 0 1 12 -12 h72 a12 12 0 0 1 12 12 v14 h-96z" fill="${C.red}"/>
      ${txt(60, 47, "HELLO", 16, "#fff")}<path d="M28 76 h64" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M30 72 q8 -12 14 0 q6 -12 12 0 q6 -10 12 0 q6 -8 12 0" fill="none" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`),
    "my": S(kid(`<path d="M104 24 Q110 60 80 92" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/><path d="M76 84 l4 10 l10 -4" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`)),
    "your": S(`<g transform="translate(-22 0)">${kid("", { shirt: C.grey })}</g><circle cx="88" cy="58" r="26" fill="#FFF1D6" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 5"/>
      <g transform="translate(88 58) scale(.42) translate(-60 -64)">${face({ hair: "short", mouth: "smile", skin: "#C68642" })}</g><path d="M48 94 Q66 104 80 86" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/><path d="M74 84 l7 1 l-1 7" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`),
    "What's your name?": S(`<g transform="translate(-14 6)">${kid()}</g>${bubble(txt(24, 30, "?", 26, C.purple), 64, 4)}`),
    "My name is …": S(`<g transform="translate(-14 6)">${kid()}</g>${bubble(`<path d="M8 14 h32 M8 24 h22" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`, 64, 4)}`),
    "I am six": S(`<g transform="translate(-14 6)">${kid()}</g><path d="M92 62 q-4 20 -10 40" fill="none" stroke="${C.grey}" stroke-width="2"/><ellipse cx="92" cy="38" rx="20" ry="24" fill="${C.pink}"/><path d="M88 61 h8 l-4 5z" fill="${C.pink}"/>${txt(92, 48, "6", 30, "#fff")}`),
    // feelings
    "happy": S(face({ eyes: "happy", mouth: "big" })),
    "sad": S(face({ mouth: "sad", extra: `<path d="M78 66 C78 66 84 76 84 79 A6 6 0 0 1 72 79 C72 76 78 66 78 66Z" fill="${C.blue}"/>` })),
    "tired": S(face({ eyes: "sleepy", mouth: "flat", extra: `${txt(98, 30, "z", 20, C.purple)}${txt(108, 16, "z", 14, C.purple)}` })),
    "good": S(face({ mouth: "smile" })),
    "yummy": S(face({ eyes: "happy", mouth: "tongue" })),
    // numbers
    ...Object.fromEntries([["one", 1, C.red], ["two", 2, C.orange], ["three", 3, C.green], ["four", 4, C.blue], ["five", 5, C.purple]].map(([w, n, col]) => [w,
      S(`<rect x="18" y="12" width="84" height="84" rx="22" fill="${col}"/>${txt(60, 76, String(n), 60, "#fff")}
        ${Array.from({ length: n }, (_, i) => `<circle cx="${60 - (n - 1) * 8 + i * 16}" cy="108" r="6" fill="${col}"/>`).join("")}`)])),
    // colours (paint splats)
    ...Object.fromEntries([["red", C.red], ["blue", C.blue], ["yellow", C.yellow], ["green", C.green]].map(([w, col]) => [w,
      S(`${shadow(36)}<path d="M60 14 C74 14 76 26 88 26 C102 26 108 40 102 52 C98 60 108 66 104 78 C100 92 86 92 78 100 C70 108 52 108 44 100 C36 92 20 94 16 80 C12 68 22 60 18 50 C14 38 26 26 38 26 C48 26 48 14 60 14Z" fill="${col}"/>
        <circle cx="104" cy="96" r="7" fill="${col}"/><circle cx="16" cy="22" r="5" fill="${col}"/><ellipse cx="44" cy="44" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 44 44)"/>`)])),
    // animals
    "cat": S(cat("#F2A65A")),
    "dog": S(dog("#C98B55", "#8A5A35")),
    "fish": S(`${shadow(34)}<path d="M92 60 L114 38 L112 82Z" fill="${C.orange}"/><ellipse cx="58" cy="60" rx="40" ry="28" fill="${C.orange}"/>
      <path d="M50 34 Q60 22 72 34Z" fill="#E06A12"/><path d="M42 64 Q52 74 62 64" fill="none" stroke="#E06A12" stroke-width="3"/><circle cx="34" cy="54" r="7" fill="#fff"/><circle cx="33" cy="54" r="4" fill="${C.ink}"/>
      <circle cx="16" cy="40" r="4" fill="none" stroke="${C.blue}" stroke-width="2"/><circle cx="10" cy="28" r="3" fill="none" stroke="${C.blue}" stroke-width="2"/>`),
    "bird": S(bird(C.blue)),
    "rabbit": S(`${shadow()}<ellipse cx="44" cy="30" rx="10" ry="28" fill="#E8E4EE"/><ellipse cx="76" cy="30" rx="10" ry="28" fill="#E8E4EE"/><ellipse cx="44" cy="32" rx="5" ry="20" fill="${C.pink}" opacity=".7"/><ellipse cx="76" cy="32" rx="5" ry="20" fill="${C.pink}" opacity=".7"/>
      <ellipse cx="60" cy="76" rx="34" ry="30" fill="#F2EFF6"/><circle cx="47" cy="70" r="5" fill="${C.ink}"/><circle cx="73" cy="70" r="5" fill="${C.ink}"/><ellipse cx="60" cy="82" rx="6" ry="4" fill="${C.pink}"/>
      <rect x="55" y="88" width="5" height="8" rx="1.5" fill="#fff" stroke="#D8D2E0"/><rect x="60" y="88" width="5" height="8" rx="1.5" fill="#fff" stroke="#D8D2E0"/>`),
    "duck": S(`${shadow(36)}<ellipse cx="62" cy="80" rx="40" ry="24" fill="${C.yellow}"/><path d="M84 74 Q100 64 104 52 Q106 76 84 86Z" fill="#F5C518"/><circle cx="42" cy="46" r="22" fill="${C.yellow}"/>
      <path d="M20 46 Q6 46 4 52 Q14 58 24 54Z" fill="${C.orange}"/><circle cx="40" cy="40" r="4.5" fill="${C.ink}"/><path d="M52 80 Q66 92 80 80" fill="none" stroke="#E0A800" stroke-width="3" stroke-linecap="round"/>`),
    "lion": S(lion("#F6C65B")),
    "elephant": S(`${shadow()}<ellipse cx="24" cy="56" rx="22" ry="28" fill="#A9B4C8"/><ellipse cx="96" cy="56" rx="22" ry="28" fill="#A9B4C8"/><ellipse cx="24" cy="56" rx="13" ry="18" fill="${C.pink}" opacity=".45"/><ellipse cx="96" cy="56" rx="13" ry="18" fill="${C.pink}" opacity=".45"/>
      <ellipse cx="60" cy="56" rx="30" ry="32" fill="#BCC6D8"/><path d="M52 74 Q48 96 58 106 Q66 112 70 104 Q60 98 64 76Z" fill="#BCC6D8"/><circle cx="48" cy="52" r="4.5" fill="${C.ink}"/><circle cx="72" cy="52" r="4.5" fill="${C.ink}"/>
      <circle cx="40" cy="64" r="5" fill="${C.pink}" opacity=".45"/><circle cx="80" cy="64" r="5" fill="${C.pink}" opacity=".45"/>`),
    "frog": S(frog),
    // fruit & food
    "apple": S(apple),
    "banana": S(banana),
    "orange": S(`${shadow(32)}<circle cx="60" cy="66" r="40" fill="#FF9A2E"/><circle cx="46" cy="56" r="2.5" fill="#E07A14"/><circle cx="70" cy="80" r="2.5" fill="#E07A14"/><circle cx="78" cy="58" r="2.5" fill="#E07A14"/><circle cx="52" cy="84" r="2.5" fill="#E07A14"/>
      <path d="M60 26 C66 16 80 14 86 18 C80 28 68 30 60 26Z" fill="${C.leaf}"/><ellipse cx="44" cy="52" rx="7" ry="11" fill="#fff" opacity=".3"/>`),
    "grapes": S(`${shadow(28)}<path d="M60 30 C60 22 64 16 70 12" fill="none" stroke="${C.stem}" stroke-width="5" stroke-linecap="round"/><path d="M64 22 C72 12 88 12 92 18 C84 28 72 28 64 22Z" fill="${C.leaf}"/>
      <circle cx="44" cy="44" r="13" fill="${C.purple}"/><circle cx="68" cy="44" r="13" fill="${C.purple}"/><circle cx="90" cy="46" r="11" fill="#9D6EE3"/><circle cx="54" cy="66" r="13" fill="#7A47C8"/><circle cx="78" cy="66" r="13" fill="${C.purple}"/>
      <circle cx="64" cy="88" r="13" fill="#7A47C8"/><circle cx="42" cy="86" r="10" fill="#9D6EE3"/>`),
    "bread": S(`${shadow(38)}<path d="M16 54 Q16 26 60 26 Q104 26 104 54 Q104 64 96 66 L96 98 Q96 104 90 104 L30 104 Q24 104 24 98 L24 66 Q16 64 16 54Z" fill="#D9934A"/>
      <path d="M26 56 Q26 36 60 36 Q94 36 94 56 Q94 62 88 64 L88 94 L32 94 L32 64 Q26 62 26 56Z" fill="#F7DBA7"/><circle cx="48" cy="62" r="2" fill="#E3B877"/><circle cx="70" cy="74" r="2" fill="#E3B877"/><circle cx="56" cy="82" r="2" fill="#E3B877"/>`),
    "milk": S(`${shadow(26)}<path d="M36 40 L46 20 L74 20 L84 40 L84 104 Q84 108 80 108 L40 108 Q36 108 36 104Z" fill="#fff" stroke="#D7E3F0" stroke-width="3"/><path d="M46 20 L74 20 L84 40 L36 40Z" fill="${C.blue}"/>
      <rect x="36" y="58" width="48" height="28" fill="#CFE6FF"/>${txt(60, 78, "MILK", 13, C.blue, 800)}<ellipse cx="50" cy="96" rx="5" ry="3" fill="${C.ink}" opacity=".12"/>`),
    "water": S(water),
    "egg": S(`${shadow(28)}<path d="M60 14 C82 14 96 50 96 72 C96 96 80 108 60 108 C40 108 24 96 24 72 C24 50 38 14 60 14Z" fill="#FBF3E4" stroke="#E8DCC6" stroke-width="3"/><ellipse cx="46" cy="52" rx="7" ry="12" fill="#fff"/>`),
    // café
    "please": S(`${shadow(24)}<g transform="translate(58 100) rotate(8)">${palm(C.skin)}</g><g transform="translate(62 100) rotate(-8) scale(-1 1)">${palm(C.skinD)}</g>
      <path d="M20 34 l6 4 M14 52 l8 1 M100 34 l-6 4 M106 52 l-8 1" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/>`),
    "thank you": S(`${shadow(30)}${heartPath(60, 58, 3.2, C.red)}<path d="M40 40 Q46 32 54 36" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>
      <path d="M100 20 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z" fill="${C.yellow}"/><path d="M20 84 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="${C.yellow}"/>`),
    "here you are": S(`${shadow(36)}<path d="M38 36 h44 l-4 40 q-1 8 -9 8 h-18 q-8 0 -9 -8z" fill="#fff" stroke="#E6D8BF" stroke-width="3"/><path d="M82 46 q14 0 12 14 q-2 12 -14 10" fill="none" stroke="#E6D8BF" stroke-width="5"/>
      <path d="M44 22 q4 -6 0 -12 M56 22 q4 -6 0 -12 M68 22 q4 -6 0 -12" fill="none" stroke="${C.grey}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      <path d="M10 92 Q30 74 56 86 L60 100 Q34 104 10 104Z" fill="${C.skin}"/><path d="M110 92 Q90 74 64 86 L60 100 Q86 104 110 104Z" fill="${C.skinD}"/>`),
    // family (warm brown skin tones)
    "mum": S(person({ hair: "bun", shirt: C.red, earrings: true, mouth: "smile" })),
    "dad": S(person({ hair: "short", shirt: C.blue, beard: true, mouth: "smile", skin: "#7E4A2A" })),
    "sister": S(`<g transform="translate(0 6)">${person({ hair: "pigtails", shirt: C.pink, mouth: "big", skin: "#A8673F" })}</g>`),
    "brother": S(`<g transform="translate(0 6)">${person({ hair: "short", shirt: C.green, mouth: "big", skin: "#8E5634" })}</g>`),
    // body
    "head": S(`<circle cx="60" cy="58" r="48" fill="none" stroke="${C.orange}" stroke-width="4" stroke-dasharray="8 7"/>${person({ hair: "puffs", shirt: C.purple })}`),
    "eyes": S(`<g transform="translate(34 60)"><path d="M-24 0 Q0 -24 24 0 Q0 24 -24 0Z" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle r="10" fill="#6B3E1F"/><circle r="5" fill="${C.ink}"/><circle cx="3" cy="-3" r="2.5" fill="#fff"/></g>
      <g transform="translate(86 60)"><path d="M-24 0 Q0 -24 24 0 Q0 24 -24 0Z" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle r="10" fill="#6B3E1F"/><circle r="5" fill="${C.ink}"/><circle cx="3" cy="-3" r="2.5" fill="#fff"/></g>
      <path d="M12 34 q22 -12 44 -2 M64 32 q22 -10 44 2" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>`),
    "nose": S(`<circle cx="60" cy="62" r="46" fill="${C.skin}"/><path d="M56 30 Q52 60 40 72 Q44 86 60 86 Q76 86 80 72 Q68 60 64 30Z" fill="${C.skinD}"/><ellipse cx="50" cy="78" rx="5" ry="4" fill="#4A2412"/><ellipse cx="70" cy="78" rx="5" ry="4" fill="#4A2412"/>`),
    "mouth": S(`<circle cx="60" cy="62" r="46" fill="${C.skin}"/><path d="M28 62 Q44 46 60 54 Q76 46 92 62 Q76 88 60 86 Q44 88 28 62Z" fill="#C2413A"/><path d="M34 62 Q60 70 86 62 Q60 76 34 62Z" fill="#7A2318"/><path d="M40 63 h40" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),
    "hands": S(`${hand(38, 100, -12, 0.95, C.skin)}${hand(82, 100, 12, 0.95, C.skinD)}`),
    "feet": S(`${shadow(40)}${[30, 82].map((x, i) => `<g transform="translate(${x} 62) scale(${i ? -1 : 1} 1)"><path d="M-14 -28 Q-18 10 -12 34 Q0 46 14 34 Q18 10 12 -28 Q0 -36 -14 -28Z" fill="${C.skin}"/>
      ${[[-12, -34, 6], [-3, -38, 5], [5, -37, 4.5], [11, -32, 4], [15, -26, 3.5]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${C.skin}"/>`).join("")}</g>`).join("")}`),
    // toys
    "ball": S(`${shadow(32)}<circle cx="60" cy="62" r="42" fill="#fff" stroke="#E6D8BF" stroke-width="3"/><path d="M60 20 A42 42 0 0 1 102 62 L60 62Z" fill="${C.red}"/><path d="M60 104 A42 42 0 0 1 18 62 L60 62Z" fill="${C.blue}"/>
      <path d="M18 62 A42 42 0 0 1 60 20 L60 62Z" fill="${C.yellow}"/><circle cx="60" cy="62" r="8" fill="#fff"/><ellipse cx="40" cy="40" rx="8" ry="5" fill="#fff" opacity=".5" transform="rotate(-40 40 40)"/>`),
    "doll": S(`${shadow(28)}<path d="M36 108 L48 62 L72 62 L84 108Z" fill="${C.pink}"/><path d="M48 62 L72 62 L68 74 L52 74Z" fill="#fff" opacity=".5"/>
      <circle cx="60" cy="40" r="20" fill="#B9774A"/><path d="M38 44 Q36 16 60 16 Q84 16 82 44 Q78 26 60 26 Q42 26 38 44Z" fill="#5A2E14"/><circle cx="38" cy="46" r="7" fill="#5A2E14"/><circle cx="82" cy="46" r="7" fill="#5A2E14"/>
      <circle cx="53" cy="42" r="2.5" fill="${C.ink}"/><circle cx="67" cy="42" r="2.5" fill="${C.ink}"/><path d="M54 49 q6 5 12 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/><circle cx="60" cy="18" r="6" fill="${C.yellow}"/>`),
    "book": S(`${shadow(46)}<path d="M60 30 Q40 18 12 24 L12 96 Q40 90 60 102 Z" fill="#fff" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/><path d="M60 30 Q80 18 108 24 L108 96 Q80 90 60 102 Z" fill="#fff" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M22 42 q16 -4 30 2 M22 56 q16 -4 30 2 M22 70 q16 -4 30 2 M68 44 q16 -6 30 -2 M68 58 q16 -6 30 -2" fill="none" stroke="#C7CCD8" stroke-width="3" stroke-linecap="round"/><circle cx="84" cy="76" r="8" fill="${C.orange}"/>`),
    "teddy": S(`${shadow(32)}<circle cx="30" cy="34" r="16" fill="#A86B3C"/><circle cx="90" cy="34" r="16" fill="#A86B3C"/><circle cx="30" cy="34" r="8" fill="#E2B485"/><circle cx="90" cy="34" r="8" fill="#E2B485"/>
      <circle cx="60" cy="64" r="40" fill="#A86B3C"/><ellipse cx="60" cy="78" rx="18" ry="14" fill="#E2B485"/><circle cx="46" cy="56" r="5" fill="${C.ink}"/><circle cx="74" cy="56" r="5" fill="${C.ink}"/>
      <ellipse cx="60" cy="72" rx="7" ry="5" fill="${C.ink}"/><path d="M60 77 v4 M53 83 q7 5 14 0" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`),
    // actions
    "jump": S(fig({ by: 40, hy: 24, legL: "M54 74 L46 88 L52 96", legR: "M66 74 L74 88 L68 96", armL: "M48 50 L34 30", armR: "M72 50 L86 30",
      before: `<path d="M36 110 h48" stroke="#1E2742" stroke-width="3" stroke-linecap="round" opacity=".15"/>`, after: `<path d="M24 92 v10 M96 92 v10 M30 82 v6 M90 82 v6" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>` })),
    "run": S(fig({ bx: 46, by: 42, br: 12, hx: 64, hy: 28, legL: "M56 74 L40 86 L30 82", legR: "M66 74 L76 94 L90 96", armL: "M52 52 L36 60", armR: "M70 50 L84 38",
      before: `<path d="M8 54 h18 M4 66 h20 M10 78 h14" stroke="${C.blue}" stroke-width="4" stroke-linecap="round" opacity=".5"/>` })),
    "sit down": S(`${shadow(30)}<rect x="30" y="70" width="54" height="10" rx="4" fill="${C.brown}"/><rect x="74" y="30" width="10" height="50" rx="4" fill="${C.brown}"/><path d="M36 80 v28 M78 80 v28" stroke="${C.brown}" stroke-width="7" stroke-linecap="round"/>
      ${fig({ ground: false, bx: 48, by: 38, hx: 62, hy: 24, legL: "M56 70 L36 72 L36 98", legR: "M66 70 L46 74 L46 98", armL: "M52 50 L42 64", armR: "M72 50 L66 64" })}`),
    "stand up": S(fig({ by: 46, hy: 30, legL: "M56 78 L54 106", legR: "M64 78 L66 106", armL: "M48 52 L40 74", armR: "M72 52 L80 74",
      after: `<path d="M100 92 V36 M90 48 L100 36 L110 48" fill="none" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` })),
    "wake up": S(`${shadow(30)}<circle cx="30" cy="30" r="12" fill="${C.yellow}"/><circle cx="90" cy="30" r="12" fill="${C.yellow}"/><path d="M36 100 L28 110 M84 100 L92 110" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="60" cy="66" r="38" fill="${C.red}"/><circle cx="60" cy="66" r="30" fill="#fff"/><path d="M60 66 V46 M60 66 L74 74" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="66" r="4" fill="${C.ink}"/>
      <path d="M14 12 l8 8 M106 12 l-8 8" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`),
    "eat": S(`${shadow(42)}<circle cx="60" cy="64" r="36" fill="#fff" stroke="#E6D8BF" stroke-width="4"/><circle cx="60" cy="64" r="24" fill="#F7F1E6"/>
      <circle cx="52" cy="60" r="8" fill="${C.green}"/><circle cx="66" cy="70" r="7" fill="${C.orange}"/><rect x="58" y="52" width="14" height="8" rx="3" fill="#E3B877"/>
      <path d="M12 30 v26 M8 30 v12 q4 6 8 0 v-12 M12 56 v44" stroke="${C.grey}" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="108" cy="40" rx="6" ry="10" fill="${C.grey}"/><path d="M108 50 v50" stroke="${C.grey}" stroke-width="4" stroke-linecap="round"/>`),
    "play": S(`${shadow(42)}<rect x="18" y="66" width="36" height="36" rx="6" fill="${C.red}"/>${txt(36, 92, "A", 22, "#fff")}<rect x="60" y="66" width="36" height="36" rx="6" fill="${C.blue}"/>${txt(78, 92, "B", 22, "#fff")}
      <rect x="38" y="26" width="36" height="36" rx="6" fill="${C.yellow}" transform="rotate(8 56 44)"/>${txt(57, 52, "C", 22, "#fff")}<circle cx="100" cy="36" r="10" fill="${C.green}"/>`),
    "sleep": S(`<circle cx="60" cy="60" r="50" fill="#2E3A66"/><path d="M70 28 A30 30 0 1 0 88 82 A24 24 0 1 1 70 28Z" fill="${C.yellow}"/>
      <circle cx="30" cy="34" r="2.5" fill="#fff"/><circle cx="40" cy="88" r="2" fill="#fff"/><circle cx="94" cy="40" r="2" fill="#fff"/>${txt(82, 54, "z", 18, "#fff")}${txt(94, 40, "z", 13, "#fff")}`),
  };
  // Phrases that reuse a drawing (a heart badge marks "I like…")
  const like = (w) => art[w].replace("</svg>", badgeHeart + "</svg>");
  Object.assign(art, {
    "a red apple": art["apple"], "an apple, please": art["apple"], "I like apples": like("apple"),
    "a yellow banana": art["banana"], "I like bananas": like("banana"),
    "a blue car": S(car(C.blue)), "a green frog": art["frog"],
    "a brown dog": art["dog"], "a yellow lion": art["lion"], "a black cat": S(cat("#2E2E3A", "#FFD23F")), "a blue bird": art["bird"],
    "water, please": art["water"], "I like cats": like("cat"),
    "I like it": S(`${shadow(28)}${thumb(false)}${badgeHeart}`), "I don't like it": S(`${shadow(28)}${thumb(true)}<circle cx="96" cy="24" r="16" fill="#fff"/><path d="M88 28 q8 -8 16 0" fill="none" stroke="${C.grey}" stroke-width="4" stroke-linecap="round"/>`)
  });
  window.ART = art;
  // Drawing kit, reused by art2.js (Level 2 pictures) so every picture has the same style
  window.ART_KIT = { C, S, shadow, txt, heartPath, badgeHeart, face, person, kid, bubble, hand, palm, thumb, motion, fig, cat, dog, bird, lion, apple, banana, car, frog, water };
})();

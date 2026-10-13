/* Hello Fox! — app logic, no frameworks, no tracking.
   Progress is stored only on this device (localStorage). Voice recordings are never stored. */
(function () {
  "use strict";

  const LESSONS = window.LESSONS;
  const STICKERS = window.STICKERS;
  const app = document.getElementById("app");
  const STEP_NAMES = ["hello", "learn", "watch", "play", "stars"];
  const STEP_MINUTES = [5, 7, 6, 7, 5];
  // What the fox says when each step opens (tap the fox to hear it again).
  const STEP_SAY = [
    "Hello! Listen, and say it with me!",
    "Tap the pictures. Listen, and repeat!",
    "Let's watch and sing!",
    "Listen, and tap the right picture!",
    "Well done! You are a star!"
  ];
  const RATINGS = { not_yet: "Pas encore", with_help: "Avec aide", independent: "Seule" };
  const PRAISE = ["Yes!", "Super!", "Well done!", "Great!", "Fantastic!"];

  // ---------- storage: several children (profiles) + family settings, all on this device ----------
  const STORE_KEY = "hellofox-v2", OLD_KEY = "my-english-v1";
  const COLORS = ["#7C6CF2", "#E8661F", "#2E8A52", "#D6336C", "#2B7BD6"];
  function fresh(name) { return { name: name || "", stars: 0, lessons: {}, skills: {}, daily: { date: "", count: 0 } }; }
  function freshRoot() {
    const id = "p" + Date.now().toString(36);
    return { profiles: [{ id, color: COLORS[0], data: fresh() }], active: id, settings: { listen: false, code: "", limit: 0, lastBackup: "", videoDay: "", setupDone: false } };
  }
  const obj = (x) => (x && typeof x === "object" && !Array.isArray(x)) ? x : {};
  function cleanData(d) {
    d = obj(d);
    const daily = obj(d.daily);
    return { name: String(d.name || "").slice(0, 20), stars: Math.max(0, Math.floor(Number(d.stars) || 0)), lessons: obj(d.lessons), skills: obj(d.skills),
      daily: { date: String(daily.date || "").slice(0, 10), count: Math.max(0, Number(daily.count) || 0) } };
  }
  // Accepts this app's saved data, a backup file, or the older single-child format. Anything else -> null.
  function cleanRoot(r) {
    if (!r || typeof r !== "object") return null;
    if (!Array.isArray(r.profiles)) {
      if (!("stars" in r) && !("lessons" in r)) return null;
      const root = freshRoot(); root.profiles[0].data = cleanData(r); root.settings.listen = !!r.listen; return root;
    }
    const profiles = r.profiles.slice(0, 8).map((p, i) => ({
      id: (String(obj(p).id || "").replace(/[^\w-]/g, "").slice(0, 24)) || "p" + i,
      color: COLORS.includes(obj(p).color) ? p.color : COLORS[i % COLORS.length],
      data: cleanData(obj(p).data)
    }));
    if (!profiles.length) return null;
    const st = obj(r.settings);
    return { profiles, active: profiles.some((p) => p.id === r.active) ? r.active : profiles[0].id,
      settings: { listen: !!st.listen, code: /^\d{4}$/.test(st.code || "") ? st.code : "",
        limit: [0, 1, 2].includes(Number(st.limit)) ? Number(st.limit) : 0,
        lastBackup: String(st.lastBackup || "").slice(0, 40), videoDay: String(st.videoDay || "").slice(0, 10), setupDone: !!st.setupDone } };
  }
  function load() {
    try {
      const r = cleanRoot(JSON.parse(localStorage.getItem(STORE_KEY)));
      if (r) return r;
      const old = cleanRoot(JSON.parse(localStorage.getItem(OLD_KEY)));
      if (old) return old;
    } catch (e) { /* storage blocked or damaged: start fresh */ }
    return freshRoot();
  }
  let root = load();
  const profile = () => root.profiles.find((p) => p.id === root.active) || root.profiles[0];
  let state = profile().data;
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(root)); }
    catch (e) { toast("Progression non sauvegardée sur cet appareil."); }
  }
  function switchProfile(id) { root.active = id; state = profile().data; save(); }
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const lessonsToday = () => (state.daily && state.daily.date === today()) ? state.daily.count : 0;
  const canPlay = () => !root.settings.limit || lessonsToday() < root.settings.limit;

  const childName = () => state.name || "friend";
  const fill = (s) => String(s).replace(/\{name\}/g, childName());
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const stickerCount = () => Math.min(STICKERS.length, Math.floor(state.stars / 3));

  // ---------- speech (built-in browser voice, runs on the device) ----------
  let voice = null;
  const hasTTS = "speechSynthesis" in window;
  function pickVoice() {
    if (!hasTTS) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find((v) => /en-GB/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function utter(text, pitch, rate) {
    const u = new SpeechSynthesisUtterance(fill(text));
    u.lang = voice ? voice.lang : "en-GB";
    if (voice) u.voice = voice;
    u.rate = rate || 0.8; u.pitch = pitch || 1.1;
    u.addEventListener("start", () => talking(true));
    u.addEventListener("end", () => talking(false));
    u.addEventListener("error", () => talking(false));
    return u;
  }
  // ---------- parent's own voice (recorded in the parent area, stored only on this device) ----------
  const voices = new Map(); // text -> object URL
  let nowAudio = null;
  function idb() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) return rej(new Error("no idb"));
      const r = indexedDB.open("hellofox", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("voice");
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  async function voiceAll() {
    try {
      const db = await idb();
      await new Promise((res) => {
        const tx = db.transaction("voice"), st = tx.objectStore("voice"), c = st.openCursor();
        c.onsuccess = () => { const cur = c.result; if (!cur) return res(); voices.set(cur.key, URL.createObjectURL(cur.value)); cur.continue(); };
        c.onerror = () => res();
      });
    } catch (e) { /* storage blocked: TTS only */ }
  }
  async function voicePut(text, blob) {
    const db = await idb();
    await new Promise((res, rej) => { const tx = db.transaction("voice", "readwrite"); tx.objectStore("voice").put(blob, text); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    if (voices.has(text)) URL.revokeObjectURL(voices.get(text));
    voices.set(text, URL.createObjectURL(blob));
  }
  async function voiceDel(text) {
    const db = await idb();
    await new Promise((res) => { const tx = db.transaction("voice", "readwrite"); tx.objectStore("voice").delete(text); tx.oncomplete = res; tx.onerror = res; });
    if (voices.has(text)) URL.revokeObjectURL(voices.get(text));
    voices.delete(text);
  }
  function stopAudio() { if (nowAudio) { try { nowAudio.pause(); } catch (e) { } nowAudio = null; } talking(false); }
  // Plays the parent's recording for this exact text if there is one. Returns true if it did.
  function playVoice(text, onEnd) {
    const url = voices.get(text); if (!url) return false;
    stopAudio(); if (hasTTS) speechSynthesis.cancel();
    const a = new Audio(url); nowAudio = a;
    a.addEventListener("play", () => talking(true));
    a.onended = a.onerror = () => { talking(false); if (nowAudio === a) nowAudio = null; onEnd && onEnd(); };
    a.play().catch(() => onEnd && onEnd());
    return true;
  }

  function speak(text) {
    if (playVoice(text)) return;
    stopAudio();
    if (!hasTTS) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter(text));
  }
  function speakLines(lines, gap) {
    if (!hasTTS) return;
    speechSynthesis.cancel();
    let k = 0;
    const next = () => {
      if (k >= lines.length) return;
      const u = utter(lines[k++], 1.2);
      u.onend = () => setTimeout(next, gap || 900);
      speechSynthesis.speak(u);
    };
    next();
  }
  const hush = () => { run++; current = null; if (typeof stopAudio === "function") stopAudio(); if (typeof stopListening === "function") stopListening(); if (hasTTS) speechSynthesis.cancel(); talking(false); if (typeof setPaused === "function") setPaused(false); };

  // ---------- Fox, drawn (one character everywhere). Mood: happy | talk | surprised | calm | sleepy ----------
  function foxSVG(mood, size) {
    const z = size || 160;
    return `<svg class="fox fox--${mood || "happy"}" viewBox="0 0 200 200" width="${z}" height="${z}" role="img" aria-label="Fox">
<path d="M38 82 L52 12 L96 52 Z" fill="#E8661F"/><path d="M162 82 L148 12 L104 52 Z" fill="#E8661F"/>
<path d="M50 62 L57 28 L80 52 Z" fill="#FFD9BD"/><path d="M150 62 L143 28 L120 52 Z" fill="#FFD9BD"/>
<path d="M28 86 Q100 18 172 86 Q178 142 100 182 Q22 142 28 86 Z" fill="#F4862C"/>
<path d="M36 112 Q70 118 100 148 Q130 118 164 112 Q156 164 100 184 Q44 164 36 112 Z" fill="#FFF6EC"/>
<circle cx="56" cy="128" r="9" fill="#FF9E8F" opacity=".55"/><circle cx="144" cy="128" r="9" fill="#FF9E8F" opacity=".55"/>
<g class="eyes-open"><circle cx="75" cy="102" r="9" fill="#1E2742"/><circle cx="125" cy="102" r="9" fill="#1E2742"/><circle cx="78" cy="98" r="3" fill="#fff"/><circle cx="128" cy="98" r="3" fill="#fff"/></g>
<g class="eyes-closed"><path d="M64 104 Q75 92 86 104" fill="none" stroke="#1E2742" stroke-width="6" stroke-linecap="round"/><path d="M114 104 Q125 92 136 104" fill="none" stroke="#1E2742" stroke-width="6" stroke-linecap="round"/></g>
<ellipse cx="100" cy="138" rx="10" ry="7" fill="#1E2742"/>
<g class="m-smile"><path d="M86 152 Q100 166 114 152" fill="none" stroke="#1E2742" stroke-width="5" stroke-linecap="round"/></g>
<g class="m-talk"><ellipse cx="100" cy="160" rx="12" ry="10" fill="#8A2E1D"/><ellipse cx="100" cy="165" rx="7" ry="4" fill="#FF7A73"/></g>
<g class="m-oh"><circle cx="100" cy="160" r="7" fill="#8A2E1D"/></g>
<g class="m-calm"><path d="M90 154 Q95 159 100 154 Q105 159 110 154" fill="none" stroke="#1E2742" stroke-width="4" stroke-linecap="round"/></g>
</svg>`;
  }
  // The fox's mouth moves while a word plays (robot voice or parent recording)
  function talking(on) { app.classList.toggle("talking", !!on); }
  const ICON = {
    home: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    pause: '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>',
    play: '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
    star: '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="#FFC23D" stroke="#E8A21A" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    book: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C6CF2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 8h6"/></svg>',
    lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    ear: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 18 12 19.5 8 20 8 18"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0"/></svg>',
    mic: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    move: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M5 9l7 1 7-1"/><path d="M12 10v5l-3 6"/><path d="M12 15l3 6"/></svg>',
    tips: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 15.5c2.8 0 6 1.7 6 4.5"/></svg>',
    again: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v5h5"/></svg>'
  };

  // ---------- small helpers ----------
  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function chime(ok) {
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      const ctx = chime.ctx || (chime.ctx = new C());
      const notes = ok ? [523, 659, 784] : [220];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.1;
        o.frequency.value = f; o.type = "triangle";
        g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.32);
      });
    } catch (e) { /* sound is optional */ }
  }
  function confetti(n) {
    const bits = ["🎉", "⭐", "✨", "🎈", "💛", "🌟"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "conf"; s.textContent = bits[i % bits.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
      s.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 4000);
    }
  }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isDone = (id) => !!(state.lessons[id] && state.lessons[id].status === "done");

  function nextLesson() {
    return LESSONS.find((l) => l.ready && !isDone(l.id)) || LESSONS.find((l) => l.ready);
  }
  function previousLesson(l) {
    const i = LESSONS.indexOf(l);
    for (let k = i - 1; k >= 0; k--) if (LESSONS[k].ready) return LESSONS[k];
    return null;
  }

  // ---------- parent gate: the parent's 4-digit code; until one is set, a sum a 6-year-old can't do ----------
  function parentGate(onPass) {
    const wrap = document.createElement("div");
    wrap.className = "gate";
    const code = root.settings.code;
    if (code) {
      let typed = "";
      wrap.innerHTML = `<div class="gate-box"><h2>Espace parent</h2><p>Entrez votre code</p>
        <div class="pin">${[0, 1, 2, 3].map((i) => `<span data-pin="${i}"></span>`).join("")}</div>
        <div class="keypad">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k) => k === "" ? "<span></span>"
          : `<button data-k="${k}" aria-label="${k === "del" ? "Effacer" : k}">${k === "del" ? "⌫" : k}</button>`).join("")}</div>
        <button data-cancel class="gate-cancel">Annuler</button></div>`;
      const pin = wrap.querySelector(".pin");
      const paint = () => wrap.querySelectorAll("[data-pin]").forEach((x, i) => x.classList.toggle("on", i < typed.length));
      wrap.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.hasAttribute("data-cancel")) { wrap.remove(); return; }
        const k = b.dataset.k;
        typed = k === "del" ? typed.slice(0, -1) : (typed + k).slice(0, 4);
        paint();
        if (typed.length === 4) {
          if (typed === code) { wrap.remove(); onPass(); }
          else { pin.classList.add("wrong"); setTimeout(() => { typed = ""; paint(); pin.classList.remove("wrong"); }, 600); }
        }
      });
    } else {
      const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5), ans = a + b;
      const opts = shuffle([ans, ans + 2, ans - 3]);
      wrap.innerHTML = `<div class="gate-box"><h2>Espace parent</h2><p>Combien font ${a} + ${b} ?</p>
        <div class="row-btns center">${opts.map((o) => `<button data-v="${o}" class="gate-num">${o}</button>`).join("")}</div>
        <p class="small">Astuce : créez un code à 4 chiffres dans l'espace parent.</p>
        <button data-cancel class="gate-cancel">Annuler</button></div>`;
      wrap.addEventListener("click", (e) => {
        const btn = e.target.closest("button"); if (!btn) return;
        wrap.remove();
        if (!btn.hasAttribute("data-cancel") && Number(btn.dataset.v) === ans) onPass();
      });
    }
    document.body.appendChild(wrap);
  }

  // ---------- install as an app (Android Chrome gives us its real install dialog) ----------
  let installEvt = null;
  const standalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); installEvt = e;
    if (app.querySelector("[data-start]")) renderHome();
    if (app.querySelector(".landing")) renderLanding();
  });
  window.addEventListener("appinstalled", () => {
    installEvt = null; toast("Hello Fox est installé ✓");
    if (app.querySelector("[data-start]")) renderHome();
    if (app.querySelector(".landing")) renderLanding(true);
  });
  async function doInstall() {
    if (!installEvt) { parentGate(renderParent); return; }
    const onLanding = !!app.querySelector(".landing");
    installEvt.prompt();
    let accepted = false;
    try { accepted = (await installEvt.userChoice).outcome === "accepted"; } catch (e) { }
    installEvt = null;
    if (onLanding) renderLanding(accepted); else renderHome();
  }

  // =================== LANDING PAGE (browser, before installing) ===================
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const SHARE_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 11v9h14v-9"/></svg>';
  const PLUS_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
  const DOTS_SVG = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>';
  function renderLanding(justInstalled) {
    hush();
    const ios = isIOS();
    const steps = ios
      ? [[SHARE_SVG, "Touchez <b>Partager</b> en haut (ou en bas) de Safari."], [PLUS_SVG, "Choisissez <b>Sur l'écran d'accueil</b>."], [foxSVG("happy", 34), "Touchez <b>Ajouter</b>, puis ouvrez <b>Hello Fox</b> depuis l'écran d'accueil."]]
      : [[DOTS_SVG, "Dans Chrome, touchez le menu <b>⋮</b> en haut à droite."], [PLUS_SVG, "Choisissez <b>Installer l'application</b> (ou <b>Ajouter à l'écran d'accueil</b>)."], [foxSVG("happy", 34), "Ouvrez <b>Hello Fox</b> depuis l'écran d'accueil."]];
    app.innerHTML = `<div class="landing">
      <section class="l-hero">
        ${foxSVG("happy", 170)}
        <h1>Hello Fox!</h1>
        <p class="l-tag">L'anglais en jouant avec un renard, pour les enfants de 6 à 8 ans qui débutent.</p>
      </section>
      <section class="l-cards">
        <div class="l-card"><h2>Le renard guide</h2><p>Il dit chaque mot, attend que l'enfant répète, puis passe au suivant. Presque rien à lire.</p></div>
        <div class="l-card"><h2>20 leçons, 4 semaines</h2><p>Bonjour, couleurs, animaux, nourriture, famille. Chansons, jeux, autocollants et diplôme.</p></div>
        <div class="l-card"><h2>Le parent décide</h2><p>Code parent, temps d'écran, votre propre voix, suivi des progrès, sauvegarde.</p></div>
      </section>
      <section class="l-install" id="install">
        <h2>${justInstalled ? "C'est installé !" : "1. Installez Hello Fox sur la tablette"}</h2>
        ${justInstalled ? `<p>Fermez cette page et ouvrez <b>Hello Fox</b> depuis l'écran d'accueil. La configuration commencera là.</p>`
          : installEvt ? `<button class="big-start" data-install><span class="play-dot">${PLUS_SVG}</span><span class="s-text"><span class="s-main">Installer Hello Fox</span><span class="s-sub">Gratuit · sans compte · sans publicité</span></span></button>`
          : `<ol class="l-steps">${steps.map(([ic, t], i) => `<li><span class="l-num">${i + 1}</span><span class="l-ic">${ic}</span><span>${t}</span></li>`).join("")}</ol>
             ${ios ? `<p class="small">Sur iPad et iPhone, utilisez Safari. Important : faites la configuration <b>dans l'appli installée</b>, pas ici (Safari et l'appli ne partagent pas leurs données).</p>`
                   : `<p class="small">Utilisez Chrome. Si le lien s'est ouvert dans WhatsApp, Facebook ou Gmail : menu → « Ouvrir dans Chrome ».</p>`}`}
        <h2 class="l-h2b">2. Ouvrez l'appli et configurez-la</h2>
        <p>Au premier lancement : votre code parent, le prénom de l'enfant et le temps d'écran. Deux minutes, puis vous lui donnez la tablette.</p>
      </section>
      <section class="l-privacy">
        <h2>Confidentialité</h2>
        <ul><li>Pas de compte, pas de publicité, pas de statistiques.</li>
          <li>Les prénoms et les progrès restent sur cette tablette.</li>
          <li>Les vidéos (Super Simple Songs) se lancent seulement après votre accord, dans un lecteur YouTube qui ne peut pas ouvrir d'autres pages.</li>
          <li>Site familial, non commercial, non affilié à Super Simple ni au British Council.</li></ul>
      </section>
      <button class="l-browser" data-browser>Continuer dans le navigateur (parents)</button>
    </div>`;
    const ib = app.querySelector("[data-install]"); if (ib) ib.onclick = doInstall;
    app.querySelector("[data-browser]").onclick = () => { try { sessionStorage.setItem("hf-browser", "1"); } catch (e) { } setupStep = 0; renderSetup(); };
  }

  // =================== FIRST-LAUNCH SETUP (done by the parent) ===================
  let setupStep = 0, setupMsg = "";
  function renderSetup() {
    hush();
    const st = root.settings;
    const named = root.profiles.filter((p) => p.data.name);
    const dots = [0, 1, 2, 3, 4].map((i) => `<span class="${i < setupStep ? "done" : i === setupStep ? "on" : ""}"></span>`).join("");
    const colorPick = (sel) => COLORS.map((c, i) => `<label class="swatch" style="background:${c}"><input type="radio" name="kcolor" value="${c}" ${c === sel ? "checked" : ""}><span class="sr">Couleur ${i + 1}</span></label>`).join("");
    const nextColor = COLORS[named.length % COLORS.length];
    const pages = [
      () => `<div class="s-fox">${foxSVG("happy", 150)}</div>
        <h1>Bienvenue !</h1>
        <p>Configurons Hello Fox en deux minutes. Cette partie est pour vous, le parent : l'enfant ne la verra pas.</p>
        <ul class="s-list"><li>Tout reste sur cette tablette : pas de compte, pas de publicité.</li><li>Vous pourrez tout changer plus tard dans l'espace parent.</li></ul>
        <div class="s-actions"><button class="s-primary" data-go="1">Commencer</button>
        <label class="s-ghost" for="rest">J'ai une sauvegarde</label><input id="rest" type="file" accept="application/json,.json" class="sr"></div>`,
      () => `<h1>Votre code parent</h1>
        <p>4 chiffres pour ouvrir l'espace parent et confirmer les vidéos. Choisissez un code que l'enfant ne connaît pas.</p>
        <div class="s-form">
          <label for="c1">Code (4 chiffres)</label><input id="c1" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" value="">
          <label for="c2">Retapez le code</label><input id="c2" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" value="">
        </div>
        ${st.code ? `<p class="small">Un code existe déjà. Laissez vide pour le garder.</p>` : ""}
        <div class="s-actions"><button class="s-ghost" data-go="0">Retour</button><button class="s-primary" data-code>Continuer</button></div>`,
      () => `<h1>Qui va apprendre ?</h1>
        <p>Le prénom s'affiche et le renard le dit. Ajoutez chaque enfant de la maison.</p>
        ${named.length ? `<div class="s-kids">${named.map((p) => `<span class="s-kid"><span class="avatar" style="background:${p.color}">${esc(p.data.name.slice(0, 1).toUpperCase())}</span>${esc(p.data.name)}</span>`).join("")}</div>` : ""}
        <div class="s-form">
          <label for="kname">${named.length ? "Ajouter un autre enfant (facultatif)" : "Prénom de l'enfant"}</label>
          <input id="kname" maxlength="20" autocomplete="off" placeholder="Prénom">
          <fieldset class="swatches"><legend>Couleur</legend>${colorPick(nextColor)}</fieldset>
          <button class="s-ghost" data-addk>Ajouter</button>
        </div>
        <div class="s-actions"><button class="s-ghost" data-go="1">Retour</button><button class="s-primary" data-kids ${named.length ? "" : "disabled"}>Continuer</button></div>`,
      () => `<h1>Réglages</h1>
        <fieldset class="segs"><legend>Temps d'écran : leçons par jour</legend>
          ${[[1, "1"], [2, "2"], [0, "Sans limite"]].map(([v, t]) => `<label class="seg ${st.limit === v ? "on" : ""}"><input type="radio" name="slimit" value="${v}" ${st.limit === v ? "checked" : ""}>${t}</label>`).join("")}</fieldset>
        <p class="small">Une leçon dure environ 30 minutes avec vous. Quand la limite est atteinte, le renard dit « See you tomorrow! ».</p>
        ${SR ? `<label class="skill"><input type="checkbox" id="slisten" ${st.listen ? "checked" : ""}> Fox listens : le renard écoute si l'enfant répète</label>
        <p class="small">Désactivé par défaut : la voix est alors transformée en texte par les serveurs de Google (Android) ou d'Apple (iPad).</p>` : ""}
        <div class="s-actions"><button class="s-ghost" data-go="2">Retour</button><button class="s-primary" data-sets>Continuer</button></div>`,
      () => `<div class="s-fox">${foxSVG("talk", 170)}</div>
        <h1>C'est prêt !</h1>
        <p>Donnez la tablette à ${esc(named.map((p) => p.data.name).join(" et ") || "votre enfant")}. Le renard s'occupe du reste.</p>
        <p class="small">Astuce : pour que l'enfant reste dans l'appli, activez l'Accès guidé (iPad, Réglages → Accessibilité) ou l'épinglage d'application (Android, Réglages → Sécurité).</p>
        <div class="s-actions"><button class="s-ghost" data-go="3">Retour</button><button class="s-primary big" data-done>C'est parti !</button></div>`
    ];
    app.innerHTML = `<div class="setup"><div class="s-dots" aria-label="Étape ${setupStep + 1} sur 5">${dots}</div>
      <section class="s-card">${pages[setupStep]()}${setupMsg ? `<p class="s-msg" role="alert">${esc(setupMsg)}</p>` : ""}</section></div>`;
    setupMsg = "";
    const go = (n) => { setupStep = n; renderSetup(); };
    app.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(Number(b.dataset.go)));
    const fail = (m) => { setupMsg = m; renderSetup(); };

    const rest = app.querySelector("#rest");
    if (rest) rest.onchange = async (e) => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      let data = null;
      try { data = f.size < 2000000 ? cleanRoot(JSON.parse(await f.text())) : null; } catch (err) { data = null; }
      if (!data) return fail("Ce fichier n'est pas une sauvegarde Hello Fox.");
      data.settings.setupDone = false; data.settings.code = st.code;
      root = data; state = profile().data; save();
      toast("Sauvegarde restaurée ✓ " + data.profiles.map((p) => p.data.name).filter(Boolean).join(", "));
      go(1);
    };
    const cb = app.querySelector("[data-code]");
    if (cb) cb.onclick = () => {
      const a = app.querySelector("#c1").value.trim(), b = app.querySelector("#c2").value.trim();
      if (!a && !b && st.code) return go(2);
      if (!/^\d{4}$/.test(a)) return fail("Le code doit avoir exactement 4 chiffres.");
      if (a !== b) return fail("Les deux codes ne sont pas identiques.");
      st.code = a; save(); go(2);
    };
    const ak = app.querySelector("[data-addk]");
    if (ak) {
      const add = () => {
        const name = app.querySelector("#kname").value.trim().slice(0, 20);
        if (!name) return fail("Écrivez un prénom.");
        if (root.profiles.length >= 8 && !root.profiles.some((p) => !p.data.name)) return fail("8 enfants maximum.");
        const color = (app.querySelector('input[name="kcolor"]:checked') || {}).value || nextColor;
        const empty = root.profiles.find((p) => !p.data.name);
        if (empty) { empty.data.name = name; empty.color = color; }
        else root.profiles.push({ id: "p" + Date.now().toString(36), color, data: fresh(name) });
        if (!profile().data.name) root.active = root.profiles.find((p) => p.data.name).id;
        state = profile().data; save(); renderSetup();
      };
      ak.onclick = add;
      app.querySelector("#kname").onkeydown = (e) => { if (e.key === "Enter") add(); };
    }
    const kb = app.querySelector("[data-kids]");
    if (kb) kb.onclick = () => {
      const typed = app.querySelector("#kname").value.trim();
      if (typed) return fail("Touchez « Ajouter » pour ajouter " + typed + ", ou effacez le prénom.");
      go(3);
    };
    app.querySelectorAll('input[name="slimit"]').forEach((r) => r.onchange = () => { st.limit = Number(r.value); save(); renderSetup(); });
    const sb = app.querySelector("[data-sets]");
    if (sb) sb.onclick = () => { const l = app.querySelector("#slisten"); if (l) st.listen = l.checked; save(); go(4); };
    const done = app.querySelector("[data-done]");
    if (done) done.onclick = () => {
      // keep only named children (the empty starter profile is dropped)
      root.profiles = root.profiles.filter((p) => p.data.name);
      if (!root.profiles.some((p) => p.id === root.active)) root.active = root.profiles[0].id;
      state = profile().data;
      st.setupDone = true; save(); homeWeek = null;
      if (root.profiles.length > 1) renderWho();
      else { renderHome(); speak(`Hello, ${childName()}! I'm Fox. Let's learn English!`); }
    };
  }

  // =================== HOME: adventure map, one island per week ===================
  const ISLANDS = [
    { l: 5, t: 57, w: 21.5, h: 32.7, r: "46% 54% 50% 50% / 58% 52% 48% 42%" },
    { l: 29.5, t: 13, w: 21.5, h: 32.7, r: "54% 46% 44% 56% / 50% 58% 42% 50%" },
    { l: 54.5, t: 52, w: 22.5, h: 34, r: "48% 52% 56% 44% / 54% 46% 54% 46%" },
    { l: 78.5, t: 11.5, w: 20, h: 31, r: "50% 50% 46% 54% / 46% 54% 46% 54%" }
  ];
  let homeWeek = null;
  function tryStart(id) { if (!canPlay()) { renderSleepy(); return; } startLesson(id); }
  function renderHome() {
    hush();
    const next = nextLesson();
    const curWeek = next ? next.week : 4;
    const week = homeWeek || curWeek;
    const islands = [1, 2, 3, 4].map((w) => {
      const ls = LESSONS.filter((l) => l.week === w);
      const done = ls.every((l) => isDone(l.id));
      const cls = done ? "done" : (w === curWeek ? "current" : (w > curWeek ? "later" : ""));
      const g = ISLANDS[w - 1];
      const dots = ls.map((l) => `<span class="${isDone(l.id) ? "d-done" : (next && next.id === l.id ? "d-next" : "")}"></span>`).join("");
      return `<button class="island ${cls} ${w === week ? "picked" : ""}" data-week="${w}" style="left:${g.l}%;top:${g.t}%;width:${g.w}%;height:${g.h}%;border-radius:${g.r}">
        <span class="i-week">Week ${w}</span><span class="i-theme">${esc(window.WEEK_THEMES[w])}</span><span class="i-dots">${dots}</span></button>`;
    }).join("");
    const g = ISLANDS[curWeek - 1];
    const tiles = LESSONS.filter((l) => l.week === week).map((l) => `<button class="lesson-tile ${isDone(l.id) ? "done" : ""} ${next && next.id === l.id && !isDone(l.id) ? "next" : ""}" data-lesson="${l.id}">
      <span class="e">${l.emoji}</span><span class="t-day">${esc(l.day.slice(0, 3))}</span><span class="t-title">${esc(l.title)}</span></button>`).join("");
    const p = profile();
    app.innerHTML = `
      <header class="home-top">
        <button class="who" data-who><span class="avatar" style="background:${p.color}">${esc((state.name || "?").slice(0, 1).toUpperCase())}</span>${esc(state.name || "Who's playing?")}</button>
        <div class="brand">Hello Fox!</div>
        <div class="top-right">
          <div class="pill" aria-label="${state.stars} stars">${ICON.star}${state.stars}</div>
          <button class="pill" data-stickers aria-label="My stickers">${ICON.book}${stickerCount()}/${STICKERS.length}</button>
          <button class="lock-btn" data-parent aria-label="Espace parent">${ICON.lock}</button>
        </div>
      </header>
      <section class="map" aria-label="Map">
        <svg class="map-path" viewBox="0 0 1116 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M180 380 C 250 250 300 190 440 175 C 570 160 600 330 735 360 C 860 390 900 210 995 170" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22"/>
        </svg>
        ${islands}
        <button class="map-fox" data-fox aria-label="Fox" style="left:${Math.max(g.l - 10, 1)}%;top:${Math.max(g.t - 26, 2)}%">${foxSVG("happy", 130)}</button>
      </section>
      <section class="week-row" aria-label="Week ${week}">${tiles}</section>
      <div class="start-row">
        ${allDone() ? `<button class="cert-btn" data-cert>${ICON.star} My certificate</button>` : ""}
        <button class="big-start" data-start><span class="play-dot">${ICON.play}</span>
          <span class="s-text"><span class="s-main">${allDone() ? "Play again" : "Start today's lesson"}</span>
          <span class="s-sub">${next ? "Week " + next.week + " · " + esc(next.title) : ""}</span></span></button>
      </div>
      ${installEvt && !standalone() ? `<button class="install-btn" data-install>Installer Hello Fox sur cet appareil</button>` : ""}`;

    const ib = app.querySelector("[data-install]"); if (ib) ib.onclick = doInstall;
    const ce = app.querySelector("[data-cert]"); if (ce) ce.onclick = renderCertificate;
    app.querySelector("[data-start]").onclick = () => tryStart(next.id);
    app.querySelector("[data-fox]").onclick = () => speak(`Hello, ${childName()}! I'm Fox. Let's play!`);
    app.querySelector("[data-stickers]").onclick = renderStickers;
    app.querySelector("[data-parent]").onclick = () => parentGate(renderParent);
    app.querySelector("[data-who]").onclick = () => root.profiles.length > 1 ? renderWho() : speak(`Hello, ${childName()}!`);
    app.querySelectorAll("[data-week]").forEach((b) => b.onclick = () => { homeWeek = Number(b.dataset.week); renderHome(); speak("Week " + b.dataset.week + "!"); });
    app.querySelectorAll("[data-lesson]").forEach((b) => b.onclick = () => tryStart(b.dataset.lesson));
  }

  // Who's playing? (only when there are several children)
  function renderWho() {
    hush();
    app.innerHTML = `<section class="who-screen"><h1>Who's playing?</h1>
      <div class="who-list">${root.profiles.map((p) => `<button class="who-card" data-p="${esc(p.id)}">
        <span class="avatar big" style="background:${p.color}">${esc((p.data.name || "?").slice(0, 1).toUpperCase())}</span>
        <span class="w-name">${esc(p.data.name || "?")}</span><span class="w-stars">${ICON.star}${p.data.stars}</span></button>`).join("")}</div></section>`;
    speak("Who's playing?");
    app.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => { switchProfile(b.dataset.p); homeWeek = null; renderHome(); speak(`Hello, ${childName()}!`); });
  }

  // Daily limit reached (set in the parent area)
  function renderSleepy() {
    hush();
    app.innerHTML = `<section class="sleepy">${foxSVG("sleepy", 240)}
      <h1>See you tomorrow, ${esc(childName())}!</h1>
      <p class="small">Limite du jour atteinte (${root.settings.limit} leçon${root.settings.limit > 1 ? "s" : ""}). Modifiable dans l'espace parent.</p>
      <button class="big-start small-start" data-home><span class="play-dot">${ICON.home}</span><span class="s-text"><span class="s-main">Home</span></span></button></section>`;
    speak(`Well done today, ${childName()}! See you tomorrow!`);
    app.querySelector("[data-home]").onclick = renderHome;
  }

  // =================== CERTIFICATE (after the 20 lessons) ===================
  const allDone = () => LESSONS.filter((l) => l.ready).every((l) => isDone(l.id));
  function renderCertificate() {
    hush();
    const dates = Object.values(state.lessons).map((x) => x.completedAt).filter(Boolean).sort();
    const end = dates.length ? new Date(dates[dates.length - 1]) : new Date();
    app.innerHTML = `
      <div class="topbar print-hide"><button class="icon-btn" data-home aria-label="Home">${ICON.home}</button>
        <button class="pill" data-print>Print</button></div>
      <section class="cert">
        <div class="cert-fox">${foxSVG("happy", 130)}</div>
        <div class="cert-kicker">Certificate</div>
        <h1>${esc(state.name || "Super learner")}</h1>
        <p class="cert-line">finished <b>Hello Fox! English</b></p>
        <p class="cert-sub">4 weeks · 20 lessons · ${state.stars} ⭐</p>
        <div class="cert-stickers">${STICKERS.slice(0, stickerCount()).map((x) => x.e).join(" ")}</div>
        <p class="cert-date">${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
        <p class="cert-words">Hello · My name is… · I'm happy · one, two, three · red, blue · cat, dog · jump · apple, please · thank you · this is my mum · I like…</p>
      </section>`;
    confetti(40); chime(true);
    speak(`Congratulations, ${childName()}! You did it! Well done!`);
    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelector("[data-print]").onclick = () => window.print();
  }

  // =================== STICKER BOOK ===================
  function renderStickers() {
    const n = stickerCount();
    const toNext = 3 - (state.stars % 3);
    const grid = STICKERS.map((s, i) => i < n
      ? `<button class="sticker got" data-w="${esc(s.w)}"><span>${s.e}</span>${esc(s.w)}</button>`
      : `<div class="sticker"><span>❔</span>&nbsp;</div>`).join("");
    app.innerHTML = `
      <div class="topbar"><button class="icon-btn" data-home aria-label="Home">${ICON.home}</button>
        <div class="pill">${ICON.star}${state.stars}</div></div>
      <section class="stage"><h2>My stickers</h2>
        <div class="minutes">${n < STICKERS.length ? `Encore ${toNext} ⭐ pour le prochain autocollant` : "Collection complète ! 🎉"}</div>
        <div class="sticker-grid">${grid}</div>
        ${allDone() ? `<div class="endbar"><button class="cert-btn" data-cert>${ICON.star} My certificate</button></div>` : ""}</section>`;
    speak(n ? "Your stickers! Tap and say the word!" : "Finish a lesson to get a sticker!");
    app.querySelector("[data-home]").onclick = renderHome;
    const cb = app.querySelector("[data-cert]"); if (cb) cb.onclick = renderCertificate;
    app.querySelectorAll("[data-w]").forEach((b) => b.onclick = () => { speak(b.dataset.w + "!"); b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle"); });
  }

  // =================== LESSON PLAYER ===================
  let L, step, play;
  function startLesson(id) {
    L = LESSONS.find((l) => l.id === id);
    step = 0;
    play = { round: 0, order: null, rating: null, gameDone: false, miss: 0 };
    renderStep();
  }

  function frame(inner, canNext, nextLabel) {
    const bars = STEP_NAMES.map((_, i) => `<span class="${i < step ? "done" : i === step ? "on" : ""}"></span>`).join("");
    app.innerHTML = `
      <div class="topbar">
        <button class="icon-btn" data-home aria-label="Home">${ICON.home}</button>
        <div class="steps" aria-label="Step ${step + 1} of 5">${bars}</div>
        <button class="icon-btn pause-btn" data-pause aria-label="Pause">${ICON.pause}</button>
      </div>
      <section class="stage">${inner}</section>
      <div class="nav">
        <button class="tips-btn" data-tips aria-expanded="false">${ICON.tips}<span>Conseils parent</span></button>
        <div class="nav-right">
          ${step > 0 ? `<button class="back-btn" data-back aria-label="Back">◀</button>` : ""}
          <button class="next-btn" data-next ${canNext ? "" : "disabled"}>${nextLabel || "Next ▶"}</button>
        </div>
      </div>`;
    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelector("[data-pause]").onclick = togglePause;
    const tips = app.querySelector("[data-tips]");
    if (!app.querySelector(".parent-note")) tips.hidden = true;
    tips.onclick = () => {
      const open = tips.getAttribute("aria-expanded") !== "true";
      tips.setAttribute("aria-expanded", String(open));
      app.querySelectorAll(".parent-note").forEach((n) => { n.hidden = !open; });
      if (open) { const n = app.querySelector(".parent-note"); if (n && n.scrollIntoView) n.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
    };
    const back = app.querySelector("[data-back]"); if (back) back.onclick = () => { step--; renderStep(); };
    app.querySelector("[data-next]").onclick = () => { if (step < 4) { step++; renderStep(); } else finishLesson(); };
  }
  const enableNext = () => { const n = app.querySelector("[data-next]"); if (n && n.disabled) { n.disabled = false; n.classList.add("pulse"); } };
  const minutes = () => "";
  const note = (t) => `<div class="parent-note" hidden><b>Pour le parent</b>${esc(fill(t))}</div>`;

  function renderStep() {
    hush();
    window.scrollTo(0, 0);
    [stepHello, stepLearn, stepWatch, stepPlay, stepStars][step]();
  }

  // ---------- guided flow: Fox says it once -> 5 s "your turn" -> next, by itself ----------
  const TURN_MS = 5000;
  let run = 0; // bumped on every screen change, so old timers/sequences stop
  function sayThen(text, cb, rate) {
    const my = run;
    let done = false;
    const fin = () => { if (done || my !== run) return; done = true; cb(); };
    if (playVoice(text, fin)) { setTimeout(fin, 9000); return; }
    stopAudio();
    if (!hasTTS) { setTimeout(fin, 1200); return; }
    speechSynthesis.cancel();
    const u = utter(text, null, rate);
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
    setTimeout(fin, 1800 + fill(text).length * 110); // safety net if the browser never fires onend
  }
  const later = (ms, cb) => { const my = run; setTimeout(() => my === run && cb(), ms); };
  function status(mode) {
    const st = app.querySelector(".status"); if (!st) return;
    st.className = "status " + mode;
    const txt = { listen: [ICON.ear, "Listen…"], turn: [ICON.mic, "Your turn!"], act: [ICON.move, "Do it!"], paused: [ICON.pause, "Pause"], hear: [ICON.ear, "Fox is listening…"] }[mode];
    st.querySelector("span").innerHTML = txt ? txt[0] + "<em>" + txt[1] + "</em>" : "";
    const bar = st.querySelector(".bar"); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
  }
  const statusHTML = `<div class="status"><span></span><div class="bar"></div></div>`;
  function focus(el) {
    app.querySelectorAll(".active").forEach((x) => x.classList.remove("active"));
    if (!el) return;
    el.classList.add("active");
    if (el.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  // One item: Fox says it, then the child gets 5 seconds to repeat (or just listens for parent lines).
  function teach(el, say, childTurn, cb, key, act) {
    focus(el); status("listen");
    const bub = app.querySelector(".bubble"); if (bub) bub.textContent = fill(say).split(/(?<=[.!?])\s/)[0];
    sayThen(say, () => {
      if (!childTurn) { status(""); later(900, cb); return; }
      if (listenOn() && !act) { listenFor(el, key || say, say, 0, cb); return; }
      status(act ? "act" : "turn");
      later(TURN_MS, () => { el.classList.add("heard"); status(""); chime(true); cb(); });
    });
  }
  // A list of items, starting at `from`. Tapping an item restarts from it.
  // ---------- "Fox listens" (optional, parent-enabled) ----------
  // Uses the browser's speech recognition. On most tablets the audio is processed by Google or Apple servers,
  // which is why it is OFF by default and explained in the parent area. It never says "wrong".
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let listenBroken = false, activeRec = null;
  const listenOn = () => !!(root.settings.listen && SR && !listenBroken);
  const NUM = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten" };
  // Words recognisers often return for what a child said ("know" for "no", "for" for "four"…)
  const ALIKE = { know: "no", knows: "nose", for: "four", to: "two", too: "two", won: "one", buy: "bye", by: "bye",
    read: "red", blew: "blue", ate: "eight", hi: "hello", yeah: "yes", yep: "yes", nope: "no", sat: "sad" };
  const norm = (t) => String(t).toLowerCase().replace(/[’']/g, "").replace(/\d+/g, (d) => " " + (NUM[d] || d) + " ")
    .replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean).map((w) => ALIKE[w] || w);
  function lev(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  // Lenient: at least half of the key words heard (one letter off is fine for longer words).
  function heardIt(alts, key) {
    const want = norm(key); if (!want.length) return true;
    const wantJoined = want.join("");
    return alts.some((alt) => {
      const got = norm(alt);
      const joined = got.join("");
      if (joined.includes(wantJoined) || (wantJoined.length >= 6 && lev(joined, wantJoined) <= Math.round(wantJoined.length / 3))) return true;
      const hits = want.filter((w) => got.some((g) => g === w || (w.length > 3 && lev(g, w) <= 1))).length;
      return hits >= Math.ceil(want.length / 2);
    });
  }
  function stopListening() { if (activeRec) { try { activeRec.abort(); } catch (e) { } activeRec = null; } }
  function listenFor(el, key, say, tries, cb) {
    const my = run;
    status("hear");
    let alts = null, finished = false, timer;
    const R = new SR();
    R.lang = "en-GB"; R.interimResults = false; R.maxAlternatives = 5; R.continuous = false;
    R.onresult = (e) => { alts = Array.from(e.results[0] || []).map((a) => a.transcript); };
    R.onerror = (e) => {
      if (["not-allowed", "service-not-allowed", "network", "audio-capture"].includes(e.error)) {
        listenBroken = true; toast("« Fox listens » indisponible ici : retour au mode 5 secondes.");
      }
    };
    R.onend = () => {
      clearTimeout(timer);
      if (finished || my !== run) return;
      finished = true; activeRec = null; status("");
      if (listenBroken) { el.classList.add("heard"); cb(); return; }
      if (alts && heardIt(alts, key)) {
        el.classList.add("heard"); chime(true); confetti(10);
        sayThen(PRAISE[Math.floor(Math.random() * PRAISE.length)], cb);
      } else if (tries === 0) {
        sayThen("Listen again!", () => sayThen(say, () => listenFor(el, key, say, 1, cb), 0.6));
      } else {
        el.classList.add("heard");
        sayThen("Good try!", cb);
      }
    };
    activeRec = R;
    try { R.start(); } catch (e) { listenBroken = true; R.onend(); return; }
    timer = setTimeout(() => { try { R.stop(); } catch (e) { } }, 6000);
  }

  let current = null;   // the guided sequence on screen, so Pause can resume it
  let paused = false;
  function guide(items, from, onDone) {
    run++; setPaused(false);
    current = { items, idx: from, onDone };
    const next = () => {
      if (current.idx >= items.length) { focus(null); return onDone(); }
      const it = items[current.idx];
      teach(it.el, it.say, it.turn !== false, () => { current.idx++; next(); }, it.key, it.act);
    };
    next();
  }
  function setPaused(on) {
    paused = on;
    const b = document.querySelector("[data-pause]");
    if (b) { b.innerHTML = on ? ICON.play : ICON.pause; b.setAttribute("aria-label", on ? "Play" : "Pause"); b.classList.toggle("is-paused", on); }
    app.classList.toggle("paused", on);
  }
  function togglePause() {
    if (!paused) {
      run++; stopListening(); stopAudio(); if (hasTTS) speechSynthesis.cancel();
      setPaused(true); status("paused");
    } else if (current) {
      guide(current.items, current.idx, current.onDone); // restart the word she was on
    } else setPaused(false);
  }
  function showEnd(msg) {
    const end = app.querySelector(".endbar"); if (end) end.hidden = false;
    enableNext(); sayThen(msg, () => {});
  }

  // 1. Hello: one greeting, her turn, quick review of yesterday's words, then on to new words automatically
  function stepHello() {
    const prev = previousLesson(L);
    const review = prev ? shuffle(prev.cards).slice(0, 3) : [];
    frame(`
      <div class="bubble"></div>
      <button class="hello-fox" data-fox aria-label="Fox">${foxSVG("happy", 200)}</button>
      <h2>${esc(L.emoji)} ${esc(L.title)}</h2>
      <div class="prompt">${esc(fill(L.warmup.prompt))}</div>
      ${statusHTML}
      ${review.length ? `<div class="review"><div class="review-title">Remember?</div>
        ${review.map((c, i) => `<button class="chip" data-i="${i}"><span>${c.emoji}</span>${esc(c.word)}</button>`).join("")}</div>` : ""}
      <div class="endbar"><button class="again-btn" data-again>${ICON.again} Again</button></div>
      ${note(L.warmup.parent + " L'écran avance tout seul : le renard parle, puis 5 secondes pour répéter.")}`, true);
    const fox = app.querySelector("[data-fox]");
    const chips = [...app.querySelectorAll(".chip")];
    const items = [{ el: fox, say: L.warmup.say, key: L.warmup.key }].concat(review.map((c, i) => ({ el: chips[i], say: c.say, key: c.key || c.word })));
    const go = (from) => guide(items, from, () => {
      confetti(12);
      sayThen("Great! Now, new words!", () => later(400, () => { step = 1; renderStep(); }));
    });
    chips.forEach((c, i) => c.onclick = () => go(i + 1));
    fox.onclick = () => go(0);
    app.querySelector("[data-again]").onclick = () => go(0);
    later(300, () => go(0));
  }

  // 2. Learn: each word is said once, 5 s to repeat, then the next one. At the end: again or next?
  function stepLearn() {
    const cards = L.cards.map((c, i) => `<button class="word-card" data-i="${i}">
      <span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`).join("");
    frame(`<div class="learn">
      <aside class="side-fox"><div class="bubble"></div><button class="fox-btn" data-fox aria-label="Fox">${foxSVG("happy", 220)}</button>${statusHTML}</aside>
      <div class="cards cards-2">${cards}</div></div>
      <div class="endbar" hidden><button class="again-btn" data-again>${ICON.again} Again</button></div>
      ${note("Laissez-la répéter pendant la barre rose (5 s), avec le geste. Touchez une image pour la réentendre. Montrez le sens avant de traduire ; un mot en français si elle bloque, puis on revient à l'anglais.")}`,
      false);
    const els = [...app.querySelectorAll(".word-card")];
    const items = L.cards.map((c, i) => ({ el: els[i], say: c.say, key: c.key || c.word }));
    const go = (from) => { app.querySelector(".endbar").hidden = true; guide(items, from, () => { confetti(12); showEnd("Well done! Again, or next?"); }); };
    els.forEach((b, i) => b.onclick = () => go(i));
    app.querySelector("[data-fox]").onclick = () => go(current ? current.idx : 0);
    app.querySelector("[data-again]").onclick = () => { els.forEach((e) => e.classList.remove("heard")); go(0); };
    sayThen("Listen, and repeat!", () => go(0));
  }

  // 3. Watch: YouTube's official embeddable player, loaded after a parent confirms (once per session)
  const videoOK = () => root.settings.videoDay === today();
  function stepWatch() {
    const v = L.video;
    frame(`<h2>Watch & sing</h2>${minutes()}
      <div class="video-box" id="vbox"><div class="video-gate">
        ${foxSVG("surprised", 120)}
        <button class="listen-btn" data-load>${ICON.play}<span>Play video</span></button>
        <p>${videoOK() ? "" : "Un parent confirme une fois par jour (la vidéo vient de YouTube)."}</p>
      </div></div>
      <div class="small">${esc(v.title)} · vidéo officielle diffusée via le lecteur YouTube.</div>
      <div class="row-btns center"><button class="link-btn" data-alt>Sing with Fox</button></div>
      ${note("Regardez ensemble, faites pause et répétez les mots. « Sing with Fox » : une petite comptine sans internet, à répéter ligne par ligne.")}`, true);
    speak(STEP_SAY[2]);
    const load = () => {
      root.settings.videoDay = today(); save(); hush();
      // Sandboxed: the player can play, but cannot open YouTube, new tabs or navigate this app away.
      document.getElementById("vbox").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?rel=0&playsinline=1&modestbranding=1&fs=1"
        title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    };
    app.querySelector("[data-load]").onclick = () => videoOK() ? load() : parentGate(load);
    app.querySelector("[data-alt]").onclick = () => speakLines(L.chant || L.cards.map((c) => c.say));
  }

  // 4. Play: a game (tap / café / memory / what's missing), then moves + dialogue with "hear myself"
  function stepPlay() {
    const g = (L.game && L.game.type) || "tap";
    if (!play.gameDone) {
      if (g === "memory") return memoryGame();
      if (g === "missing") return missingGame();
      return tapGame(g === "cafe");
    }
    talkPart();
  }
  function gameOver() { play.gameDone = true; later(1300, stepPlay); }
  const cardBtn = (c, i, cls) => `<button class="word-card ${cls || ""}" data-i="${i}"><span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`;

  // Listen & tap — or Fox's café, where Fox orders and she serves
  function tapGame(cafe) {
    const items = (L.game && L.game.items) || L.cards;
    const ROUNDS = Math.min(items.length, 5);
    const order = play.order || (play.order = shuffle(items.map((_, i) => i)).slice(0, ROUNDS));
    if (play.round >= ROUNDS) { play.gameDone = true; return stepPlay(); }
    const cards = shuffle(items.map((c, i) => ({ c, i }))).map(({ c, i }) => cardBtn(c, i)).join("");
    frame(`<h2>${cafe ? "☕ Fox's café" : "Listen & tap"}</h2>${minutes()}
      ${cafe ? `<div class="cafe-fox">${foxSVG("happy", 120)}</div>` : ""}
      <button class="listen-btn" data-q>${ICON.ear}<span>${cafe ? "What does Fox want?" : "What do you hear?"}</span></button>
      <div class="progress-stars">${Array.from({ length: ROUNDS }, (_, i) => i < play.round ? "⭐" : "☆").join(" ")}</div>
      <div class="cards">${cards}</div>
      ${cafe ? note("Le renard est le client : il commande, elle sert en touchant le bon aliment. Ensuite, à la maison, inversez : elle commande, vous servez.") : ""}`, false);
    const it = items[order[play.round]];
    let firstTry = true;
    const ask = () => speak(cafe ? (it.order || it.say) : (it.ask && play.round % 2 === 1 ? it.ask : it.say));
    if (play.round === 0) sayThen(cafe ? "Welcome to my café! I'm hungry!" : STEP_SAY[3], () => later(300, ask));
    else later(300, ask);
    app.querySelector("[data-q]").onclick = ask;
    app.querySelectorAll(".word-card").forEach((b) => b.onclick = () => {
      if (play.locked) return;
      if (items[Number(b.dataset.i)] === it) {
        play.locked = true;
        b.classList.add("right"); chime(true); confetti(firstTry ? 10 : 5);
        speak(cafe ? ["Thank you!", "Yummy! Thank you!", "Thank you very much!"][play.round % 3] : PRAISE[play.round % PRAISE.length]);
        play.round++;
        later(1300, () => { play.locked = false; stepPlay(); });
      } else {
        firstTry = false; b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        chime(false); later(500, ask);
      }
    });
  }

  // Memory: find the pairs. Each turned card says its word.
  function memoryGame() {
    const cards = L.cards.slice(0, 4);
    const tiles = shuffle(cards.concat(cards).map((c, k) => ({ c, k: k % cards.length })));
    frame(`<h2>Find the pairs!</h2>${minutes()}
      <div class="mem-grid">${tiles.map((t, i) => `<button class="mem" data-t="${i}" aria-label="card"><span class="back">${foxSVG("calm", 76)}</span>
        <span class="front"><span class="e">${t.c.emoji}</span>${esc(t.c.word)}</span></button>`).join("")}</div>
      ${note("Jeu de mémoire : elle retourne deux cartes. Chaque carte dit son mot : faites-la répéter. Une paire trouvée = le renard dit la phrase entière.")}`, false);
    sayThen("Find the pairs!", () => { });
    let open = [], found = 0, busy = false;
    app.querySelectorAll(".mem").forEach((b) => b.onclick = () => {
      const t = tiles[Number(b.dataset.t)];
      if (busy || b.classList.contains("up")) return;
      b.classList.add("up"); speak(t.c.word);
      open.push({ b, t });
      if (open.length < 2) return;
      busy = true;
      const [x, y] = open; open = [];
      if (x.t.k === y.t.k) {
        later(500, () => {
          x.b.classList.add("matched"); y.b.classList.add("matched"); chime(true); confetti(8);
          sayThen(x.t.c.say, () => {
            busy = false; found++;
            if (found === cards.length) { confetti(20); sayThen("Well done! All the pairs!", gameOver); }
          });
        });
      } else {
        later(1200, () => { x.b.classList.remove("up"); y.b.classList.remove("up"); busy = false; });
      }
    });
  }

  // What's missing? Look, close your eyes, one picture disappears, find it.
  function missingGame() {
    const ROUNDS = 3;
    play.miss = play.miss || 0;
    if (play.miss >= ROUNDS) { play.gameDone = true; return stepPlay(); }
    const shown = L.cards.slice(0, 4);
    const gone = Math.floor(Math.random() * shown.length);
    frame(`<h2>What's missing?</h2>${minutes()}
      <div class="progress-stars">${Array.from({ length: ROUNDS }, (_, i) => i < play.miss ? "⭐" : "☆").join(" ")}</div>
      <div class="cards look">${shown.map((c, i) => cardBtn(c, i, "still")).join("")}</div>
      <div class="cover" hidden>${foxSVG("sleepy", 180)}Close your eyes!</div>
      <div class="pick" hidden><div class="prompt">What's missing?</div><div class="pick-row">${shuffle(shown.map((c, i) => ({ c, i }))).map(({ c, i }) =>
        `<button class="chip" data-p="${i}"><span>${c.emoji}</span>${esc(c.word)}</button>`).join("")}</div></div>
      ${note("Regardez les images ensemble, nommez-les. Elle ferme les yeux pendant que l'écran se cache, puis trouve l'image disparue. À refaire avec de vrais objets sur la table.")}`, false);
    const look = app.querySelector(".look"), cover = app.querySelector(".cover"), pick = app.querySelector(".pick");
    sayThen(play.miss === 0 ? "Look! Remember the pictures!" : "Look again!", () => later(2500, () => {
      cover.hidden = false;
      sayThen("Close your eyes!", () => later(2500, () => {
        const el = look.querySelectorAll(".word-card")[gone];
        el.classList.add("hidden-card"); el.innerHTML = `<span class="e">❓</span>&nbsp;`;
        cover.hidden = true; pick.hidden = false;
        sayThen("Open your eyes! What's missing?", () => { });
      }));
    }));
    app.querySelectorAll("[data-p]").forEach((b) => b.onclick = () => {
      if (Number(b.dataset.p) === gone) {
        b.classList.add("right"); chime(true); confetti(10);
        sayThen("Yes! " + shown[gone].say, () => { play.miss++; later(500, stepPlay); });
      } else {
        b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong"); chime(false); speak("Look again!");
      }
    });
  }

  function talkPart() {
    // Without a saved name: speaker shows "Me" and the line says "My name is …"
    const who = (w) => w === "{name}" ? "🙋‍♀️ " + (state.name || "Me") : w === "Parent" ? "👨 Parent" : "👫 Both";
    const line = (t) => state.name ? fill(t) : t.replace(/\{name\}\.?/g, "…");
    const script = L.speak.script.map((s) => `<div class="script-line"><span class="who">${esc(who(s.who))}</span>
      <span class="say">${esc(line(s.line))}</span><button class="mini-listen" data-line="${esc(line(s.line).replace("…", ""))}" aria-label="Listen">🔊</button></div>`).join("");
    const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    const moves = (L.moves || []).map((m) => `<div class="move-card"><span class="e" aria-hidden="true">${m.emoji}</span>${esc(m.say)}</div>`).join("");
    frame(`<h2>${moves ? "Move & talk!" : "Let's talk!"}</h2>${minutes()}
      ${statusHTML}${moves ? `<div class="moves">${moves}</div>` : ""}<div class="script">${script}</div>
      <div class="endbar" hidden><button class="again-btn" data-again>${ICON.again} Again</button></div>
      ${canRecord ? `<button class="rec-btn" data-rec>${ICON.mic}<span>Say it, then hear yourself!</span></button>` : ""}
      ${note(L.speak.activity + (canRecord ? " Le micro enregistre 4 secondes puis rejoue sa voix. Rien n'est sauvegardé ni envoyé." : ""))}`, true);
    const lines = [...app.querySelectorAll(".script-line")];
    const mv = [...app.querySelectorAll(".move-card")];
    const items = (L.moves || []).map((m, i) => ({ el: mv[i], say: m.say, act: true }))
      .concat(L.speak.script.map((s, i) => ({ el: lines[i], say: line(s.line).replace("…", ""), turn: s.who !== "Parent", key: s.line.replace(/\{name\}\.?/g, "") })));
    const go = (from) => { app.querySelector(".endbar").hidden = true; guide(items, from, () => showEnd("Well done! Again, or next?")); };
    mv.forEach((m, i) => m.onclick = () => go(i));
    app.querySelectorAll("[data-line]").forEach((b, i) => b.onclick = () => go(mv.length + i));
    app.querySelector("[data-again]").onclick = () => go(0);
    const rec = app.querySelector("[data-rec]"); if (rec) rec.onclick = () => { run++; focus(null); status(""); recordMe(rec); };
    sayThen(mv.length ? "Let's move!" : "Now, let's talk!", () => go(0));
  }

  // "Hear myself": records ~4 s in memory, plays it back, then discards it. Nothing is saved or uploaded.
  async function recordMe(btn) {
    hush();
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { toast("Micro non autorisé. Autorisez-le dans les réglages du navigateur."); return; }
    const chunks = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/mp4" }));
      const audio = new Audio(url);
      btn.querySelector("span").textContent = "Listen to you!"; btn.classList.remove("recording");
      audio.onended = () => { URL.revokeObjectURL(url); btn.querySelector("span").textContent = "Again!"; btn.disabled = false; chime(true); confetti(8); };
      audio.play().catch(() => { btn.querySelector("span").textContent = "Again!"; btn.disabled = false; });
    };
    btn.disabled = true; btn.classList.add("recording"); btn.querySelector("span").textContent = "Speak now!";
    rec.start();
    setTimeout(() => rec.state !== "inactive" && rec.stop(), 4000);
  }

  // 5. Star time: praise + optional parent rating (no score shown to the child)
  function stepStars() {
    const sel = (k) => play.rating === k ? "sel" : "";
    frame(`<div class="dance">${foxSVG("happy", 200)}</div>
      <h2>Well done, ${esc(childName())}!</h2>${minutes()}
      <div class="score" aria-label="3 stars"><span>⭐</span><span>⭐</span><span>⭐</span></div>
      <div class="review">${L.cards.map((c) => `<button class="chip" data-r="${esc(c.say)}"><span>${c.emoji}</span>${esc(c.word)}</button>`).join("")}</div>
      <button class="listen-btn" data-bye>${ICON.ear}<span>Goodbye!</span></button>
      <div class="parent-note" hidden><b>Pour le parent — ${esc(L.skill)}</b>
        Demandez-lui 2 ou 3 mots du jour. Optionnel : notez la compétence (jamais montré à l'enfant).
        <div class="rating">${Object.entries(RATINGS).map(([k, v]) => `<button class="${sel(k)}" data-rt="${k}">${v}</button>`).join("")}</div>
      </div>`, true, "Get my stars ⭐");
    confetti(30); chime(true);
    speak(`Well done, ${childName()}! Three stars!`);
    app.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => speak(b.dataset.r));
    app.querySelector("[data-bye]").onclick = () => speak(`Goodbye, ${childName()}! See you tomorrow!`);
    app.querySelectorAll("[data-rt]").forEach((b) => b.onclick = () => {
      play.rating = b.dataset.rt;
      app.querySelectorAll("[data-rt]").forEach((x) => x.classList.toggle("sel", x === b));
    });
  }

  function finishLesson() {
    const prev = state.lessons[L.id];
    const firstTime = !isDone(L.id);
    const before = stickerCount();
    state.lessons[L.id] = {
      status: "done",
      completedAt: new Date().toISOString(),
      rating: play.rating || (prev && prev.rating) || null,
      times: ((prev && prev.times) || 0) + 1
    };
    state.stars += firstTime ? 3 : 1; // practice always earns something
    state.daily = { date: today(), count: lessonsToday() + 1 };
    save();
    if (stickerCount() > before) renderNewSticker(STICKERS[stickerCount() - 1]);
    else { renderHome(); toast(firstTime ? "+3 ⭐" : "+1 ⭐ — bravo pour la révision !"); }
  }

  function renderNewSticker(s) {
    app.innerHTML = `<section class="stage reveal">
      <h2>New sticker!</h2>
      <div class="big-sticker">${s.e}</div>
      <div class="prompt">${esc(s.w)}</div>
      <button class="listen-btn" data-say>${ICON.ear}<span>${esc(s.w)}</span></button>
      <div class="nav"><button class="next-btn" data-ok>My stickers</button></div></section>`;
    confetti(30); chime(true);
    speak(`You got a new sticker! ${s.w}!`);
    app.querySelector("[data-say]").onclick = () => speak(s.w + "!");
    app.querySelector("[data-ok]").onclick = renderStickers;
  }

  // =================== PARENT AREA ===================
  // Every text Fox can say from a lesson's cards, café orders and animal-sound questions (what "Ma voix" can record)
  function voiceTexts(l) {
    const texts = [];
    const add = (t, label) => { if (t && !texts.some((x) => x.t === t)) texts.push({ t, label }); };
    l.cards.forEach((c) => { add(c.say, c.emoji + " " + c.word); if (c.ask) add(c.ask, c.emoji + " " + c.ask); });
    ((l.game && l.game.items) || l.cards).forEach((c) => add(c.order, c.emoji + " " + c.order));
    return texts;
  }
  function renderParent() {
    hush();
    const st = root.settings;
    const ready = LESSONS.filter((l) => l.ready);
    const doneN = ready.filter((l) => isDone(l.id)).length;
    const ticked = Object.values(state.skills).filter(Boolean).length;
    const allTexts = ready.reduce((acc, l) => acc.concat(voiceTexts(l).map((x) => x.t)), []);
    const uniq = [...new Set(allTexts)];
    const recN = uniq.filter((t) => voices.has(t)).length;
    const pct = (a, b) => Math.round((100 * a) / Math.max(1, b)) + "%";
    const rows = ready.map((l) => {
      const p = state.lessons[l.id];
      return `<tr><td>S${l.week} · ${esc(l.day.slice(0, 3))}</td><td>${esc(l.title)}</td>
        <td>${p ? "Faite le " + new Date(p.completedAt).toLocaleDateString("fr-FR") + (p.times > 1 ? ` (×${p.times})` : "") : "—"}</td>
        <td>${p && p.rating ? RATINGS[p.rating] : "—"}</td></tr>`;
    }).join("");
    const skills = [1, 2, 3, 4].map((w) => `<div class="skill-week"><b>Semaine ${w}</b>${window.SKILLS[w].map((x, i) => {
      const k = w + "-" + i;
      return `<label class="skill"><input type="checkbox" data-sk="${k}" ${state.skills[k] ? "checked" : ""}> ${esc(x)}</label>`;
    }).join("")}</div>`).join("");
    const seen = new Set();
    const links = LESSONS.filter((l) => l.video && !seen.has(l.video.page) && seen.add(l.video.page)).map((l) =>
      `<li><a href="${esc(l.video.page)}" target="_blank" rel="noopener noreferrer">${esc(l.video.title)}</a></li>`).join("");
    const limitOpt = (v, label) => `<label class="seg ${st.limit === v ? "on" : ""}"><input type="radio" name="limit" value="${v}" ${st.limit === v ? "checked" : ""}>${label}</label>`;

    app.innerHTML = `
      <header class="p-head">
        <button class="icon-btn" data-home aria-label="Accueil">${ICON.home}</button>
        <h1>Espace parent</h1>
        <span class="badge ${st.code ? "ok" : ""}">${ICON.lock}${st.code ? "Protégé par votre code" : "Pas encore de code"}</span>
      </header>

      <div class="p-grid">
        <section class="card"><h2>Qui joue ?</h2>
          ${root.profiles.map((p) => `<button class="kid ${p.id === root.active ? "on" : ""}" data-kid="${esc(p.id)}">
            <span class="avatar" style="background:${p.color}">${esc((p.data.name || "?").slice(0, 1).toUpperCase())}</span>
            <span><b>${esc(p.data.name || "Sans prénom")}</b><small>${p.data.stars} étoiles · ${LESSONS.filter((l) => l.ready && p.data.lessons[l.id] && p.data.lessons[l.id].status === "done").length}/20 leçons</small></span></button>`).join("")}
          ${root.profiles.length < 8 ? `<div class="add-kid"><label for="newkid" class="sr">Prénom du nouvel enfant</label>
            <input id="newkid" maxlength="20" placeholder="Prénom d'un autre enfant"><button data-addkid>Ajouter</button></div>` : ""}
        </section>

        <section class="card"><h2>Progression ${state.name ? "— " + esc(state.name) : ""}</h2>
          <div class="bar-row"><span>Leçons</span><span>${doneN} / ${ready.length}</span></div>
          <div class="bar"><i style="width:${pct(doneN, ready.length)};background:#F4862C"></i></div>
          <div class="bar-row"><span>Contrôle du vendredi</span><span data-tick>${ticked} / 16</span></div>
          <div class="bar"><i data-tickbar style="width:${pct(ticked, 16)};background:#3FAE6B"></i></div>
          <a href="#skills" class="more">Voir les compétences</a>
        </section>

        <section class="card"><h2>Temps d'écran</h2>
          <fieldset class="segs"><legend>Leçons par jour</legend>${limitOpt(1, "1")}${limitOpt(2, "2")}${limitOpt(0, "Sans limite")}</fieldset>
          <p class="small">Ensuite, le renard dit « See you tomorrow! » et l'appli se repose jusqu'au lendemain. Aujourd'hui : ${lessonsToday()} leçon(s).</p>
        </section>

        <section class="card"><h2>Code parent</h2>
          <p class="small">${st.code ? "Code actif. Pour le changer, tapez-en un nouveau." : "4 chiffres que vous choisissez, à la place de l'addition."}</p>
          <div class="add-kid"><label for="pcode" class="sr">Nouveau code à 4 chiffres</label>
            <input id="pcode" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••">
            <button data-setcode>${st.code ? "Changer" : "Créer"}</button></div>
          ${st.code ? `<button class="link" data-delcode>Supprimer le code</button>` : ""}
        </section>

        <section class="card"><h2>Sauvegarde</h2>
          <div class="two">
            <button class="dark" data-export>Exporter</button>
            <label class="ghost" for="impfile">Importer</label>
            <input id="impfile" type="file" accept="application/json,.json" class="sr">
          </div>
          <p class="small">${st.lastBackup ? "Dernière sauvegarde : " + esc(st.lastBackup) + "." : "Aucune sauvegarde pour l'instant."} Le fichier contient les progrès de tous les enfants (pas les enregistrements de voix ni le code).</p>
        </section>

        <section class="card"><h2>Voix et écoute</h2>
          <div class="bar-row"><span>Mots enregistrés avec ma voix</span><span>${recN} / ${uniq.length}</span></div>
          <div class="bar"><i style="width:${pct(recN, uniq.length)};background:#7C6CF2"></i></div>
          <a href="#voice" class="more">Enregistrer des mots</a>
          ${SR ? `<label class="skill"><input type="checkbox" data-listen ${st.listen ? "checked" : ""}> Fox listens (reconnaissance vocale)</label>` : ""}
        </section>
      </div>

      <section class="panel"><h2>Prénom de l'enfant</h2>
        <p class="small">Enregistré uniquement sur cette tablette. Jamais envoyé ailleurs, jamais publié sur GitHub.</p>
        <div class="add-kid"><label for="nm" class="sr">Prénom</label><input id="nm" maxlength="20" value="${esc(state.name)}" placeholder="Prénom"><button data-savename>Enregistrer</button></div></section>

      <section class="panel" id="skills"><h2>Contrôle du vendredi</h2>
        <p class="small">Cochez quand elle y arrive avec peu d'aide. Un jeu, pas un examen. Comprendre sans encore dire, c'est déjà un progrès.</p>
        <div class="skills">${skills}</div></section>

      <section class="panel" id="voice"><h2>Ma voix</h2>
        <p class="small">Enregistrez chaque mot avec votre voix : le renard l'utilisera à la place de la voix robot. Les enregistrements restent sur cette tablette (jamais envoyés). 3 secondes par mot.</p>
        <label for="vl" class="sr">Leçon</label>
        <select id="vl" class="vl">${ready.map((l) => `<option value="${l.id}">S${l.week} ${esc(l.day.slice(0, 3))} · ${esc(l.title)}</option>`).join("")}</select>
        <div id="vrows"></div></section>

      ${SR ? `<section class="panel"><h2>Fox listens</h2>
        <p class="small">Désactivé par défaut. Quand c'est activé, la tablette utilise la reconnaissance vocale du navigateur : sur la plupart des tablettes, la voix est envoyée aux serveurs de Google (Chrome / Android) ou d'Apple (Safari / iPad) pour être transformée en texte. Rien n'est enregistré par Hello Fox. Le renard ne dit jamais « faux » : il fait réécouter une fois puis passe au mot suivant.</p></section>` : ""}

      <section class="panel"><h2>Leçons</h2>
        <div class="table-wrap"><table><thead><tr><th>Jour</th><th>Leçon</th><th>Faite</th><th>Compétence</th></tr></thead><tbody>${rows}</tbody></table></div>
        <div class="row-btns"><button data-certprev>Aperçu du diplôme</button><button class="danger" data-reset>Réinitialiser cet enfant</button></div></section>

      ${standalone() ? "" : `<section class="panel"><h2>Installer comme une appli</h2>
        ${installEvt ? `<div class="row-btns"><button data-install2>Installer maintenant</button></div>` : ""}
        <ul class="small tips">
          <li><b>Android (Chrome)</b> : menu <b>⋮</b> en haut à droite → <b>Installer l'application</b> (ou <b>Ajouter à l'écran d'accueil</b> → <b>Installer</b>).</li>
          <li><b>iPad / iPhone (Safari)</b> : bouton <b>Partager</b> → <b>Sur l'écran d'accueil</b> → <b>Ajouter</b>.</li>
          <li>Pour qu'elle reste dans l'appli : <b>Accès guidé</b> sur iPad (Réglages → Accessibilité) ou <b>Épinglage d'application</b> sur Android (Réglages → Sécurité).</li>
        </ul></section>`}

      <section class="panel"><h2>Petites habitudes qui font la différence</h2>
        <ul class="small tips"><li>Revoir les mots d'hier avant d'en apprendre de nouveaux.</li>
        <li>Lui donner des raisons de parler : « Apple or banana? » et attendre quelques secondes.</li>
        <li>Utiliser l'anglais au quotidien : « Come here », « Let's go », « Wash your hands », « Good night ».</li>
        <li>Féliciter chaque essai. Si elle dit « apple », répondre « Yes! It is an apple. » sans corriger.</li></ul></section>

      <section class="panel"><h2>Vidéos et ressources officielles</h2><ul>${links}
        <li><a href="https://learnenglishkids.britishcouncil.org/listen-watch/songs/hello-hello-hello" target="_blank" rel="noopener noreferrer">Hello, hello, hello — British Council (chanson, fiche à imprimer)</a></li>
        <li><a href="https://learnenglishkids.britishcouncil.org/" target="_blank" rel="noopener noreferrer">LearnEnglish Kids — British Council</a></li></ul>
        <p class="small">Contenus © leurs auteurs, usage personnel et non commercial. Ce site n'est affilié ni à Super Simple / Skyship Entertainment ni au British Council.</p></section>

      <section class="panel"><h2>Confidentialité</h2>
        <p class="small">Pas de compte, pas de publicité, pas de statistiques. Polices hébergées ici (aucune requête à Google). Les vidéos YouTube se chargent seulement après votre confirmation, dans un lecteur qui ne peut pas ouvrir YouTube ni d'autres pages. Le micro (« hear yourself ») enregistre en mémoire, rejoue, puis efface. La progression reste dans le navigateur de cette tablette : pensez à exporter une sauvegarde.</p></section>`;

    app.querySelector("[data-home]").onclick = renderHome;
    const i2 = app.querySelector("[data-install2]"); if (i2) i2.onclick = doInstall;
    app.querySelectorAll("a.more").forEach((a) => a.onclick = (e) => { e.preventDefault(); const t = document.querySelector(a.getAttribute("href")); if (t) t.scrollIntoView({ behavior: "smooth" }); });

    // profiles
    app.querySelectorAll("[data-kid]").forEach((b) => b.onclick = () => { switchProfile(b.dataset.kid); homeWeek = null; renderParent(); toast("C'est au tour de " + (state.name || "cet enfant")); });
    const ak = app.querySelector("[data-addkid]");
    if (ak) ak.onclick = () => {
      const name = app.querySelector("#newkid").value.trim().slice(0, 20);
      if (!name) { toast("Écrivez un prénom."); return; }
      const id = "p" + Date.now().toString(36);
      root.profiles.push({ id, color: COLORS[root.profiles.length % COLORS.length], data: fresh(name) });
      save(); renderParent(); toast(name + " ajouté(e) ✓");
    };
    // screen time
    app.querySelectorAll('input[name="limit"]').forEach((r) => r.onchange = () => { st.limit = Number(r.value); save(); renderParent(); toast("Temps d'écran enregistré ✓"); });
    // parent code
    app.querySelector("[data-setcode]").onclick = () => {
      const v = app.querySelector("#pcode").value.trim();
      if (!/^\d{4}$/.test(v)) { toast("Le code doit avoir 4 chiffres."); return; }
      st.code = v; save(); renderParent(); toast("Code enregistré ✓ Notez-le quelque part.");
    };
    const dc = app.querySelector("[data-delcode]");
    if (dc) dc.onclick = () => { if (confirm("Supprimer le code parent ?")) { st.code = ""; save(); renderParent(); } };
    // backup: export everything except voice recordings and the code; import replaces after a confirmation
    app.querySelector("[data-export]").onclick = () => {
      const copy = JSON.parse(JSON.stringify(root)); copy.settings.code = "";
      copy.exportedAt = new Date().toISOString(); copy.app = "hellofox";
      const blob = new Blob([JSON.stringify(copy, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "hellofox-sauvegarde-" + today() + ".json"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      st.lastBackup = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); save();
      renderParent(); toast("Sauvegarde téléchargée ✓");
    };
    app.querySelector("#impfile").onchange = async (e) => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      if (f.size > 2000000) { toast("Fichier trop gros."); return; }
      let data = null;
      try { data = cleanRoot(JSON.parse(await f.text())); } catch (err) { data = null; }
      if (!data) { toast("Ce fichier n'est pas une sauvegarde Hello Fox."); return; }
      const kids = data.profiles.map((p) => p.data.name || "?").join(", ");
      if (!confirm("Remplacer la progression actuelle par celle du fichier ?\nEnfants : " + kids)) return;
      data.settings.code = st.code; data.settings.setupDone = true; // keep this tablet's code; already set up
      root = data; state = profile().data; save(); homeWeek = null;
      renderParent(); toast("Sauvegarde restaurée ✓");
    };
    // voice recordings
    const vl = app.querySelector("#vl");
    const vrows = () => {
      const texts = voiceTexts(LESSONS.find((x) => x.id === vl.value));
      app.querySelector("#vrows").innerHTML = texts.map((x, i) => `<div class="vrow"><span class="vtxt">${esc(x.label)}<small>${esc(x.t)}</small></span>
        <button data-vp="${i}" aria-label="Écouter">${ICON.ear}</button>
        <button data-vr="${i}" class="${voices.has(x.t) ? "has" : ""}" aria-label="${voices.has(x.t) ? "Réenregistrer" : "Enregistrer"}">${ICON.mic}</button>
        ${voices.has(x.t) ? `<button data-vd="${i}" aria-label="Supprimer">✕</button>` : ""}</div>`).join("");
      app.querySelectorAll("[data-vp]").forEach((b) => b.onclick = () => speak(texts[b.dataset.vp].t));
      app.querySelectorAll("[data-vd]").forEach((b) => b.onclick = async () => { await voiceDel(texts[b.dataset.vd].t); vrows(); });
      app.querySelectorAll("[data-vr]").forEach((b) => b.onclick = async () => {
        let stream;
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
        catch (e) { toast("Micro non autorisé."); return; }
        const chunks = [], rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        rec.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          try { await voicePut(texts[b.dataset.vr].t, new Blob(chunks, { type: rec.mimeType || "audio/mp4" })); toast("Enregistré ✓"); }
          catch (e) { toast("Impossible d'enregistrer sur cet appareil."); }
          vrows(); speak(texts[b.dataset.vr].t);
        };
        b.classList.add("recording"); b.disabled = true; rec.start();
        setTimeout(() => rec.state !== "inactive" && rec.stop(), 3000);
      });
    };
    vl.onchange = vrows; vrows();
    const cp = app.querySelector("[data-certprev]"); if (cp) cp.onclick = renderCertificate;
    const lt = app.querySelector("[data-listen]");
    if (lt) lt.onchange = () => { st.listen = lt.checked; listenBroken = false; save(); toast(lt.checked ? "Fox listens : activé" : "Fox listens : désactivé"); };
    app.querySelector("[data-savename]").onclick = () => {
      state.name = app.querySelector("#nm").value.trim().slice(0, 20); save(); renderParent(); toast("Enregistré ✓");
    };
    app.querySelectorAll("[data-sk]").forEach((c) => c.onchange = () => {
      state.skills[c.dataset.sk] = c.checked; save();
      const n = Object.values(state.skills).filter(Boolean).length;
      app.querySelector("[data-tick]").textContent = n + " / 16";
      app.querySelector("[data-tickbar]").style.width = pct(n, 16);
    });
    app.querySelector("[data-reset]").onclick = () => {
      if (confirm("Effacer la progression de " + (state.name || "cet enfant") + " sur cet appareil ?")) {
        const n = state.name; profile().data = fresh(n); state = profile().data; save(); renderParent(); toast("Progression effacée");
      }
    };
  }

  // ---------- boot ----------
  // Not set up yet: in the installed app (or "continue in browser") -> parent setup; otherwise -> landing page.
  function boot() {
    if (root.settings.setupDone) return renderHome();
    let browserOK = false;
    try { browserOK = sessionStorage.getItem("hf-browser") === "1"; } catch (e) { }
    if (standalone() || browserOK) { setupStep = 0; renderSetup(); } else renderLanding();
  }
  boot();
  voiceAll();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();

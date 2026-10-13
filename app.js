/* Hello Fox! — app logic, no frameworks, no tracking.
   Progress is stored only on this device (localStorage). Voice recordings are never stored. */
(function () {
  "use strict";

  const LESSONS = window.LESSONS;
  const STICKERS = window.STICKERS;
  const app = document.getElementById("app");
  const STORE_KEY = "my-english-v1";
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

  // ---------- storage (guarded: private mode / cleared data must not break the app) ----------
  function fresh() { return { name: "", stars: 0, lessons: {}, skills: {}, seenStickers: 0 }; }
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(STORE_KEY)) || {}); } catch (e) { return fresh(); }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast("Progression non sauvegardée sur cet appareil."); }
  }
  let state = load();

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
  function utter(text, pitch) {
    const u = new SpeechSynthesisUtterance(fill(text));
    u.lang = voice ? voice.lang : "en-GB";
    if (voice) u.voice = voice;
    u.rate = 0.8; u.pitch = pitch || 1.1;
    return u;
  }
  function speak(text) {
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
  const hush = () => { if (hasTTS) speechSynthesis.cancel(); };

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

  // ---------- parent gate: a sum a 6-year-old can't do yet ----------
  function parentGate(onPass) {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5), ans = a + b;
    const opts = shuffle([ans, ans + 2, ans - 3]);
    const wrap = document.createElement("div");
    wrap.className = "gate";
    wrap.innerHTML = `<div><h2>Espace parent</h2><p>Combien font ${a} + ${b} ?</p>
      <div class="row-btns center">${opts.map((o) => `<button data-v="${o}" class="gate-num">${o}</button>`).join("")}</div>
      <div class="row-btns center"><button data-cancel>Annuler</button></div></div>`;
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      wrap.remove();
      if (!btn.hasAttribute("data-cancel") && Number(btn.dataset.v) === ans) onPass();
    });
    document.body.appendChild(wrap);
  }

  // =================== HOME ===================
  function renderHome() {
    hush();
    const next = nextLesson();
    const weeks = [1, 2, 3, 4].map((w) => {
      const tiles = LESSONS.filter((l) => l.week === w).map((l) => {
        const done = isDone(l.id);
        const cls = ["lesson-tile", done ? "done" : "", !l.ready ? "soon" : "", next && next.id === l.id && !done ? "next" : ""].join(" ");
        return `<button class="${cls}" data-lesson="${l.id}" aria-label="${esc(l.title)}${l.ready ? "" : " (bientôt)"}">
          <span class="e">${l.emoji}</span>${esc(l.day.slice(0, 3))}${l.ready ? "" : `<span class="soon-tag">soon</span>`}</button>`;
      }).join("");
      return `<section class="week"><h2>Week ${w} <span>· ${esc(window.WEEK_THEMES[w])}</span></h2><div class="lesson-row">${tiles}</div></section>`;
    }).join("");

    app.innerHTML = `
      <div class="topbar">
        <div class="stars-pill" aria-label="${state.stars} stars">⭐ ${state.stars}</div>
        <button class="sticker-btn" data-stickers>📒 ${stickerCount()}/${STICKERS.length}</button>
        <button class="parent-btn" data-parent>Espace parent</button>
      </div>
      <section class="hero">
        <button class="mascot-btn" data-fox aria-label="Fox"><span class="mascot">🦊</span></button>
        <h1>Hello, ${esc(childName())}!</h1>
        <p>Let's learn English together.</p>
        <button class="big-start" data-start>▶ Start today's lesson
          <small>${next ? esc(next.emoji + " " + next.title) : ""}</small></button>
      </section>
      ${weeks}`;

    app.querySelector("[data-start]").onclick = () => startLesson(next.id);
    app.querySelector("[data-fox]").onclick = () => speak(`Hello, ${childName()}! I'm Fox. Let's play!`);
    app.querySelector("[data-stickers]").onclick = renderStickers;
    app.querySelector("[data-parent]").onclick = () => parentGate(renderParent);
    app.querySelectorAll("[data-lesson]").forEach((b) => b.onclick = () => {
      const l = LESSONS.find((x) => x.id === b.dataset.lesson);
      if (l.ready) startLesson(l.id); else { speak("Soon!"); toast("Bientôt disponible"); }
    });
  }

  // =================== STICKER BOOK ===================
  function renderStickers() {
    const n = stickerCount();
    const toNext = 3 - (state.stars % 3);
    const grid = STICKERS.map((s, i) => i < n
      ? `<button class="sticker got" data-w="${esc(s.w)}"><span>${s.e}</span>${esc(s.w)}</button>`
      : `<div class="sticker"><span>❔</span>&nbsp;</div>`).join("");
    app.innerHTML = `
      <div class="topbar"><button class="icon-btn" data-home aria-label="Home">🏠</button>
        <div class="stars-pill">⭐ ${state.stars}</div></div>
      <section class="stage"><h2>My stickers</h2>
        <div class="minutes">${n < STICKERS.length ? `Encore ${toNext} ⭐ pour le prochain autocollant` : "Collection complète ! 🎉"}</div>
        <div class="sticker-grid">${grid}</div></section>`;
    speak(n ? "Your stickers! Tap and say the word!" : "Finish a lesson to get a sticker!");
    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelectorAll("[data-w]").forEach((b) => b.onclick = () => { speak(b.dataset.w + "!"); b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle"); });
  }

  // =================== LESSON PLAYER ===================
  let L, step, play;
  function startLesson(id) {
    L = LESSONS.find((l) => l.id === id);
    step = 0;
    play = { heardWarmup: false, heard: new Set(), round: 0, order: null, rating: null };
    renderStep();
  }

  function frame(inner, canNext, nextLabel) {
    const dots = STEP_NAMES.map((_, i) => `<span class="dot ${i < step ? "done" : i === step ? "on" : ""}"></span>`).join("");
    app.innerHTML = `
      <div class="topbar">
        <button class="icon-btn" data-home aria-label="Home">🏠</button>
        <div class="steps" aria-label="Step ${step + 1} of 5">${dots}</div>
        <button class="icon-btn fox-help" data-help aria-label="Fox, say it again">🦊</button>
      </div>
      <section class="stage">${inner}</section>
      <div class="nav">
        ${step > 0 ? `<button class="back-btn" data-back aria-label="Back">◀</button>` : ""}
        <button class="next-btn" data-next ${canNext ? "" : "disabled"}>${nextLabel || "Next ▶"}</button>
      </div>`;
    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelector("[data-help]").onclick = () => speak(STEP_SAY[step]);
    const back = app.querySelector("[data-back]"); if (back) back.onclick = () => { step--; renderStep(); };
    app.querySelector("[data-next]").onclick = () => { if (step < 4) { step++; renderStep(); } else finishLesson(); };
  }
  const enableNext = () => { const n = app.querySelector("[data-next]"); if (n && n.disabled) { n.disabled = false; n.classList.add("pulse"); } };
  const minutes = () => `<div class="minutes">⏱ ~${STEP_MINUTES[step]} min</div>`;
  const note = (t) => `<div class="parent-note"><b>👪 Pour le parent</b>${esc(fill(t))}</div>`;

  function renderStep() {
    hush();
    window.scrollTo(0, 0);
    [stepHello, stepLearn, stepWatch, stepPlay, stepStars][step]();
  }

  // 1. Hello: warm-up + quick review of the previous lesson ("repeat yesterday's words")
  function stepHello() {
    const prev = previousLesson(L);
    const review = prev ? shuffle(prev.cards).slice(0, 3) : [];
    frame(`
      <div class="mascot" aria-hidden="true">🦊</div>
      <h2>${esc(L.emoji)} ${esc(L.title)}</h2>${minutes()}
      <button class="listen-btn" data-say>🔊 Listen</button>
      <div class="prompt">${esc(fill(L.warmup.prompt))}</div>
      <button class="did-btn" data-did>🙋‍♀️ I did it!</button>
      ${review.length ? `<div class="review"><div class="review-title">🧠 Remember?</div>
        ${review.map((c) => `<button class="chip" data-r="${esc(c.say)}"><span>${c.emoji}</span>${esc(c.word)}</button>`).join("")}</div>` : ""}
      ${note(L.warmup.parent)}`, play.heardWarmup);
    speak(L.warmup.say);
    app.querySelector("[data-say]").onclick = () => speak(L.warmup.say);
    app.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => speak(b.dataset.r));
    app.querySelector("[data-did]").onclick = () => { play.heardWarmup = true; chime(true); confetti(12); speak("Great job!"); enableNext(); };
  }

  // 2. Learn: tap every card to hear it
  function stepLearn() {
    const cards = L.cards.map((c, i) => `<button class="word-card ${play.heard.has(i) ? "heard" : ""}" data-i="${i}">
      <span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`).join("");
    frame(`<h2>New words</h2>${minutes()}<div class="cards">${cards}</div>
      ${note("Touchez chaque image, écoutez, puis répétez ensemble avec le geste. Montrez le sens avant de traduire ; un mot en français si elle bloque, puis on revient à l'anglais.")}`,
      play.heard.size === L.cards.length);
    speak(STEP_SAY[1]);
    app.querySelectorAll(".word-card").forEach((b) => b.onclick = () => {
      const i = Number(b.dataset.i); speak(L.cards[i].say);
      play.heard.add(i); b.classList.add("heard"); b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle");
      if (play.heard.size === L.cards.length) { chime(true); enableNext(); }
    });
  }

  // 3. Watch: YouTube's official embeddable player, loaded after a parent confirms (once per session)
  let videoOK = false;
  function stepWatch() {
    const v = L.video;
    frame(`<h2>Watch & sing</h2>${minutes()}
      <div class="video-box" id="vbox"><div class="video-gate">
        <div style="font-size:64px">🎬</div>
        <button class="listen-btn" data-load>▶ Play video</button>
        <p>${videoOK ? "" : "Un parent confirme une fois (la vidéo vient de YouTube)."}</p>
      </div></div>
      <div class="small">${esc(v.title)} · vidéo officielle diffusée via le lecteur YouTube.</div>
      <div class="row-btns center"><button class="link-btn" data-alt>🎵 Sing with Fox</button></div>
      ${note("Regardez ensemble, faites pause et répétez les mots. « Sing with Fox » : une petite comptine sans internet, à répéter ligne par ligne.")}`, true);
    speak(STEP_SAY[2]);
    const load = () => {
      videoOK = true; hush();
      document.getElementById("vbox").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?rel=0&playsinline=1&modestbranding=1"
        title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    };
    app.querySelector("[data-load]").onclick = () => videoOK ? load() : parentGate(load);
    app.querySelector("[data-alt]").onclick = () => speakLines(L.chant || L.cards.map((c) => c.say));
  }

  // 4. Play: listen & tap game, then the dialogue with "hear myself"
  function stepPlay() {
    const ROUNDS = L.cards.length;
    const gameDone = play.round >= ROUNDS;
    const order = play.order || (play.order = shuffle(L.cards.map((_, i) => i)));
    const cards = shuffle(L.cards.map((c, i) => ({ c, i }))).map(({ c, i }) =>
      `<button class="word-card" data-i="${i}"><span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`).join("");
    // Without a saved name: speaker shows "Me" and the line says "My name is …"
    const who = (w) => w === "{name}" ? "🙋‍♀️ " + (state.name || "Me") : w === "Parent" ? "👨 Parent" : "👫 Both";
    const line = (t) => state.name ? fill(t) : t.replace(/\{name\}/g, "…");
    const script = L.speak.script.map((s) => `<div class="script-line"><span class="who">${esc(who(s.who))}</span>
      <span class="say">${esc(line(s.line))}</span><button class="mini-listen" data-line="${esc(line(s.line).replace("…", ""))}" aria-label="Listen">🔊</button></div>`).join("");
    const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

    frame(`<h2>${gameDone ? "Let's talk!" : "Listen & tap"}</h2>${minutes()}
      ${gameDone ? "" : `
        <button class="listen-btn" data-q>🔊 What do you hear?</button>
        <div class="progress-stars">${Array.from({ length: ROUNDS }, (_, i) => i < play.round ? "⭐" : "☆").join(" ")}</div>
        <div class="cards">${cards}</div>`}
      ${gameDone ? `<div class="script">${script}</div>
        ${canRecord ? `<button class="rec-btn" data-rec>🎤 Say it, then hear yourself!</button>` : ""}
        ${note(L.speak.activity + (canRecord ? " Le micro enregistre 4 secondes puis rejoue sa voix. Rien n'est sauvegardé ni envoyé." : ""))}` : ""}`, gameDone);

    if (gameDone) {
      speak("Now, let's talk!");
      app.querySelectorAll("[data-line]").forEach((b) => b.onclick = () => speak(b.dataset.line));
      const rec = app.querySelector("[data-rec]"); if (rec) rec.onclick = () => recordMe(rec);
      return;
    }
    const target = order[play.round];
    let firstTry = true;
    const ask = () => speak(L.cards[target].say);
    setTimeout(ask, play.round === 0 ? 1800 : 300);
    if (play.round === 0) speak(STEP_SAY[3]);
    app.querySelector("[data-q]").onclick = ask;
    app.querySelectorAll(".word-card").forEach((b) => b.onclick = () => {
      if (play.locked) return;
      const i = Number(b.dataset.i);
      if (i === target) {
        play.locked = true;
        b.classList.add("right"); chime(true); confetti(firstTry ? 10 : 5);
        speak(PRAISE[play.round % PRAISE.length]);
        play.round++;
        setTimeout(() => { play.locked = false; stepPlay(); }, 1200);
      } else {
        firstTry = false; b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        chime(false); setTimeout(ask, 500);
      }
    });
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
      btn.textContent = "🔊 Listen to you!"; btn.classList.remove("recording");
      audio.onended = () => { URL.revokeObjectURL(url); btn.textContent = "🎤 Again!"; btn.disabled = false; chime(true); confetti(8); };
      audio.play().catch(() => { btn.textContent = "🎤 Again!"; btn.disabled = false; });
    };
    btn.disabled = true; btn.classList.add("recording"); btn.textContent = "🔴 Speak now!";
    rec.start();
    setTimeout(() => rec.state !== "inactive" && rec.stop(), 4000);
  }

  // 5. Star time: praise + optional parent rating (no score shown to the child)
  function stepStars() {
    const sel = (k) => play.rating === k ? "sel" : "";
    frame(`<div class="mascot dance" aria-hidden="true">🦊</div>
      <h2>Well done, ${esc(childName())}!</h2>${minutes()}
      <div class="score" aria-label="3 stars"><span>⭐</span><span>⭐</span><span>⭐</span></div>
      <div class="review">${L.cards.map((c) => `<button class="chip" data-r="${esc(c.say)}"><span>${c.emoji}</span>${esc(c.word)}</button>`).join("")}</div>
      <button class="listen-btn" data-bye>🔊 Goodbye!</button>
      <div class="parent-note"><b>👪 Pour le parent — ${esc(L.skill)}</b>
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
    save();
    if (stickerCount() > before) renderNewSticker(STICKERS[stickerCount() - 1]);
    else { renderHome(); toast(firstTime ? "+3 ⭐" : "+1 ⭐ — bravo pour la révision !"); }
  }

  function renderNewSticker(s) {
    app.innerHTML = `<section class="stage reveal">
      <h2>New sticker!</h2>
      <div class="big-sticker">${s.e}</div>
      <div class="prompt">${esc(s.w)}</div>
      <button class="listen-btn" data-say>🔊 ${esc(s.w)}</button>
      <div class="nav"><button class="next-btn" data-ok>📒 My stickers</button></div></section>`;
    confetti(30); chime(true);
    speak(`You got a new sticker! ${s.w}!`);
    app.querySelector("[data-say]").onclick = () => speak(s.w + "!");
    app.querySelector("[data-ok]").onclick = renderStickers;
  }

  // =================== PARENT AREA ===================
  function renderParent() {
    hush();
    const rows = LESSONS.filter((l) => l.ready).map((l) => {
      const p = state.lessons[l.id];
      return `<tr><td>S${l.week} · ${esc(l.day.slice(0, 3))}</td><td>${esc(l.title)}</td>
        <td>${p ? "✅ " + new Date(p.completedAt).toLocaleDateString("fr-FR") + (p.times > 1 ? ` (×${p.times})` : "") : "—"}</td>
        <td>${p && p.rating ? RATINGS[p.rating] : "—"}</td></tr>`;
    }).join("");
    const ticked = Object.values(state.skills).filter(Boolean).length;
    const skills = [1, 2, 3, 4].map((w) => `<div class="skill-week"><b>Semaine ${w}</b>${window.SKILLS[w].map((s, i) => {
      const k = w + "-" + i;
      return `<label class="skill"><input type="checkbox" data-sk="${k}" ${state.skills[k] ? "checked" : ""}> ${esc(s)}</label>`;
    }).join("")}</div>`).join("");
    const seen = new Set();
    const links = LESSONS.filter((l) => l.video && !seen.has(l.video.page) && seen.add(l.video.page)).map((l) =>
      `<li><a href="${esc(l.video.page)}" target="_blank" rel="noopener noreferrer">${esc(l.video.title)}</a></li>`).join("");

    app.innerHTML = `
      <div class="topbar"><button class="icon-btn" data-home aria-label="Home">🏠</button><h1 class="parent-title">Espace parent</h1><span></span></div>
      <section class="panel"><h2>Prénom affiché</h2>
        <p class="small">Enregistré uniquement sur cette tablette. Jamais envoyé ailleurs, jamais publié sur GitHub.</p>
        <input id="nm" maxlength="20" value="${esc(state.name)}" placeholder="Prénom">
        <div class="row-btns"><button data-savename>Enregistrer</button></div></section>
      <section class="panel"><h2>Contrôle du vendredi ⭐ ${ticked}/16</h2>
        <p class="small">Cochez quand elle y arrive avec peu d'aide. Un jeu, pas un examen. Comprendre sans encore dire, c'est déjà un progrès.</p>
        <div class="skills">${skills}</div></section>
      <section class="panel"><h2>Leçons</h2>
        <table><thead><tr><th>Jour</th><th>Leçon</th><th>Faite</th><th>Compétence</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="small">Étoiles : ${state.stars} · Autocollants : ${stickerCount()}/${STICKERS.length}</p>
        <div class="row-btns"><button data-export>Exporter (fichier)</button><button class="danger" data-reset>Réinitialiser</button></div></section>
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
        <p class="small">Pas de compte, pas de publicité, pas de statistiques. Le micro (« hear yourself ») enregistre en mémoire, rejoue, puis efface : rien n'est sauvegardé ni envoyé. La progression reste dans le navigateur de cette tablette ; effacer les données du navigateur l'efface.</p></section>`;

    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelector("[data-savename]").onclick = () => {
      state.name = document.getElementById("nm").value.trim().slice(0, 20); save(); toast("Enregistré ✓");
    };
    app.querySelectorAll("[data-sk]").forEach((c) => c.onchange = () => {
      state.skills[c.dataset.sk] = c.checked; save();
      app.querySelector(".skills").previousElementSibling.previousElementSibling.textContent =
        `Contrôle du vendredi ⭐ ${Object.values(state.skills).filter(Boolean).length}/16`;
    });
    app.querySelector("[data-export]").onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "hellofox-progression.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    app.querySelector("[data-reset]").onclick = () => {
      if (confirm("Effacer toute la progression sur cet appareil ?")) { const n = state.name; state = fresh(); state.name = n; save(); renderParent(); toast("Progression effacée"); }
    };
  }

  // ---------- boot ----------
  renderHome();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();

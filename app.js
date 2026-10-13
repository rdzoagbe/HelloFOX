/* Hello Fox! — single-file app logic, no frameworks, no tracking.
   Progress is stored only on this device (localStorage). */
(function () {
  "use strict";

  const LESSONS = window.LESSONS;
  const app = document.getElementById("app");
  const STORE_KEY = "my-english-v1";
  const STEP_NAMES = ["hello", "learn", "watch", "play", "stars"];
  const STEP_MINUTES = [5, 7, 6, 7, 5];
  const RATINGS = { not_yet: "Pas encore", with_help: "Avec aide", independent: "Seule" };

  // ---------- storage (always guarded: private mode / cleared data must not break the app) ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || fresh(); } catch (e) { return fresh(); }
  }
  function fresh() { return { name: "", stars: 0, lessons: {} }; }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast("Progression non sauvegardée sur cet appareil."); }
  }
  let state = load();

  const childName = () => state.name || "friend";
  const fill = (s) => s.replace(/\{name\}/g, childName());
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- speech (built-in browser voice; no data leaves the device for TTS on iPad/Android) ----------
  let voice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find((v) => /en-GB/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("Audio non disponible sur ce navigateur."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fill(text));
    u.lang = voice ? voice.lang : "en-GB";
    if (voice) u.voice = voice;
    u.rate = 0.8; u.pitch = 1.1;
    speechSynthesis.speak(u);
  }

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
      const notes = ok ? [660, 880] : [220];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.12); o.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch (e) { /* sound is optional */ }
  }
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function nextLesson() {
    return LESSONS.find((l) => l.ready && !(state.lessons[l.id] && state.lessons[l.id].status === "done"))
      || LESSONS.find((l) => l.ready);
  }

  // ---------- parent gate: a sum a 6-year-old can't read yet ----------
  function parentGate(onPass) {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 5), ans = a + b;
    const opts = shuffle([ans, ans + 2, ans - 3]);
    const wrap = document.createElement("div");
    wrap.className = "panel";
    wrap.style.cssText = "position:fixed;inset:0;z-index:20;margin:0;border-radius:0;display:grid;place-items:center;text-align:center";
    wrap.innerHTML = `<div><h2>Espace parent</h2><p>Combien font ${a} + ${b} ?</p>
      <div class="row-btns" style="justify-content:center">${opts.map((o) => `<button data-v="${o}" style="font-size:26px;min-width:90px">${o}</button>`).join("")}</div>
      <div class="row-btns" style="justify-content:center"><button data-cancel>Annuler</button></div></div>`;
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button"); if (!btn) return;
      if (btn.hasAttribute("data-cancel")) return wrap.remove();
      if (Number(btn.dataset.v) === ans) { wrap.remove(); onPass(); } else { wrap.remove(); }
    });
    document.body.appendChild(wrap);
  }

  // =================== HOME ===================
  function renderHome() {
    const next = nextLesson();
    const weeks = [1, 2, 3, 4].map((w) => {
      const tiles = LESSONS.filter((l) => l.week === w).map((l) => {
        const done = state.lessons[l.id] && state.lessons[l.id].status === "done";
        const cls = ["lesson-tile", done ? "done" : "", !l.ready ? "locked" : "", next && next.id === l.id && !done ? "next" : ""].join(" ");
        return `<button class="${cls}" data-lesson="${l.id}" aria-label="${esc(l.title)}${l.ready ? "" : " (bientôt)"}">
          <span class="e">${l.ready ? l.emoji : "🔒"}</span>${esc(l.day.slice(0, 3))}</button>`;
      }).join("");
      return `<section class="week"><h2>Week ${w} <span>· ${esc(window.WEEK_THEMES[w])}</span></h2><div class="lesson-row">${tiles}</div></section>`;
    }).join("");

    app.innerHTML = `
      <div class="topbar">
        <div class="stars-pill" aria-label="${state.stars} stars">⭐ ${state.stars}</div>
        <button class="parent-btn" data-parent>Espace parent</button>
      </div>
      <section class="hero">
        <div class="mascot" aria-hidden="true">🦊</div>
        <h1>Hello, ${esc(childName())}!</h1>
        <p>Let's learn English together.</p>
        <button class="big-start" data-start="${next ? next.id : ""}">▶ Start today's lesson
          <small>${next ? esc(next.title) : ""}</small></button>
      </section>
      ${weeks}`;

    app.querySelector("[data-start]").onclick = () => { speak("Let's go!"); startLesson(next.id); };
    app.querySelector("[data-parent]").onclick = () => parentGate(renderParent);
    app.querySelectorAll("[data-lesson]").forEach((b) => b.onclick = () => {
      const l = LESSONS.find((x) => x.id === b.dataset.lesson);
      if (l.ready) startLesson(l.id); else { speak("Soon!"); toast("Bientôt disponible"); }
    });
    // Greet once per load, only after a tap (browsers block audio without one).
  }

  // =================== LESSON PLAYER ===================
  let L, step, play;
  function startLesson(id) {
    L = LESSONS.find((l) => l.id === id);
    step = 0;
    play = { heardWarmup: false, heard: new Set(), round: 0, correct: 0, target: null, rating: null };
    renderStep();
  }

  function frame(inner, canNext, nextLabel) {
    const dots = STEP_NAMES.map((_, i) => `<span class="dot ${i < step ? "done" : i === step ? "on" : ""}"></span>`).join("");
    app.innerHTML = `
      <div class="topbar">
        <button class="icon-btn" data-home aria-label="Home">🏠</button>
        <div class="steps" aria-label="Step ${step + 1} of 5">${dots}</div>
        <div class="stars-pill">⭐ ${state.stars}</div>
      </div>
      <section class="stage">${inner}</section>
      <div class="nav">
        ${step > 0 ? `<button class="back-btn" data-back aria-label="Back">◀</button>` : ""}
        <button class="next-btn" data-next ${canNext ? "" : "disabled"}>${nextLabel || "Next ▶"}</button>
      </div>`;
    app.querySelector("[data-home]").onclick = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); renderHome(); };
    const back = app.querySelector("[data-back]"); if (back) back.onclick = () => { step--; renderStep(); };
    app.querySelector("[data-next]").onclick = () => { if (step < 4) { step++; renderStep(); } else finishLesson(); };
  }
  const enableNext = () => { const n = app.querySelector("[data-next]"); if (n) n.disabled = false; };
  const minutes = () => `<div class="minutes">⏱ ~${STEP_MINUTES[step]} min</div>`;
  const note = (t) => `<div class="parent-note"><b>👪 Pour le parent</b>${esc(fill(t))}</div>`;

  function renderStep() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    window.scrollTo(0, 0);
    [stepHello, stepLearn, stepWatch, stepPlay, stepStars][step]();
  }

  // 1. Hello / warm-up
  function stepHello() {
    frame(`
      <div class="mascot" aria-hidden="true">🦊</div>
      <h2>${esc(L.title)}</h2>${minutes()}
      <button class="listen-btn" data-say>🔊 Listen</button>
      <div class="prompt">${esc(fill(L.warmup.prompt))}</div>
      <button class="link-btn" data-did style="font-size:24px;min-height:72px;background:#FFF1D6">🙋 I said it!</button>
      ${note(L.warmup.parent)}`, play.heardWarmup);
    app.querySelector("[data-say]").onclick = () => speak(L.warmup.say);
    app.querySelector("[data-did]").onclick = () => { play.heardWarmup = true; chime(true); speak("Great job!"); enableNext(); };
  }

  // 2. Learn: tap every card to hear it
  function stepLearn() {
    const cards = L.cards.map((c, i) => `<button class="word-card ${play.heard.has(i) ? "heard" : ""}" data-i="${i}">
      <span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`).join("");
    frame(`<h2>New words</h2>${minutes()}<div class="prompt">Tap and repeat!</div><div class="cards">${cards}</div>
      ${note("Touchez chaque image, écoutez, puis répétez ensemble. Faites le geste (main qui salue, pouce levé…).")}`,
      play.heard.size === L.cards.length);
    app.querySelectorAll(".word-card").forEach((b) => b.onclick = () => {
      const i = Number(b.dataset.i); speak(L.cards[i].say);
      play.heard.add(i); b.classList.add("heard");
      if (play.heard.size === L.cards.length) enableNext();
    });
  }

  // 3. Watch: YouTube's official embeddable player, loaded only after a parent confirms
  function stepWatch() {
    const v = L.video;
    frame(`<h2>Watch & sing</h2>${minutes()}
      <div class="video-box" id="vbox"><div class="video-gate">
        <div style="font-size:64px">🎬</div>
        <button class="listen-btn" data-load>▶ Play video</button>
        <p>Un parent doit confirmer (la vidéo vient de YouTube).</p>
      </div></div>
      <div class="small">${esc(v.title)} · vidéo officielle diffusée via le lecteur YouTube.</div>
      <div class="row-btns" style="justify-content:center">
        <button class="link-btn" data-alt>🎵 Pas de vidéo ? Chantons ensemble</button>
      </div>
      ${note("La vidéo n'est chargée qu'après votre confirmation. Mode « youtube-nocookie » utilisé. Si la vidéo ne se lance pas, ouvrez la page officielle depuis l'espace parent, ou faites l'activité de remplacement.")}`, true);

    app.querySelector("[data-load]").onclick = () => parentGate(() => {
      const box = document.getElementById("vbox");
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?rel=0&playsinline=1&modestbranding=1"
        title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    });
    // In-app fallback: our own short chant (original text, not the song's lyrics).
    app.querySelector("[data-alt]").onclick = () => {
      const lines = ["Hello, hello!", fill("Hello, {name}!"), "Yes, yes, yes!", "No, no, no!", "Goodbye, goodbye!"];
      let k = 0;
      const sayNext = () => {
        if (k >= lines.length) return;
        const u = new SpeechSynthesisUtterance(lines[k++]);
        if (voice) u.voice = voice; u.lang = voice ? voice.lang : "en-GB"; u.rate = 0.8; u.pitch = 1.2;
        u.onend = () => setTimeout(sayNext, 900);
        speechSynthesis.speak(u);
      };
      if ("speechSynthesis" in window) { speechSynthesis.cancel(); sayNext(); }
      toast("Répétez chaque ligne après la voix 🎵");
    };
  }

  // 4. Play: listen & tap (4 rounds), then the speaking script
  function stepPlay() {
    const ROUNDS = L.cards.length;
    const gameDone = play.round >= ROUNDS;
    const order = play.order || (play.order = shuffle(L.cards.map((_, i) => i)));
    const cards = L.cards.map((c, i) => `<button class="word-card" data-i="${i}"><span class="e" aria-hidden="true">${c.emoji}</span>${esc(c.word)}</button>`).join("");
    const script = L.speak.script.map((s) => `<div class="script-line"><span class="who">${esc(fill(s.who))}</span>
      <span class="say">${esc(s.line)}</span><button class="mini-listen" data-line="${esc(s.line)}" aria-label="Listen">🔊</button></div>`).join("");

    frame(`<h2>Listen & tap</h2>${minutes()}
      ${gameDone ? `<div class="prompt">🎉 Super! You did it!</div>` : `
        <button class="listen-btn" data-q>🔊 What do you hear?</button>
        <div class="small">Round ${play.round + 1} / ${ROUNDS}</div>
        <div class="cards">${cards}</div>`}
      <h2 style="margin-top:28px">Let's talk!</h2>
      <div class="script">${script}</div>
      ${note(L.speak.activity)}`, gameDone);

    app.querySelectorAll("[data-line]").forEach((b) => b.onclick = () => speak(b.dataset.line));
    if (gameDone) return;

    play.target = order[play.round];
    let firstTry = true;
    const ask = () => speak(L.cards[play.target].say);
    app.querySelector("[data-q]").onclick = ask;
    app.querySelectorAll(".word-card").forEach((b) => b.onclick = () => {
      const i = Number(b.dataset.i);
      if (i === play.target) {
        b.classList.add("right"); chime(true);
        if (firstTry) play.correct++;
        speak(["Yes!", "Super!", "Well done!", "Great!"][play.round % 4]);
        play.round++;
        setTimeout(stepPlay, 1100);
      } else {
        firstTry = false; b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        chime(false); setTimeout(ask, 500);
      }
    });
  }

  // 5. Star time: praise + optional parent rating (no scores shown to the child)
  function stepStars() {
    const sel = (k) => play.rating === k ? "sel" : "";
    frame(`<div class="confetti" aria-hidden="true">🎉</div>
      <h2>Well done, ${esc(childName())}!</h2>${minutes()}
      <div class="score" aria-label="3 stars">⭐⭐⭐</div>
      <button class="listen-btn" data-bye>🔊 Goodbye!</button>
      <div class="parent-note"><b>👪 Pour le parent — compétence : ${esc(L.skill)}</b>
        Optionnel. Aucune note n'est montrée à l'enfant.
        <div class="rating">${Object.entries(RATINGS).map(([k, v]) => `<button class="${sel(k)}" data-r="${k}">${v}</button>`).join("")}</div>
      </div>`, true, "Finish ⭐");
    speak(fill("Well done, {name}! Three stars!"));
    app.querySelector("[data-bye]").onclick = () => speak(fill("Goodbye, {name}! See you tomorrow!"));
    app.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => {
      play.rating = b.dataset.r;
      app.querySelectorAll("[data-r]").forEach((x) => x.classList.toggle("sel", x === b));
    });
  }

  function finishLesson() {
    const prev = state.lessons[L.id];
    const firstTime = !(prev && prev.status === "done");
    state.lessons[L.id] = {
      status: "done",
      completedAt: new Date().toISOString(),
      rating: play.rating || (prev && prev.rating) || null,
      times: ((prev && prev.times) || 0) + 1
    };
    state.stars += firstTime ? 3 : 1; // practice always earns something
    save();
    renderHome();
    toast(firstTime ? "+3 ⭐" : "+1 ⭐ — bravo pour la révision !");
  }

  // =================== PARENT AREA ===================
  function renderParent() {
    const rows = LESSONS.filter((l) => l.ready).map((l) => {
      const p = state.lessons[l.id];
      return `<tr><td>${esc(l.week + " · " + l.day)}</td><td>${esc(l.title)}</td>
        <td>${p ? "✅ " + new Date(p.completedAt).toLocaleDateString("fr-FR") + (p.times > 1 ? ` (×${p.times})` : "") : "—"}</td>
        <td>${p && p.rating ? RATINGS[p.rating] : "—"}</td></tr>`;
    }).join("");
    const links = LESSONS.filter((l) => l.video).map((l) =>
      `<li><a href="${esc(l.video.page)}" target="_blank" rel="noopener noreferrer">${esc(l.video.title)}</a></li>`).join("");

    app.innerHTML = `
      <div class="topbar"><button class="icon-btn" data-home aria-label="Home">🏠</button><h1 style="margin:0;font-size:28px">Espace parent</h1><span></span></div>
      <section class="panel"><h2>Prénom affiché</h2>
        <p class="small">Enregistré uniquement sur cet appareil. Jamais envoyé ailleurs, jamais publié sur GitHub.</p>
        <input id="nm" maxlength="20" value="${esc(state.name)}" placeholder="Prénom">
        <div class="row-btns"><button data-savename>Enregistrer</button></div></section>
      <section class="panel"><h2>Progression</h2>
        <table><thead><tr><th>Semaine</th><th>Leçon</th><th>Faite</th><th>Compétence</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="small">Étoiles : ${state.stars}. Les leçons verrouillées seront ajoutées au fur et à mesure.</p>
        <div class="row-btns"><button data-export>Exporter (fichier)</button><button class="danger" data-reset>Réinitialiser</button></div></section>
      <section class="panel"><h2>Vidéos officielles (ouvrir à part)</h2><ul>${links}</ul>
        <p class="small">Contenus © leurs auteurs, usage personnel et non commercial. Ce site n'est pas affilié à Super Simple / Skyship Entertainment ni au British Council.</p></section>
      <section class="panel"><h2>Confidentialité</h2>
        <p class="small">Pas de compte, pas de publicité, pas de statistiques, pas d'enregistrement de voix. La progression reste dans le navigateur de cette tablette. Effacer les données du navigateur efface la progression.</p></section>`;

    app.querySelector("[data-home]").onclick = renderHome;
    app.querySelector("[data-savename]").onclick = () => {
      state.name = document.getElementById("nm").value.trim().slice(0, 20); save(); toast("Enregistré ✓");
    };
    app.querySelector("[data-export]").onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "progression-anglais.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
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

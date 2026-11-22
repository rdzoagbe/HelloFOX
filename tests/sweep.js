// Plays EVERY lesson the way a curious child does: taps whatever looks tappable, never reads, never waits politely.
// Fails if any screen of any lesson keeps the Next button grey for too long, or if the browser logs an error.
// Slower than the main checks (about 10 minutes), so it runs as its own job: `npm run sweep`.
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain" };
const SPEED = 10;          // turn waits and pauses run 10x faster (Fox's own speech is stubbed to ~60 ms a line)
const TAP_MS = 250;        // how often the child taps something
const LIMIT_MS = 25000;    // a screen that keeps Next grey longer than this, at test speed, is a stuck screen
const ONLY = process.argv[2]; // optional lesson id, e.g. `node tests/sweep.js w2d3`

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(root, p === "/" ? "index.html" : p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

// Deterministic "random" taps, so a failure can be replayed exactly.
let seed = 12345;
const rand = (n) => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed >>> 16) % n; }; // high bits: the low ones cycle

(async () => {
  await new Promise((r) => server.listen(0, r));
  const URL0 = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  const ctx = await b.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, permissions: ["microphone"] });
  // All lessons open (Level 2 unlocked by the parent), videos off so the child never hits the parent gate mid-lesson.
  await ctx.addInitScript((speed) => {
    window.HF_TEST_SPEED = speed;
    if (!localStorage.getItem("hellofox-v2")) localStorage.setItem("hellofox-v2", JSON.stringify({
      profiles: [{ id: "k", color: "#7C6CF2", data: { name: "Keren", stars: 0, lessons: {} } }], active: "k",
      settings: { setupDone: true, code: "1234", open: [2], video: "off", lang: "en" } }));
    speechSynthesis.speak = (u) => setTimeout(() => u.onend && u.onend(), 60);
    speechSynthesis.cancel = () => {};
  }, SPEED);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => { if (m.type() === "error" && !/net::|ERR_|Permissions policy/i.test(m.text())) errs.push(m.text()); });
  await p.goto(URL0); await p.waitForTimeout(400);
  const lessons = await p.evaluate(() => window.LESSONS.filter((l) => l.ready).map((l) => ({ id: l.id, level: l.level || 1, week: l.week, title: l.title })));

  // What a child taps: first anything that looks like "do this now", else any button on the stage.
  const DO_NOW = ".tap-next, .choice:not([disabled]), .cards .word-card:not(.right), [data-opt], [data-p], .mem:not(.up), [data-start-chat], [data-q]";
  const ANY = ".stage button:not([disabled]):not([data-load]):not([data-rec]):not([data-line]):not(.again-btn), .stage .page.shown";
  const tapSomething = async () => {
    const picked = await p.evaluate(({ DO_NOW, ANY, r }) => {
      const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent && !e.closest("[hidden]"));
      let els = vis(DO_NOW); if (!els.length) els = vis(ANY);
      if (!els.length) return null;
      const el = els[r % els.length]; el.click();
      return (el.getAttribute("aria-label") || el.textContent || el.className).trim().slice(0, 24);
    }, { DO_NOW, ANY, r: rand(1000) });
    return picked;
  };

  let failed = 0, slowest = { ms: 0 };
  for (const L of lessons) {
    if (ONLY && L.id !== ONLY) continue;
    await p.goto(URL0 + "?t=" + L.id); await p.waitForTimeout(300);
    if (await p.$(`[data-level="${L.level}"]`)) { await p.click(`[data-level="${L.level}"]`); await p.waitForTimeout(100); }
    await p.click(`[data-week="${L.week}"]`); await p.click(`[data-lesson="${L.id}"]`); await p.waitForTimeout(200);
    const times = [];
    let stuck = null;
    for (let s = 0; s < 8; s++) {
      if (!(await p.$(".stage"))) break;              // lesson over (home, sticker or certificate screen)
      const t0 = Date.now();
      let taps = 0, last = "";
      while (await p.$("[data-next][disabled]")) {
        if (Date.now() - t0 > LIMIT_MS) { stuck = { step: s + 1, taps, last }; break; }
        const l = await tapSomething(); if (l) { taps++; last = l; }
        await p.waitForTimeout(TAP_MS);
      }
      const ms = Date.now() - t0; times.push(ms);
      if (ms > slowest.ms) slowest = { ms, id: L.id, step: s + 1 };
      if (stuck) break;
      const n = await p.$("[data-next]:not([disabled])"); if (!n) break;
      await n.click(); await p.waitForTimeout(250);
    }
    const line = `${L.id.padEnd(5)} L${L.level} ${L.title.padEnd(28)} ${times.map((t) => (t / 1000).toFixed(1).padStart(5)).join(" ")}`;
    if (stuck) { failed++; console.log(`  FAIL ${line}   stuck on screen ${stuck.step} after ${stuck.taps} taps (last tap: "${stuck.last}")`); }
    else console.log(`  ok   ${line}`);
  }
  console.log(`\nSlowest screen: ${slowest.id} screen ${slowest.step}, ${(slowest.ms / 1000).toFixed(1)} s at test speed.`);
  if (errs.length) { failed++; console.log("Browser errors:\n  " + errs.join("\n  ")); }
  await b.close(); server.close();
  console.log(failed ? `\n${failed} problem(s): a child can get stuck.` : "\nEvery lesson can be played through by a child who just taps.");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

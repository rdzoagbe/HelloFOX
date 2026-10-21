// Browser checks: opens the real app in Chromium and clicks through it like a parent and a child.
// Run: npm test   (or: node tests/e2e.js)
// Optional: CHROME_PATH=/path/to/chrome to use an already-installed Chromium.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");
const SHOTS = process.env.SHOTS || path.join(root, "test-results");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain" };

let failed = 0;
const check = (ok, msg) => { console.log((ok ? "  ok   " : "  FAIL ") + msg); if (!ok) { failed++; if (process.env.GITHUB_ACTIONS) console.log("::error title=Check failed::" + String(msg).replace(/\n/g, " %0A")); } };

// Tiny local web server for the app files
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(root, p === "/" ? "index.html" : p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const seeded = (settings) => ({ profiles: [{ id: "k", color: "#7C6CF2", data: { name: "Keren", stars: 0, lessons: {} } }], active: "k", settings: { setupDone: true, ...settings } });

(async () => {
  await new Promise((r) => server.listen(0, r));
  const URL0 = `http://localhost:${server.address().port}/`;
  fs.mkdirSync(SHOTS, { recursive: true });
  const b = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  const errs = [];
  const watch = (p, name) => {
    p.on("pageerror", (e) => errs.push(`[${name}] ${e.message}`));
    // Only count errors from Hello Fox's own files, not from inside the YouTube player
    p.on("console", (m) => {
      const from = (m.location() && m.location().url) || "";
      if (m.type() !== "error" || /youtube|net::|ERR_|sessionStorage|Permissions policy violation/i.test(m.text() + " " + from)) return;
      if (from && !from.startsWith("http://localhost")) return;
      errs.push(`[${name}] ${m.text()}`);
    });
  };
  const newPage = async (name, opts = {}, store) => {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, permissions: ["microphone"], ...opts });
    if (store) await ctx.addInitScript((s) => { try { if (sessionStorage.getItem("seeded")) return; sessionStorage.setItem("seeded", "1"); localStorage.setItem("hellofox-v2", s); } catch (e) {} }, JSON.stringify(store));
    const p = await ctx.newPage(); watch(p, name);
    await p.goto(URL0 + "?t=" + Date.now()); await p.waitForTimeout(500);
    return p;
  };
  const forceNext = async (p) => { await p.evaluate(() => { const n = document.querySelector("[data-next]"); if (n) n.disabled = false; }); await p.click("[data-next]"); };
  const store = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("hellofox-v2")));

  try {
    // ---------- 1. Landing page and parent setup ----------
    console.log("Landing and setup");
    let p = await newPage("setup");
    check(!!(await p.$(".landing")), "a new visitor sees the landing page");
    check((await p.getAttribute("html", "lang")) === "en", "landing page is in English by default");
    await p.click('[data-lang="fr"]'); await p.waitForTimeout(100);
    check(/anglais/i.test(await p.textContent(".l-tag")), "EN | FR switch turns the landing page French");
    await p.click('[data-lang="en"]');
    await p.click("[data-browser]"); await p.waitForTimeout(200);
    check(!!(await p.$("[data-landing]")), "setup has a button back to the landing page");
    await p.click('[data-go="1"]');
    await p.fill("#c1", "1357"); await p.fill("#c2", "1358"); await p.click("[data-code]");
    check(!!(await p.$(".s-msg")) && (await p.textContent(".s-msg")).trim().length > 0, "mismatched parent codes are refused");
    await p.fill("#c1", "1357"); await p.fill("#c2", "1357"); await p.click("[data-code]");
    check(await p.$eval("[data-kids]", (e) => e.disabled), "cannot continue before adding a child");
    await p.fill("#kname", "Keren"); await p.click("[data-addk]");
    await p.click("[data-kids]"); await p.click("[data-sets]"); await p.click("[data-done]"); await p.waitForTimeout(300);
    const s1 = await store(p);
    check(s1.settings.setupDone === true && s1.settings.code === "1357" && s1.profiles[0].data.name === "Keren", "setup saves the code and the child's name");
    await p.reload(); await p.waitForTimeout(400);
    check(!!(await p.$("[data-start]")), "after setup, the app opens straight on the child's home");
    await p.screenshot({ path: path.join(SHOTS, "home.png") });
    await p.context().close();

    // ---------- 2. All 20 lessons, start to finish ----------
    console.log("All 20 lessons");
    p = await newPage("lessons", { viewport: { width: 1024, height: 768 } }, seeded({}));
    let lessonsOk = 0;
    for (let n = 0; n < 20; n++) {
      await p.click("[data-start]"); await p.waitForTimeout(250);
      const title = (await p.textContent(".stage h2")).trim();
      if (n === 1) check((await p.$$(".art")).length > 0, "word pictures are drawings, not emojis");
      await forceNext(p); await p.waitForTimeout(150); await forceNext(p); await forceNext(p); await p.waitForTimeout(300);
      for (let guard = 0; guard < 40; guard++) {
        const h = (await p.textContent(".stage h2")).trim();
        if (/talk/i.test(h)) break;
        if (await p.$(".mem")) {
          const fronts = await p.$$eval(".mem", (els) => els.map((e) => e.querySelector(".front").textContent.trim()));
          const done = new Set();
          for (let i = 0; i < fronts.length; i++) {
            if (done.has(i)) continue;
            const j = fronts.findIndex((f, k) => k !== i && f === fronts[i] && !done.has(k));
            done.add(i); done.add(j);
            await p.click(`.mem[data-t="${i}"]`); await p.click(`.mem[data-t="${j}"]`);
            await p.waitForFunction(() => !document.querySelector(".mem.up:not(.matched)"), null, { timeout: 15000 }).catch(() => {});
            await p.waitForTimeout(700);
          }
          await p.waitForTimeout(3500);
        } else if (/missing/i.test(h)) {
          await p.waitForSelector(".pick:not([hidden])", { timeout: 20000 });
          const visible = await p.$$eval(".look .word-card:not(.hidden-card)", (els) => els.map((e) => e.textContent.trim()));
          const chips = await p.$$eval("[data-p]", (els) => els.map((e) => [e.dataset.p, e.textContent.trim()]));
          const miss = chips.find(([, t]) => !visible.includes(t));
          await p.click(`[data-p="${miss[0]}"]`); await p.waitForTimeout(2500);
        } else if (await p.$("[data-q]")) {
          for (const c of await p.$$(".word-card")) { await c.click().catch(() => {}); await p.waitForTimeout(100); if (await p.$(".word-card.right")) break; }
          await p.waitForTimeout(1600);
        } else await p.waitForTimeout(500);
      }
      const end = (await p.textContent(".stage h2")).trim();
      if (/talk/i.test(end)) lessonsOk++; else console.log(`       lesson ${n + 1} (${title}) stuck at: ${end}`);
      await forceNext(p); await p.waitForTimeout(300); await p.click("[data-next]"); await p.waitForTimeout(400);
      if (await p.$("[data-ok]")) { await p.click("[data-ok]"); await p.click("[data-home]"); }
    }
    check(lessonsOk === 20, `every lesson reaches its speaking part (${lessonsOk}/20)`);
    const s2 = await store(p);
    check(Object.values(s2.profiles[0].data.lessons).filter((l) => l.status === "done").length === 20, "all 20 lessons are saved as done");
    check(!!(await p.$(".cert")), "finishing Level 1 opens the certificate by itself");
    check((await p.textContent(".cert h1")).includes("Keren"), "the certificate shows the child's name");
    await p.click("[data-home]"); await p.waitForTimeout(300);
    check(!!(await p.$("[data-cert]")), "the certificate stays on the home screen");
    check(/Level 2/.test(await p.textContent(".s-sub")), "after Level 1, today's lesson is in Level 2");
    await p.click("[data-parent]");
    const [a, bb] = (await p.textContent(".gate p")).match(/\d+/g).map(Number);
    await p.click(`.gate [data-v="${a + bb}"]`);
    await p.selectOption("#vl", "w2d1"); await p.click('[data-vr="0"]'); await p.waitForTimeout(3800);
    check(await p.$eval('[data-vr="0"]', (e) => e.classList.contains("has")), "a parent can record a word in their own voice");
    await p.context().close();

    // ---------- 2b. Dialogue: Fox does not say her echo line twice ----------
    console.log("Dialogue");
    p = await newPage("dialogue", {}, seeded({}));
    await p.evaluate(() => { window.__said = []; speechSynthesis.speak = (u) => { window.__said.push(u.text); setTimeout(() => u.onend && u.onend(), 120); }; });
    await p.click("[data-start]"); await forceNext(p); await forceNext(p); await forceNext(p); await p.waitForTimeout(300);
    for (let g = 0; g < 20 && !/talk/i.test(await p.textContent(".stage h2")); g++) {
      for (const c of await p.$$(".word-card")) { await c.click().catch(() => {}); await p.waitForTimeout(100); if (await p.$(".word-card.right")) break; }
      await p.waitForTimeout(1600);
    }
    await p.waitForFunction(() => window.__said.some((t) => /Again, or next/i.test(t)), null, { timeout: 40000 }).catch(() => {});
    const all = await p.evaluate(() => window.__said);
    const said = all.slice(all.lastIndexOf("Now, let's talk!"));
    if (process.env.DEBUG) console.log(said, await p.textContent(".stage h2"));
    check(said.filter((t) => t === "Hello!").length === 1 && said.filter((t) => t === "Goodbye!").length === 1, "in the dialogue Fox says each line once, then it's her turn");
    await p.context().close();

    // ---------- 2c. Lesson opening: Fox announces the lesson, no "repeat after me" ----------
    console.log("Lesson opening");
    p = await newPage("opening", {}, { ...seeded({}), profiles: [{ id: "k", color: "#7C6CF2", data: { name: "Keren", stars: 0, lessons: { w1d1: { status: "done" } } } }] });
    await p.evaluate(() => {
      window.__said = []; window.__turns = 0;
      speechSynthesis.speak = (u) => { window.__said.push(u.text); setTimeout(() => u.onend && u.onend(), 120); };
      new MutationObserver(() => { const st = document.querySelector(".status"); if (st && /turn/.test(st.className) && document.querySelector(".hello-fox")) window.__turns++; })
        .observe(document.body, { subtree: true, attributes: true, childList: true });
    });
    await p.click('[data-lesson="w1d2"]');
    await p.waitForFunction(() => window.__said.includes("Listen, and repeat!"), null, { timeout: 20000 }).catch(() => {});
    const open = await p.evaluate(() => ({ said: window.__said, turns: window.__turns }));
    check(/^Lesson 2! /.test(open.said[0] || ""), "opening a lesson, Fox announces it (\"" + (open.said[0] || "nothing") + "\")");
    check(open.turns === 0, "the lesson opening never waits for her to repeat");
    check(!open.said.some((t) => ["Hello!", "Goodbye!", "Yes!", "No!"].includes(t)), "the opening does not replay the previous lesson's words");
    await p.context().close();


    // ---------- 2d. Level 2: locked at first, every lesson opens, one lesson played with taps only ----------
    console.log("Level 2");
    p = await newPage("level2-lock", {}, seeded({ code: "1234" }));
    await p.click('[data-level="2"]'); await p.waitForTimeout(200);
    check(!!(await p.$(".lvl.locked")) && !!(await p.$(".lesson-tile.locked")), "Level 2 is locked until Level 1 is finished");
    await p.click('[data-lesson="w5d1"]'); await p.waitForTimeout(200);
    check(!(await p.$(".stage")), "a locked lesson does not start");
    await p.click("[data-parent]"); for (const d of "1234") await p.click(`.keypad [data-k="${d}"]`); await p.waitForTimeout(200);
    await p.click('[data-open="2"]'); await p.click("[data-home]"); await p.click('[data-level="2"]'); await p.waitForTimeout(200);
    check(!(await p.$(".lesson-tile.locked")), "a parent can open Level 2 early");
    await p.context().close();

    const l1done = {};
    for (let w = 1; w <= 4; w++) for (let d = 1; d <= 5; d++) l1done[`w${w}d${d}`] = { status: "done", completedAt: "2026-10-01T10:00:00Z" };
    const seededL2 = { ...seeded({}), profiles: [{ id: "k", color: "#7C6CF2", data: { name: "Keren", stars: 60, lessons: l1done } }] };

    // every Level 2 lesson: each of the 7 steps shows its activity
    p = await newPage("level2-all", { viewport: { width: 1024, height: 768 } }, seededL2);
    await p.evaluate(() => { speechSynthesis.speak = (u) => setTimeout(() => u.onend && u.onend(), 60); });
    let l2ok = 0; const l2bad = [];
    for (let w = 5; w <= 8; w++) for (let d = 1; d <= 5; d++) {
      const id = `w${w}d${d}`;
      await p.click('[data-level="2"]').catch(() => {}); await p.click(`[data-week="${w}"]`); await p.click(`[data-lesson="${id}"]`); await p.waitForTimeout(200);
      const seen = [];
      seen.push(!!(await p.$(".hello-fox")));
      await forceNext(p); await p.waitForTimeout(200); seen.push((await p.$$(".learn .word-card")).length >= 4);
      await forceNext(p); await p.waitForTimeout(300); seen.push(!!(await p.$("[data-q]")));
      await forceNext(p); await p.waitForTimeout(1200); seen.push(!!(await p.$(".page.shown")));
      await forceNext(p); await p.waitForTimeout(1200); seen.push(!!(await p.$(".ask-card.active")));
      await forceNext(p); await p.waitForTimeout(300); seen.push(!!(await p.$("[data-start-chat]")));
      await p.click("[data-start-chat]", { force: true }); await p.waitForTimeout(800); seen.push(!!(await p.$(".msg.fox")));
      await forceNext(p); await p.waitForTimeout(300); seen.push(!!(await p.$(".mission")));
      await p.click("[data-next]"); await p.waitForTimeout(400);
      if (await p.$("[data-ok]")) { await p.click("[data-ok]"); await p.click("[data-home]"); }
      if (await p.$(".cert")) await p.click("[data-home]");
      if (seen.every(Boolean)) l2ok++; else l2bad.push(id + ":" + seen.map((x) => (x ? 1 : 0)).join(""));
    }
    check(l2ok === 20, `every Level 2 lesson shows words, tap game, story, questions, conversation and mission (${l2ok}/20)` + (l2bad.length ? " " + l2bad.join(" ") : ""));
    const s3 = await store(p);
    check(Object.keys(s3.profiles[0].data.lessons).filter((k) => /^w[5-8]/.test(k)).length === 20, "all 20 Level 2 lessons are saved as done");
    check(!!(await p.$("[data-cert]")), "Level 2 has its certificate too");
    await p.context().close();

    // one Level 2 lesson played the way a child does it: only taps on pictures and arrows
    p = await newPage("level2-taps", {}, seededL2);
    await p.evaluate(() => { window.__said = []; speechSynthesis.speak = (u) => { window.__said.push(u.text); setTimeout(() => u.onend && u.onend(), 80); }; });
    await p.click('[data-lesson="w5d2"]');
    const t0 = Date.now(); let reached = false, movedAlone = false;
    while (Date.now() - t0 < 300000) {
      await p.waitForTimeout(400);
      const h = ((await p.textContent(".stage h2").catch(() => "")) || "").trim();
      if (await p.$(".score")) { reached = true; break; }
      const tn = await p.$(".tap-next"); if (tn) { await tn.click({ force: true }); continue; }
      const sc = await p.$("[data-start-chat]"); if (sc) { await sc.click({ force: true }); continue; }
      const ch = await p.$(".choice:not([disabled])"); if (ch) { await ch.click({ force: true }); continue; }
      const q = await p.$$(".page-q.shown [data-opt]");
      if (q.length && !(await p.$(".page-q .right"))) { for (const x of q) { await x.click(); await p.waitForTimeout(200); if (await p.$(".page-q .right")) break; } continue; }
      if ((await p.$("[data-q]")) && !(await p.$(".word-card.right"))) {
        const said = (await p.evaluate(() => window.__said.slice(-1)[0])) || "";
        for (const x of await p.$$(".cards .word-card")) { const tx = (await x.textContent()).trim().replace(/[.!?]/g, "").toLowerCase(); if (said.replace(/[.!?]/g, "").toLowerCase().includes(tx)) { await x.click(); break; } }
        continue;
      }
      const endShown = !!(await p.$(".endbar:not([hidden])"));
      if (endShown && (await p.$("[data-next]:not([disabled])"))) {
        // waits for her: nothing changes by itself, even after 9 seconds
        await p.waitForTimeout(9000);
        const after = ((await p.textContent(".stage h2").catch(() => "")) || "").trim();
        if (after !== h) movedAlone = true;
        await p.click("[data-next]", { force: true });
      }
    }
    const said2 = await p.evaluate(() => window.__said);
    check(/^Level 2, lesson 2! /.test(said2[0] || ""), "a Level 2 lesson opens with \"Level 2, lesson 2!\"");
    check(reached, "a whole Level 2 lesson can be played with taps only");
    check(!movedAlone, "Fox waits for her tap before the next activity (no automatic Next)");
    await p.context().close();

    // ---------- 3. Video end screen, smart review, sound settings, languages ----------
    console.log("Video, review and parent settings");
    p = await newPage("features", {}, seeded({ code: "1234" }));
    await p.click("[data-start]"); await forceNext(p); await forceNext(p);
    await p.click("[data-load]"); for (const d of "1234") await p.click(`.keypad [data-k="${d}"]`); await p.waitForTimeout(300);
    const src = await p.getAttribute("iframe", "src");
    check(/^https:\/\/www\.youtube-nocookie\.com\/embed\//.test(src), "videos use YouTube's privacy (no-cookie) player");
    check(/allow-scripts/.test(await p.getAttribute("iframe", "sandbox")), "the video player is sandboxed");
    await p.evaluate(() => window.dispatchEvent(new MessageEvent("message", { origin: "https://evil.example", data: JSON.stringify({ event: "onStateChange", info: 0 }) })));
    await p.waitForTimeout(100);
    check(!!(await p.$("iframe")), "messages from other websites are ignored");
    await p.evaluate(() => window.dispatchEvent(new MessageEvent("message", { origin: "https://www.youtube-nocookie.com", data: JSON.stringify({ event: "infoDelivery", info: { playerState: 0 } }) })));
    await p.waitForTimeout(300);
    check(!!(await p.$(".video-end [data-again-v]")) && !!(await p.$(".video-end [data-next-v]")), "Fox's 'Watch again / Next' screen appears when a song ends");
    const look = await p.$eval("[data-next-v]", (e) => { const c = getComputedStyle(e); return [c.backgroundColor, c.color, getComputedStyle(document.body).backgroundColor]; });
    check(look[0] !== look[2] && look[1] === "rgb(255, 255, 255)", "the 'Watch again / Next' buttons are coloured and readable");
    await p.click("[data-next-v]"); await p.waitForTimeout(300);
    for (let g = 0; g < 12 && (await p.$("[data-q]")); g++) {
      for (const c of await p.$$(".word-card")) { await c.click().catch(() => {}); await p.waitForTimeout(120); if (await p.$(".word-card.right")) break; }
      await p.waitForTimeout(1500);
    }
    const weak = (await store(p)).profiles[0].data.weak || {};
    check(Object.keys(weak).length > 0, "missed words are remembered");
    await forceNext(p); await p.waitForTimeout(300); await p.click("[data-next]"); await p.waitForTimeout(400);
    if (await p.$("[data-ok]")) { await p.click("[data-ok]"); await p.click("[data-home]"); }
    await p.click("[data-start]"); await p.waitForTimeout(300);
    check((await p.$$(".review .chip")).length > 0, "missed words are shown as \"Remember?\" words in the next lesson");
    await p.click("[data-home]");
    await p.click("[data-parent]"); for (const d of "1234") await p.click(`.keypad [data-k="${d}"]`); await p.waitForTimeout(200);
    check((await p.$$(".p-words .chip")).length > 0, "the parent area lists words to practise");
    await p.click("[data-calm]"); await p.click("[data-sfx]"); await p.waitForTimeout(200);
    const st = (await store(p)).settings;
    check(st.sfx === false && st.calm === true && (await p.evaluate(() => document.body.classList.contains("calm"))), "sound and calm-mode switches are saved");
    const h1en = await p.textContent(".p-head h1");
    await p.click('[data-lang="fr"]'); await p.waitForTimeout(150);
    check((await p.textContent(".p-head h1")) !== h1en, "the parent area switches to French");
    const exported = await p.evaluate(() => localStorage.getItem("hellofox-v2"));
    check(JSON.parse(exported).settings.lang === "fr", "the language choice is saved");
    await p.context().close();

    // ---------- 4. Invalid backups must never replace existing family data ----------
    console.log("Backup validation");
    p = await newPage("backup-validation", {}, seeded({ code: "1234" }));
    await p.click("[data-parent]");
    for (const d of "1234") await p.click('.keypad [data-k="' + d + '"]');
    await p.waitForTimeout(250);
    await p.setInputFiles("#impfile", {
      name: "malformed-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ profiles: [{}], settings: {} }))
    });
    await p.waitForTimeout(250);
    const afterInvalidImport = await store(p);
    check(afterInvalidImport.profiles[0].data.name === "Keren", "a malformed backup is rejected without replacing the existing child profile");
    check(afterInvalidImport.settings.code === "1234", "a malformed backup cannot overwrite the existing parent code");

    p.on("dialog", (dialog) => dialog.accept());
    const validBackup = {
      app: "hellofox",
      profiles: [{ id: "restored", color: "#7C6CF2", data: {
        name: "Restored", stars: 2, lessons: {}, skills: {}, weak: {}, daily: { date: "", count: 0 }
      }}],
      active: "restored",
      settings: { setupDone: true, code: "9999", lang: "en", limit: 0 }
    };
    await p.setInputFiles("#impfile", {
      name: "valid-hellofox-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(validBackup))
    });
    await p.waitForTimeout(350);
    const afterValidImport = await store(p);
    check(afterValidImport.profiles[0].data.name === "Restored", "a valid backup restores the saved child profile");
    check(afterValidImport.profiles[0].data.stars === 2, "a valid backup restores learning progress");
    check(afterValidImport.settings.code === "1234", "restoring a backup preserves this device's existing parent code");
    await p.context().close();

    // ---------- 5. Mobile layout smoke checks at narrow phone and tablet widths ----------
    console.log("Mobile layout");
    p = await newPage("mobile-layout", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, seeded({}));
    for (const width of [320, 360, 390, 430, 768]) {
      await p.setViewportSize({ width, height: 844 });
      await p.waitForTimeout(100);
      const metrics = await p.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        app: document.querySelector("#app")?.getBoundingClientRect().width || 0
      }));
      check(metrics.document <= metrics.viewport + 1,
        `no horizontal page overflow at ${width}px (viewport ${metrics.viewport}px, document ${metrics.document}px)`);
      check(metrics.app <= width + 1,
        `app container fits the ${width}px viewport`);
    }
    await p.setViewportSize({ width: 320, height: 720 });
    await p.click("[data-start]");
    await p.waitForTimeout(150);
    const lessonMetrics = await p.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      next: document.querySelector("[data-next]")?.getBoundingClientRect().toJSON()
    }));
    check(lessonMetrics.document <= lessonMetrics.viewport + 1,
      "lesson screen has no horizontal overflow on a 320px phone viewport");
    check(!!lessonMetrics.next && lessonMetrics.next.width > 0 &&
      lessonMetrics.next.left >= -1 && lessonMetrics.next.right <= lessonMetrics.viewport + 1,
      "lesson navigation remains visible on a narrow phone viewport");
    await p.context().close();
  } catch (e) {
    check(false, "test run crashed: " + e.message.split("\n")[0]);
  }

  check(!errs.length, "no errors in the browser console" + (errs.length ? "\n         " + errs.join("\n         ") : ""));
  await b.close(); server.close();
  console.log(failed ? `\n${failed} check(s) failed` : "\nAll browser checks passed");
  process.exit(failed ? 1 : 0);
})();

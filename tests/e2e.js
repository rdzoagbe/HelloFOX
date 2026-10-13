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
    p.on("console", (m) => m.type() === "error" && !/youtube|net::|ERR_|sessionStorage/i.test(m.text()) && errs.push(`[${name}] ${m.text()}`));
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
    check(!!(await p.$("[data-cert]")), "the certificate unlocks at the end");
    await p.click("[data-cert]"); await p.waitForTimeout(500);
    check((await p.textContent(".cert h1")).includes("Keren"), "the certificate shows the child's name");
    await p.click("[data-home]");
    await p.click("[data-parent]");
    const [a, bb] = (await p.textContent(".gate p")).match(/\d+/g).map(Number);
    await p.click(`.gate [data-v="${a + bb}"]`);
    await p.selectOption("#vl", "w2d1"); await p.click('[data-vr="0"]'); await p.waitForTimeout(3800);
    check(await p.$eval('[data-vr="0"]', (e) => e.classList.contains("has")), "a parent can record a word in their own voice");
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
    check((await p.$$(".review .chip")).length > 0, "missed words come back in the next lesson's warm-up");
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
  } catch (e) {
    check(false, "test run crashed: " + e.message.split("\n")[0]);
  }

  check(!errs.length, "no errors in the browser console" + (errs.length ? "\n         " + errs.join("\n         ") : ""));
  await b.close(); server.close();
  console.log(failed ? `\n${failed} check(s) failed` : "\nAll browser checks passed");
  process.exit(failed ? 1 : 0);
})();

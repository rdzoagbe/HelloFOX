// Quick checks that need no browser: syntax, translations, lesson data, drawings, offline cache list.
// Run: node tests/static.js
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
let failed = 0;
const check = (ok, msg) => { console.log((ok ? "  ok   " : "  FAIL ") + msg); if (!ok) { failed++; if (process.env.GITHUB_ACTIONS) console.log("::error title=Check failed::" + String(msg).replace(/\n/g, " %0A")); } };

// 1. Every script parses
for (const f of ["app.js", "lessons.js", "level2.js", "missions.js", "i18n.js", "art.js", "art2.js", "sw.js"]) {
  let ok = true;
  try { execFileSync(process.execPath, ["--check", path.join(root, f)], { stdio: "pipe" }); } catch { ok = false; }
  check(ok, `${f} has valid syntax`);
}

// Load the data files the same way the browser does
global.window = {};
for (const f of ["lessons.js", "level2.js", "missions.js", "i18n.js", "art.js", "art2.js"]) require(path.join(root, f));
const { LESSONS, I18N, ART } = window;

// 2. Translations: English and French have exactly the same keys, none empty
const en = Object.keys(I18N.en), fr = Object.keys(I18N.fr);
const missingFr = en.filter((k) => !(k in I18N.fr)), missingEn = fr.filter((k) => !(k in I18N.en));
check(!missingFr.length, "every English text has a French version" + (missingFr.length ? `: ${missingFr.join(", ")}` : ""));
check(!missingEn.length, "every French text has an English version" + (missingEn.length ? `: ${missingEn.join(", ")}` : ""));
const empty = [...en.filter((k) => !String(I18N.en[k]).trim()), ...fr.filter((k) => !String(I18N.fr[k]).trim())];
check(!empty.length, "no empty translations" + (empty.length ? `: ${empty.join(", ")}` : ""));

// 3. Lessons: 20 lessons, unique ids, each with cards, a valid video id and English parent notes
const L1 = LESSONS.filter((l) => (l.level || 1) === 1), L2 = LESSONS.filter((l) => l.level === 2);
check(L1.length === 20, `Level 1 has 20 lessons (found ${L1.length})`);
check(L2.length === 20, `Level 2 has 20 lessons (found ${L2.length})`);
const ids = LESSONS.map((l) => l.id);
check(new Set(ids).size === ids.length, "lesson ids are unique");
const badVideo = LESSONS.filter((l) => l.video && !/^[A-Za-z0-9_-]{11}$/.test(l.video.youtubeId)).map((l) => l.id);
check(!badVideo.length, "every video id has the YouTube format" + (badVideo.length ? `: ${badVideo.join(", ")}` : ""));
const noCards = LESSONS.filter((l) => !l.cards || !l.cards.length).map((l) => l.id);
check(!noCards.length, "every lesson has word cards" + (noCards.length ? `: ${noCards.join(", ")}` : ""));
if (window.PARENT_EN) {
  const noEn = LESSONS.filter((l) => !window.PARENT_EN[l.id]).map((l) => l.id);
  check(!noEn.length, "every lesson has English parent notes" + (noEn.length ? `: ${noEn.join(", ")}` : ""));
}

// 4. Every picture used anywhere has a drawing (the emoji is only a safety net)
const words = new Set();
const key = (p) => (typeof p === "string" ? p : (typeof p.art === "string" ? p.art : p.word));
for (const l of LESSONS) {
  for (const c of l.cards || []) words.add(key(c));
  if (l.story) { l.story.pages.forEach((pg) => pg.pics.forEach((p) => words.add(key(p)))); l.story.q.options.forEach((o) => words.add(o)); }
  (l.ask || []).forEach((q) => words.add(key(q.pic)));
  if (l.chat) { words.add(l.chat.art); l.chat.lines.forEach((ln) => (ln.choices || []).forEach((c) => words.add(c.word))); }
}
const noArt = [...words].filter((w) => !ART[w]);
check(!noArt.length, `all ${words.size} pictures have a drawing` + (noArt.length ? `: ${noArt.join(", ")}` : ""));

// 4b. Level 2 lessons are complete: story with a correct answer, 4 questions, a conversation, parent texts
const bad2 = L2.filter((l) => !(l.cards && l.cards.length === 4 && l.story && l.story.pages.length >= 3 && l.story.q.options.includes(l.story.q.answer)
  && l.ask && l.ask.length === 4 && l.ask.every((q) => q.q && q.answer && q.key) && l.chat && l.chat.lines.length >= 3
  && l.chat.lines.every((ln) => ln.fox && (ln.reply || (ln.choices && ln.choices.every((c) => c.say && c.react)) || ln.choices === undefined))
  && l.warmup && l.warmup.parent && l.speak && l.speak.activity && l.skill)).map((l) => l.id);
check(!bad2.length, "every Level 2 lesson has story, questions, conversation and parent tips" + (bad2.length ? `: ${bad2.join(", ")}` : ""));
// 4c. A mission for every lesson, in both languages
const noMission = LESSONS.filter((l) => !(window.MISSIONS[l.id] && window.MISSIONS[l.id].en && window.MISSIONS[l.id].fr)).map((l) => l.id);
check(!noMission.length, "every lesson has a parent mission in English and French" + (noMission.length ? `: ${noMission.join(", ")}` : ""));
// 4d. Can-do checklist: same weeks and number of items in both languages, a week for every lesson week
const wk = [...new Set(LESSONS.map((l) => l.week))];
const skillOk = wk.every((w) => window.SKILLS[w] && window.SKILLS_EN[w] && window.SKILLS[w].length === window.SKILLS_EN[w].length);
check(skillOk, "the can-do checklist covers every week in English and French");
check(window.STICKERS.length >= LESSONS.length, `enough stickers for all lessons (${window.STICKERS.length})`);
const badSvg = Object.keys(ART).filter((k) => !/^<svg[\s\S]*<\/svg>$/.test(ART[k].trim()) || /<script|on\w+=/i.test(ART[k]));
check(!badSvg.length, "drawings are clean SVG (no scripts)" + (badSvg.length ? `: ${badSvg.join(", ")}` : ""));

// 5. Offline cache: every file listed in sw.js exists, and every script the page loads is cached
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const shell = JSON.parse("[" + sw.match(/const SHELL = \[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
const missingFiles = shell.filter((f) => f !== "./" && !fs.existsSync(path.join(root, f)));
check(!missingFiles.length, "every cached file exists" + (missingFiles.length ? `: ${missingFiles.join(", ")}` : ""));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
const uncached = scripts.filter((s) => !shell.includes(s));
check(!uncached.length, "every page script works offline" + (uncached.length ? `: ${uncached.join(", ")}` : ""));
check(/const VERSION = "hellofox-v\d+"/.test(sw), "service worker has a version");

// 6. Privacy: no trackers or outside scripts
const outside = scripts.filter((s) => /^https?:/i.test(s));
check(!outside.length, "no scripts loaded from other websites");
check(/Content-Security-Policy/.test(html), "security policy is present");

console.log(failed ? `\n${failed} check(s) failed` : "\nAll static checks passed");
process.exit(failed ? 1 : 0);

# Hello Fox! — beginner English PWA

A tablet-friendly, installable web app for a 6-year-old French-speaking beginner. The full 4-week course (20 lessons) is playable: talking fox with guided 5-second turns, pause, optional "Fox listens" speech check, games (listen & tap, Fox's café, memory pairs, what's missing?, Simon says), sticker book, parent voice recordings, Friday speaking check and a printable certificate.
The other 19 lessons are listed and locked. Each one follows the same 5-step template.

## What's included
| File | Role |
|---|---|
| `index.html` | Page shell |
| `styles.css` | Child-friendly tablet layout (big touch targets) |
| `app.js` | Home, lesson player, parent area, progress |
| `lessons.js` | **All lesson content.** Edit this to add lessons |
| `manifest.webmanifest`, `sw.js`, `icons/` | Makes it installable + works offline |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

No build step, no framework, no server, no account, no analytics.

## Publish on GitHub Pages
1. Create a new repository on GitHub (this one: `HelloFOX`). On a free account it must be **public**.
2. Upload every file and the `icons` folder to the root of the `main` branch.
3. Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save**.
4. After about a minute the site is live at `https://rdzoagbe.github.io/HelloFOX/`.

## Install on the tablet
- **iPad (Safari):** open the link → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the link → ⋮ menu → **Install app** / **Add to Home screen**.

It then opens full-screen like an app. After the first visit, the lessons work offline (videos still need internet).

## Add the next lesson
In `lessons.js`, copy the structure of `w1d1` into the lesson you want (e.g. `w1d2`):
fill in `warmup`, `cards`, `video`, `speak`, `skill`, then set `ready: true`.
Then in `sw.js` change `VERSION` (e.g. `hellofox-v2`) so tablets pick up the update.

## Languages
Parent-facing screens (landing page, setup, parent area, parent tips) switch between **English and French** with the EN | FR button; English is the default. The child's lessons are always in English. Texts live in `i18n.js` (app) and `window.PARENT_EN` in `lessons.js` (per-lesson parent tips).

## First launch
1. Open the site in the browser: a parent landing page explains Hello Fox and how to install it (Chrome install button on Android, picture steps for Safari on iPad).
2. Open the installed app: a 5-step parent setup (welcome / restore a backup, parent code typed twice, children with a colour, screen time and Fox listens, hand-over screen).
3. Setup runs in the installed app on purpose: on iPad/iPhone the home-screen app does not share data with Safari.
"Continuer dans le navigateur" at the bottom of the landing page runs the same setup in the browser.

## What's new in the redesign
- Drawn fox (moves its mouth while speaking), map home screen, rounded Fredoka/Nunito fonts hosted in the project (no Google Fonts request).
- Several children: "Who's playing?" profiles, each with its own stars, stickers and progress.
- Parent area: 4-digit parent code, screen-time limit (1 or 2 lessons a day), backup Export **and Import**, voice recordings, Fox listens.
- Security: Content-Security-Policy (only this site + the YouTube no-cookie player), YouTube player sandboxed so it cannot open YouTube or other pages, parent check for videos once a day.
- Tip: lock the tablet on the app with Guided Access (iPad) or App pinning (Android).

## Automatic checks

Every update to `main` runs the checks in `tests/` on GitHub (tab **Actions**, workflow "Automatic checks").
A green tick means the site still works: all 20 lessons, setup, EN | FR, videos, review of missed words and parent settings.
A red cross means something broke; open the run to see which check failed.

To run them on a computer: `npm install`, `npx playwright install chromium`, then `npm test`.

## Privacy and legal notes
- The child's first name is typed in the **Parent area** and stays only on the tablet (browser storage). It is never in the code, so it is never public on GitHub.
- Progress is stored only on the device. Clearing the browser data erases it. Use **Export** in the parent area for a backup.
- Videos play through YouTube's official embedded player (`youtube-nocookie.com`), only after a parent confirms. No video file is copied or hosted here.
- Super Simple Songs and British Council content belong to their owners. Their pages are linked, not copied. This site is not affiliated with them.
- The site is for personal, non-commercial family use. Do not add ads or charge for it (GitHub Pages and the content owners' terms do not allow that).

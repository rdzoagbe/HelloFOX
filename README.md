# Hello Fox! — beginner English PWA

Hello Fox is an installable, tablet-friendly English-learning app for young French-speaking beginners. It contains **40 lessons across two levels**: Level 1 builds vocabulary and listening confidence; Level 2 adds picture stories, comprehension questions and guided conversations. The app includes a talking fox, guided turns, optional speech checks, learning games, stickers, parent voice recordings, progress tracking and printable certificates.

The app is built as static files: there is no build step, application server, user account or analytics service. Child profiles and progress are stored in the browser's local storage on the device.

## What's included

| File | Role |
|---|---|
| `index.html` | Page shell, metadata and security policy |
| `styles.css` | Responsive, child-friendly interface |
| `app.js` | Home, lesson player, parent area, progress and settings |
| `lessons.js`, `level2.js` | Level 1 and Level 2 lesson content |
| `missions.js`, `i18n.js` | Parent missions and English/French interface text |
| `art.js`, `art2.js` | Lesson illustrations |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA installation and app-shell caching |
| `tests/` | Static checks and automated Chromium browser journeys |

## Live app

GitHub Pages publishes the app at [https://rdzoagbe.github.io/HelloFOX/](https://rdzoagbe.github.io/HelloFOX/).

## Install on a device

- **iPhone or iPad (Safari):** open the app URL, tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** open the app URL, then use **Install app** or **Add to Home screen** from the browser menu.

Installation and offline behavior can differ between browsers and operating-system versions. Validate both on the actual target devices before relying on them. The app shell is cached for offline use; embedded YouTube videos require an internet connection.

## First launch and family setup

1. Open the site in a browser. The landing page explains the app and installation.
2. Complete the parent setup in the installed app: create the parent code, add child profiles and choose settings.
3. On iPhone/iPad, the Home Screen app and Safari may have separate browser storage. Complete setup in the environment where the family will use the app. The landing page also offers a way to continue in the browser.

## Learning levels

- **Level 1 (weeks 1–4):** vocabulary, listening, guided speaking, games and review.
- **Level 2 (weeks 5–8):** new sentences, Listen & Tap, picture stories, comprehension questions, guided conversations and a parent English mission.
- Level 2 normally unlocks after Level 1 is completed; the parent area can also unlock it earlier.

Lesson content lives in `lessons.js` and `level2.js`. Supporting missions and illustrations live in `missions.js`, `art.js` and `art2.js`. When editing lesson data, preserve the data shape expected by the app and run the full test suite before publishing.

## Parent features

- Multiple child profiles, each with their own progress, stars and stickers.
- A parent area protected by a locally stored 4-digit code.
- Daily lesson limits, calm mode and sound settings.
- Backup export and import.
- Parent voice recordings and settings for the optional “Fox listens” speech check.

**Important security limitation:** the parent code is a convenience gate, not strong security against someone with access to the device or browser storage. It should not be used to protect sensitive information.

## Automatic checks

The **Automatic checks** workflow runs on pushes to `main`, pull requests and manual dispatch. It runs JavaScript syntax and lesson/content checks, verifies the offline shell file list, and exercises key journeys in automated Chromium.

To run the suite locally:

```sh
npm ci
npx playwright install chromium
npm test
```

A green CI result confirms that the automated checks passed in their test environment. It does **not** replace physical-device testing on Android Chrome and iPhone/iPad Safari, including installation, offline startup, speech features, storage persistence and app updates.

## Privacy and limitations

- Child names and progress are stored in local browser storage. They are not synchronised between devices. Clearing site data can erase progress; export a backup regularly and verify that it can be restored.
- Speech playback and speech recognition depend on browser and device support. The speech check is optional and should not be treated as a definitive pronunciation assessment.
- Videos use YouTube's embedded no-cookie player and require internet access. A third-party video provider may still process connection data when a video is played.
- The project links to third-party learning content and is not affiliated with those content owners.

Before wider distribution, review the privacy notice, third-party content permissions and the suitability of all learning materials for the intended audience.

# HelloFOX stabilization baseline

**Purpose:** stabilize the existing family learning app before adding features or changing its architecture.

## Baseline snapshot

- Repository: [rdzoagbe/HelloFOX](https://github.com/rdzoagbe/HelloFOX)
- Baseline branch: `main`
- Baseline commit reviewed: `a1f9c79c383ade31d7d24c6c0b8d471d237df802`
- Application: static-file PWA published through GitHub Pages
- Runtime: vanilla JavaScript; no application server or build step
- Content: 40 lessons across two levels, parent/child profiles, progress, settings, backup export/import, speech features and illustrations
- Automated tests: `tests/static.js` and `tests/e2e.js`, run by `.github/workflows/tests.yml`
- Latest observed CI at baseline: Automatic checks passed; Pages deployment completed successfully on 2026-10-21

## What the existing checks cover

- JavaScript syntax for app, lesson, translation, art and service-worker files
- English/French translation key parity
- Lesson counts and uniqueness, required lesson content, parent missions and illustration references
- Presence of service-worker cache files and local scripts in the offline shell
- New-user setup, profile creation, persistence after reload, Level 1 and Level 2 lesson journeys, language switching, review of missed words, video messaging and selected parent settings
- Browser console/page errors during the automated Chromium run
- Responsive-layout smoke checks at 320, 360, 390, 430 and 768 CSS pixels, including lesson navigation at 320px

## What CI does not prove

- Installation and lifecycle behavior on physical Android Chrome or iOS/iPadOS Safari
- Reliable speech playback or speech recognition across device/browser voices and permission states
- Offline launch and service-worker update behavior on real installed PWAs
- Backup restoration after malformed, outdated or partially corrupted input
- Usability with children, assistive technology, reduced-motion settings or a range of screen sizes
- That the locally stored parent code resists someone who can inspect or edit browser storage

## Stabilization priorities

1. **Reproduce before fixing:** capture the current commit, exact device/browser, steps, expected behavior, actual behavior and console evidence for each defect.
2. **Protect family data:** test profile/progress persistence, backup export/import, invalid backup rejection and service-worker updates without loss of progress.
3. **Validate core learning:** complete representative and full lesson journeys in both levels; check progress, level unlocks, rewards and daily limits.
4. **Validate PWA behavior:** install from the live HTTPS site, warm the cache, launch offline, return online and verify update behavior.
5. **Validate speech fallbacks:** test speech synthesis and recognition available/unavailable, microphone denied, and no matching voice. Speech recognition must not block a lesson.
6. **Accessibility and usability:** test keyboard/focus behavior, accessible names, contrast, text scaling, reduced motion, portrait/landscape and touch targets.
7. **Release candidate:** rerun automated checks against the exact candidate commit and complete the physical-device matrix before publishing.

## Physical-device acceptance matrix

| Check | Android Chrome | iPhone/iPad Safari |
|---|---|---|
| Add to Home Screen / install and standalone launch | Pending | Pending |
| Setup, child profiles and restart persistence | Pending | Pending |
| Complete a lesson and retain progress | Pending | Pending |
| Warm cache, launch offline, navigate cached lessons | Pending | Pending |
| Reconnect and receive an app update without progress loss | Pending | Pending |
| Speech playback and unavailable-voice fallback | Pending | Pending |
| Speech recognition permission denied/unavailable fallback | Pending | Pending |
| Backup export, valid restore and invalid-file rejection | Pending | Pending |
| Small screen, orientation, text scaling and accessibility review | Pending | Pending |

## Release blockers

Do not release a candidate with a confirmed data-loss defect, a blocked core lesson journey, an invalid backup that can corrupt current data, a serious parent-control bypass in normal use, or a critical/high-severity regression. CI passing alone is not sufficient for release approval.

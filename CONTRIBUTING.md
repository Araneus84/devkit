# Contributing to DevKit

`main` is the published GitHub Pages branch and is protected by the **DevKit QA gate**. Work on a branch and merge through a pull request.

```bash
git switch -c feature/short-name
npm ci
npx playwright install chromium
npm test
git add .
git commit -m "Describe the change"
git push -u origin feature/short-name
```

Open a pull request into `main`. GitHub Actions rebuilds `dist/devkit.html` and runs every test in `tests/` against the folder and standalone editions. The pull request cannot merge while the required check is failing.

When QA fails, open the **DevKit QA** workflow run. Its summary lists every check, the failing test, the relevant final error output, and a suggested repair area. The `devkit-qa-failure-*` artifact contains the complete log for every check.

Add or extend a regression test whenever behavior changes. Interactive editor changes should use real Playwright clicks and key presses where practical, cover both `index.html` and `dist/devkit.html`, and verify the generated text or block model rather than only checking that a control exists.

GitHub sends workflow failure notifications according to each account's Actions notification settings. Enable notifications for this repository under GitHub **Settings → Notifications → Actions** if they are disabled.

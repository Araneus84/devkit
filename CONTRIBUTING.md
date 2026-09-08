# Contributing to DevKit

`main` is the published GitHub Pages branch. It is protected by the required **DevKit QA gate**, so changes go through a pull request.

## Set up

```bash
git switch -c feature/short-name
npm ci
npx playwright install chromium
```

Node.js 22 is used in CI. The application itself remains a static browser app.

## Make and verify a change

Run the fast structural check while editing:

```bash
npm run check
```

Run a matching test file by partial filename when the change is focused:

```bash
npm run test:one -- editor-assist
```

Before opening a pull request, run the complete gate:

```bash
npm test
```

The full command validates the manifest and source tree, rebuilds the standalone file, and runs every model and browser test against the folder and portable editions. Commit `dist/devkit.html` whenever the build changes it.

Add a regression test for behavior changes. Interactive editor tests should use real clicks and key presses where practical and verify the generated source or block model, not only the presence of a control.

## Project structure

The ordered runtime graph lives in `app-manifest.json`. Add a source or style file there and add its matching tag to `index.html` in the same order. `npm run check` rejects missing, duplicated, reordered, or stale assets.

Reference sheets and command builders live in domain files under `data/`. The build generates `src/reference-data.js` and `src/command-definitions.js` for the static runtime. Edit the JSON source, then run `npm run build`.

Keep the portable output in `dist/` and third-party code in `vendor/`. Do not edit generated or vendor files as application source. See [docs/architecture.md](docs/architecture.md) for data flow and extension steps.

## Pull requests

```bash
git add .
git commit -m "Describe the behavior change"
git push -u origin feature/short-name
```

Open a pull request into `main`. A failed Actions run includes a job summary, a precise annotation, and a `devkit-qa-failure-*` artifact with complete logs. GitHub sends notifications according to your repository Actions notification settings.

# DevKit architecture

DevKit has two distributions built from one source tree:

- `index.html` loads ordered JavaScript and CSS files for the normal folder edition.
- `dist/devkit.html` inlines those same assets for portable, offline use.

`app-manifest.json` is the canonical runtime load graph. `index.html` must contain each manifest asset exactly once and in the same order. `tools/build.cjs` validates the graph and generates the portable file. `tools/check.cjs` also rejects missing assets, JavaScript syntax errors, text hygiene problems, and a stale portable build.

## Runtime layers

The runtime uses browser globals because it must also work from `file://` without a module server. Load order is therefore part of the application contract.

1. `vendor/` provides pinned third-party parsers, CodeMirror, modes, and Vim support.
2. `src/state.js`, generated command definitions and reference data, and CI/CD data provide the base model.
3. Reference and feature files add builders, recipes, editors, round-trip adapters, diagnostics, projects, and search.
4. `src/start.js` starts the interface after every dependency is available.

Styles follow the same feature-oriented order in `styles/`. Generated output belongs in `dist/`; third-party source belongs in `vendor/`.

## Editing flow

Connected editors share a document model:

```text
source text → parser/adapter → block model → renderer
     ↑                              ↓
     └──────── generator/reconciler ┘
```

The exact source remains authoritative until a structured edit occurs. YAML adapters use the concrete syntax tree to reconcile changed data into the original document and preserve formatting details where supported. Syntax errors keep the source editable and pause structured controls until the user repairs or resets it.

Editor assistance reads language and schema metadata from `src/schema-registry.js`. Diagnostics, completion, indentation, source/block synchronization, Vim mode, history, and persistence should work through shared editor services rather than feature-specific key handlers.

## Browser storage

Drafts, preferences, workspaces, and project history use versioned browser-local storage. Exported backups are the portability boundary between browsers or devices. Migrations must preserve older envelopes and should have regression coverage.

Recipe packs are data-only JSON. They may describe fields and templates but may not execute code or inject interface markup.

## Add or change a feature

1. Put application code in a focused file under `src/` and styles under `styles/`.
2. Register new schemas or editor behavior in the shared registries and adapters.
3. Add assets to `app-manifest.json` and matching tags to `index.html` in load order.
4. Add a model test for parsing or generation and a browser test for important interaction behavior.
5. Run `npm run check`, then a focused test with `npm run test:one -- <name>`.
6. Run `npm test` before opening a pull request.

For a new reference module, add its sheet to `data/reference/`, its builders to `data/builders/`, and both names to `data/catalog-manifest.json`. Add its schema metadata, recipes, and search aliases at the same time so users can discover the capability from every entry point. `npm run build` regenerates the runtime catalog files.

## Maintenance boundaries

`src/reference-data.js` and `src/command-definitions.js` are generated compatibility files for the static runtime. Edit their domain-owned JSON sources instead. The build and fast check reject stale generated catalogs.

Do not edit `dist/devkit.html` directly. Rebuild it with `npm run build`. Do not modify minified files under `vendor/`; update the pinned dependency and its license notice as a separate change.

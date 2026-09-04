# Security and privacy

DevKit is a static browser application. It reads selected files locally and generates text; it does not execute scripts, connect to infrastructure, install packages, or send drafts to a backend. External documentation opens only when selected. GitHub receives ordinary hosting requests when you load the hosted edition; use the downloaded edition offline when that matters.

## Saved content

Drafts, notes and command history use browser localStorage. They and exported backups are **not encrypted**. Other pages on the same origin, browser extensions with access, or someone using the same browser profile may access saved content. Use environment-variable references and placeholders instead of real credentials. Keep exported backups private. Clear this site's browser data to remove saved content; this also removes drafts, so export anything needed first.

## Reporting a vulnerability

Use the repository's **Security → Report a vulnerability** option for sensitive findings: https://github.com/Araneus84/devkit/security/advisories/new. Include the affected version, a minimal sanitized reproduction and its impact. Never include real secrets or personal files. Ordinary bugs can be filed as GitHub issues. No response-time guarantee is offered.

## Review performed 2026-09-04

Scope: browser rendering, local file and backup imports, parser dependencies, code execution/network paths, and the public repository. This is a scoped maintainer review with regression tests, not an independent penetration test or certification.

- Updated js-yaml from 4.1.1 to 4.3.2, the maintained 4.x release with fixes for upstream parsing/merge denial-of-service advisories. DevKit's JSON-schema parsing avoids several YAML-specific tags already; upgrading also protects other/default-schema uses. Package SHA-512 integrity was verified against npm metadata before copying the published browser bundle; no installation scripts ran.
- Added a Content Security Policy blocking app network connections, objects, forms and base-URL changes, plus a no-referrer policy. Inline script/style support remains necessary for current event handlers and the portable bundle; this is defense in depth, not complete XSS prevention. GitHub Pages response headers and framing policy are outside this HTML policy.
- Retained bounded file/backup imports, cyclic/oversized tree rejection, safe YAML schema use and text escaping. Regression tests exercise malicious markup, backup prototype keys, unsupported YAML tags, parser resource limits, no unexpected network requests and both distributions.
- Full third-party license notices now accompany the standalone HTML.
- Enabled GitHub secret scanning, push protection and private vulnerability reporting. The API reported zero open secret alerts at review time; newly enabled scanning may continue in the background. Exact-version GitHub Advisory Database queries returned no advisories for js-yaml 4.3.2 and the four bundled Lezer packages on this date. This does not prove that no undisclosed vulnerabilities or unrecognized secrets exist.

Checks passed: `tests/security-browser.cjs`, `tests/roundtrip-adapters.cjs`, `tests/roundtrip-browser.cjs`, `tests/ansible-live-sync.cjs`, `tests/python-browser.cjs`, `tests/recipes.cjs`, `tests/deep.cjs` and `tests/cicd.cjs`. Browser checks used Chromium on Windows and covered the folder and bundled editions. No other browser or operating system was tested in this review.

Limits: parsers and conversions run in the browser; unusually complex inputs can still cause slowness. No generated script was run against infrastructure during this review. Templates, custom expressions and reconstructed blocks are not full language/schema validators. Review destructive commands and validate output with the target tool before execution. The latest main branch is maintained; old downloaded copies do not update automatically.

Upstream advisories: https://github.com/nodeca/js-yaml/security/advisories (including GHSA-pm4m-ph32-ghv5 and GHSA-2883-xcg3-v3hh).

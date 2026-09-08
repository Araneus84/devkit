# DevKit

**[Open DevKit](https://araneus84.github.io/devkit/)** · [Single-file edition](https://araneus84.github.io/devkit/dist/devkit.html) · [Download](https://github.com/Araneus84/devkit/archive/refs/heads/main.zip)

DevKit is an offline command reference and structured file builder for system administrators, DevOps engineers, platform engineers, and SREs. It helps you create commands, scripts, configuration files, and CI/CD pipelines without memorizing every keyword or indentation rule.

The app runs entirely in the browser. It has no account, backend, analytics, or runtime network dependency. Drafts stay in browser storage unless you export them.

## What it includes

- Searchable references for common infrastructure and operations tools
- Connected source and block editors for YAML, JSON, Bash, PowerShell, Python, SQL, Terraform, Docker, and related formats
- Specialized Ansible, Python, GitHub Actions, GitLab CI, and Jenkins builders
- Context-aware completion, diagnostics, repairs, syntax highlighting, and optional Vim controls
- Multi-file project workspaces, version history, ZIP import/export, and portable backups
- Recipe packs for adding trusted, data-only templates
- An optional local companion for installed-tool detection and controlled validation

Source edits update supported blocks, and block edits update source. Comments, anchors, aliases, key order, and quote styles are preserved for supported YAML documents when possible. Invalid source stays editable while block controls pause and offer recovery actions.

## Run it

Open `index.html` in a modern browser. Copy the whole folder to move DevKit between Windows, macOS, and Linux.

Use `dist/devkit.html` when you need one portable file. It is generated from the same manifest and source files as the folder edition.

For local development:

```bash
npm ci
npx playwright install chromium
npm run check
npm test
```

Run one test group while iterating:

```bash
npm run test:one -- companion
```

Rebuild the standalone edition after changing source, styles, or the asset manifest:

```bash
npm run build
```

Reference sheets and legacy command builders are maintained as domain files under `data/`. The build generates their browser-compatible runtime files and verifies the portable edition.

## Optional local companion

The companion can detect installed tools, inspect Git status, and run a fixed set of validators or formatters:

```bash
npm run companion
```

It binds to loopback, prints a one-time token, and never invokes a general-purpose shell. Node.js 18 or newer is required for this optional feature. See [Local companion](docs/local-companion.md).

## Documentation

- [Architecture and maintenance](docs/architecture.md)
- [Schema registry](docs/schema-registry.md)
- [YAML round-trip behavior](docs/yaml-roundtrip.md)
- [Editor modes](docs/editor-modes.md)
- [Diagnostics](docs/diagnostics.md)
- [Project workspaces](docs/project-workspaces.md)
- [Recipe packs](docs/recipe-packs.md)
- [Unified search](docs/unified-search.md)
- [CI/CD pipeline map](docs/cicd-pipeline-map.md)
- [Security](SECURITY.md)
- [Release history](CHANGELOG.md)

## License

DevKit uses the [DevKit Free Use License 1.0](LICENSE). You may use it personally, at work, and for paid client projects. You may use or sell the scripts and configurations you generate. You may not sell DevKit, charge for hosted access, include it in a paid product, or monetize copies or derivatives without written permission.

This is a source-available license and is not an OSI-approved open-source license. Third-party libraries keep their own licenses; see [NOTICE](NOTICE).

Browser drafts and backups are not encrypted. Use placeholders for credentials and private keys.

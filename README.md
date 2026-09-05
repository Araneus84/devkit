# DevKit — portable reference and workbench

**[Open DevKit in your browser](https://araneus84.github.io/devkit/)** · [Single-file edition](https://araneus84.github.io/devkit/dist/devkit.html) · [Download for offline use](https://github.com/Araneus84/devkit/archive/refs/heads/main.zip)

DevKit is a browser-based command reference and file builder for sysadmins, DevOps, platform engineers and SREs. It includes Ansible, Terraform, Bash, PowerShell, Python, SQL, containers and separate CI/CD builders. No account or backend is required to use the app.

The hosted app uses browser-local storage. Drafts do not automatically synchronize between devices or between the local-file and hosted editions. Use the app’s backup/export and restore/import controls to move your work. Download the ZIP or single-file edition for offline use.

## License and responsible use

DevKit uses the [DevKit Free Use License 1.0](LICENSE), with notices in [NOTICE](NOTICE). You may use it personally, at work, and for paid client projects. You may use or sell the scripts/configurations you generate. You may share or modify DevKit under its terms, but may not sell the application, include it in a paid product, charge for hosted access, or monetize copies/derivatives without separate written permission.

This is a custom **source-available** license, not an OSI open-source license. Third-party libraries retain their MIT terms. See [SECURITY.md](SECURITY.md) for privacy, review scope, limits and private vulnerability reporting. Browser drafts and exported backups are not encrypted; use placeholders instead of real credentials.

## Publishing updates

GitHub Pages serves the `main` branch from the repository root. The `.nojekyll` file keeps this a plain static site. After editing source files, run `node tools/build.cjs`, commit source and `dist/devkit.html`, then push to `main`. Pages publishes the updated folder edition automatically.


Open **index.html** in a modern browser. No installation, server, account or internet connection is required. Copy the entire folder to move the app to Windows, macOS or Linux. Unzip downloaded archives first.

For a single file, use **dist/devkit.html**. This is generated from the same source as the folder edition.

## Using the app

Version 3.9 adds local syntax coloring to the editable file, Ansible, recipe and command panes. Colors adapt to dark/light themes and distinguish strings, comments, keywords, numbers, variables and configuration keys. The editable textarea retains selection, copy/download, code/block sync and optional Vim controls. Coloring is a lightweight lexical aid, not syntax validation; files above 200,000 characters use plain rendering to keep editing responsive. No external highlighting libraries or network requests are needed. Forced-colors accessibility mode uses native text colors.

Version 3.8 adds **Saved files** to each tool's workbench. Resume imported files after reload, search, rename, duplicate or delete drafts (deletion has an immediate Undo). **Save as a new copy** creates a separate document. Same-name imports offer **Resume saved draft** or **Import as a new copy**, preserving previous edits. These files live in this browser; export backups to move them elsewhere.

**New blank file** and **Load starter** work even when source syntax is incomplete; Undo restores the source and blocks. Backup imports validate complete editor draft shapes. Damaged existing drafts offer recovery downloads rather than silently replacing their contents. Filenames are checked in both block and source modes. Export status is separate from language validation: exporting is possible for unfinished source, and the target tool remains the final validator.

Enable **Vim controls** above an editable code pane. The preference is optional, saved locally and included in workspace backups. The key guide documents the supported subset: insert/normal modes, motions, line yank/delete/paste, new lines and undo/redo. Mode survives automatic block synchronization. This is a lightweight Vim-style implementation; visual mode, Ex commands, macros and plugins are not implemented. Turn the checkbox off for ordinary textarea editing.

Workspace/reset operations and source-change coordination now use shared functions and explicit Python/source adapters in `src/editor-workspace.js`. Rendering still uses the existing extension layers; this release does not replace the entire UI architecture. `tests/workspace-browser.cjs` covers interrupted workflows and Vim operations in both distributions.

1. Choose a tool in the sidebar, then **Open workbench**.
2. Select a recipe, fill in its required values, and add optional blocks.
3. Review the live output. Copy it or download the suggested filename.
4. Use **Customize** on any reference example to edit its exact text. Examples with a matching command recipe open that recipe automatically.

Choose **Deep block editors** at the top of a tool's workbench to build a whole file. The existing quick recipes and command builders remain below it. Ansible retains its specialized playbook, inventory and nested task builder. Regex includes a local JavaScript-engine tester with a 500 ms time limit.

## Deep editors

### Built-in syntax round trips

Version 3.7 improves code-to-block reconstruction instead of relying on a single edited field:

- Dockerfile: every original instruction type, ENV variables, COPY shell/JSON forms, shell/exec RUN/CMD/ENTRYPOINT, continuation lines, build ARGs, platform stages, COPY options/multiple sources and port protocols.
- Bash and PowerShell: the library’s functions, conditions, loops, arrays, commands/parameters and pipelines; PowerShell try/catch/finally. Preambles are preserved when importing scripts without the default startup settings.
- SQL: the library’s SELECT clauses, nested filters, joins, CTEs, INSERT, UPDATE, DELETE and CREATE TABLE.
- Jenkins: the library’s Declarative Pipeline stages, parallel branches, environment/credentials, retry/directory steps and post conditions.
- GitHub Actions/GitLab CI: pipelines expressed by the platform builders return to their specialized blocks. Other valid YAML retains generic data blocks rather than losing vendor-specific keys.
- Terraform: object and array expressions return to typed nested values when representable.

These adapters do not implement every external language/vendor grammar. Unknown directives, heredocs, custom plugins and other unsupported forms remain as editable code. Jenkins/CI specialized conversion is accepted only when regeneration preserves the supported source/data; unsupported additional settings remain intact in the fallback view. Python and Ansible retain their dedicated parsers.

Validation: `node tests/roundtrip-adapters.cjs` tests fresh-source reconstruction and emitted output; `node tests/roundtrip-browser.cjs` tests automatic sync, multiple edits, reorder/undo, error recovery, draft reload and both app editions.

### Compact editors and empty starts

New deep-editor drafts start empty. Bash starts with `#!/usr/bin/env bash`; Python starts with `#!/usr/bin/env python3`. Existing saved drafts are restored. **New blank file** clears the working page (Undo is available); **Load starter** explicitly loads an example. Explicitly selected recipes/examples still open their chosen content. Ansible new files start blank and offer a visible first-field suggestion.

Block panels use smaller spacing, softer surfaces and content-sized text inputs. File uploads are under **Open or drop a file**; dragging a file over that control expands it. YAML completion cards show the changed lines with an always-visible Apply button.

### Ansible live completion

Typing valid YAML, including `- name: ""`, creates and selects the corresponding play/task block automatically after a short pause. Incomplete YAML keeps the last valid blocks. The preview offers explicit, parser-checked repairs for missing colons, unfinished quotes and unclosed flow lists/mappings. Review the proposed text and choose **Apply**; repairs are never applied automatically, and Undo restores the original text. Unsupported errors remain visible for manual correction.

### Edit code and blocks together

Every deep editor, quick recipe, Ansible builder and original command modal now has an editable preview. Type directly, pause briefly, or press **Ctrl/Cmd+Enter** / **Sync code to blocks now**. Block edits update the preview. Deep editor and recipe drafts save typed text immediately; Undo restores earlier code and blocks together. The original command modal remains session-only.

- **Terraform:** typed configuration rebuilds provider/resource/variable/module blocks, arguments and nested blocks. Expressions remain expressions. Comments are retained as code blocks; heredoc-containing blocks are kept as custom code to preserve their contents.
- **YAML/JSON and Ansible:** text rebuilds nested data blocks. Invalid or incomplete documents keep the typed text and last valid blocks; fix the text before resuming structured editing. Deep editors also offer **Keep as Custom code**. YAML comments/anchors and original formatting remain in the code until a block edit regenerates YAML.
- **Bash, PowerShell, SQL, Dockerfile and Jenkins:** edits that exactly match a supported field update that field. Existing recognized blocks are retained where possible. Simple new Bash commands, PowerShell variables/output, SELECT queries and Dockerfile instructions become structured blocks. The supported nested structures are covered by the adapters above; other syntax is preserved in editable **Custom code** blocks.
- **CI/CD YAML:** known field edits keep specialized controls; broader source edits use nested YAML data blocks so extra vendor keys remain editable. Jenkins syntax outside supported fields is retained as custom code.
- **Quick commands:** supported scalar edits retain recipe fields. Other changes use source-line blocks and keep the output filename. The original command modal uses a custom command block for syntax outside its options.

Uploads of `.tf`, `.sh`, `.ps1`, `.sql`, `Dockerfile` and `Jenkinsfile` use the same adapters. **Original source text** remains available for exact-text editing. Source is never executed. Custom code and target-specific expressions must be validated using their language/tool. Run `node tests/source-sync-browser.cjs` with the existing Playwright environment settings to verify two-way editing, nested Terraform, script field updates, imports, unfinished-code recovery, Ansible and both distributions.

### CI/CD platform builders

Open **CI/CD** in the sidebar and select **GitHub Actions**, **GitLab CI**, or **Jenkins**. Each platform has a dedicated builder, starter, saved draft, official syntax reference, and export filename. Add nested blocks or use suggested steps, drag blocks between compatible sections, and use Undo/Redo to revise changes.

- **GitHub Actions:** push, pull request, manual and scheduled triggers; jobs, dependencies, runners, timeouts, matrices, environment/secret references, shell steps, reusable actions and action inputs. Save under `.github/workflows/ci.yml`.
- **GitLab CI:** ordered stages, jobs, images, runner tags, dependencies, variables, before/script/after commands, conditional rules, manual jobs, artifacts and caches. Save as `.gitlab-ci.yml` in the repository root. Some browsers strip its leading dot on download; restore the exact filename.
- **Jenkins:** Declarative Pipeline with agent selection, timeouts, environment/credential bindings, sequential and parallel stages, Unix/Windows commands, checkout, retry, directory, artifacts, JUnit and post conditions. Save as `Jenkinsfile` in the repository root. The starter checks out SCM explicitly and requires a Pipeline-from-SCM or multibranch job.

The editable preview syncs with blocks; automatic quoting handles YAML and Groovy strings. Jobs in GitHub run in parallel unless linked by Needs. GitLab stage order controls execution, with Needs able to bypass stage barriers. Jenkins parallel branches share the selected agent and workspace. Structural checks catch missing fields, duplicate names and invalid job dependencies; full validation still belongs to the target CI platform, particularly action inputs, cron expressions, shell commands and installed Jenkins plugins.

Existing uploads use the shared importer: YAML becomes generic data blocks, and Jenkinsfile uses custom code blocks when its syntax is not recognized. Importing a pipeline does not reconstruct every platform-specific block. The builders work offline and never run pipelines or send credentials anywhere.

CI/CD checks: `node tests/cicd.cjs` and `node tests/cicd-browser.cjs` (the latter uses the same Playwright/Chrome environment settings as the existing browser tests). Model and browser checks cover the three starters, YAML parsing, dependency errors, matrix and secret values, stage reordering, Groovy escaping, independent drafts, download, sidebar restoration, mobile preview, and both folder and bundled editions. No live CI server was used.

| Editor | Building blocks |
| --- | --- |
| Bash | Variables, arrays, commands with individual arguments, pipelines, functions, if/else, foreach, while, return and comments |
| PowerShell | The same script structures, named parameters/switches, and try/catch/finally |
| Python | Variables, arrays, loops, functions, conditions, exception handling and subprocess commands/pipelines |
| Terraform HCL | Terraform settings, providers, variables, locals, resources, data sources, modules, outputs, recursive nested blocks and typed values |
| SQL | SELECT, joins, aggregates, nested AND/OR filters, CTEs, sorting, limits, INSERT rows, UPDATE, DELETE and CREATE TABLE |
| Dockerfile | Repeatable instructions and multiple build stages, with structured command arguments |
| YAML / JSON | Nested mappings/objects, lists, strings, numbers, booleans, null and multiple YAML documents |

### Python: connected code and blocks

Python now opens as a three-pane workspace: a searchable step library, your script blocks, and **editable Python code**. Choose Basics, Modules, pandas, Excel, NumPy or OpenCV. Use **Add the next step to** to insert inside a loop or branch. Ready-made examples include CSV-to-Excel, array statistics, cell editing and image resizing.

Package operations include reading/writing CSV and Excel tables, filtering rows, removing missing rows, creating NumPy arrays and calculating statistics, editing workbook cells, and reading/resizing/converting/saving images. Required imports are generated automatically. **Packages & custom modules** also lets you add a module with an optional alias or use `from … import …`. The displayed pip command is for your own Python environment; DevKit installs and executes nothing.

The operations expansion adds **44 guided steps** and brings the searchable module catalog to **46 entries**, including **23 built-in modules**. This is a curated practical toolkit, not a measured popularity ranking.

| Area | Modules and tasks |
| --- | --- |
| Files and OS | pathlib, os, shutil, subprocess, hashlib; discovery, text files, environment settings, copies, ZIP archives, checksums and commands with timeouts |
| Configuration | json, csv, PyYAML, tomllib, configparser, python-dotenv, Jinja2, sqlite3; config loading/writing, inventory files, templates and parameterized read-only database queries |
| APIs | requests, httpx, tenacity; GET/POST, JSON responses and bounded retries |
| SSH and networking | socket, ipaddress, Paramiko, Netmiko; DNS, TCP checks, subnets, SSH diagnostics, SFTP and device show commands |
| Cloud and containers | boto3, Docker SDK, Kubernetes client/config; AWS identity, paginated S3 listings, container inventories and pod listings |
| Monitoring and automation | psutil, logging, datetime, re, argparse, concurrent.futures, GitPython, Rich, prometheus-client; metrics, logs, CLI options, thread pools, repository status and Prometheus textfiles |

The catalog also provides one-click imports and documentation for sys, platform, tempfile, glob, asyncio, time, pytest, Click and Typer; these do not yet all have dedicated guided operations. The existing NumPy, pandas, Excel and OpenCV helpers remain available.

Use the **Python task category** dropdown to filter the step library, or search by task/module name. **Packages & custom modules** has its own search, documentation links and a built-in/third-party label. The install command excludes standard-library modules and deduplicates packages such as Kubernetes. **Download requirements.txt** exports the selected known third-party dependencies without version pins. Custom modules and dependencies used only in opaque code may need to be added separately.

New starter workflows include API health checks, host metrics, YAML-to-JSON conversion and Kubernetes pod inventory. Connection steps rely on the environment where the generated script runs: existing cloud profiles, kubeconfig, Docker configuration, known SSH host keys, or named environment variables. Templates are never run by DevKit. TOML's built-in `tomllib` requires Python 3.11 or newer.

Type directly into the code pane. After a 600 ms pause, recognized imports, assignments, calls, functions, loops and if/else branches become editable blocks. You can also click **Sync code to blocks now** or press Ctrl/Cmd+Enter. Tab inserts four spaces. Common supported package calls return to their guided steps; other calls use generic function/argument blocks.

Unsupported constructs such as classes, decorators, with-statements and elif chains remain complete **Advanced statement** blocks. Code typed into the pane is kept exactly until a block edit requires regeneration, which may normalize whitespace and quoting. Unrecognized code is retained, not executed. This is a syntax-assisted editor, not a full Python interpreter, formatter or type checker.

While a typed statement is incomplete, the current code is saved and the last valid blocks remain visible. Block editing pauses until the code parses, preventing an incomplete source edit from being overwritten. You can still copy/download the in-progress code. Undo restores previous states. Existing `.py` files open in this connected editor automatically; **Original source text** remains available as an explicit import mode.

Each section offers compatible block types. Add a block, fill its fields, then add more blocks inside it. Drag a handle into a compatible section to change nesting, or use arrow buttons to reorder siblings. Duplicate a block to reuse an entire branch. Collapse/expand controls help navigate large files. SQL keeps its required clause order automatically.

Literal values are escaped automatically. Choose **variable** when referring to a script variable. **Expression** and **Advanced statement** fields deliberately accept code; those require your own syntax review. Terraform expression fields offer input-variable and type choices. Returns belong inside functions.

Compose, Kubernetes and package.json recipes can open as fully editable document trees. Terraform also has an editable `.tf.json` starting file. These starters have separate saved drafts. Contextual suggestions include Compose service fields, Kubernetes container settings, npm metadata and common Terraform arguments. Generic YAML/JSON editors are available from every tool, and Bash/PowerShell editors can assemble command workflows for the other CLI tools.

Use **Drop a file here to customize it** or **Choose file to customize** in a workbench or builder. Ansible's **Open / drop a file** button leads to the same importer. Files are read locally; they are never uploaded to a server.

Automatic mode opens `.json`, `.yaml` and `.yml` as nested blocks, and `.py` in the connected Python workspace. Terraform, Bash, PowerShell, SQL, Dockerfile and Jenkinsfile use the source/block adapters described above; other UTF-8 files open in an editable source view with their original filename. Choose **Original source text** explicitly to bypass conversion, preserve YAML comments or repair an invalid JSON file.

Block imports preserve data, not comments, YAML anchors or original formatting. Source mode preserves original text on import and download; after editing, line endings use the detected original style. JSON holds one root value; YAML may contain multiple documents. Imports require UTF-8 files under 1 MB. Block trees allow 1,500 values and 20 nested levels. Binary files and UTF-16 files are rejected with an explanation. Failed imports leave the current draft intact. Imported files have separate drafts by filename and editor type.

The editors supply language structure, not every vendor's schema. Runtime variable values, provider-specific Terraform arguments, database schemas and advanced expressions are not validated by the browser. SQL uses PostgreSQL-style syntax. Python pipelines capture text between commands and are intended for small text output.

Drag handles and arrow buttons reorder blocks where the output format permits it. SQL clauses and some script setup steps keep their required order. YAML, JSON, shell commands, formulas and device CLI commands have different rules; the UI indicates the output target.

**Nothing is executed by DevKit.** The browser app is cross-platform; generated commands still require the named tools and the indicated operating system or shell. Recipes are starting points, not exhaustive vendor schemas or deployment validation. Check generated files with the actual target tool. Older reference examples are retained and may target particular versions.

## Moving your notes and drafts

Use **Backup / move → Export notes, favorites & drafts** in the old copy. Import that JSON backup into the new copy. Browser storage can depend on the browser, profile and local file path. File URLs do not provide reliable shared storage between different copies.

App files contain no personal notes, favorites or drafts. Those stay in browser storage. Backups contain your saved content and should be kept privately. Closing a private-browsing session or clearing browser data can remove drafts.

## Source layout

- `src/reference-data.js`: cheatsheet content.
- `src/command-definitions.js`: existing option-aware command definitions.
- `src/tool-guides.js`: purpose, workflow, pitfalls, checks and official links for every tool.
- `src/recipe-catalog.js`: typed recipe definitions and pure text generators.
- `src/workbench.js`: shared UI, drafts, fields, ordering, copying and regex testing.
- `src/portable.js`: versioned export/import and portability controls.
- `src/deep-model.js`: recursive node definitions, structural validation and language generators.
- `src/deep-editor.js`: nested editor, compatible moves, file import and per-editor drafts.
- `src/deep-hints.js`: tool-specific suggested fields and starter integration.
- `src/file-import.js`: local file picker/drop zones, structured import and original-source editing.
- `src/python-model.js`: package operations and Python source/block conversion using the locally bundled Lezer parser.
- `src/python-editor.js`: Python step library, editable preview and synchronization.
- `src/python-ops.js`: sysadmin/DevOps module catalog, operations steps and starter workflows.
- `src/ansible-*.js`: the specialized Ansible builder and reference.
- `src/state.js`, `src/reference-ui.js`, `src/start.js`: reference app state, rendering and startup.
- `styles/`: matching stylesheets.
- `vendor/`: the locally bundled YAML library.
- `tools/build.cjs`: dependency-free single-file builder.
- `tests/`: repeatable checks.

Classic deferred scripts are intentional: they can run directly from `file://` without module-loader or fetch restrictions. Runtime resources are local. External documentation links open only when clicked. There is no telemetry, cloud storage, service worker, or automatic update mechanism.

## Rebuild the single-file edition

Only maintainers need Node.js. From this folder:

```text
node tools/build.cjs
```

The build syntax-checks each script and writes `dist/devkit.html`. Edit source files, not the generated HTML. No npm installation is needed to build.

Run `node tests/recipes.cjs` for catalog coverage, generated YAML/JSON parsing, command argument ordering and source checks. Run `node tests/deep.cjs` for recursive language generators and validation. Both use only Node.js built-ins and the bundled YAML library.

Optional UI checks: `node tests/browser-deep.cjs` requires Playwright and a browser supplied separately. `DEVKIT_PLAYWRIGHT` may point to an existing Playwright package and `DEVKIT_CHROME` to a Chrome executable. No browser-test dependencies are needed to run or build the app.

`node tests/uploads.cjs` checks file drops, pickers, original-source downloads, CRLF edits, invalid import recovery, saved imported drafts and both app editions using the same Playwright setup.

Python checks: `node tests/python.cjs`, `node tests/python-roundtrip.cjs`, and `node tests/python-browser.cjs` (the last requires the same Playwright setup). This release also passed CPython syntax checks for 21 generated scripts and CPython AST comparisons for 11 source-to-block-to-source fixtures. Browser checks cover package selection, both editing directions, nested blocks, incomplete-code recovery and reload, custom imports, `.py` imports and offline operation.

Operations checks: `node tests/python-ops.cjs` and `node tests/ops-browser.cjs` (Playwright). All 44 operations and four starters generated parsable Python; 48 outputs also passed CPython syntax parsing. Browser checks cover categories, module search, built-in dependency exclusion, package deduplication, nested insertion and both editions. No cloud, SSH, Docker or Kubernetes operations were executed during verification.

This release was also checked in Chromium with network requests blocked: all 28 tool sections, 1,976 customizable examples, copy/download, input validation, undo, draft reload, regex timeout, backup import/export, mobile preview and the retained Ansible builder passed. The deep editor checks cover actual pointer dragging between branches, recursive editing, cyclic YAML rejection, draft recovery and both folder and bundled editions. Representative Python, Bash, PowerShell, HCL and SQL outputs passed local parser checks. Generated commands were not executed against services or devices.

To add a recipe, call `dkRecipe(...)` in `src/recipe-catalog.js`: specify its tool, stable ID, fields, blocks, pure generator, filename and verification hint. Do not execute generated commands or add network calls. Keep generators deterministic and add representative checks under `tests/`.

## Browser support

Requires a modern browser with native dialog elements, JavaScript, local file access and Blob downloads. Tested in Chromium on Windows. Other operating systems do not need platform-specific app code, but have not been tested in this environment. Clipboard permissions and local regex workers vary by browser; the UI provides selection-based copying or an explanatory message if unavailable.

## Third-party code

js-yaml 4.3.2 is bundled under its MIT license. See `vendor/LICENSE.js-yaml.txt`. Its published npm tarball was verified against SHA-512 integrity `sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==`.

Lezer's Python parser and its common, LR and highlight packages are bundled locally under MIT licenses; see `vendor/LICENSE.lezer.txt` for versions and copyright notices. There are no runtime parser downloads.

Python package references: [NumPy statistics](https://numpy.org/doc/stable/reference/routines.statistics.html), [pandas file I/O](https://pandas.pydata.org/docs/user_guide/io.html), [openpyxl tutorial](https://openpyxl.readthedocs.io/en/3.1/tutorial.html), and [OpenCV image I/O](https://docs.opencv.org/4.12.0/d4/da8/group__imgcodecs.html).

Language references used for the deep editors: [Bash manual](https://www.gnu.org/software/bash/manual/bash.html), [PowerShell language keywords](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords), [Terraform configuration syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration), [PostgreSQL table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html), [Docker Compose services](https://docs.docker.com/reference/compose-file/services/), [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/).

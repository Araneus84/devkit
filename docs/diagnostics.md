# Offline diagnostics contract

DevKit diagnostics run entirely in the browser against the current editor text. They never execute generated code or send source to a service. Every result contains a severity, source category, message, zero-based source range and optional deterministic repair. The CodeMirror integration renders those ranges, lists human-readable one-based line and column locations, and moves the caret to a selected problem.

Syntax checks currently use js-yaml for YAML, `JSON.parse` for JSON, and the bundled Lezer Python syntax tree for Python. Declarative rules cover Kubernetes resources, Docker Compose, GitHub Actions, GitLab CI, Ansible playbooks and package.json. Rule identifiers are attached to the relevant schema-registry entries through `schema.validation.diagnosticRules`. These checks cover common structure and do not replace the target platform's validator.

Secret detection recognizes private-key blocks and common AWS, GitHub, GitLab and Slack token shapes. It also checks literal assignments whose names indicate passwords, tokens, secrets or API keys. Known placeholders and variable expressions are ignored. Repairs replace only the detected value with a context-aware reference. Shared project variables reject a newly entered value that resembles a secret and retain the previously saved value.

Safe repairs are limited to mechanical changes such as removing trailing whitespace, converting forbidden indentation tabs and adding a final newline. Schema and secret repairs require an individual click. Add diagnostics through a schema rule when the condition describes document structure; keep language syntax checks and secret patterns in the shared engine. Every rule or repair needs browser coverage in both the modular and standalone editions.

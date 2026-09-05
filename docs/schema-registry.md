# DevKit schema registry

Schema version 1 is the common runtime contract for DevKit modules. It gives the editor one place to discover reference sheets, structured block profiles, recipes, command builders, syntax mode, indentation, autocomplete entries, parsers, generators and starters.

`src/schema-registry.js` currently normalizes the trusted built-in definitions after all model and round-trip adapters have loaded. Existing builders keep their proven implementations while the UI begins consuming the common contract. Later schema versions can move built-in definitions and safe data-only recipe packs behind the same API without another editor rewrite.

Each entry returned by `dkSchemaGet(id)` contains:

- `schemaVersion`, `id`, `kind`, `title` and `description`
- its reference `sheet`, structured `profile`, recipe IDs and command-builder keys
- `editor.mode`, `editor.indentUnit`, `editor.structured`, `editor.assistId` and optional `editor.preserveSyntax`
- `assist.catalog`
- for structured documents, `blocks.root`, `blocks.types`, `io.seed`, `io.generate` and `io.parse`

Use `dkSchemaProfile(id)` when opening or validating a structured document, `dkSchemaForEditor(item)` for editor behavior, and `dkSchemaAudit()` in tests or development checks. Registration rejects malformed IDs, unsupported schema versions, duplicate IDs and duplicate aliases.

YAML-backed schemas declare `editor.preserveSyntax: "yaml-cst"`. Connected editors use this capability to reconcile block changes into the retained concrete syntax tree instead of selecting preservation behavior from the page or filename.

New built-in modules should first define their reference sheet and/or structured profile, then add editor and completion metadata to the registry tables. Every accepted child type must exist in the profile's type table. Add browser coverage that proves registration, generation, parsing and the consuming UI behavior in both `index.html` and `dist/devkit.html`.

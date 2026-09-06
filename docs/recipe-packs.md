# Data-only recipe packs

DevKit 3.19 can import guided recipes from JSON files. A pack is browser-local, works offline, travels in DevKit backups and can be exported again. Imported recipes appear with built-in recipes in their selected module and in unified search.

Recipe packs are interpreted data. They cannot contain JavaScript generators, event handlers, interface HTML, remote assets or network instructions. DevKit accepts only documented keys, known modules and field types, safe output filenames, bounded collection sizes and fixed `<<part.field|filter>>` placeholders. Import never evaluates pack text.

Use **Packs** in the main header or search for “recipe packs.” The manager includes a downloadable example containing Bash and PowerShell recipes. Importing, replacing or removing a pack reloads DevKit so the schema registry and search index are rebuilt from one consistent library.

Each recipe has ordered `output` segments. A segment without `part` is always emitted. A segment with `part` is emitted only when that block is present, which provides safe optional sections without a programming language.

Placeholders may use `raw`, `shell`, `json`, `yaml`, `lines`, `space`, `csv`, `upper` or `lower`. Structured list or pair values require a structured filter. `shell` follows the builder's POSIX shell or PowerShell selection. These filters format text; they do not execute or validate the resulting command.

The machine-readable contract is [recipe-pack-v1.schema.json](../schemas/recipe-pack-v1.schema.json). Runtime validation remains authoritative and adds semantic checks that JSON Schema cannot express, including unique IDs, valid placeholder references, total limits and known DevKit module IDs.

# YAML round-trip contract

DevKit bundles yaml 2.9.0 locally and parses imported or typed YAML into a concrete syntax tree. The editable block model remains plain, portable data. When a block changes, `src/yaml-roundtrip.js` reconciles the new data into the original document nodes rather than dumping the full object through a plain serializer.

Unchanged source is returned byte-for-byte. After a block change, the document serializer retains document and node comments, anchors, aliases, mapping order, sequence-item comments, and single- or double-quoted scalar styles. Existing sequence nodes are matched first by complete value and then by stable identity fields such as `name`, `id`, `key`, `stage`, `uses`, `run`, `path` or `host`, so their attached comments move with them. A single key replacement at the same mapping position is treated as a rename and retains the pair's comments. New nodes use safe YAML defaults.

This path is shared by generic YAML, GitHub Actions, GitLab CI, the Ansible builder, local YAML imports and project autosave/export. Multi-document streams are supported. The folder and standalone editions load the same committed parser bundle and never fetch parser code at runtime.

The reconciliation layer preserves syntax metadata attached to surviving nodes; it does not promise byte-identical whitespace after a structure changes. Comments attached only to a deleted node are deleted with that node. A changed alias value may become an ordinary node if retaining the alias would change the requested data. Unsupported or invalid YAML stays in the editable source recovery path and cannot overwrite the last valid blocks.

YAML input remains limited to 1 MB, 1,500 values, 20 nested levels and a bounded alias expansion. Duplicate keys, cyclic aliases, null bytes and parser errors are rejected. Add low-level coverage to `tests/yaml-cst-roundtrip.cjs` and connected browser coverage to `tests/yaml-cst-browser.cjs` for every reconciliation change.

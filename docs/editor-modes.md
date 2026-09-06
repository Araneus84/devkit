# Editor modes

DevKit 3.16 provides Guided, Standard and Expert views over the same live document. Switching views changes layout and guidance density only. It does not parse, regenerate, copy or otherwise modify source text, blocks, comments, history or project data.

- **Guided** gives blocks, next-step choices and explanations more room.
- **Standard** balances the connected block and code panes and remains the default.
- **Expert** gives editable code more room and hides repeated field explanations while keeping blocks, diagnostics, completion and synchronization available.

The `devkit:editor-mode-v1` preference applies to deep file editors, Python, CI/CD, project files, Ansible and compact command/file builders. It persists in browser storage and is included in DevKit workspace backups. The responsive Build/Preview tabs remain in control on narrow screens, so all three modes stay usable without forcing a desktop grid.

Mode controls are ordinary buttons in an accessible group. `aria-pressed` identifies the active view, each button describes its effect, and changing modes refreshes mounted CodeMirror instances after layout settles.

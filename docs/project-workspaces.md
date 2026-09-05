# Project workspace contract

DevKit 3.13 stores multi-file workspaces under `devkit:projects:v2`. A project owns file paths, folder entries, open tabs, the active file, shared non-secret variables and durable snapshots. Existing `devkit:projects:v1` data migrates in place on first load. Each file points to an ordinary schema-backed draft in `devkit_builder_drafts_v1`, so opening a project file uses the same code/block synchronization, validation, autocomplete, Vim option and download behavior as a standalone file.

The storage envelope has an explicit integer version and passes `pwMigrate` before validation. Project packages use the separate `devkit-project` format and contain one project plus only its referenced drafts. Imports receive new project, file and draft identities so they cannot overwrite local work. Package version 2 includes snapshot history; version 1 remains importable.

ZIP export writes stored UTF-8 entries with CRC-32 checks and no runtime dependency. ZIP import reads stored or deflated UTF-8 text, validates the complete central directory before changing a project, rejects encrypted and multi-disk archives, checks CRC and expanded sizes, and applies the same portable path rules as manual files. ZIP archives contain the actual project files and empty folder entries. DevKit project packages remain the format that also carries editor blocks, variables, tabs and history.

Snapshots are explicit browser history points containing file text, folders and shared variables. Up to 20 snapshots and 5 MB of snapshot text are retained per project; an individual project must be at most 2 MB to snapshot. A line diff shows current changes and can restore one file or the entire snapshot. ZIP imports and restore operations create a safety snapshot first.

Paths are normalized to portable forward-slash relative paths. Absolute paths, parent traversal, control characters and Windows-reserved filename characters are rejected. Projects are limited to 200 files, imported source files retain their existing 1 MB limit, and unknown file types use the source-preserving editor.

Template contents are data in `PW_TEMPLATES`. New templates should use relative paths, placeholder values and syntax that can open offline. Add browser coverage for file creation, path validation, persistence, tab switching, package round trips and both the folder and standalone editions.

# Project workspace contract

DevKit 3.12 stores multi-file workspaces under `devkit:projects:v1`. A project owns file paths, folder entries, open tabs, the active file and shared non-secret variables. Each file points to an ordinary schema-backed draft in `devkit_builder_drafts_v1`, so opening a project file uses the same code/block synchronization, validation, autocomplete, Vim option and download behavior as a standalone file.

The storage envelope has an explicit integer version and passes `pwMigrate` before validation. Project packages use the separate `devkit-project` format and contain one project plus only its referenced drafts. Imports receive new project, file and draft identities so they cannot overwrite local work.

Paths are normalized to portable forward-slash relative paths. Absolute paths, parent traversal, control characters and Windows-reserved filename characters are rejected. Projects are limited to 200 files, imported source files retain their existing 1 MB limit, and unknown file types use the source-preserving editor.

Template contents are data in `PW_TEMPLATES`. New templates should use relative paths, placeholder values and syntax that can open offline. Add browser coverage for file creation, path validation, persistence, tab switching, package round trips and both the folder and standalone editions.

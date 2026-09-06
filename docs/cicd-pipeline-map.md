# CI/CD pipeline map

DevKit 3.18 adds an offline visual map to the GitHub Actions, GitLab CI and Jenkins builders. The map reads the same document model as the blocks and source preview, so it never maintains a separate pipeline copy.

- GitHub Actions and GitLab CI job cards expose dependency checkboxes and draw arrows for `needs` links.
- Links that would create a cycle are disabled. GitLab links to a later stage are also disabled.
- Jenkins stages are shown from left to right, with parallel branches grouped in one column.
- Selecting a job or stage in the map focuses its editable block.

The map helps design structure; use the platform's own validator before running the generated pipeline.

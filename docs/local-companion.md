# Local companion

DevKit works as a static, offline application. The optional companion adds a deliberately small bridge to tools installed on the same computer. It can inventory supported commands, read the selected repository's Git status, validate text, and format supported text. It cannot run a user-supplied command or read and write arbitrary files.

## Start and connect

From a downloaded or cloned DevKit folder, run Node.js 18 or newer:

```sh
node companion/devkit-companion.cjs --root .
```

Use `--root PATH` to select a different repository for Git status, or `--port NUMBER` to change the default port 3210. The service prints its exact URL and a random one-time token. Keep the terminal open, select **Local** in DevKit, and enter those two values. A new launch creates a new token. The browser keeps the connection details in session storage only.

The workspace detects Git, Node.js, Python, Bash, PowerShell, Terraform, Ansible, Docker, kubectl and Ruff. An unavailable tool is informational; the rest of DevKit remains usable. **Use current DevKit output** copies the open editor text into the companion workspace. Validation never replaces that text. Formatting replaces only the companion workspace text, where it can be reviewed and copied.

Built-in parsing validates JSON and YAML, including Ansible YAML. Installed tools can run `bash -n`, Python byte compilation, the PowerShell parser, and `terraform fmt -check`. Formatting supports two-space JSON, two-space YAML/Ansible and `terraform fmt`. The YAML formatter reports its comment-loss behavior before the user copies its result.

## Security boundary

The HTTP server binds to `127.0.0.1`. It rejects non-loopback Host headers and origins outside local files, local development pages, and DevKit's official GitHub Pages origin. Every non-preflight request requires the random token. Requests are rate-limited and limited to 1 MB; output is capped and commands time out.

Child processes use hard-coded executable candidates and argument arrays with `shell: false`. Validation content is placed in a new operating-system temporary directory, and that directory is deleted after the request. The only repository operation is `git -C ROOT status --short --branch`. There are no general command, argument, path, file-read, file-write, dependency-install, network-proxy or script-execution endpoints.

The browser content policy allows HTTP connections only to `127.0.0.1` and `localhost`. DevKit does not make one unless the user selects **Connect**, **Validate**, **Format**, or **Read Git status**. When the hosted GitHub Pages edition connects, current Chrome versions ask for Local Network Access permission; allow it for `araneus84.github.io`. If it was denied earlier, open the site's browser permissions, allow Local Network Access, and connect again. The local-file edition does not cross from a public site into loopback and may not need this prompt. Close the companion terminal when finished.

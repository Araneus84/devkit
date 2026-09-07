# DevKit Companion

The optional companion gives DevKit controlled access to locally installed validators, formatters and read-only Git status. The browser app remains fully usable without it.

Start it from a DevKit checkout with Node.js 18 or newer:

```powershell
node companion/devkit-companion.cjs --root .
```

The terminal prints a loopback URL and a new random token. Open **Local** in DevKit, enter both values and select **Connect**. The token is kept in session storage only and disappears when the browser session closes. When connecting from GitHub Pages, allow the browser's Local Network Access prompt; if it was previously denied, change that permission in the site's browser settings and retry.

The companion binds to `127.0.0.1`, checks the request Host and Origin, requires the token, limits request size and rate, caps command output, and runs every child process with `shell: false`. It has no arbitrary command, path, file-read, file-write or execution endpoint. Validation input is written only to an isolated temporary directory that is removed after each request. Git access is limited to `git status --short --branch` for the root chosen at launch.

Available API calls are `GET /health`, `GET /tools`, `GET /git/status`, `POST /validate` and `POST /format`. JSON and YAML checks run through bundled parsers. Bash, Python, PowerShell and Terraform checks use an installed tool when available. Formatting supports JSON, YAML/Ansible and Terraform; YAML formatting intentionally reports that comments are not retained.

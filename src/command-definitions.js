const BUILDERS = {
  // ── CMD: robocopy ──
  'cmd::robocopy src dest /mir': {
    name: 'robocopy',
    description: 'Build a robocopy command with the right switches',
    base: 'robocopy',
    args: [
      { key: 'source', label: 'Source', placeholder: 'C:\\source', required: true },
      { key: 'dest', label: 'Destination', placeholder: 'D:\\backup', required: true },
      { key: 'files', label: 'Files (optional)', placeholder: '*.* (default)', required: false },
    ],
    flags: [
      { flag: '/MIR', desc: 'Mirror directory tree (equivalent to /E + /PURGE)' },
      { flag: '/E', desc: 'Copy all subdirectories, including empty ones' },
      { flag: '/S', desc: 'Copy subdirectories, excluding empty ones' },
      { flag: '/PURGE', desc: 'Delete files in destination that no longer exist in source' },
      { flag: '/COPYALL', desc: 'Copy ALL file info (equivalent to /COPY:DATSOU)' },
      { flag: '/MOVE', desc: 'Move files (delete from source after copy)' },
      { flag: '/Z', desc: 'Copy in restartable mode (good for unstable networks)' },
      { flag: '/MT', desc: 'Multi-threaded copy (default 8 threads)', valuePrompt: 'Threads (1-128)', valueDefault: '8' },
      { flag: '/R', desc: 'Number of retries on failed copies', valuePrompt: 'Retries', valueDefault: '3' },
      { flag: '/W', desc: 'Wait time between retries (seconds)', valuePrompt: 'Wait seconds', valueDefault: '5' },
      { flag: '/XF', desc: 'Exclude files matching pattern', valuePrompt: 'Pattern (e.g. *.tmp *.log)' },
      { flag: '/XD', desc: 'Exclude directories matching pattern', valuePrompt: 'Pattern (e.g. node_modules)' },
      { flag: '/LOG', desc: 'Log output to file', valuePrompt: 'Log file path', valueDefault: 'robocopy.log', join: ':' },
      { flag: '/TEE', desc: 'Output to both console and log file' },
      { flag: '/NP', desc: 'No progress (cleaner output)' },
      { flag: '/NFL', desc: 'No file list (cleaner log)' },
      { flag: '/NDL', desc: 'No directory list (cleaner log)' },
      { flag: '/L', desc: 'List only — do not copy (dry run!)' },
      { flag: '/MAXAGE', desc: 'Maximum file age (skip files older than)', valuePrompt: 'Days or YYYYMMDD', join: ':' },
      { flag: '/MINAGE', desc: 'Minimum file age (skip files newer than)', valuePrompt: 'Days or YYYYMMDD', join: ':' },
    ]
  },

  // ── BASH: find ──
  'bash::find . -name "*.txt"': {
    name: 'find',
    description: 'Build a find command with filters',
    base: 'find',
    args: [
      { key: 'path', label: 'Search path', placeholder: '.', required: true, default: '.' },
    ],
    flags: [
      { flag: '-name', desc: 'Match by filename pattern (case-sensitive)', valuePrompt: 'Pattern (e.g. *.log)', join: ' ', quote: true },
      { flag: '-iname', desc: 'Match by filename pattern (case-insensitive)', valuePrompt: 'Pattern', join: ' ', quote: true },
      { flag: '-type f', desc: 'Match only files' },
      { flag: '-type d', desc: 'Match only directories' },
      { flag: '-type l', desc: 'Match only symbolic links' },
      { flag: '-size', desc: 'Filter by file size', valuePrompt: 'Size (e.g. +100M, -1k, +1G)', join: ' ' },
      { flag: '-mtime', desc: 'Modified time in days (+N = older, -N = newer)', valuePrompt: 'Days (e.g. -7)', join: ' ' },
      { flag: '-mmin', desc: 'Modified time in minutes', valuePrompt: 'Minutes (e.g. -60)', join: ' ' },
      { flag: '-user', desc: 'Files owned by user', valuePrompt: 'Username', join: ' ' },
      { flag: '-perm', desc: 'Files with specific permissions', valuePrompt: 'Mode (e.g. 644, /u+x)', join: ' ' },
      { flag: '-empty', desc: 'Empty files or directories only' },
      { flag: '-not', desc: 'Negate the next condition' },
      { flag: '-maxdepth', desc: 'Limit recursion depth', valuePrompt: 'Depth', valueDefault: '2', join: ' ' },
      { flag: '-mindepth', desc: 'Minimum depth before matching', valuePrompt: 'Depth', valueDefault: '1', join: ' ' },
      { flag: '-delete', desc: 'Delete matching files (CAREFUL!)' },
      { flag: '-print', desc: 'Print full path (default action)' },
      { flag: '-print0', desc: 'Print null-separated (use with xargs -0)' },
      { flag: '-exec', desc: 'Execute command on each match', valuePrompt: 'Command (use {} for file, end with \\;)', join: ' ' },
    ]
  },

  // ── BASH: grep ──
  'bash::grep "pattern" file.txt': {
    name: 'grep',
    description: 'Build a grep search command',
    base: 'grep',
    args: [
      { key: 'pattern', label: 'Pattern', placeholder: 'search text or regex', required: true, quote: true },
      { key: 'file', label: 'File / path', placeholder: 'file.txt or directory', required: true },
    ],
    flags: [
      { flag: '-i', desc: 'Case-insensitive matching' },
      { flag: '-r', desc: 'Recursive search through directories' },
      { flag: '-R', desc: 'Recursive, following symlinks' },
      { flag: '-v', desc: 'Invert match — show lines NOT matching' },
      { flag: '-n', desc: 'Show line numbers' },
      { flag: '-c', desc: 'Count matching lines only' },
      { flag: '-l', desc: 'Print only filenames with matches' },
      { flag: '-L', desc: 'Print only filenames WITHOUT matches' },
      { flag: '-w', desc: 'Match whole words only' },
      { flag: '-x', desc: 'Match whole lines only' },
      { flag: '-E', desc: 'Extended regex (egrep mode)' },
      { flag: '-P', desc: 'Perl-compatible regex (PCRE)' },
      { flag: '-F', desc: 'Fixed string (no regex)' },
      { flag: '-A', desc: 'Show N lines AFTER match', valuePrompt: 'Lines', valueDefault: '3', join: ' ' },
      { flag: '-B', desc: 'Show N lines BEFORE match', valuePrompt: 'Lines', valueDefault: '3', join: ' ' },
      { flag: '-C', desc: 'Show N lines AROUND match (context)', valuePrompt: 'Lines', valueDefault: '3', join: ' ' },
      { flag: '--include', desc: 'Only search files matching glob', valuePrompt: 'Glob (e.g. *.py)', join: '=', quote: true },
      { flag: '--exclude', desc: 'Skip files matching glob', valuePrompt: 'Glob (e.g. *.log)', join: '=', quote: true },
      { flag: '--exclude-dir', desc: 'Skip directories matching pattern', valuePrompt: 'Dir name (e.g. node_modules)', join: '=' },
      { flag: '--color=always', desc: 'Force colored output (useful when piping)' },
    ]
  },

  // ── BASH: rsync ──
  'bash::rsync -avz src/ user@host:/dest/': {
    name: 'rsync',
    description: 'Build a rsync sync command',
    base: 'rsync',
    args: [
      { key: 'source', label: 'Source', placeholder: 'src/ or user@host:/path/', required: true },
      { key: 'dest', label: 'Destination', placeholder: 'dest/ or user@host:/path/', required: true },
    ],
    flags: [
      { flag: '-a', desc: 'Archive mode (preserves permissions, times, symlinks)' },
      { flag: '-v', desc: 'Verbose output' },
      { flag: '-z', desc: 'Compress during transfer (faster over network)' },
      { flag: '-h', desc: 'Human-readable numbers' },
      { flag: '-P', desc: 'Show progress AND keep partial files on interrupt' },
      { flag: '--progress', desc: 'Show progress during transfer' },
      { flag: '--partial', desc: 'Keep partially transferred files' },
      { flag: '--delete', desc: 'Delete extra files at destination (mirror)' },
      { flag: '--dry-run', desc: 'Preview without actually copying' },
      { flag: '-n', desc: 'Same as --dry-run (shorter)' },
      { flag: '--exclude', desc: 'Exclude files matching pattern', valuePrompt: 'Pattern (e.g. *.tmp)', join: '=', quote: true },
      { flag: '--include', desc: 'Include files matching pattern', valuePrompt: 'Pattern', join: '=', quote: true },
      { flag: '--exclude-from', desc: 'Exclude patterns from file', valuePrompt: 'Filename', join: '=' },
      { flag: '-e', desc: 'Use custom remote shell command', valuePrompt: 'Command (e.g. "ssh -p 2222")', join: ' ', quote: true },
      { flag: '--bwlimit', desc: 'Limit bandwidth (KB/s)', valuePrompt: 'Speed', valueDefault: '1000', join: '=' },
      { flag: '--max-size', desc: 'Skip files larger than size', valuePrompt: 'Size (e.g. 100M)', join: '=' },
      { flag: '--checksum', desc: 'Use checksum to determine changes (slower but safer)' },
      { flag: '-u', desc: 'Skip files newer at destination (update only)' },
      { flag: '--remove-source-files', desc: 'Remove source files after successful copy' },
    ]
  },

  // ── BASH: tar ──
  'bash::tar -czvf archive.tar.gz dir/': {
    name: 'tar',
    description: 'Build a tar archive command',
    base: 'tar',
    args: [
      { key: 'mode', label: 'Operation', type: 'select', options: [
        { value: '-c', label: '-c Create archive' },
        { value: '-x', label: '-x Extract archive' },
        { value: '-t', label: '-t List contents' },
      ], required: true, default: '-c' },
      { key: 'archive', label: 'Archive file', placeholder: 'archive.tar.gz', required: true },
      { key: 'target', label: 'Target (for create only)', placeholder: 'dir/ or file', required: false },
    ],
    flags: [
      { flag: '-z', desc: 'Use gzip compression (.tar.gz / .tgz)' },
      { flag: '-j', desc: 'Use bzip2 compression (.tar.bz2)' },
      { flag: '-J', desc: 'Use xz compression (.tar.xz)' },
      { flag: '-v', desc: 'Verbose — show files being processed' },
      { flag: '-f', desc: 'Required — specify archive filename (auto-added)', hidden: true, alwaysOn: true },
      { flag: '-p', desc: 'Preserve permissions' },
      { flag: '--exclude', desc: 'Exclude files matching pattern', valuePrompt: 'Pattern (e.g. *.log)', join: '=', quote: true },
      { flag: '-C', desc: 'Change to directory before processing', valuePrompt: 'Directory path', join: ' ' },
      { flag: '--strip-components', desc: 'Strip N leading path components on extract', valuePrompt: 'Number', valueDefault: '1', join: '=' },
    ]
  },

  // ── DOCKER: docker run ──
  'docker::docker run -d --name web -p 8080:80 nginx': {
    name: 'docker run',
    description: 'Build a docker run command',
    base: 'docker run',
    args: [
      { key: 'image', label: 'Image', placeholder: 'nginx:latest', required: true },
      { key: 'cmd', label: 'Command (optional)', placeholder: 'bash, or leave empty', required: false },
    ],
    flags: [
      { flag: '-d', desc: 'Detached mode — run in background' },
      { flag: '-it', desc: 'Interactive with terminal' },
      { flag: '--rm', desc: 'Auto-remove container after exit' },
      { flag: '--name', desc: 'Container name', valuePrompt: 'Name', join: ' ' },
      { flag: '-p', desc: 'Port mapping', valuePrompt: 'host:container (e.g. 8080:80)', join: ' ' },
      { flag: '-v', desc: 'Volume mount', valuePrompt: 'host:container (e.g. /data:/app)', join: ' ' },
      { flag: '-e', desc: 'Environment variable', valuePrompt: 'KEY=value', join: ' ' },
      { flag: '--env-file', desc: 'Load env from file', valuePrompt: 'Filename (e.g. .env)', join: ' ' },
      { flag: '--network', desc: 'Connect to network', valuePrompt: 'Network name', join: ' ' },
      { flag: '--restart', desc: 'Restart policy', valuePrompt: 'always | on-failure | unless-stopped', valueDefault: 'unless-stopped', join: '=' },
      { flag: '--user', desc: 'Run as user', valuePrompt: 'UID:GID or username', join: ' ' },
      { flag: '-w', desc: 'Working directory inside container', valuePrompt: 'Path (e.g. /app)', join: ' ' },
      { flag: '--memory', desc: 'Memory limit', valuePrompt: 'Size (e.g. 512m, 2g)', join: '=' },
      { flag: '--cpus', desc: 'CPU limit', valuePrompt: 'Count (e.g. 1.5)', join: '=' },
      { flag: '--hostname', desc: 'Set container hostname', valuePrompt: 'Hostname', join: ' ' },
      { flag: '--privileged', desc: 'Give extended privileges (CAREFUL!)' },
    ]
  },

  // ── CURL: complex POST ──
  'curl::curl -X POST -d \'{"key":"value"}\' -H "Content-Type: application/json" url': {
    name: 'curl',
    description: 'Build a curl HTTP request',
    base: 'curl',
    args: [
      { key: 'url', label: 'URL', placeholder: 'https://api.example.com/endpoint', required: true },
    ],
    flags: [
      { flag: '-X', desc: 'HTTP method', valuePrompt: 'GET | POST | PUT | DELETE | PATCH', valueDefault: 'POST', join: ' ' },
      { flag: '-H', desc: 'Add header', valuePrompt: 'Header (e.g. "Content-Type: application/json")', join: ' ', quote: true, repeatable: true },
      { flag: '-d', desc: 'Request body data', valuePrompt: 'Data (e.g. \'{"key":"value"}\' or @file.json)', join: ' ', quote: true },
      { flag: '-u', desc: 'Basic auth', valuePrompt: 'username:password', join: ' ' },
      { flag: '-o', desc: 'Save output to file', valuePrompt: 'Filename', join: ' ' },
      { flag: '-O', desc: 'Save with original filename' },
      { flag: '-L', desc: 'Follow redirects' },
      { flag: '-v', desc: 'Verbose output' },
      { flag: '-s', desc: 'Silent (no progress bar)' },
      { flag: '-i', desc: 'Include response headers in output' },
      { flag: '-I', desc: 'HEAD request only (headers)' },
      { flag: '-k', desc: 'Allow insecure SSL (skip cert check)' },
      { flag: '--max-time', desc: 'Maximum total time', valuePrompt: 'Seconds', valueDefault: '30', join: ' ' },
      { flag: '--connect-timeout', desc: 'Connection timeout', valuePrompt: 'Seconds', valueDefault: '5', join: ' ' },
      { flag: '-F', desc: 'Multipart form data', valuePrompt: 'field=value or file=@path', join: ' ', quote: true, repeatable: true },
      { flag: '--cookie', desc: 'Send cookies', valuePrompt: 'name=value or filename', join: ' ', quote: true },
      { flag: '-A', desc: 'User-Agent string', valuePrompt: 'User agent', join: ' ', quote: true },
      { flag: '-x', desc: 'Use proxy', valuePrompt: 'Proxy URL', join: ' ' },
    ]
  },

  // ── NMAP ──
  'net::nmap host.com': {
    name: 'nmap',
    description: 'Build an nmap scan command',
    base: 'nmap',
    args: [
      { key: 'target', label: 'Target', placeholder: 'host.com or 192.168.1.0/24', required: true },
    ],
    flags: [
      { flag: '-sn', desc: 'Ping scan only — discover hosts (no port scan)' },
      { flag: '-sS', desc: 'SYN stealth scan (requires root)' },
      { flag: '-sT', desc: 'TCP connect scan (no root needed)' },
      { flag: '-sU', desc: 'UDP scan (requires root)' },
      { flag: '-sV', desc: 'Service version detection' },
      { flag: '-O', desc: 'OS detection' },
      { flag: '-A', desc: 'Aggressive (OS, services, scripts, traceroute)' },
      { flag: '-p', desc: 'Ports to scan', valuePrompt: 'e.g. 80,443 or 1-1000 or -', valueDefault: '1-1000', join: ' ' },
      { flag: '-p-', desc: 'Scan ALL 65535 ports (slow!)' },
      { flag: '-T', desc: 'Timing template (0-5, higher=faster)', valuePrompt: 'Speed', valueDefault: '4', join: '' },
      { flag: '--top-ports', desc: 'Scan top N most common ports', valuePrompt: 'N', valueDefault: '100', join: ' ' },
      { flag: '-Pn', desc: 'Skip host discovery (treat as up)' },
      { flag: '-n', desc: 'No DNS resolution (faster)' },
      { flag: '--script', desc: 'Run NSE scripts', valuePrompt: 'Script name (e.g. vuln, default)', join: '=' },
      { flag: '-oN', desc: 'Output to normal text file', valuePrompt: 'Filename', join: ' ' },
      { flag: '-oX', desc: 'Output to XML file', valuePrompt: 'Filename', join: ' ' },
      { flag: '-v', desc: 'Verbose output' },
      { flag: '-vv', desc: 'Very verbose' },
    ]
  },

  // ── SSH ──
  'ssh::ssh user@host': {
    name: 'ssh',
    description: 'Build an SSH connection command',
    base: 'ssh',
    args: [
      { key: 'target', label: 'user@host', placeholder: 'user@server.com', required: true },
      { key: 'remoteCmd', label: 'Remote command (optional)', placeholder: 'uptime', required: false, quote: true },
    ],
    flags: [
      { flag: '-p', desc: 'Custom port', valuePrompt: 'Port', valueDefault: '22', join: ' ' },
      { flag: '-i', desc: 'Identity file (private key)', valuePrompt: 'Path to key', join: ' ' },
      { flag: '-v', desc: 'Verbose (use -vvv for max verbosity)' },
      { flag: '-A', desc: 'Forward SSH agent' },
      { flag: '-X', desc: 'X11 forwarding (GUI apps)' },
      { flag: '-t', desc: 'Force pseudo-terminal (needed for sudo)' },
      { flag: '-N', desc: 'No remote command (useful for tunnels)' },
      { flag: '-f', desc: 'Background after authentication' },
      { flag: '-L', desc: 'Local port forward', valuePrompt: 'localport:remotehost:remoteport', join: ' ' },
      { flag: '-R', desc: 'Remote port forward', valuePrompt: 'remoteport:localhost:localport', join: ' ' },
      { flag: '-D', desc: 'SOCKS5 proxy port', valuePrompt: 'Local port', valueDefault: '1080', join: ' ' },
      { flag: '-J', desc: 'ProxyJump (via bastion)', valuePrompt: 'jumpuser@jumphost', join: ' ' },
      { flag: '-o', desc: 'Set option', valuePrompt: 'e.g. ServerAliveInterval=60', join: ' ', quote: true, repeatable: true },
      { flag: '-C', desc: 'Enable compression' },
      { flag: '-q', desc: 'Quiet mode' },
    ]
  },

  // ── KUBECTL: get pods with filters ──
  'k8s::kubectl get pods': {
    name: 'kubectl get pods',
    description: 'Build a kubectl get pods command',
    base: 'kubectl get pods',
    args: [],
    flags: [
      { flag: '-n', desc: 'Namespace', valuePrompt: 'Namespace name', join: ' ' },
      { flag: '-A', desc: 'All namespaces' },
      { flag: '-o wide', desc: 'Show extra info (IP, node)' },
      { flag: '-o yaml', desc: 'Output as YAML' },
      { flag: '-o json', desc: 'Output as JSON' },
      { flag: '-l', desc: 'Label selector', valuePrompt: 'e.g. app=nginx,env=prod', join: ' ' },
      { flag: '--field-selector', desc: 'Field selector', valuePrompt: 'e.g. status.phase=Failed', join: '=' },
      { flag: '-w', desc: 'Watch — live updates' },
      { flag: '--show-labels', desc: 'Include labels in output' },
      { flag: '--sort-by', desc: 'Sort by field', valuePrompt: 'JSONPath (e.g. .metadata.name)', join: '=', quote: true },
      { flag: '--no-headers', desc: 'Skip column headers' },
      { flag: '--all-namespaces', desc: 'Same as -A (long form)' },
    ]
  },

  // ── KUBECTL: logs ──
  'k8s::kubectl logs pod-name': {
    name: 'kubectl logs',
    description: 'Build a kubectl logs command',
    base: 'kubectl logs',
    args: [
      { key: 'pod', label: 'Pod name or selector', placeholder: 'pod-name or -l app=nginx', required: true },
    ],
    flags: [
      { flag: '-n', desc: 'Namespace', valuePrompt: 'Namespace', join: ' ' },
      { flag: '-f', desc: 'Follow log output (stream)' },
      { flag: '-c', desc: 'Container name (for multi-container pods)', valuePrompt: 'Container', join: ' ' },
      { flag: '--previous', desc: 'Show logs from previous container instance (crashed)' },
      { flag: '--tail', desc: 'Show only last N lines', valuePrompt: 'Lines', valueDefault: '100', join: '=' },
      { flag: '--since', desc: 'Show logs since duration ago', valuePrompt: 'e.g. 1h, 30m, 5s', join: '=' },
      { flag: '--since-time', desc: 'Show logs since timestamp', valuePrompt: 'RFC3339 (e.g. 2025-01-01T00:00:00Z)', join: '=' },
      { flag: '--timestamps', desc: 'Include timestamps in output' },
      { flag: '--all-containers', desc: 'Logs from all containers in pod' },
      { flag: '-l', desc: 'Label selector (instead of pod name)', valuePrompt: 'e.g. app=nginx', join: ' ' },
    ]
  },

  // ── GIT: log ──
  'git::git log': {
    name: 'git log',
    description: 'Build a git log command',
    base: 'git log',
    args: [],
    flags: [
      { flag: '--oneline', desc: 'Compact one-line format' },
      { flag: '--graph', desc: 'ASCII graph of branches' },
      { flag: '--all', desc: 'Show all branches' },
      { flag: '--decorate', desc: 'Show branch/tag refs' },
      { flag: '-n', desc: 'Limit number of commits', valuePrompt: 'Number', valueDefault: '20', join: ' ' },
      { flag: '--since', desc: 'Show commits since date', valuePrompt: 'e.g. "2 weeks ago" or "2025-01-01"', join: '=', quote: true },
      { flag: '--until', desc: 'Show commits until date', valuePrompt: 'Date', join: '=', quote: true },
      { flag: '--author', desc: 'Filter by author', valuePrompt: 'Name or email', join: '=', quote: true },
      { flag: '--grep', desc: 'Filter by commit message pattern', valuePrompt: 'Pattern', join: '=', quote: true },
      { flag: '-p', desc: 'Show patch (full diff)' },
      { flag: '--stat', desc: 'Show file change stats' },
      { flag: '--name-only', desc: 'Show only changed filenames' },
      { flag: '--reverse', desc: 'Show oldest commits first' },
      { flag: '--merges', desc: 'Show only merge commits' },
      { flag: '--no-merges', desc: 'Hide merge commits' },
      { flag: '--pretty', desc: 'Custom format', valuePrompt: 'e.g. format:"%h %s"', join: '=', quote: true },
    ]
  },

  // ── AWS S3 sync ──
  'aws::aws s3 sync local/ s3://bucket/path/': {
    name: 'aws s3 sync',
    description: 'Build an aws s3 sync command',
    base: 'aws s3 sync',
    args: [
      { key: 'source', label: 'Source', placeholder: 'local/ or s3://bucket/path/', required: true },
      { key: 'dest', label: 'Destination', placeholder: 's3://bucket/path/ or local/', required: true },
    ],
    flags: [
      { flag: '--delete', desc: 'Delete files in destination that no longer exist in source' },
      { flag: '--dryrun', desc: 'Preview without making changes' },
      { flag: '--exclude', desc: 'Exclude pattern', valuePrompt: 'Pattern (e.g. "*.tmp")', join: ' ', quote: true, repeatable: true },
      { flag: '--include', desc: 'Include pattern (use after exclude)', valuePrompt: 'Pattern', join: ' ', quote: true, repeatable: true },
      { flag: '--acl', desc: 'Set ACL on uploaded objects', valuePrompt: 'private | public-read | bucket-owner-full-control', valueDefault: 'private', join: ' ' },
      { flag: '--storage-class', desc: 'Storage class', valuePrompt: 'STANDARD | STANDARD_IA | GLACIER | DEEP_ARCHIVE', join: ' ' },
      { flag: '--sse', desc: 'Server-side encryption', valuePrompt: 'AES256 | aws:kms', valueDefault: 'AES256', join: ' ' },
      { flag: '--cache-control', desc: 'Set Cache-Control header', valuePrompt: 'e.g. max-age=3600', join: ' ', quote: true },
      { flag: '--content-type', desc: 'Set Content-Type', valuePrompt: 'e.g. text/html', join: ' ', quote: true },
      { flag: '--profile', desc: 'Use specific AWS profile', valuePrompt: 'Profile name', join: ' ' },
      { flag: '--region', desc: 'Specify region', valuePrompt: 'e.g. us-east-1', join: ' ' },
      { flag: '--size-only', desc: 'Compare size only (not modified time)' },
      { flag: '--exact-timestamps', desc: 'Require exact timestamp match' },
    ]
  },

  // ── tcpdump ──
  'net::sudo tcpdump -i any': {
    name: 'tcpdump',
    description: 'Build a tcpdump packet capture command',
    base: 'sudo tcpdump',
    args: [],
    flags: [
      { flag: '-i', desc: 'Interface to capture on', valuePrompt: 'e.g. eth0, any', valueDefault: 'any', join: ' ' },
      { flag: '-c', desc: 'Capture only N packets then stop', valuePrompt: 'Count', valueDefault: '100', join: ' ' },
      { flag: '-w', desc: 'Write to pcap file', valuePrompt: 'Filename (e.g. capture.pcap)', join: ' ' },
      { flag: '-r', desc: 'Read from pcap file', valuePrompt: 'Filename', join: ' ' },
      { flag: '-n', desc: 'Don\'t resolve hostnames (faster)' },
      { flag: '-nn', desc: 'Don\'t resolve hostnames or port names' },
      { flag: '-v', desc: 'Verbose (use -vv or -vvv for more)' },
      { flag: '-A', desc: 'Print packets in ASCII' },
      { flag: '-X', desc: 'Print packets in hex AND ASCII' },
      { flag: '-s', desc: 'Snapshot length (bytes per packet)', valuePrompt: 'Bytes (0 = full)', valueDefault: '0', join: ' ' },
      { flag: 'port', desc: 'Filter by port (filter expression)', valuePrompt: 'Port number', join: ' ', filterMode: true },
      { flag: 'host', desc: 'Filter by host (filter expression)', valuePrompt: 'IP or hostname', join: ' ', filterMode: true },
      { flag: 'net', desc: 'Filter by network (filter expression)', valuePrompt: 'CIDR (e.g. 192.168.1.0/24)', join: ' ', filterMode: true },
      { flag: 'tcp', desc: 'Only TCP traffic', filterMode: true },
      { flag: 'udp', desc: 'Only UDP traffic', filterMode: true },
      { flag: 'icmp', desc: 'Only ICMP (ping) traffic', filterMode: true },
    ]
  },

  // ══════════════════════════════════════════════
  // GAM7
  // ══════════════════════════════════════════════
  'gam7::gam update user user@domain.com suspended false': {
    name: 'gam update user',
    description: 'Update a Google Workspace user account',
    base: 'gam update user',
    args: [
      { key: 'user', label: 'User email', placeholder: 'user@domain.com', required: true },
    ],
    flags: [
      { flag: 'suspended true',  desc: 'Suspend the user account' },
      { flag: 'suspended false', desc: 'Unsuspend / restore the user account' },
      { flag: 'changepassword true', desc: 'Force password change at next login' },
      { flag: 'admin true',  desc: 'Grant super admin privileges' },
      { flag: 'admin false', desc: 'Revoke super admin privileges' },
      { flag: 'password', desc: 'Set a new password', valuePrompt: 'New password', join: ' ', quote: true },
      { flag: 'firstname', desc: 'Change first name', valuePrompt: 'First name', join: ' ', quote: true },
      { flag: 'lastname',  desc: 'Change last name',  valuePrompt: 'Last name',  join: ' ', quote: true },
      { flag: 'ou', desc: 'Move to Organizational Unit', valuePrompt: '/OUName', join: ' ', quote: true },
    ]
  },

  'gam7::gam user user@domain.com print filelist': {
    name: 'gam print filelist',
    description: 'List Drive files for a user',
    base: 'gam user',
    args: [
      { key: 'user', label: 'User email', placeholder: 'user@domain.com', required: true },
    ],
    flags: [
      { flag: 'print filelist', desc: 'List files (always required)', alwaysOn: true, hidden: true },
      { flag: 'fields name,size,owners,modifiedtime', desc: 'Show name, size, owner, modified date' },
      { flag: 'fields name,id,mimeType,parents', desc: 'Show file ID, type and folder structure' },
      { flag: 'query "mimeType=\'application/vnd.google-apps.folder\'"', desc: 'List only folders', join: ' ' },
      { flag: 'query "\'me\' in owners"', desc: 'Only files owned by this user', join: ' ' },
      { flag: 'query "modifiedTime > \'2024-01-01\'"', desc: 'Only recently modified files', join: ' ' },
      { flag: '> filelist.csv', desc: 'Export output to CSV file' },
    ]
  },

  'gam7::gam user user@domain.com print licenses': {
    name: 'gam print licenses',
    description: 'Show licenses for a user or the whole org',
    base: 'gam',
    args: [
      { key: 'scope', label: 'Scope', type: 'select',
        options: [
          { value: 'user user@domain.com print licenses', label: 'Specific user' },
          { value: 'print licenses', label: 'Entire org' },
        ], required: true, default: 'print licenses' },
    ],
    flags: []
  },

  'gam7::gam user src@domain.com transfer drive dest@domain.com': {
    name: 'gam transfer drive',
    description: 'Transfer Drive files between users',
    base: 'gam user',
    args: [
      { key: 'src',  label: 'Source user',      placeholder: 'source@domain.com',      required: true },
      { key: 'dest', label: 'Destination user',  placeholder: 'destination@domain.com', required: true },
    ],
    flags: [
      { flag: 'transfer drive', desc: 'Transfer Drive files (always required)', alwaysOn: true, hidden: true },
    ]
  },

  'gam7::gam user user@domain.com add license 1010020026': {
    name: 'gam add/delete license',
    description: 'Assign or remove a Google Workspace license',
    base: 'gam user',
    args: [
      { key: 'user',   label: 'User email', placeholder: 'user@domain.com', required: true },
      { key: 'action', label: 'Action', type: 'select',
        options: [
          { value: 'add license',    label: 'Add license' },
          { value: 'delete license', label: 'Remove license' },
        ], required: true, default: 'add license' },
      { key: 'sku', label: 'License SKU', type: 'select',
        options: [
          { value: '1010020026', label: 'Enterprise Standard' },
          { value: '1010020020', label: 'Enterprise Plus' },
          { value: '1010310004', label: 'Business Standard' },
          { value: '1010310003', label: 'Business Starter' },
          { value: '1010340001', label: 'Archived User' },
          { value: '1010400001', label: 'Chrome Enterprise Premium' },
        ], required: true, default: '1010020026' },
    ],
    flags: []
  },

  'gam7::gam create vaultexport matter MATTER_ID name "Export" corpus mail accounts user@domain.com': {
    name: 'gam create vaultexport',
    description: 'Export a user mailbox or Drive via Vault',
    base: 'gam create vaultexport',
    args: [
      { key: 'matter',  label: 'matter MATTER_ID', placeholder: 'matter abc123', required: true },
      { key: 'name',    label: 'Export name',       placeholder: 'My Export',      required: true, quote: true },
      { key: 'corpus',  label: 'Data type', type: 'select',
        options: [
          { value: 'corpus mail',   label: 'Mail (Gmail)' },
          { value: 'corpus drive',  label: 'Drive' },
          { value: 'corpus groups', label: 'Groups' },
        ], required: true, default: 'corpus mail' },
      { key: 'accounts', label: 'User email', placeholder: 'accounts user@domain.com', required: true },
    ],
    flags: []
  },

  'gam7::gam print users': {
    name: 'gam print users',
    description: 'List users with filters and fields',
    base: 'gam print users',
    args: [],
    flags: [
      { flag: 'query "isSuspended=true"',  desc: 'Only suspended users' },
      { flag: 'query "isAdmin=true"',       desc: 'Only super admins' },
      { flag: 'query "orgUnitPath=/Sales"', desc: 'Filter by OU path', valuePrompt: 'OU path (e.g. /Sales)', join: ' ', quote: true },
      { flag: 'fields primaryEmail,name,suspended,orgUnitPath', desc: 'Common useful fields' },
      { flag: 'fields primaryEmail,lastLoginTime,creationTime', desc: 'Login and creation dates' },
      { flag: '> users.csv', desc: 'Export to CSV file' },
    ]
  },

  // ══════════════════════════════════════════════
  // POWERSHELL
  // ══════════════════════════════════════════════
  'powershell::Get-ChildItem -Recurse -Filter "*.log"': {
    name: 'Get-ChildItem',
    description: 'List directory contents with filters',
    base: 'Get-ChildItem',
    args: [
      { key: 'path', label: 'Path', placeholder: 'C:\\Logs or . for current', required: false, default: '.' },
    ],
    flags: [
      { flag: '-Recurse',   desc: 'Search recursively through subdirectories' },
      { flag: '-Filter',    desc: 'Filter by filename pattern', valuePrompt: '*.log or *.txt', join: ' ', quote: true },
      { flag: '-Include',   desc: 'Include matching names (use with -Recurse)', valuePrompt: '*.log', join: ' ', quote: true },
      { flag: '-Exclude',   desc: 'Exclude matching names', valuePrompt: '*.tmp', join: ' ', quote: true },
      { flag: '-File',      desc: 'Return only files (no directories)' },
      { flag: '-Directory', desc: 'Return only directories' },
      { flag: '-Hidden',    desc: 'Include hidden items' },
      { flag: '-Depth',     desc: 'Limit recursion depth', valuePrompt: 'Number', valueDefault: '3', join: ' ' },
      { flag: '-ErrorAction SilentlyContinue', desc: 'Suppress access denied errors' },
      { flag: '| Where-Object { $_.Length -gt 1MB }', desc: 'Pipe: filter files larger than 1MB' },
      { flag: '| Sort-Object Length -Descending', desc: 'Pipe: sort by size descending' },
      { flag: '| Select-Object Name, Length, LastWriteTime', desc: 'Pipe: show specific columns' },
    ]
  },

  'powershell::Get-Process | Where-Object {$_.CPU -gt 100}': {
    name: 'Get-Process',
    description: 'List and filter running processes',
    base: 'Get-Process',
    args: [
      { key: 'name', label: 'Process name (optional)', placeholder: 'notepad or chrome', required: false, quote: true },
    ],
    flags: [
      { flag: '| Where-Object { $_.CPU -gt', desc: 'Filter by CPU usage greater than N', valuePrompt: 'CPU seconds (e.g. 100)', valueDefault: '100', join: ' ' },
      { flag: '| Where-Object { $_.WorkingSet -gt 500MB }', desc: 'Pipe: filter by memory > 500MB' },
      { flag: '| Sort-Object CPU -Descending', desc: 'Pipe: sort by CPU usage' },
      { flag: '| Sort-Object WorkingSet -Descending', desc: 'Pipe: sort by memory usage' },
      { flag: '| Select-Object Name, CPU, Id, Company', desc: 'Pipe: show selected columns' },
      { flag: '| Stop-Process -Force', desc: 'Pipe: kill matching processes (CAREFUL!)' },
      { flag: '-IncludeUserName', desc: 'Include the owning username (needs elevation)' },
    ]
  },

  'powershell::Get-EventLog -LogName System -Newest 20': {
    name: 'Get-EventLog',
    description: 'Query Windows event logs',
    base: 'Get-EventLog',
    args: [
      { key: 'log', label: 'Log name', type: 'select',
        options: [
          { value: '-LogName System',      label: 'System' },
          { value: '-LogName Application', label: 'Application' },
          { value: '-LogName Security',    label: 'Security' },
        ], required: true, default: '-LogName System' },
    ],
    flags: [
      { flag: '-Newest', desc: 'Return only the N newest entries', valuePrompt: 'Count', valueDefault: '50', join: ' ' },
      { flag: '-EntryType Error',   desc: 'Only Error entries' },
      { flag: '-EntryType Warning', desc: 'Only Warning entries' },
      { flag: '-Source',  desc: 'Filter by event source', valuePrompt: 'Source name (e.g. Disk)', join: ' ', quote: true },
      { flag: '-EventID', desc: 'Filter by specific Event ID', valuePrompt: 'Event ID number', join: ' ' },
      { flag: '-After',   desc: 'Events after date', valuePrompt: 'Date (e.g. "2025-01-01")', join: ' ', quote: true },
      { flag: '-Before',  desc: 'Events before date', valuePrompt: 'Date', join: ' ', quote: true },
      { flag: '-ComputerName', desc: 'Query a remote computer', valuePrompt: 'Hostname', join: ' ' },
      { flag: '| Format-List', desc: 'Pipe: show full details for each entry' },
      { flag: '| Export-Csv events.csv -NoTypeInformation', desc: 'Pipe: export to CSV' },
    ]
  },

  'powershell::Invoke-WebRequest -Uri https://url': {
    name: 'Invoke-WebRequest',
    description: 'Make HTTP requests with PowerShell',
    base: 'Invoke-WebRequest',
    args: [
      { key: 'uri', label: 'URL', placeholder: 'https://api.example.com', required: true },
    ],
    flags: [
      { flag: '-Method', desc: 'HTTP method', valuePrompt: 'GET | POST | PUT | DELETE | PATCH', valueDefault: 'GET', join: ' ' },
      { flag: '-Body', desc: 'Request body', valuePrompt: "JSON string or @{key='value'}", join: ' ', quote: true },
      { flag: '-ContentType', desc: 'Content-Type header', valuePrompt: 'application/json', join: ' ', quote: true },
      { flag: '-Headers', desc: 'Headers hashtable', valuePrompt: "@{Authorization='Bearer TOKEN'}", join: ' ' },
      { flag: '-Credential', desc: 'Use stored credentials', valuePrompt: '$cred', join: ' ' },
      { flag: '-UseBasicParsing', desc: 'Skip HTML parsing (faster, no IE engine)' },
      { flag: '-OutFile', desc: 'Save response to file', valuePrompt: 'output.json', join: ' ', quote: true },
      { flag: '-SessionVariable', desc: 'Store session for cookie reuse', valuePrompt: 'session', join: ' ' },
      { flag: '-WebSession', desc: 'Reuse a stored session', valuePrompt: '$session', join: ' ' },
      { flag: '-SkipCertificateCheck', desc: 'Allow invalid SSL certs (PS 6+)' },
      { flag: '-TimeoutSec', desc: 'Request timeout in seconds', valuePrompt: 'Seconds', valueDefault: '30', join: ' ' },
    ]
  },

  // ══════════════════════════════════════════════
  // CMD
  // ══════════════════════════════════════════════
  'cmd::xcopy /s /e source dest': {
    name: 'xcopy',
    description: 'Copy files and directories with options',
    base: 'xcopy',
    args: [
      { key: 'source', label: 'Source', placeholder: 'C:\\source', required: true },
      { key: 'dest',   label: 'Destination', placeholder: 'D:\\dest', required: true },
    ],
    flags: [
      { flag: '/S', desc: 'Copy directories and subdirectories (except empty)' },
      { flag: '/E', desc: 'Copy all subdirectories including empty ones' },
      { flag: '/H', desc: 'Copy hidden and system files' },
      { flag: '/R', desc: 'Overwrite read-only files' },
      { flag: '/Y', desc: 'Suppress overwrite confirmation prompt' },
      { flag: '/I', desc: 'Assume destination is a directory' },
      { flag: '/D', desc: 'Copy only files newer than destination' },
      { flag: '/C', desc: 'Continue on errors' },
      { flag: '/Q', desc: 'Quiet mode — suppress file names' },
      { flag: '/F', desc: 'Show full source and destination paths' },
      { flag: '/Z', desc: 'Restartable mode (for network copies)' },
      { flag: '/EXCLUDE:list.txt', desc: 'Exclude files listed in a text file' },
    ]
  },

  'cmd::netstat -ano': {
    name: 'netstat',
    description: 'Show network connections and listening ports',
    base: 'netstat',
    args: [],
    flags: [
      { flag: '-a', desc: 'Show all connections and listening ports' },
      { flag: '-n', desc: 'Show addresses numerically (no DNS)' },
      { flag: '-o', desc: 'Show owning process ID (PID)' },
      { flag: '-b', desc: 'Show executable involved (needs admin)' },
      { flag: '-e', desc: 'Show ethernet statistics' },
      { flag: '-s', desc: 'Show per-protocol statistics' },
      { flag: '-r', desc: 'Show routing table' },
      { flag: '-p TCP', desc: 'Filter by protocol', valuePrompt: 'TCP | UDP | ICMP', join: ' ' },
      { flag: '| findstr :80', desc: 'Pipe: filter to specific port', valuePrompt: 'Port number (e.g. :443)', join: ' ' },
      { flag: '| findstr LISTENING', desc: 'Pipe: only listening sockets' },
      { flag: '| findstr ESTABLISHED', desc: 'Pipe: only active connections' },
    ]
  },

  'cmd::schtasks /create /tn "MyTask" /tr "C:\\script.bat" /sc daily': {
    name: 'schtasks /create',
    description: 'Create a scheduled task',
    base: 'schtasks /create',
    args: [
      { key: 'tn', label: 'Task name', placeholder: 'MyTask', required: true },
      { key: 'tr', label: 'Task to run', placeholder: 'C:\\scripts\\backup.bat', required: true, quote: true },
    ],
    flags: [
      { flag: '/sc DAILY',   desc: 'Run daily' },
      { flag: '/sc WEEKLY',  desc: 'Run weekly' },
      { flag: '/sc MONTHLY', desc: 'Run monthly' },
      { flag: '/sc ONCE',    desc: 'Run once only' },
      { flag: '/sc ONSTART', desc: 'Run at system startup' },
      { flag: '/sc ONLOGON', desc: 'Run at user logon' },
      { flag: '/st', desc: 'Start time', valuePrompt: 'HH:MM (24h, e.g. 02:00)', join: ' ' },
      { flag: '/sd', desc: 'Start date', valuePrompt: 'MM/DD/YYYY', join: ' ' },
      { flag: '/mo', desc: 'Modifier (e.g. every N days)', valuePrompt: 'Number', valueDefault: '1', join: ' ' },
      { flag: '/ru', desc: 'Run as user', valuePrompt: 'SYSTEM or username', join: ' ', quote: true },
      { flag: '/rp', desc: 'Password for run-as user', valuePrompt: 'Password', join: ' ', quote: true },
      { flag: '/f',  desc: 'Force create, suppress warnings' },
    ]
  },

  // ══════════════════════════════════════════════
  // GIT (additional)
  // ══════════════════════════════════════════════
  'git::git commit -m "message"': {
    name: 'git commit',
    description: 'Commit staged changes',
    base: 'git commit',
    args: [
      { key: 'message', label: 'Commit message', placeholder: 'feat: add login page', required: true, quote: true },
    ],
    flags: [
      { flag: '-a', desc: 'Auto-stage all tracked changed files before commit' },
      { flag: '--amend', desc: 'Amend the previous commit' },
      { flag: '--no-edit', desc: 'Amend without changing the message' },
      { flag: '--allow-empty', desc: 'Allow commit with no changes (e.g. to trigger CI)' },
      { flag: '--signoff', desc: 'Add Signed-off-by trailer' },
      { flag: '--no-verify', desc: 'Skip pre-commit and commit-msg hooks' },
      { flag: '--author', desc: 'Override author', valuePrompt: '"Name <email>"', join: '=', quote: true },
      { flag: '--date', desc: 'Override date', valuePrompt: '"YYYY-MM-DD HH:MM:SS"', join: '=', quote: true },
    ]
  },

  'git::git push': {
    name: 'git push',
    description: 'Push commits to remote',
    base: 'git push',
    args: [
      { key: 'remote', label: 'Remote (optional)', placeholder: 'origin', required: false },
      { key: 'branch', label: 'Branch (optional)', placeholder: 'main or feature/x', required: false },
    ],
    flags: [
      { flag: '-u', desc: 'Set upstream tracking branch (use first time)' },
      { flag: '--force', desc: 'Force push — overwrites remote (CAREFUL!)' },
      { flag: '--force-with-lease', desc: 'Safer force push — fails if remote has new commits' },
      { flag: '--dry-run', desc: 'Preview without actually pushing' },
      { flag: '--tags', desc: 'Push all local tags' },
      { flag: '--delete', desc: 'Delete remote branch', valuePrompt: 'Branch name', join: ' ' },
      { flag: '--no-verify', desc: 'Skip pre-push hooks' },
    ]
  },

  'git::git stash': {
    name: 'git stash',
    description: 'Stash uncommitted changes',
    base: 'git stash',
    args: [
      { key: 'subcommand', label: 'Action', type: 'select',
        options: [
          { value: 'push',       label: 'push — save changes' },
          { value: 'pop',        label: 'pop — restore latest' },
          { value: 'apply',      label: 'apply — restore without removing' },
          { value: 'list',       label: 'list — show all stashes' },
          { value: 'drop',       label: 'drop — delete a stash' },
          { value: 'show',       label: 'show — see stash diff' },
          { value: 'clear',      label: 'clear — remove all stashes' },
          { value: 'branch',     label: 'branch — create branch from stash' },
        ], required: true, default: 'push' },
    ],
    flags: [
      { flag: '-m', desc: 'Stash message (for push)', valuePrompt: 'Description', join: ' ', quote: true },
      { flag: '-u', desc: 'Include untracked files (push)' },
      { flag: '-a', desc: 'Include all files including ignored (push)' },
      { flag: '--index', desc: 'Restore staged state too (pop/apply)' },
      { flag: 'stash@{1}', desc: 'Target a specific stash index (pop/apply/drop/show)', join: ' ' },
    ]
  },

  'git::git diff': {
    name: 'git diff',
    description: 'Show changes between commits, branches or files',
    base: 'git diff',
    args: [
      { key: 'ref', label: 'Ref / branch (optional)', placeholder: 'main or HEAD~1 or branch1..branch2', required: false },
    ],
    flags: [
      { flag: '--staged',    desc: 'Show staged changes (what will be committed)' },
      { flag: '--cached',    desc: 'Same as --staged' },
      { flag: '--stat',      desc: 'Show summary stats instead of full diff' },
      { flag: '--name-only', desc: 'Show only changed file names' },
      { flag: '--name-status', desc: 'Show file names with change type (A/M/D)' },
      { flag: '-w',          desc: 'Ignore whitespace changes' },
      { flag: '--word-diff', desc: 'Show changes word by word' },
      { flag: '--shortstat', desc: 'One-line summary of changes' },
      { flag: '--', desc: 'Separate ref from file path', valuePrompt: 'File path (e.g. src/app.js)', join: ' ' },
    ]
  },

  // ══════════════════════════════════════════════
  // DOCKER (additional)
  // ══════════════════════════════════════════════
  'docker::docker build -t name:tag .': {
    name: 'docker build',
    description: 'Build an image from a Dockerfile',
    base: 'docker build',
    args: [
      { key: 'tag',     label: 'Image name:tag', placeholder: 'myapp:latest', required: true },
      { key: 'context', label: 'Build context',  placeholder: '.', required: true, default: '.' },
    ],
    flags: [
      { flag: '-t', desc: 'Tag (always required)', alwaysOn: true, hidden: true },
      { flag: '--no-cache', desc: 'Build without using cache' },
      { flag: '--pull',     desc: 'Always pull newer base image' },
      { flag: '-f',  desc: 'Dockerfile path (if not in context root)', valuePrompt: 'Path to Dockerfile', join: ' ', quote: true },
      { flag: '--build-arg', desc: 'Build-time variable', valuePrompt: 'KEY=value', join: ' ', repeatable: true },
      { flag: '--target', desc: 'Build a specific multi-stage target', valuePrompt: 'Stage name', join: ' ' },
      { flag: '--platform', desc: 'Target platform', valuePrompt: 'linux/amd64 | linux/arm64', join: '=' },
      { flag: '--label', desc: 'Add metadata label', valuePrompt: 'key=value', join: ' ', quote: true },
      { flag: '--progress plain', desc: 'Plain text output (no TTY spinners)' },
      { flag: '--secret', desc: 'Secret to expose during build', valuePrompt: 'id=mysecret,src=~/.ssh/id_rsa', join: ' ' },
    ]
  },

  'docker::docker exec -it container bash': {
    name: 'docker exec',
    description: 'Execute command inside a running container',
    base: 'docker exec',
    args: [
      { key: 'container', label: 'Container name/ID', placeholder: 'my-container', required: true },
      { key: 'command',   label: 'Command to run', placeholder: 'bash', required: true, default: 'bash' },
    ],
    flags: [
      { flag: '-it', desc: 'Interactive with terminal (for shells)' },
      { flag: '-d',  desc: 'Detached — run in background' },
      { flag: '-e',  desc: 'Set environment variable', valuePrompt: 'KEY=value', join: ' ' },
      { flag: '-u',  desc: 'Run as user', valuePrompt: 'UID or username', join: ' ' },
      { flag: '-w',  desc: 'Working directory inside container', valuePrompt: '/path', join: ' ' },
      { flag: '--privileged', desc: 'Run with extended privileges' },
    ]
  },

  'docker::docker logs -f --tail 100 container': {
    name: 'docker logs',
    description: 'View and follow container logs',
    base: 'docker logs',
    args: [
      { key: 'container', label: 'Container name/ID', placeholder: 'my-container', required: true },
    ],
    flags: [
      { flag: '-f',          desc: 'Follow — stream logs in real time' },
      { flag: '--tail',      desc: 'Show only last N lines', valuePrompt: 'Lines', valueDefault: '100', join: ' ' },
      { flag: '--since',     desc: 'Show logs since time ago', valuePrompt: 'e.g. 10m, 1h, 2024-01-01', join: ' ' },
      { flag: '--until',     desc: 'Show logs until timestamp', valuePrompt: 'e.g. 2024-12-31', join: ' ' },
      { flag: '-t',          desc: 'Add timestamps to each line' },
      { flag: '--details',   desc: 'Show extra log detail attributes' },
    ]
  },

  // ══════════════════════════════════════════════
  // KUBERNETES (additional)
  // ══════════════════════════════════════════════
  'k8s::kubectl apply -f manifest.yaml': {
    name: 'kubectl apply',
    description: 'Apply Kubernetes manifests',
    base: 'kubectl apply',
    args: [
      { key: 'target', label: 'File / directory / URL', placeholder: 'manifest.yaml or ./k8s/', required: true },
    ],
    flags: [
      { flag: '-f', desc: 'From file (always required)', alwaysOn: true, hidden: true },
      { flag: '-n',            desc: 'Namespace', valuePrompt: 'Namespace', join: ' ' },
      { flag: '--dry-run=client', desc: 'Preview without applying (client-side)' },
      { flag: '--dry-run=server', desc: 'Preview without applying (server validates)' },
      { flag: '--server-side',   desc: 'Use server-side apply (better conflict handling)' },
      { flag: '--force',         desc: 'Force apply, deleting and recreating if necessary' },
      { flag: '--prune',         desc: 'Delete resources not in the applied set' },
      { flag: '-l',              desc: 'Prune selector label', valuePrompt: 'app=myapp', join: ' ' },
      { flag: '-R',              desc: 'Recursively apply all files in directory' },
      { flag: '-k',              desc: 'Apply Kustomize directory instead of -f' },
    ]
  },

  'k8s::kubectl scale deployment nginx --replicas=5': {
    name: 'kubectl scale',
    description: 'Scale a Kubernetes workload',
    base: 'kubectl scale',
    args: [
      { key: 'resource', label: 'Resource type', type: 'select',
        options: [
          { value: 'deployment', label: 'deployment' },
          { value: 'statefulset', label: 'statefulset' },
          { value: 'replicaset', label: 'replicaset' },
        ], required: true, default: 'deployment' },
      { key: 'name',     label: 'Resource name', placeholder: 'nginx', required: true },
      { key: 'replicas', label: 'Replica count',  placeholder: '3',     required: true },
    ],
    flags: [
      { flag: '--replicas', desc: 'Number of replicas (always required)', alwaysOn: true, hidden: true },
      { flag: '-n', desc: 'Namespace', valuePrompt: 'Namespace', join: ' ' },
      { flag: '--current-replicas', desc: 'Only scale if current count matches', valuePrompt: 'Current count', join: '=' },
      { flag: '--timeout', desc: 'Timeout for the operation', valuePrompt: 'e.g. 60s', join: '=' },
    ]
  },

  'k8s::kubectl rollout restart deployment/nginx': {
    name: 'kubectl rollout',
    description: 'Manage rollouts — restart, undo, status',
    base: 'kubectl rollout',
    args: [
      { key: 'action', label: 'Action', type: 'select',
        options: [
          { value: 'restart',  label: 'restart — rolling restart' },
          { value: 'undo',     label: 'undo — roll back' },
          { value: 'status',   label: 'status — watch progress' },
          { value: 'history',  label: 'history — view revisions' },
          { value: 'pause',    label: 'pause — halt rollout' },
          { value: 'resume',   label: 'resume — continue rollout' },
        ], required: true, default: 'restart' },
      { key: 'resource', label: 'Resource', placeholder: 'deployment/nginx', required: true },
    ],
    flags: [
      { flag: '-n', desc: 'Namespace', valuePrompt: 'Namespace', join: ' ' },
      { flag: '--to-revision', desc: 'Roll back to specific revision (undo)', valuePrompt: 'Revision number', join: '=' },
      { flag: '--timeout',     desc: 'Timeout waiting for status', valuePrompt: 'e.g. 5m', join: '=' },
    ]
  },

  'k8s::kubectl describe pod pod-name': {
    name: 'kubectl describe',
    description: 'Show detailed info about any resource',
    base: 'kubectl describe',
    args: [
      { key: 'resource', label: 'Resource type', type: 'select',
        options: [
          { value: 'pod',         label: 'pod' },
          { value: 'deployment',  label: 'deployment' },
          { value: 'service',     label: 'service' },
          { value: 'node',        label: 'node' },
          { value: 'ingress',     label: 'ingress' },
          { value: 'configmap',   label: 'configmap' },
          { value: 'secret',      label: 'secret' },
          { value: 'persistentvolumeclaim', label: 'persistentvolumeclaim' },
        ], required: true, default: 'pod' },
      { key: 'name', label: 'Resource name', placeholder: 'my-pod-name or leave empty for all', required: false },
    ],
    flags: [
      { flag: '-n', desc: 'Namespace', valuePrompt: 'Namespace', join: ' ' },
      { flag: '-l', desc: 'Select by label instead of name', valuePrompt: 'app=nginx', join: ' ' },
      { flag: '-A', desc: 'All namespaces' },
    ]
  },

  // ══════════════════════════════════════════════
  // TERRAFORM
  // ══════════════════════════════════════════════
  'terraform::terraform plan': {
    name: 'terraform plan',
    description: 'Preview infrastructure changes',
    base: 'terraform plan',
    args: [],
    flags: [
      { flag: '-out',          desc: 'Save plan to file for later apply', valuePrompt: 'Filename (e.g. tfplan)', join: '=' },
      { flag: '-var',          desc: 'Set input variable', valuePrompt: 'key=value', join: '=', quote: true, repeatable: true },
      { flag: '-var-file',     desc: 'Load variables from file', valuePrompt: 'prod.tfvars', join: '=', quote: true },
      { flag: '-target',       desc: 'Limit to specific resource', valuePrompt: 'aws_instance.web', join: '=', repeatable: true },
      { flag: '-refresh-only', desc: 'Only refresh state, no changes' },
      { flag: '-refresh=false',desc: 'Skip state refresh (faster)' },
      { flag: '-destroy',      desc: 'Plan a destroy instead of apply' },
      { flag: '-detailed-exitcode', desc: 'Exit codes: 0=no changes 1=error 2=changes' },
      { flag: '-compact-warnings', desc: 'Shorter warning messages' },
      { flag: '-parallelism',  desc: 'Number of parallel operations', valuePrompt: 'Count', valueDefault: '10', join: '=' },
    ]
  },

  'terraform::terraform apply': {
    name: 'terraform apply',
    description: 'Apply infrastructure changes',
    base: 'terraform apply',
    args: [
      { key: 'planfile', label: 'Plan file (optional)', placeholder: 'tfplan (from terraform plan -out)', required: false },
    ],
    flags: [
      { flag: '-auto-approve',  desc: 'Skip interactive confirmation' },
      { flag: '-var',           desc: 'Set input variable', valuePrompt: 'key=value', join: '=', quote: true, repeatable: true },
      { flag: '-var-file',      desc: 'Load variables from file', valuePrompt: 'prod.tfvars', join: '=', quote: true },
      { flag: '-target',        desc: 'Apply only specific resource', valuePrompt: 'resource.name', join: '=', repeatable: true },
      { flag: '-replace',       desc: 'Force replace specific resource', valuePrompt: 'resource.name', join: '=', repeatable: true },
      { flag: '-refresh-only',  desc: 'Update state only, no infrastructure changes' },
      { flag: '-parallelism',   desc: 'Parallel operations', valuePrompt: 'Count', valueDefault: '10', join: '=' },
      { flag: '-compact-warnings', desc: 'Shorter warning messages' },
    ]
  },

  'terraform::terraform state list': {
    name: 'terraform state',
    description: 'Manage Terraform state',
    base: 'terraform state',
    args: [
      { key: 'action', label: 'Action', type: 'select',
        options: [
          { value: 'list',    label: 'list — list all resources' },
          { value: 'show',    label: 'show — show resource details' },
          { value: 'mv',      label: 'mv — rename/move resource' },
          { value: 'rm',      label: 'rm — remove from state' },
          { value: 'pull',    label: 'pull — download remote state' },
          { value: 'push',    label: 'push — upload local state' },
        ], required: true, default: 'list' },
      { key: 'resource', label: 'Resource address (for show/mv/rm)', placeholder: 'aws_instance.web', required: false },
    ],
    flags: [
      { flag: '-state', desc: 'Path to alternate state file', valuePrompt: 'terraform.tfstate', join: '=', quote: true },
    ]
  },

  // ══════════════════════════════════════════════
  // ANSIBLE
  // ══════════════════════════════════════════════
  'ansible::ansible-playbook site.yml': {
    name: 'ansible-playbook',
    description: 'Run an Ansible playbook',
    base: 'ansible-playbook',
    args: [
      { key: 'playbook', label: 'Playbook file', placeholder: 'site.yml', required: true },
    ],
    flags: [
      { flag: '-i',              desc: 'Inventory file or host', valuePrompt: 'inventory.ini or host,', join: ' ', quote: true },
      { flag: '--limit',         desc: 'Limit to hosts/groups', valuePrompt: 'webservers or host1,host2', join: ' ', quote: true },
      { flag: '--tags',          desc: 'Only run tasks with these tags', valuePrompt: 'deploy,config', join: ' ', quote: true },
      { flag: '--skip-tags',     desc: 'Skip tasks with these tags', valuePrompt: 'slow,debug', join: ' ', quote: true },
      { flag: '--check',         desc: 'Dry run — do not make changes' },
      { flag: '--diff',          desc: 'Show diffs of changed files' },
      { flag: '-e',              desc: 'Extra variable', valuePrompt: 'key=value or @vars.yml', join: ' ', quote: true, repeatable: true },
      { flag: '--start-at-task', desc: 'Start from specific task', valuePrompt: 'Task name', join: '=', quote: true },
      { flag: '-v',              desc: 'Verbose (-vv or -vvv for more)' },
      { flag: '--ask-vault-pass',  desc: 'Prompt for vault password' },
      { flag: '--vault-password-file', desc: 'Vault password file', valuePrompt: '~/.vault_pass', join: ' ' },
      { flag: '--become',        desc: 'Run operations with sudo' },
      { flag: '--become-user',   desc: 'User to become (default root)', valuePrompt: 'root', join: '=' },
      { flag: '--ask-become-pass', desc: 'Prompt for sudo password' },
      { flag: '--forks',         desc: 'Parallel processes', valuePrompt: 'Count', valueDefault: '10', join: ' ' },
      { flag: '--step',          desc: 'Confirm each task interactively' },
      { flag: '--syntax-check',  desc: 'Only check syntax, do not run' },
      { flag: '--list-tasks',    desc: 'List tasks without executing' },
      { flag: '--list-hosts',    desc: 'List target hosts without executing' },
    ]
  },

  'ansible::ansible all -m ping': {
    name: 'ansible ad-hoc',
    description: 'Run ad-hoc command on hosts',
    base: 'ansible',
    args: [
      { key: 'hosts', label: 'Hosts / group', placeholder: 'all or webservers', required: true },
      { key: 'module', label: 'Module', type: 'select',
        options: [
          { value: '-m ping',    label: 'ping — connectivity test' },
          { value: '-m setup',   label: 'setup — gather facts' },
          { value: '-m shell',   label: 'shell — run shell command' },
          { value: '-m command', label: 'command — run command' },
          { value: '-m copy',    label: 'copy — copy file' },
          { value: '-m file',    label: 'file — manage files/dirs' },
          { value: '-m service', label: 'service — manage services' },
          { value: '-m package', label: 'package — install packages' },
          { value: '-m user',    label: 'user — manage users' },
          { value: '-m git',     label: 'git — clone/update repo' },
        ], required: true, default: '-m ping' },
    ],
    flags: [
      { flag: '-a', desc: 'Module arguments', valuePrompt: 'e.g. "name=nginx state=started"', join: ' ', quote: true },
      { flag: '-i', desc: 'Inventory file', valuePrompt: 'inventory.ini', join: ' ', quote: true },
      { flag: '-b', desc: 'Become (sudo)' },
      { flag: '-u', desc: 'Remote user', valuePrompt: 'username', join: ' ' },
      { flag: '-k', desc: 'Prompt for SSH password' },
      { flag: '--ask-become-pass', desc: 'Prompt for sudo password' },
      { flag: '-f', desc: 'Forks (parallel)', valuePrompt: 'Count', valueDefault: '10', join: ' ' },
      { flag: '-o', desc: 'One-line output' },
      { flag: '-v', desc: 'Verbose' },
    ]
  },

  // ══════════════════════════════════════════════
  // AWS (additional)
  // ══════════════════════════════════════════════
  'aws::aws ec2 describe-instances': {
    name: 'aws ec2 describe-instances',
    description: 'List EC2 instances with filters',
    base: 'aws ec2 describe-instances',
    args: [],
    flags: [
      { flag: '--filters', desc: 'Filter by tag or state', valuePrompt: 'Name=tag:Name,Values=web* or Name=instance-state-name,Values=running', join: ' ', quote: true, repeatable: true },
      { flag: '--instance-ids', desc: 'Specific instance ID(s)', valuePrompt: 'i-1234567890abcdef0', join: ' ', repeatable: true },
      { flag: '--query', desc: 'JMESPath query to reshape output', valuePrompt: '"Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]"', join: ' ', quote: true },
      { flag: '--output', desc: 'Output format', valuePrompt: 'table | json | text', valueDefault: 'table', join: ' ' },
      { flag: '--profile', desc: 'AWS profile to use', valuePrompt: 'prod', join: ' ' },
      { flag: '--region',  desc: 'AWS region', valuePrompt: 'us-east-1', join: ' ' },
    ]
  },

  'aws::aws s3 cp file.txt s3://bucket/path/': {
    name: 'aws s3 cp',
    description: 'Copy files to/from/between S3',
    base: 'aws s3 cp',
    args: [
      { key: 'source', label: 'Source', placeholder: 'file.txt or s3://bucket/path/', required: true },
      { key: 'dest',   label: 'Destination', placeholder: 's3://bucket/path/ or ./local/', required: true },
    ],
    flags: [
      { flag: '--recursive',    desc: 'Copy directory recursively' },
      { flag: '--exclude',      desc: 'Exclude pattern', valuePrompt: '"*.tmp"', join: ' ', quote: true, repeatable: true },
      { flag: '--include',      desc: 'Include pattern (override exclude)', valuePrompt: '"*.log"', join: ' ', quote: true, repeatable: true },
      { flag: '--sse',          desc: 'Server-side encryption', valuePrompt: 'AES256 | aws:kms', join: ' ' },
      { flag: '--acl',          desc: 'Canned ACL', valuePrompt: 'private | public-read', join: ' ' },
      { flag: '--storage-class',desc: 'Storage class', valuePrompt: 'STANDARD | STANDARD_IA | GLACIER', join: ' ' },
      { flag: '--no-progress',  desc: 'Suppress progress output' },
      { flag: '--profile',      desc: 'AWS profile', valuePrompt: 'prod', join: ' ' },
      { flag: '--region',       desc: 'AWS region', valuePrompt: 'us-east-1', join: ' ' },
    ]
  },

  // ══════════════════════════════════════════════
  // AZURE
  // ══════════════════════════════════════════════
  'azure::az vm create --resource-group myRG --name myVM --image Ubuntu2204 --admin-username azureuser --generate-ssh-keys': {
    name: 'az vm create',
    description: 'Create an Azure Virtual Machine',
    base: 'az vm create',
    args: [
      { key: 'rg',   label: '--resource-group', placeholder: 'myResourceGroup', required: true },
      { key: 'name', label: '--name',            placeholder: 'myVM',            required: true },
    ],
    flags: [
      { flag: '--resource-group', desc: 'Resource group (always required)', alwaysOn: true, hidden: true },
      { flag: '--name',           desc: 'VM name (always required)',         alwaysOn: true, hidden: true },
      { flag: '--image', desc: 'OS image', valuePrompt: 'Ubuntu2204 | Win2022Datacenter | RHEL | Debian11', valueDefault: 'Ubuntu2204', join: ' ' },
      { flag: '--size',  desc: 'VM size', valuePrompt: 'Standard_B2s | Standard_D2s_v3', join: ' ' },
      { flag: '--admin-username', desc: 'Admin username', valuePrompt: 'azureuser', join: ' ', quote: true },
      { flag: '--generate-ssh-keys', desc: 'Auto-generate SSH key pair' },
      { flag: '--ssh-key-values', desc: 'SSH public key(s)', valuePrompt: '~/.ssh/id_rsa.pub', join: ' ', quote: true },
      { flag: '--admin-password', desc: 'Admin password (Windows)', valuePrompt: 'Password123!', join: ' ', quote: true },
      { flag: '--location', desc: 'Azure region', valuePrompt: 'westus2 | eastus | northeurope', join: ' ' },
      { flag: '--vnet-name',  desc: 'Virtual network', valuePrompt: 'myVNet', join: ' ' },
      { flag: '--subnet',     desc: 'Subnet name', valuePrompt: 'mySubnet', join: ' ' },
      { flag: '--public-ip-sku', desc: 'Public IP SKU', valuePrompt: 'Standard | Basic', join: ' ' },
      { flag: '--no-wait', desc: 'Do not wait for operation to complete' },
    ]
  },

  'azure::az group create --name myRG --location westus2': {
    name: 'az group create',
    description: 'Create an Azure resource group',
    base: 'az group create',
    args: [
      { key: 'name',     label: '--name',     placeholder: 'myResourceGroup', required: true },
      { key: 'location', label: '--location', placeholder: 'westus2',         required: true },
    ],
    flags: [
      { flag: '--tags', desc: 'Tags as key=value pairs', valuePrompt: 'env=prod team=ops', join: ' ', quote: true },
      { flag: '--managed-by', desc: 'ID of resource managing this group', valuePrompt: 'Resource ID', join: ' ' },
    ]
  },

  // ══════════════════════════════════════════════
  // GCLOUD
  // ══════════════════════════════════════════════
  'gcloud::gcloud compute instances create my-vm --machine-type=e2-medium --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud': {
    name: 'gcloud compute instances create',
    description: 'Create a Google Compute Engine VM',
    base: 'gcloud compute instances create',
    args: [
      { key: 'name', label: 'Instance name', placeholder: 'my-vm', required: true },
    ],
    flags: [
      { flag: '--machine-type',   desc: 'Machine type', valuePrompt: 'e2-micro | e2-medium | n2-standard-4', valueDefault: 'e2-medium', join: '=' },
      { flag: '--image-family',   desc: 'OS image family', valuePrompt: 'ubuntu-2204-lts | debian-11 | centos-stream-9', valueDefault: 'ubuntu-2204-lts', join: '=' },
      { flag: '--image-project',  desc: 'Image project', valuePrompt: 'ubuntu-os-cloud | debian-cloud | centos-cloud', valueDefault: 'ubuntu-os-cloud', join: '=' },
      { flag: '--zone',           desc: 'Zone', valuePrompt: 'us-central1-a | us-east1-b', join: '=' },
      { flag: '--region',         desc: 'Region (auto-selects zone)', valuePrompt: 'us-central1', join: '=' },
      { flag: '--boot-disk-size', desc: 'Boot disk size', valuePrompt: '50GB', join: '=' },
      { flag: '--boot-disk-type', desc: 'Boot disk type', valuePrompt: 'pd-standard | pd-ssd | pd-balanced', join: '=' },
      { flag: '--tags',           desc: 'Network tags for firewall rules', valuePrompt: 'http-server,https-server', join: '=' },
      { flag: '--metadata',       desc: 'Metadata key=value pairs', valuePrompt: 'ssh-keys=user:pubkey', join: '=' },
      { flag: '--preemptible',    desc: 'Use preemptible instance (cheaper, can be stopped)' },
      { flag: '--no-address',     desc: 'No external IP (internal only)' },
      { flag: '--subnet',         desc: 'Subnet name', valuePrompt: 'default', join: '=' },
      { flag: '--service-account', desc: 'Service account email', valuePrompt: 'sa@project.iam.gserviceaccount.com', join: '=' },
    ]
  },

  'gcloud::gcloud run deploy my-service --image=gcr.io/project/image --region=us-central1': {
    name: 'gcloud run deploy',
    description: 'Deploy a container to Cloud Run',
    base: 'gcloud run deploy',
    args: [
      { key: 'name', label: 'Service name', placeholder: 'my-service', required: true },
    ],
    flags: [
      { flag: '--image',    desc: 'Container image URL', valuePrompt: 'gcr.io/project/image:tag', join: '=', quote: true },
      { flag: '--region',   desc: 'Region', valuePrompt: 'us-central1 | europe-west1', valueDefault: 'us-central1', join: '=' },
      { flag: '--platform', desc: 'Platform', valuePrompt: 'managed | gke | kubernetes', valueDefault: 'managed', join: '=' },
      { flag: '--allow-unauthenticated', desc: 'Allow public access without authentication' },
      { flag: '--no-allow-unauthenticated', desc: 'Require authentication' },
      { flag: '--memory',   desc: 'Memory limit', valuePrompt: '256Mi | 512Mi | 1Gi | 2Gi', join: '=' },
      { flag: '--cpu',      desc: 'CPU limit', valuePrompt: '1 | 2 | 4', join: '=' },
      { flag: '--concurrency', desc: 'Max requests per container', valuePrompt: '80', join: '=' },
      { flag: '--min-instances', desc: 'Minimum instances (prevent cold start)', valuePrompt: '1', join: '=' },
      { flag: '--max-instances', desc: 'Maximum instances', valuePrompt: '100', join: '=' },
      { flag: '--set-env-vars', desc: 'Environment variables', valuePrompt: 'KEY1=val1,KEY2=val2', join: '=' },
      { flag: '--set-secrets',  desc: 'Mount secrets', valuePrompt: 'ENV_VAR=secret-name:version', join: '=' },
      { flag: '--service-account', desc: 'Service account', valuePrompt: 'sa@project.iam.gserviceaccount.com', join: '=' },
      { flag: '--tag',      desc: 'Traffic tag for the revision', valuePrompt: 'canary | staging', join: '=' },
    ]
  },

  // ══════════════════════════════════════════════
  // LINUX ADMIN
  // ══════════════════════════════════════════════
  'linux::systemctl status servicename': {
    name: 'systemctl',
    description: 'Manage systemd services',
    base: 'systemctl',
    args: [
      { key: 'action', label: 'Action', type: 'select',
        options: [
          { value: 'status',   label: 'status — show service state' },
          { value: 'start',    label: 'start — start service' },
          { value: 'stop',     label: 'stop — stop service' },
          { value: 'restart',  label: 'restart — stop and start' },
          { value: 'reload',   label: 'reload — reload config' },
          { value: 'enable',   label: 'enable — start on boot' },
          { value: 'disable',  label: 'disable — do not start on boot' },
          { value: 'mask',     label: 'mask — prevent any start' },
          { value: 'unmask',   label: 'unmask — remove mask' },
          { value: 'is-active',   label: 'is-active — check if running' },
          { value: 'is-enabled',  label: 'is-enabled — check if enabled' },
          { value: 'list-units',  label: 'list-units — list loaded units' },
        ], required: true, default: 'status' },
      { key: 'service', label: 'Service name (optional for list)', placeholder: 'nginx or docker', required: false },
    ],
    flags: [
      { flag: '--no-pager', desc: 'Do not pipe output through pager' },
      { flag: '--full',     desc: 'Do not truncate output' },
      { flag: '--type=service', desc: 'List only service units (for list-units)' },
      { flag: '--state=failed',  desc: 'Filter by state (failed, active, inactive)' },
    ]
  },

  'linux::journalctl -u servicename -f': {
    name: 'journalctl',
    description: 'Query systemd journal logs',
    base: 'journalctl',
    args: [],
    flags: [
      { flag: '-u', desc: 'Show logs for specific service', valuePrompt: 'nginx or docker', join: ' ' },
      { flag: '-f', desc: 'Follow — stream new logs in real time' },
      { flag: '-n', desc: 'Show last N lines', valuePrompt: 'Lines', valueDefault: '100', join: ' ' },
      { flag: '-p', desc: 'Filter by priority', valuePrompt: 'err | warning | info | debug', join: ' ' },
      { flag: '-b', desc: 'Show logs from current boot only' },
      { flag: '-b -1', desc: 'Show logs from previous boot' },
      { flag: '--since', desc: 'Show logs since time', valuePrompt: '"1 hour ago" or "2025-01-01 00:00:00"', join: ' ', quote: true },
      { flag: '--until', desc: 'Show logs until time', valuePrompt: '"now" or timestamp', join: ' ', quote: true },
      { flag: '-o short-iso', desc: 'ISO timestamp format' },
      { flag: '-o json-pretty', desc: 'JSON output' },
      { flag: '--no-pager', desc: 'Output without pager' },
      { flag: '--disk-usage', desc: 'Show how much disk logs are using' },
      { flag: '--vacuum-time', desc: 'Delete logs older than duration', valuePrompt: '7d | 2w | 1month', join: '=' },
    ]
  },

  'linux::useradd -m -s /bin/bash username': {
    name: 'useradd',
    description: 'Create a new Linux user',
    base: 'useradd',
    args: [
      { key: 'username', label: 'Username', placeholder: 'alice', required: true },
    ],
    flags: [
      { flag: '-m', desc: 'Create home directory at /home/username' },
      { flag: '-s', desc: 'Login shell', valuePrompt: '/bin/bash | /bin/zsh | /sbin/nologin', valueDefault: '/bin/bash', join: ' ' },
      { flag: '-c', desc: 'Comment (full name)', valuePrompt: '"Alice Smith"', join: ' ', quote: true },
      { flag: '-G', desc: 'Supplementary groups', valuePrompt: 'sudo,docker,www-data', join: ' ' },
      { flag: '-g', desc: 'Primary group', valuePrompt: 'groupname or GID', join: ' ' },
      { flag: '-d', desc: 'Custom home directory', valuePrompt: '/opt/alice', join: ' ' },
      { flag: '-u', desc: 'Specify UID', valuePrompt: '1001', join: ' ' },
      { flag: '-e', desc: 'Account expiry date', valuePrompt: 'YYYY-MM-DD', join: ' ' },
      { flag: '-r', desc: 'Create system account (no home, no password)' },
    ]
  },

  'linux::ss -tulpn': {
    name: 'ss / netstat',
    description: 'Show socket and network connections',
    base: 'ss',
    args: [],
    flags: [
      { flag: '-t', desc: 'TCP sockets' },
      { flag: '-u', desc: 'UDP sockets' },
      { flag: '-l', desc: 'Listening sockets only' },
      { flag: '-p', desc: 'Show process using the socket' },
      { flag: '-n', desc: 'Numeric addresses (no DNS)' },
      { flag: '-a', desc: 'All sockets (listening and connected)' },
      { flag: '-e', desc: 'Show detailed socket information' },
      { flag: '-s', desc: 'Summary statistics' },
      { flag: 'state established', desc: 'Only established connections', join: ' ' },
      { flag: 'state listening',   desc: 'Only listening sockets', join: ' ' },
      { flag: 'sport = :80',  desc: 'Filter by source port', join: ' ', valuePrompt: 'Port number (e.g. :443)', join2: ' ' },
      { flag: '| grep LISTEN', desc: 'Pipe: grep for LISTEN' },
    ]
  },

  // ══════════════════════════════════════════════
  // NPM
  // ══════════════════════════════════════════════
  'npm::npm install package-name': {
    name: 'npm install',
    description: 'Install npm packages',
    base: 'npm install',
    args: [
      { key: 'package', label: 'Package(s)', placeholder: 'react react-dom or leave empty for all', required: false },
    ],
    flags: [
      { flag: '--save-dev',         desc: 'Save as devDependency' },
      { flag: '--save-optional',    desc: 'Save as optionalDependency' },
      { flag: '--save-exact',       desc: 'Save exact version (no ^ or ~)' },
      { flag: '--no-save',          desc: 'Install without saving to package.json' },
      { flag: '--global',           desc: 'Install globally' },
      { flag: '--legacy-peer-deps', desc: 'Bypass peer dependency conflicts' },
      { flag: '--force',            desc: 'Force reinstall even if up to date' },
      { flag: '--production',       desc: 'Skip devDependencies' },
      { flag: '--dry-run',          desc: 'Preview without installing' },
      { flag: '--prefer-offline',   desc: 'Use cache when available' },
    ]
  },

  'npm::npm run script-name': {
    name: 'npm run',
    description: 'Run a package.json script',
    base: 'npm run',
    args: [
      { key: 'script', label: 'Script name', placeholder: 'build or dev or test', required: true },
    ],
    flags: [
      { flag: '--',         desc: 'Pass arguments to the script after this flag', valuePrompt: '--port 3001 --watch', join: ' ' },
      { flag: '--if-present',   desc: 'Do not error if script does not exist' },
      { flag: '--silent',       desc: 'Suppress npm log output' },
      { flag: '--workspace',    desc: 'Run in specific workspace', valuePrompt: 'workspace-name', join: '=' },
      { flag: '--workspaces',   desc: 'Run in all workspaces' },
    ]
  },

  // ══════════════════════════════════════════════
  // SQL
  // ══════════════════════════════════════════════
  'sql::SELECT * FROM table WHERE col = "value";': {
    name: 'SELECT query builder',
    description: 'Build a SELECT query with filters',
    base: 'SELECT',
    args: [
      { key: 'cols',  label: 'Columns', placeholder: '* or col1, col2, col3', required: true, default: '*' },
      { key: 'table', label: 'FROM table', placeholder: 'users', required: true },
    ],
    flags: [
      { flag: 'WHERE', desc: 'Filter condition', valuePrompt: 'id = 1 AND status = "active"', join: ' ', quote: false },
      { flag: 'JOIN',  desc: 'JOIN another table', valuePrompt: 'orders ON users.id = orders.user_id', join: ' ' },
      { flag: 'GROUP BY', desc: 'Group results', valuePrompt: 'column_name', join: ' ' },
      { flag: 'HAVING',   desc: 'Filter on aggregates', valuePrompt: 'COUNT(*) > 5', join: ' ' },
      { flag: 'ORDER BY', desc: 'Sort results', valuePrompt: 'created_at DESC', join: ' ' },
      { flag: 'LIMIT',    desc: 'Limit row count', valuePrompt: 'Number', valueDefault: '100', join: ' ' },
      { flag: 'OFFSET',   desc: 'Skip first N rows (pagination)', valuePrompt: 'Number', valueDefault: '0', join: ' ' },
    ]
  },

  // ══════════════════════════════════════════════
  // PYTHON
  // ══════════════════════════════════════════════
  'python::python script.js': {
    name: 'python / python3',
    description: 'Run Python scripts with options',
    base: 'python3',
    args: [
      { key: 'script', label: 'Script file (or leave empty for REPL)', placeholder: 'script.py', required: false },
    ],
    flags: [
      { flag: '-c', desc: 'Execute inline code', valuePrompt: '"print(\'hello\')"', join: ' ', quote: true },
      { flag: '-m', desc: 'Run library module as script', valuePrompt: 'http.server | venv | pip | pytest', join: ' ' },
      { flag: '-i', desc: 'Inspect mode — open REPL after script runs' },
      { flag: '-v', desc: 'Verbose — show import statements' },
      { flag: '-u', desc: 'Unbuffered output (useful for real-time logging)' },
      { flag: '-O', desc: 'Optimize — strip assert statements' },
      { flag: '-W', desc: 'Warning filter', valuePrompt: 'ignore | error | always', join: ' ' },
      { flag: '-X', desc: 'Runtime option', valuePrompt: 'utf8 | dev | faulthandler', join: ' ' },
      { flag: '--version', desc: 'Show Python version and exit' },
    ]
  },

  'python::pip install package-name --break-system-packages': {
    name: 'pip install',
    description: 'Install Python packages with pip',
    base: 'pip install',
    args: [
      { key: 'package', label: 'Package(s)', placeholder: 'requests pandas numpy', required: false },
    ],
    flags: [
      { flag: '-r', desc: 'Install from requirements file', valuePrompt: 'requirements.txt', join: ' ' },
      { flag: '-U', desc: 'Upgrade to latest version' },
      { flag: '--upgrade', desc: 'Same as -U (long form)' },
      { flag: '--pre', desc: 'Include pre-release versions' },
      { flag: '-e', desc: 'Editable install (develop mode)', valuePrompt: '. or git+https://github.com/...', join: ' ' },
      { flag: '--no-deps', desc: 'Do not install dependencies' },
      { flag: '--break-system-packages', desc: 'Allow install outside virtualenv (Linux system Python)' },
      { flag: '--user', desc: 'Install to user directory only' },
      { flag: '-q', desc: 'Quiet — minimal output' },
      { flag: '-i', desc: 'Alternate index URL', valuePrompt: 'https://pypi.org/simple/', join: ' ', quote: true },
      { flag: '--dry-run', desc: 'Preview what would be installed' },
    ]
  },
};

/* ─────────────────────────────────────────
   CHEATSHEET DATA
───────────────────────────────────────── */

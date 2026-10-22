/* Linux infrastructure recipes: DNS, load balancers, TLS, network, performance, storage, security, patching, Puppet and incident response. */
const dkLines = (value) => (value || []).map((item) => String(item).trim()).filter(Boolean);

dkRecipe(
  'dns',
  'triage',
  'DNS triage script',
  'Compare the local resolver, public resolvers and every authoritative server for one name.',
  [
    dkP('target', 'Name to test', 'The record you are investigating.', {
      name: dkToken('Name', 'example.com'),
      type: dkChoice('Record type', 'A', ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME', 'CAA']),
    }),
    dkP('resolvers', 'Resolvers to compare', 'Public resolvers give a known-good reference.', {
      items: dkList('Resolvers', ['1.1.1.1', '9.9.9.9']),
    }),
  ],
  (p) => {
    const name = dkQ(p.target.name),
      type = dkQ(p.target.type),
      resolvers = dkLines(p.resolvers?.items);
    return (
      [
        '#!/usr/bin/env bash',
        '# DNS triage: read-only, safe to run on a production host.',
        'name=' + name,
        'type=' + type,
        '',
        'echo "== Resolver configuration =="',
        'cat /etc/resolv.conf',
        'resolvectl status 2>/dev/null | head -20',
        '',
        'echo "== What applications see (nsswitch) =="',
        'getent hosts "$name"',
        '',
        'echo "== System resolver =="',
        'dig "$name" "$type" +noall +answer +comments +stats | grep -E "status:|Query time|SERVER|^[^;]"',
        ...resolvers.flatMap((r) => [
          '',
          'echo "== Resolver ' + r.replace(/[^A-Za-z0-9.:_-]/g, '') + ' =="',
          'dig @' +
            dkQ(r) +
            ' "$name" "$type" +noall +answer +comments +stats | grep -E "status:|Query time|^[^;]"',
        ]),
        '',
        'echo "== Over TCP =="',
        'dig +tcp "$name" "$type" +noall +comments | grep "status:"',
        '',
        'echo "== DNSSEC checking disabled (SERVFAIL only without this means validation) =="',
        'dig +cd "$name" "$type" +noall +comments | grep "status:"',
        '',
        'echo "== Each authoritative server =="',
        'for ns in $(dig +short NS "$name"); do',
        '  echo "-- $ns"',
        '  dig +short +time=2 +tries=1 @"$ns" "$name" "$type"',
        'done',
        '',
        'echo "== SOA serial on every authoritative server =="',
        'dig +nssearch "$name"',
      ].join('\n') + '\n'
    );
  },
  'dns-triage.sh',
  'bash -n dns-triage.sh',
);

dkRecipe(
  'lb',
  'haproxy-config',
  'HAProxy load balancer',
  'Create a frontend, a backend with health checks and a runtime admin socket.',
  [
    dkP(
      'frontend',
      'Frontend',
      'The address and port clients connect to.',
      {
        name: dkToken('Frontend name', 'web'),
        port: dkPort('Listen port', 80),
        mode: dkChoice('Mode', 'http', ['http', 'tcp']),
      },
      true,
    ),
    dkP(
      'backend',
      'Backend',
      'How requests are spread and how health is checked.',
      {
        name: dkToken('Backend name', 'be_app'),
        balance: dkChoice('Algorithm', 'roundrobin', ['roundrobin', 'leastconn', 'source']),
        path: dkText('Health check path (http mode)', '/health'),
      },
      true,
    ),
    dkP('servers', 'Servers', 'One "name address:port" per line.', {
      items: dkList('Servers', ['web1 10.0.0.11:8080', 'web2 10.0.0.12:8080']),
    }),
  ],
  (p) => {
    const http = p.frontend.mode === 'http',
      servers = dkLines(p.servers?.items);
    return (
      [
        'global',
        '    log /dev/log local0',
        '    maxconn 4096',
        '    stats socket /run/haproxy/admin.sock mode 660 level admin',
        '',
        'defaults',
        '    log global',
        '    mode ' + p.frontend.mode,
        '    option ' + (http ? 'httplog' : 'tcplog'),
        '    timeout connect 5s',
        '    timeout client 30s',
        '    timeout server 30s',
        '    retries 3',
        '',
        'frontend ' + p.frontend.name,
        '    bind *:' + p.frontend.port,
        '    default_backend ' + p.backend.name,
        '',
        'backend ' + p.backend.name,
        '    balance ' + p.backend.balance,
        ...(http
          ? ['    option httpchk GET ' + p.backend.path, '    http-check expect status 200']
          : ['    option tcp-check']),
        ...servers.map((s) => '    server ' + s + ' check inter 2s fall 3 rise 2'),
      ].join('\n') + '\n'
    );
  },
  'haproxy.cfg',
  'haproxy -c -f haproxy.cfg',
);

dkRecipe(
  'lb',
  'keepalived-config',
  'keepalived VRRP failover',
  'Create a VRRP instance that moves a virtual IP and fails over when a health check fails.',
  [
    dkP(
      'instance',
      'VRRP instance',
      'Both nodes use the same router ID and virtual IP; the highest priority wins.',
      {
        name: dkToken('Instance name', 'VI_1'),
        interface: dkToken('Interface', 'eth0'),
        state: dkChoice('Initial state', 'MASTER', ['MASTER', 'BACKUP']),
        vrid: dkF('Router ID (1-255)', 'number', 51, 'Must match on both nodes.', {
          min: 1,
          max: 255,
        }),
        priority: dkF('Priority (1-254)', 'number', 100, 'Give the backup a lower number.', {
          min: 1,
          max: 254,
        }),
        vip: dkText('Virtual IP with prefix', '192.0.2.100/24'),
      },
      true,
    ),
    dkP('check', 'Health check', 'A script that exits 0 when the service is healthy.', {
      script: dkText('Check script', '/usr/local/bin/check_app.sh'),
      interval: dkF('Interval (seconds)', 'number', 2, '', { min: 1, max: 60 }),
      weight: dkF(
        'Priority change on failure',
        'number',
        -20,
        'Make it larger than the priority gap.',
        {
          min: -253,
          max: 253,
        },
      ),
    }),
  ],
  (p) => {
    const i = p.instance;
    return (
      [
        'global_defs {',
        '    enable_script_security',
        '    script_user root',
        '}',
        '',
        ...(p.check
          ? [
              'vrrp_script chk_app {',
              '    script "' + p.check.script + '"',
              '    interval ' + p.check.interval,
              '    weight ' + p.check.weight,
              '    fall 2',
              '    rise 2',
              '}',
              '',
            ]
          : []),
        'vrrp_instance ' + i.name + ' {',
        '    state ' + i.state,
        '    interface ' + i.interface,
        '    virtual_router_id ' + i.vrid,
        '    priority ' + i.priority,
        '    advert_int 1',
        '    virtual_ipaddress {',
        '        ' + i.vip,
        '    }',
        ...(p.check ? ['    track_script {', '        chk_app', '    }'] : []),
        '}',
      ].join('\n') + '\n'
    );
  },
  'keepalived.conf',
  'keepalived -t -f keepalived.conf',
);

dkRecipe(
  'tls',
  'cert-check',
  'Certificate expiry and chain check',
  'Report days left and chain validity for several hosts; exit non-zero for monitoring.',
  [
    dkP('hosts', 'Hosts', 'One hostname per line.', {
      items: dkList('Hosts', ['example.com', 'www.example.com']),
      port: dkPort('Port', 443),
    }),
    dkP('limit', 'Warning threshold', 'Fail when fewer days remain.', {
      days: dkF('Days', 'number', 21, '', { min: 1, max: 365 }),
    }),
  ],
  (p) =>
    [
      '#!/usr/bin/env bash',
      '# Certificate expiry and chain check. Exit code 1 if anything needs attention.',
      'warn_days=' + (p.limit?.days ?? 21),
      'port=' + (p.hosts.port ?? 443),
      'status=0',
      '',
      'for host in ' + dkLines(p.hosts.items).map(dkQ).join(' ') + '; do',
      '  out=$(echo | openssl s_client -connect "$host:$port" -servername "$host" 2>&1)',
      '  end=$(printf "%s\\n" "$out" | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)',
      '  if [ -z "$end" ]; then echo "FAIL  $host: no certificate received"; status=1; continue; fi',
      '  days=$(( ( $(date -d "$end" +%s) - $(date +%s) ) / 86400 ))',
      '  chain=$(printf "%s\\n" "$out" | grep -m1 -E "Verification|Verify return code")',
      '  state=OK',
      '  [ "$days" -lt "$warn_days" ] && { state=WARN; status=1; }',
      '  printf "%s\\n" "$chain" | grep -qE "OK|\\(ok\\)" || { state=FAIL; status=1; }',
      '  echo "$state  $host: $days days left (expires $end); $chain"',
      'done',
      'exit $status',
    ].join('\n') + '\n',
  'cert-check.sh',
  'bash -n cert-check.sh',
);

dkRecipe(
  'netdiag',
  'snapshot',
  'Network state snapshot',
  'Collect interfaces, routes, sockets, counters, outbound rate and top talkers into one folder.',
  [
    dkP('scope', 'Scope', 'The interface to measure and where to save the evidence.', {
      interface: dkToken('Interface', 'eth0'),
      directory: dkText('Output directory', '/tmp/net-snapshot'),
    }),
    dkP(
      'capture',
      'Packet sample',
      'A short capture identifies top talkers (needs root and tcpdump).',
      {
        packets: dkF('Packets to sample', 'number', 2000, '', { min: 100, max: 100000 }),
      },
    ),
  ],
  (p) => {
    const dir = dkQ(p.scope.directory),
      nic = dkQ(p.scope.interface),
      n = p.capture ? p.capture.packets : 0;
    return (
      [
        '#!/usr/bin/env bash',
        '# Network snapshot: read-only except for writing files into the output directory.',
        'dir=' + dir + '/$(date +%Y%m%d-%H%M%S)',
        'nic=' + nic,
        'mkdir -p "$dir"',
        'ip -br addr > "$dir/addr.txt"',
        'ip route > "$dir/routes.txt"',
        'ip -s link show "$nic" > "$dir/link-stats.txt"',
        'ss -s > "$dir/ss-summary.txt"',
        'ss -tunap > "$dir/sockets.txt"',
        'nstat -az > "$dir/nstat.txt" 2>&1',
        'conntrack -C > "$dir/conntrack-count.txt" 2>&1',
        'sysctl net.netfilter.nf_conntrack_max net.netfilter.nf_conntrack_count > "$dir/conntrack-limits.txt" 2>&1',
        '',
        '# Outbound and inbound rate over 5 seconds',
        'tx1=$(cat /sys/class/net/$nic/statistics/tx_bytes); rx1=$(cat /sys/class/net/$nic/statistics/rx_bytes)',
        'sleep 5',
        'tx2=$(cat /sys/class/net/$nic/statistics/tx_bytes); rx2=$(cat /sys/class/net/$nic/statistics/rx_bytes)',
        'echo "tx $(( (tx2-tx1)*8/5/1000 )) kbps, rx $(( (rx2-rx1)*8/5/1000 )) kbps" | tee "$dir/rate.txt"',
        ...(n
          ? [
              '',
              '# Top sources and destinations in a short sample',
              'timeout 30 tcpdump -nni "$nic" -c ' + n + ' > "$dir/sample.txt" 2>/dev/null',
              'awk \'{print $3}\' "$dir/sample.txt" | cut -d. -f1-4 | sort | uniq -c | sort -rn | head > "$dir/top-sources.txt"',
              'awk \'{print $5}\' "$dir/sample.txt" | sed \'s/:$//\' | sort | uniq -c | sort -rn | head > "$dir/top-destinations.txt"',
            ]
          : []),
        'echo "Saved to $dir"',
      ].join('\n') + '\n'
    );
  },
  'net-snapshot.sh',
  'bash -n net-snapshot.sh',
);

dkRecipe(
  'perf',
  'snapshot',
  'Performance snapshot (60 seconds)',
  'Run the standard first-minute checklist and save every output for later comparison.',
  [
    dkP('output', 'Output', 'Where to save the results.', {
      directory: dkText('Output directory', '/tmp/perf-snapshot'),
      seconds: dkF('Sampling seconds', 'number', 5, 'Each sampling tool runs this long.', {
        min: 1,
        max: 60,
      }),
    }),
  ],
  (p) => {
    const s = p.output.seconds;
    return (
      [
        '#!/usr/bin/env bash',
        '# Performance snapshot: read-only except for the output directory.',
        'dir=' + dkQ(p.output.directory) + '/$(date +%Y%m%d-%H%M%S)',
        'mkdir -p "$dir"',
        'run() { name=$1; shift; { echo "# $*"; "$@"; } > "$dir/$name.txt" 2>&1; }',
        'run uptime uptime',
        'run dmesg dmesg -T --level=err,warn',
        'run vmstat vmstat 1 ' + s,
        'run mpstat mpstat -P ALL 1 ' + s,
        'run pidstat pidstat 1 ' + s,
        'run iostat iostat -xz 1 ' + s,
        'run free free -m',
        'run sar-net sar -n DEV 1 ' + s,
        'run top-cpu bash -c "ps aux --sort=-%cpu | head -15"',
        'run top-mem bash -c "ps aux --sort=-%mem | head -15"',
        'run d-state bash -c "ps -eo state,pid,comm | awk \'\\$1==\\"D\\"\'"',
        'run pressure bash -c "grep . /proc/pressure/*"',
        "run oom bash -c \"journalctl -k --since '-1 day' | grep -iE 'out of memory|oom'\"",
        'echo "Saved to $dir"',
      ].join('\n') + '\n'
    );
  },
  'perf-snapshot.sh',
  'bash -n perf-snapshot.sh',
);

dkRecipe(
  'storage',
  'lvm-grow',
  'Grow an LVM volume and filesystem',
  'Check free space, extend the logical volume and grow XFS or ext4 online.',
  [
    dkP(
      'volume',
      'Logical volume',
      'The volume to grow and its mount point.',
      {
        lv: dkText('Logical volume path', '/dev/vg0/data'),
        mount: dkText('Mount point', '/mnt/data'),
        size: dkText('Add size', '+10G', 'Use +10G or +100%FREE.'),
        fs: dkChoice('Filesystem', 'xfs', ['xfs', 'ext4']),
      },
      true,
    ),
  ],
  (p) => {
    const v = p.volume;
    return (
      [
        '#!/usr/bin/env bash',
        'set -euo pipefail',
        '# Grow a logical volume and its filesystem online.',
        'lv=' + dkQ(v.lv),
        'mount_point=' + dkQ(v.mount),
        '',
        'echo "Before:"; lvs "$lv"; vgs -o +vg_free; df -hT "$mount_point"',
        'lvextend -L ' + dkQ(v.size) + ' "$lv"',
        ...(v.fs === 'xfs' ? ['xfs_growfs "$mount_point"'] : ['resize2fs "$lv"']),
        'echo "After:"; lvs "$lv"; df -hT "$mount_point"',
      ].join('\n') + '\n'
    );
  },
  'lvm-grow.sh',
  'bash -n lvm-grow.sh',
);

dkRecipe(
  'secaudit',
  'triage',
  'Read-only compromise triage',
  'Collect process, network, persistence and change evidence without modifying the system.',
  [
    dkP('output', 'Evidence folder', 'Results are written here; nothing else is changed.', {
      directory: dkText('Output directory', '/root/triage'),
      days: dkF('Look back (days)', 'number', 3, 'For recently created executables.', {
        min: 1,
        max: 60,
      }),
    }),
  ],
  (p) => {
    const d = p.output.days;
    return (
      [
        '#!/usr/bin/env bash',
        '# Read-only triage. Never execute anything you find; copy it and record its hash instead.',
        'dir=' + dkQ(p.output.directory) + '/$(hostname)-$(date +%Y%m%d-%H%M%S)',
        'mkdir -p "$dir"; chmod 700 "$dir"',
        'run() { name=$1; shift; { echo "# $*"; "$@"; } > "$dir/$name.txt" 2>&1; }',
        'run processes ps -eo user,pid,ppid,lstart,cmd --sort=lstart',
        'run deleted-binaries bash -c "ls -l /proc/*/exe 2>/dev/null | grep deleted"',
        'run tmp-executables find /tmp /var/tmp /dev/shm -type f -perm /111',
        'run new-executables find / -xdev -type f -newermt "' + d + ' days ago" -perm /111',
        'run sockets ss -tunap',
        'run listening ss -tulpn',
        'run cron bash -c "crontab -l; ls -la /etc/cron.* /var/spool/cron/crontabs"',
        'run timers systemctl list-timers --all',
        'run enabled-units systemctl list-unit-files --state=enabled',
        'run uid0 bash -c "getent passwd | awk -F: \'\\$3==0\'"',
        'run authorized-keys bash -c "for f in /root/.ssh/authorized_keys /home/*/.ssh/authorized_keys; do echo \\"== \\$f\\"; ssh-keygen -lf \\"\\$f\\"; done"',
        'run recent-logins last -i -n 30',
        'run failed-logins lastb -n 30',
        'run sshd-config sshd -T',
        'run changed-system-files find /etc /usr/bin /usr/sbin /bin /sbin -newermt "7 days ago" -type f',
        'chmod -R go-rwx "$dir"',
        'echo "Evidence saved to $dir"',
      ].join('\n') + '\n'
    );
  },
  'triage.sh',
  'bash -n triage.sh',
);

dkRecipe(
  'patching',
  'rolling-reboot',
  'Rolling patch & reboot playbook',
  'Upgrade packages and reboot only when needed, a few hosts at a time, stopping on failure.',
  [
    dkP(
      'target',
      'Hosts',
      'The inventory group to patch.',
      {
        group: dkToken('Group', 'web'),
        serial: dkF('Hosts at a time', 'number', 1, 'Use 1 behind a load balancer.', {
          min: 1,
          max: 50,
        }),
      },
      true,
    ),
    dkP('packages', 'Package upgrade', 'Debian/Ubuntu apt upgrade mode.', {
      mode: dkChoice('Mode', 'dist', ['safe', 'full', 'dist']),
    }),
    dkP('reboot', 'Reboot', 'Wait for the host to return before moving on.', {
      timeout: dkF('Timeout (seconds)', 'number', 600, '', { min: 60, max: 3600 }),
    }),
  ],
  (p) =>
    dkYaml([
      {
        name: 'Patch and reboot ' + p.target.group,
        hosts: p.target.group,
        become: true,
        serial: Number(p.target.serial),
        max_fail_percentage: 0,
        tasks: [
          {
            name: 'Update the package index and upgrade',
            'ansible.builtin.apt': {
              update_cache: true,
              upgrade: p.packages ? p.packages.mode : 'dist',
            },
          },
          {
            name: 'Check whether a reboot is required',
            'ansible.builtin.stat': { path: '/var/run/reboot-required' },
            register: 'reboot_required',
          },
          {
            name: 'Reboot when required',
            'ansible.builtin.reboot': {
              reboot_timeout: Number(p.reboot ? p.reboot.timeout : 600),
            },
            when: 'reboot_required.stat.exists',
          },
          {
            name: 'Read the running kernel',
            'ansible.builtin.command': 'uname -r',
            register: 'kernel',
            changed_when: false,
          },
          {
            name: 'Report the kernel',
            'ansible.builtin.debug': {
              msg: '{{ inventory_hostname }} runs {{ kernel.stdout }}',
            },
          },
        ],
      },
    ]),
  'patch.yml',
  'ansible-playbook -i inventory.yml patch.yml --syntax-check',
);

dkRecipe(
  'puppet',
  'profile',
  'Puppet profile class',
  'Create a class that installs a package and keeps its service running.',
  [
    dkP(
      'class',
      'Class',
      'Use the profile::name convention.',
      {
        name: dkToken('Class name', 'profile::webserver'),
        package: dkToken('Package', 'nginx'),
        service: dkToken('Service', 'nginx'),
      },
      true,
    ),
  ],
  (p) =>
    [
      '# @summary Install and run ' + p.class.package,
      'class ' + p.class.name + ' (',
      "  String $package_name = '" + p.class.package + "',",
      "  String $service_name = '" + p.class.service + "',",
      ') {',
      '  package { $package_name:',
      '    ensure => installed,',
      '  }',
      '',
      '  service { $service_name:',
      '    ensure  => running,',
      '    enable  => true,',
      '    require => Package[$package_name],',
      '  }',
      '}',
    ].join('\n') + '\n',
  'manifest.pp',
  'puppet parser validate manifest.pp',
);

dkRecipe(
  'runbooks',
  'postmortem',
  'Blameless post-mortem',
  'A structured write-up: impact, timeline, cause, what worked, and follow-up actions.',
  [
    dkP(
      'incident',
      'Incident',
      'Facts first; no names or blame.',
      {
        title: dkText('Title', 'Intermittent DNS failures'),
        severity: dkChoice('Severity', 'SEV2', ['SEV1', 'SEV2', 'SEV3']),
        impact: dkText(
          'Impact',
          'Name resolution failed for about 20% of requests for 45 minutes.',
        ),
      },
      true,
    ),
    dkP('timeline', 'Timeline', 'One entry per line: time - what happened.', {
      items: dkList('Entries', [
        '19:36 - First alert: DNS timeouts',
        '19:41 - Outbound traffic found saturated',
        '19:52 - Cause contained',
      ]),
    }),
  ],
  (p) =>
    [
      '# ' + p.incident.title,
      '',
      '**Severity:** ' + p.incident.severity,
      '',
      '## Impact',
      p.incident.impact,
      '',
      '## Timeline',
      ...dkLines(p.timeline?.items).map((l) => '- ' + l),
      '',
      '## Root cause',
      '_What actually caused it, and how we know._',
      '',
      '## What went well',
      '-',
      '',
      '## What went badly or by luck',
      '-',
      '',
      '## Detection',
      '_How was it noticed? How could it have been noticed sooner?_',
      '',
      '## Action items',
      '| Action | Owner | Due |',
      '| --- | --- | --- |',
      '|  |  |  |',
    ].join('\n') + '\n',
  'postmortem.md',
);

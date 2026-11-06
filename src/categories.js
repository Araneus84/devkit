/* ─────────────────────────────────────────
   CATEGORIES — groups the cheatsheets for the sidebar and the home dashboard.
   Every sheet key in SHEETS must appear in exactly one category (tests/home-ui.cjs).
───────────────────────────────────────── */
const DK_CATEGORIES = [
  {
    id: 'languages',
    name: 'Languages & Shells',
    icon: '⌨',
    hue: '#8b7cf6',
    blurb: 'Shells, scripting and editor muscle memory.',
    sheets: ['bash', 'powershell', 'cmd', 'python', 'npm', 'regex', 'vim', 'tmux'],
  },
  {
    id: 'linux',
    name: 'Linux & Systems',
    icon: '🐧',
    hue: '#e8a33d',
    blurb: 'Administer, tune and patch Linux hosts.',
    sheets: ['linux', 'perf', 'storage', 'patching'],
  },
  {
    id: 'network',
    name: 'Networking & Security',
    icon: '🛰',
    hue: '#2fbfb3',
    blurb: 'DNS, load balancing, TLS, firewalls and switches.',
    sheets: [
      'net',
      'netdiag',
      'dns',
      'lb',
      'tls',
      'ssh',
      'curl',
      'secaudit',
      'cisco',
      'aruba',
      'fortigate',
      'juniper',
      'netgear',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & Containers',
    icon: '☁',
    hue: '#4c9aff',
    blurb: 'Containers, Kubernetes and the big three clouds.',
    sheets: ['docker', 'k8s', 'aws', 'azure', 'gcloud'],
  },
  {
    id: 'automation',
    name: 'Automation & IaC',
    icon: '⚙',
    hue: '#6cc04a',
    blurb: 'Infrastructure as code, config management and Git.',
    sheets: ['terraform', 'ansible', 'puppet', 'cicd', 'git'],
  },
  {
    id: 'data',
    name: 'Data & Admin',
    icon: '🗂',
    hue: '#f2688f',
    blurb: 'Databases, spreadsheets and Google Workspace admin.',
    sheets: ['sql', 'excel', 'gam7'],
  },
  {
    id: 'runbooks',
    name: 'Runbooks & Incidents',
    icon: '🚨',
    hue: '#ff7a45',
    blurb: 'Step-by-step checklists for when something is on fire.',
    sheets: ['runbooks'],
  },
];

const DK_INTENTS = [
  'restart a service',
  'DNS not resolving',
  'check certificate expiry',
  'disk is full',
  'find what is using a port',
  'server is slow',
  'rolling patch reboot',
  'test HAProxy config',
  'kubernetes pod crash loop',
  'undo a git commit',
];

function dkCategoryList() {
  const known = new Set();
  const list = DK_CATEGORIES.map((c) => ({
    ...c,
    sheets: c.sheets.filter((k) => {
      if (!SHEETS[k]) return false;
      known.add(k);
      return true;
    }),
  }));
  const rest = Object.keys(SHEETS).filter((k) => !known.has(k));
  if (rest.length)
    list.push({
      id: 'other',
      name: 'Other',
      icon: '•',
      hue: '#8a93a6',
      blurb: 'Everything else.',
      sheets: rest,
    });
  return list;
}

function dkCategoryOf(sheetKey) {
  return dkCategoryList().find((c) => c.sheets.includes(sheetKey)) || null;
}

function dkSheetCommandCount(key) {
  return SHEETS[key] ? SHEETS[key].sections.reduce((n, s) => n + s.cmds.length, 0) : 0;
}

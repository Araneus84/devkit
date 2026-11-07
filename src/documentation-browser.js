/* Documentation is rendered as text, never as executable third-party HTML. */
let dbPack = null;
let dbQuery = '';
let dbSheet = 'python';
let dbReturn = null;
const DB_PACKS = new Map();
const DB_MANUALS = {
  vim: {
    id: 'vim-2026-11',
    name: 'Vim 9.2 help snapshot (November 2026)',
    filename: 'vim-2026-11.json',
    source: 'https://github.com/vim/vim/blob/88d96a15f99851faca0cacbbbdcede3f8c25149b/',
    example: ':w, CTRL-V, registers',
    licensePage: 'licenses/OPUBL-1.0.txt',
  },
  k8s: {
    id: 'kubernetes-2026-11',
    name: 'Kubernetes documentation snapshot (November 2026)',
    filename: 'kubernetes-2026-11.json',
    source: 'https://github.com/kubernetes/website/blob/3ce2ad7b7a23560bc16e0f8d32d654a75bb98063/',
    example: 'Deployment, Pod, kubectl',
    licensePage: 'LICENSE',
  },
  python: {
    id: 'python-3.15',
    name: 'Python 3.15',
    filename: 'python-3.15.json',
    source: 'https://docs.python.org/3.15/',
    example: 'sorted, pathlib, exceptions',
    licensePage: 'license.html',
  },
  bash: {
    id: 'bash-5.3',
    name: 'GNU Bash 5.3',
    filename: 'bash-5.3.json',
    source: 'https://www.gnu.org/software/bash/manual/',
    example: 'quoting, arrays, pipelines',
    licenseTitle: 'Appendix C GNU Free Documentation License',
  },
  powershell: {
    id: 'powershell-7.6',
    name: 'PowerShell 7.6',
    filename: 'powershell-7.6.json',
    source:
      'https://github.com/MicrosoftDocs/PowerShell-Docs/blob/ebaa235784a688ec72ab642186c4c17460fb438b/',
    example: 'Get-ChildItem, pipelines, functions',
    licensePage: 'LICENSE.md',
  },
  ansible: {
    id: 'ansible-core-2.21',
    name: 'Ansible Core 2.21',
    filename: 'ansible-core-2.21.json',
    source:
      'https://github.com/ansible/ansible-documentation/blob/00c4cb3eb344e2cbbdb8a81f25ee608db3fb6915/',
    coreSource: 'https://github.com/ansible/ansible/blob/446d5bb415de5e40a0bf9b23f9ae2a7e2ad16835/',
    example: 'apt, playbooks, variables',
    licensePage: 'guides/COPYING',
  },
  terraform: {
    id: 'terraform-1.17',
    name: 'Terraform 1.17',
    filename: 'terraform-1.17.json',
    source:
      'https://github.com/hashicorp/web-unified-docs/blob/91cd77c2916730dbf8f922042462b0c0f22141e9/',
    example: 'sort, variables, providers',
    licensePage: 'LICENSE',
  },
  git: {
    id: 'git-2026-11',
    name: 'Git manual snapshot (November 2026)',
    filename: 'git-2026-11.json',
    source: 'https://git.github.io/htmldocs/',
    example: 'commit, rebase, reset',
    licensePage: 'COPYING',
  },
  docker: {
    id: 'docker-2026-11',
    name: 'Docker documentation snapshot (November 2026)',
    filename: 'docker-2026-11.json',
    source: 'https://github.com/docker/docs/blob/16e452c8eaea26cec842cbf1065037fb2015001f/',
    cliSource: 'https://github.com/docker/cli/blob/7c0f1b261a24b36ad39b6031db6ffe41e60bc7e7/',
    buildkitSource:
      'https://github.com/moby/buildkit/blob/cedaeca8850a2bb536bbd1db72419f3cf491bdb5/',
    example: 'Dockerfile, docker run, compose',
    licensePage: 'docs/LICENSE',
  },
  sql: {
    id: 'postgresql-18.6',
    name: 'PostgreSQL 18.6 SQL and database',
    filename: 'postgresql-18.6.json',
    source: 'https://www.postgresql.org/docs/18/',
    example: 'SELECT, joins, window functions',
    licensePage: 'legalnotice.html',
  },
  yaml: {
    id: 'yaml-1.2.2',
    name: 'YAML 1.2.2',
    label: 'YAML',
    filename: 'yaml-1.2.2.json',
    source: 'https://yaml.org/spec/1.2.2/',
    sourceUrl: 'https://yaml.org/spec/1.2.2/',
    example: 'anchors, indentation, mappings',
    licensePage: 'spec.md',
  },
  json: {
    id: 'json-rfc8259',
    name: 'JSON RFC 8259',
    label: 'JSON',
    filename: 'json-rfc8259.json',
    source: 'https://www.rfc-editor.org/rfc/',
    example: 'arrays, objects, strings',
    licensePage: 'rfc8259.txt',
  },
};

function dbLabel(sheet) {
  return DB_MANUALS[sheet].label || SHEETS[sheet].name;
}

function dbFind(text, query) {
  if (dbSheet === 'vim') {
    const tag = text.indexOf('*' + query.trim() + '*');
    if (tag >= 0) return tag + 1;
    return text.indexOf(query.trim());
  }
  const lower = text.toLowerCase();
  const term = query.trim().toLowerCase();
  const symbol = term.replace(/\(\)$/, '(');
  const definition = lower.indexOf('\n ' + symbol);
  return definition >= 0 ? definition + 2 : lower.indexOf(term);
}

function dbValidate(pack) {
  if (
    !pack ||
    pack.format !== 'devkit-documentation-pack' ||
    pack.version !== 1 ||
    pack.id !== DB_MANUALS[dbSheet].id ||
    !Array.isArray(pack.pages) ||
    pack.pages.length > 2000 ||
    pack.pages.some(
      (page) =>
        !page ||
        typeof page.title !== 'string' ||
        typeof page.path !== 'string' ||
        !/^(?:[a-zA-Z0-9_./-]+\.(?:html|md|mdx|rst|py|txt)(?:#[a-zA-Z0-9_.-]+)?|guides\/COPYING|docs\/LICENSE|cli\/NOTICE|COPYING|LICENSE)$/.test(
          page.path,
        ) ||
        page.path.split('/').includes('..') ||
        typeof page.text !== 'string' ||
        page.text.length > 3000000,
    )
  ) {
    throw new Error('This pack does not match the selected manual.');
  }
  return pack;
}

function dbAddEntry(main, sheet) {
  const button = dkBtn(
    sheet === 'sql'
      ? 'Search PostgreSQL 18 documentation'
      : sheet === 'ansible'
        ? 'Search Ansible Core documentation'
        : sheet === 'terraform'
          ? 'Search Terraform language and CLI documentation'
          : sheet === 'docker'
            ? 'Search Docker documentation'
            : 'Search full ' + SHEETS[sheet].name + ' documentation',
    () => dbOpen('', sheet),
    'dk-btn primary',
  );
  button.style.marginBottom = '1rem';
  main.querySelector('.page-header')?.after(button);
}

function dbOpen(initialQuery = '', sheet = 'python', returnToEditor = null) {
  dbSheet = sheet;
  dbReturn = returnToEditor;
  dbPack = DB_PACKS.get(sheet) || null;
  dbQuery = initialQuery;
  dkStopTest();
  dkShow();
  dbRender();
}

function dbPackUrl() {
  const base = new URL(location.href);
  if (base.pathname.endsWith('/dist/devkit.html'))
    base.pathname = base.pathname.replace(/dist\/devkit\.html$/, '');
  else base.pathname = base.pathname.replace(/[^/]*$/, '');
  return new URL('documentation-packs/' + DB_MANUALS[dbSheet].filename, base);
}

async function dbLoadOnline(status) {
  status.textContent = 'Loading documentation…';
  try {
    const response = await fetch(dbPackUrl());
    if (!response.ok) throw new Error(`Download failed (${response.status}).`);
    dbPack = dbValidate(await response.json());
    DB_PACKS.set(dbSheet, dbPack);
    dbRender();
  } catch (error) {
    status.textContent = `Could not load the online manual: ${error.message}`;
  }
}

function dbRender() {
  const root = document.getElementById('dk-root');
  root.replaceChildren();
  const header = dkEl('header', 'dk-header');
  const title = dkEl('div');
  title.append(
    dkEl('h2', '', DB_MANUALS[dbSheet].name + ' documentation'),
    dkEl('p', 'dk-help', 'Search the official reference manual.'),
  );
  header.append(title);
  if (dbReturn) header.append(dkBtn('← Back to editor', dbReturn));
  header.append(dkBtn('Close ✕', dkClose));
  root.append(header);
  const body = dkEl('div', 'dk-home');
  root.append(body);
  if (!dbPack) {
    const status = dkEl('p', 'dk-help', 'Load the manual to search its contents.');
    body.append(status);
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      body.append(dkBtn('Load online manual', () => dbLoadOnline(status), 'dk-btn primary'));
      const download = dkEl('a', 'dk-btn', 'Download pack for offline use');
      download.href = dbPackUrl().href;
      download.download = DB_MANUALS[dbSheet].filename;
      body.append(download);
    }
    const label = dkEl('label', 'dk-help', ' Or choose a downloaded documentation pack: ');
    const input = dkEl('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.setAttribute('aria-label', 'Choose ' + dbLabel(dbSheet) + ' documentation pack');
    input.onchange = async () => {
      try {
        const file = input.files[0];
        if (!file || file.size > 30000000) throw new Error('Choose a pack smaller than 30 MB.');
        dbPack = dbValidate(JSON.parse(await file.text()));
        DB_PACKS.set(dbSheet, dbPack);
        dbRender();
      } catch (error) {
        status.textContent = `Could not load the pack: ${error.message}`;
      }
    };
    label.append(input);
    body.append(label);
    return;
  }
  const input = dkEl('input', 'dk-input');
  input.type = 'search';
  input.placeholder = 'Search documentation, e.g. ' + DB_MANUALS[dbSheet].example;
  input.setAttribute('aria-label', 'Search ' + dbLabel(dbSheet) + ' documentation');
  input.value = dbQuery;
  body.append(input);
  const terms = DB_MANUALS[dbSheet];
  const licensePage = dbPack.pages.find(
    (page) => page.path === terms.licensePage || page.title === terms.licenseTitle,
  );
  const attribution = dkEl(
    'p',
    'dk-help',
    'Documentation by its original authors. Separate third-party license terms apply. ',
  );
  if (licensePage)
    attribution.append(
      dkBtn('Read documentation license', () => dbRead(licensePage, ''), 'us-query'),
    );
  body.append(attribution);
  const results = dkEl('div');
  body.append(results);
  function search() {
    dbQuery = input.value;
    results.replaceChildren();
    const query = dbQuery.trim();
    if (!query) {
      results.append(dkEl('p', 'dk-help', `${dbPack.pages.length} manual pages ready to search.`));
      return;
    }
    const matches = dbPack.pages
      .map((page) => {
        const position = dbFind(page.text, query);
        const titleMatch = page.title.toLowerCase().includes(query.toLowerCase());
        const tagMatch = dbSheet === 'vim' && page.text.includes('*' + query + '*');
        return { page, position, titleMatch, tagMatch };
      })
      .filter((item) => item.position >= 0 || item.titleMatch)
      .sort(
        (a, b) =>
          Number(b.tagMatch) - Number(a.tagMatch) || Number(b.titleMatch) - Number(a.titleMatch),
      );
    results.append(dkEl('p', 'dk-help', `${matches.length} pages found; showing up to 50.`));
    for (const item of matches.slice(0, 50)) {
      const card = dkEl('div', 'dk-guide');
      const start = Math.max(0, item.position - 80);
      card.append(
        dkEl('strong', '', item.page.title),
        dkEl('p', 'dk-help', item.page.text.slice(start, start + 220).replace(/\s+/g, ' ')),
        dkBtn('Read page', () => dbRead(item.page, query)),
      );
      results.append(card);
    }
  }
  input.oninput = search;
  search();
  input.focus();
}

function dbRead(page, query) {
  const root = document.getElementById('dk-root');
  root.replaceChildren();
  const header = dkEl('header', 'dk-header');
  header.append(
    dkEl('h2', '', page.title),
    dkBtn('Back to results', dbRender),
    dkBtn('Close ✕', dkClose),
  );
  const body = dkEl('div', 'dk-home');
  const source = dkEl('a', '', 'Official documentation ↗');
  if (dbSheet === 'vim' && page.path === 'licenses/OPUBL-1.0.txt') {
    source.href = 'https://spdx.org/licenses/OPUBL-1.0.html';
  } else if (dbSheet === 'docker') {
    const [origin, ...parts] = page.path.split('/');
    const bases = {
      docs: DB_MANUALS.docker.source,
      cli: DB_MANUALS.docker.cliSource,
      buildkit: DB_MANUALS.docker.buildkitSource,
    };
    source.href = (bases[origin] || DB_MANUALS.docker.source) + parts.join('/');
  } else if (dbSheet === 'git' && page.path === 'COPYING') {
    source.href = 'https://github.com/git/git/blob/master/COPYING';
  } else if (dbSheet === 'ansible') {
    const isCore = page.path.startsWith('core/');
    source.href =
      (isCore ? DB_MANUALS.ansible.coreSource : DB_MANUALS.ansible.source) +
      page.path.replace(/^(?:core|guides)\//, '');
  } else source.href = DB_MANUALS[dbSheet].sourceUrl || DB_MANUALS[dbSheet].source + page.path;
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  const text = dkEl('pre');
  text.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;font:inherit';
  const position = dbFind(page.text, query);
  if (position >= 0 && query) {
    text.append(document.createTextNode(page.text.slice(0, position)));
    const mark = dkEl('mark', '', page.text.slice(position, position + query.length));
    text.append(mark, document.createTextNode(page.text.slice(position + query.length)));
    requestAnimationFrame(() => mark.scrollIntoView({ block: 'center' }));
  } else text.textContent = page.text;
  body.append(source, text);
  root.append(header, body);
}

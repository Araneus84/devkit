/* Documentation is rendered as text, never as executable third-party HTML. */
let dbPack = null;
let dbQuery = '';
let dbSheet = 'python';
let dbReturn = null;
const DB_PACKS = new Map();
const DB_MANUALS = {
  node: {
    id: 'node-26.13.0',
    name: 'Node.js 26.13.0 API',
    label: 'Node.js',
    filename: 'node-26.13.0.json',
    source: 'https://github.com/nodejs/node/blob/v26.13.0/',
    example: 'fs.readFile, http.createServer, process',
    licensePage: 'licenses/node-license.txt',
  },
  npm: {
    id: 'npm-12.2.2',
    name: 'npm 12.2.2',
    label: 'npm',
    filename: 'npm-12.2.2.json',
    source: 'https://docs.npmjs.com/cli/v12/',
    example: 'npm ci, package.json, workspaces',
    licensePage: 'LICENSE',
  },
  curl: {
    id: 'curl-2026-11',
    name: 'curl documentation snapshot (November 2026)',
    label: 'curl',
    filename: 'curl-2026-11.json',
    source: 'https://github.com/curl/curl/blob/155f6f76c7ba9d19b5656c4ab1f320a949a3ca4c/',
    example: '--header, --retry, authentication',
    licensePage: 'COPYING',
  },
  jq: {
    id: 'jq-1.8',
    name: 'jq 1.8',
    label: 'jq',
    filename: 'jq-1.8.json',
    source: 'https://github.com/jqlang/jq/blob/5c001b18d7237cce1fdba63608732163f978dd23/',
    example: 'map, select, sort_by',
    licensePage: 'licenses/CC-BY-3.0.txt',
  },
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

const DB_PYTHON_EXAMPLES = {
  abs: 'abs(-8)  # 8\nabs(3.5)  # 3.5\nabs(3 + 4j)  # 5.0',
  sorted: 'sorted([3, 1, 2])  # [1, 2, 3]\nsorted([3, 1, 2], reverse=True)  # [3, 2, 1]',
  len: "len('hello')  # 5\nlen([10, 20, 30])  # 3",
  sum: 'sum([1, 2, 3])  # 6',
  min: 'min([3, 1, 2])  # 1',
  max: 'max([3, 1, 2])  # 3',
  range: 'list(range(4))  # [0, 1, 2, 3]',
  enumerate: "list(enumerate(['a', 'b']))  # [(0, 'a'), (1, 'b')]",
  zip: "list(zip(['a', 'b'], [1, 2]))  # [('a', 1), ('b', 2)]",
  any: 'any([False, True])  # True',
  all: 'all([True, False])  # False',
};

function dbPythonEntry(page, query) {
  if (dbSheet !== 'python' || page.path !== 'builtins/functions.html') return null;
  const match = /^([A-Za-z_]\w*)(?:\(\)?)?$/.exec(query.trim());
  if (!match) return null;
  const name = match[1];
  const start = page.text.indexOf('\n ' + name + '(');
  if (start < 0) return null;
  const rest = page.text.slice(start + 2);
  const end = /\n [A-Za-z_]\w*\([^\n]*\)[^\n]*\n/.exec(rest);
  const entry = (end ? rest.slice(0, end.index) : rest).trim();
  const newline = entry.indexOf('\n');
  if (newline < 0) return null;
  return {
    name,
    signature: entry
      .slice(0, newline)
      .replace(/[¶\uFFFD]/g, '')
      .trim(),
    description: entry.slice(newline).trim(),
    example: DB_PYTHON_EXAMPLES[name] || '',
  };
}

function dbAliases(page) {
  const title = page.title
    .replace(/`/g, '')
    .replace(/^\d+(?:\.\d+)*\s+/, '')
    .trim();
  const aliases = [title];
  const base = title.replace(/\s+Function$/i, '').replace(/\(\d+\)$/, '');
  aliases.push(base);
  if (/^(?:git|npm)-/.test(base)) aliases.push(base.replace('-', ' '));
  if (base.startsWith('ansible.builtin.')) aliases.push(base.slice('ansible.builtin.'.length));
  if (dbSheet === 'curl')
    aliases.push(
      ...(base.match(/--[a-z0-9-]+|\(-[A-Za-z0-9]\)/g) || []).map((x) => x.replace(/[()]/g, '')),
    );
  if (dbSheet === 'jq') {
    for (const part of base.split(',')) {
      const name = part.trim().match(/^([\w]+)\(/);
      if (name) aliases.push(name[1], name[1] + '()');
    }
  }
  return [...new Set(aliases.filter(Boolean))];
}

const DB_HEADING_CACHE = new WeakMap();
function dbSpecHeadings(page, sheet) {
  if (!['yaml', 'json'].includes(sheet)) return [];
  const cached = DB_HEADING_CACHE.get(page);
  if (cached) return cached;
  const pattern =
    sheet === 'yaml'
      ? /^#{1,6}\s+(?:Chapter\s+)?(?:#\.\s*)?([^\n]+)$/gm
      : /^\s*\d+(?:\.\d+)*\.\s+([A-Z][A-Za-z0-9 ,()/-]{2,90})\s*$/gm;
  const headings = [];
  for (const match of page.text.matchAll(pattern)) {
    const name = match[1]
      .replace(/\s*\{#[^}]+\}\s*$/, '')
      .replace(/[`*]/g, '')
      .trim();
    if (name.length > 2 && name.length < 100)
      headings.push({ name, start: match.index, after: match.index + match[0].length });
  }
  DB_HEADING_CACHE.set(page, headings);
  return headings;
}

function dbDirectEntry(page, query) {
  const python = dbPythonEntry(page, query);
  if (python) return { ...python, label: 'Python built-in' };
  const q = query.trim();
  let signature = '';
  let text = page.text;
  if (dbSheet === 'python' && /^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)+(?:\(\)?)?$/.test(q)) {
    const name = q.replace(/\(\)?$/, '');
    const index = text.indexOf('\n ' + name + '(');
    if (index >= 0) {
      const section = text.slice(index + 2);
      const newline = section.indexOf('\n');
      if (newline >= 0) {
        signature = section
          .slice(0, newline)
          .replace(/[¶\uFFFD]/g, '')
          .trim();
        text = section.slice(newline + 1);
      }
    }
  } else if (dbSheet === 'node' && /^[\w$]+\.[\w$]+(?:\(\)?)?$/.test(q)) {
    const needle = q.replace(/\(\)$/, '(').toLowerCase();
    const index = text.toLowerCase().indexOf('\n`' + needle);
    if (index >= 0) {
      const section = text.slice(index + 2);
      const newline = section.indexOf('\n');
      if (newline >= 0) {
        signature = section.slice(0, newline).replace(/`/g, '');
        text = section.slice(newline + 1);
      }
    }
  } else if (dbSheet === 'vim' && text.includes('*' + q + '*')) {
    signature = q;
    text = text.slice(text.indexOf('*' + q + '*') + q.length + 2);
  } else if (['yaml', 'json'].includes(dbSheet)) {
    const headings = dbSpecHeadings(page, dbSheet);
    const index = headings.findIndex((heading) => heading.name.toLowerCase() === q.toLowerCase());
    if (index >= 0) {
      signature = headings[index].name;
      text = text.slice(headings[index].after, headings[index + 1]?.start);
    }
  } else if (dbAliases(page).some((alias) => alias.toLowerCase() === q.toLowerCase())) {
    signature = page.title.replace(/`/g, '');
  }
  if (!signature && dbAliases(page).some((alias) => alias.toLowerCase() === q.toLowerCase())) {
    signature = page.title.replace(/`/g, '');
  }
  if (!signature) return null;
  const short = /^short_description:\s*(.+)$/m.exec(text);
  const synopsis = /^##\s+SYNOPSIS\s*\n+([^\n#]+)/im.exec(text);
  const description =
    short?.[1] ||
    synopsis?.[1] ||
    text
      .replace(/<!--(?:.|\n)*?-->/g, '')
      .split(/\n\s*\n/)
      .map((part) =>
        part
          .replace(/^#+\s*[^\n]*\n?/gm, '')
          .replace(/[`*_]/g, '')
          .trim(),
      )
      .find(
        (part) =>
          part &&
          !/^(?:DOCUMENTATION|SYNOPSIS|NAME|Synopsis)$/i.test(part) &&
          !part.startsWith('|'),
      ) ||
    '';
  const exampleMatch =
    /(?:^|\n)#{1,4}\s*examples?[^\n]*\n[\s\S]{0,2000}?```[^\n]*\n([\s\S]*?)```/i.exec(text) ||
    /(?:^|\n)(Example filter:[\s\S]*?)(?:\n\s*\n|$)/i.exec(text);
  return {
    signature,
    description,
    example: exampleMatch ? exampleMatch[1].trim().slice(0, 800) : '',
    label: dbLabel(dbSheet),
  };
}

const DB_SUGGESTION_CACHE = new WeakMap();
function dbSuggestionIndex(pack, sheet) {
  const cached = DB_SUGGESTION_CACHE.get(pack);
  if (cached) return cached;
  const candidates = new Map();
  function add(value, priority = 1) {
    value = value.trim();
    if (!value || value.length > 100) return;
    const old = candidates.get(value);
    if (old === undefined || priority < old) candidates.set(value, priority);
  }
  for (const page of pack.pages) {
    for (const name of dbAliases(page)) add(name);
    for (const heading of dbSpecHeadings(page, sheet)) add(heading.name, 0);
    if (sheet === 'python') {
      if (page.path === 'builtins/functions.html') {
        for (const match of page.text.matchAll(/\n ([A-Za-z_]\w*)\(/g)) add(match[1] + '()', 0);
      }
      for (const match of page.text.matchAll(/\n ([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)+)\(/g))
        add(match[1] + '()', 1);
    } else if (sheet === 'node') {
      for (const match of page.text.matchAll(/\n`([\w$]+\.[\w$]+)\(/g)) add(match[1] + '()', 0);
    } else if (sheet === 'vim') {
      for (const match of page.text.matchAll(/\*([^\s*]{1,80})\*/g)) add(match[1], 0);
    }
  }
  const index = [...candidates]
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
  DB_SUGGESTION_CACHE.set(pack, index);
  return index;
}

function dbSnippet(text, position) {
  let start = Math.max(0, position - 80);
  let end = Math.min(text.length, start + 220);
  if (start) {
    const next = text.indexOf(' ', start);
    if (next >= 0 && next < position) start = next + 1;
  }
  if (end < text.length) {
    const previous = text.lastIndexOf(' ', end);
    if (previous > position) end = previous;
  }
  return (
    (start ? '…' : '') +
    text.slice(start, end).replace(/\s+/g, ' ').trim() +
    (end < text.length ? '…' : '')
  );
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
  if (dbSheet === 'node') {
    const definition = lower.indexOf('\n`' + symbol);
    if (definition >= 0) return definition + 2;
  }
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
        !/^(?:[a-zA-Z0-9_./-]+\.(?:html|md|mdx|rst|py|txt|yml)(?:#[a-zA-Z0-9_.-]+)?|guides\/COPYING|docs\/LICENSE|cli\/NOTICE|COPYING|LICENSE)$/.test(
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
            : 'Search full ' + dbLabel(sheet) + ' documentation',
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
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'db-suggestions');
  input.value = dbQuery;
  body.append(input);
  const suggestions = dkEl('div', 'db-suggestions');
  suggestions.id = 'db-suggestions';
  suggestions.setAttribute('role', 'listbox');
  suggestions.setAttribute('aria-label', 'Documentation suggestions');
  suggestions.hidden = true;
  body.append(suggestions);
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
  const results = dkEl('div');
  results.setAttribute('aria-live', 'polite');
  body.append(results);
  body.append(attribution);
  function search() {
    dbQuery = input.value;
    results.replaceChildren();
    const query = dbQuery.trim();
    if (!query) {
      results.append(
        dkEl(
          'p',
          'dk-help',
          `Type a function, command, or topic to search ${dbPack.pages.length} manual pages.`,
        ),
      );
      return;
    }
    const matches = dbPack.pages
      .map((page) => {
        const position = dbFind(page.text, query);
        const titleMatch = page.title.toLowerCase().includes(query.toLowerCase());
        const tagMatch = dbSheet === 'vim' && page.text.includes('*' + query + '*');
        const entry = dbDirectEntry(page, query);
        const exactTitle = page.title.toLowerCase() === query.toLowerCase();
        const score =
          (entry ? 1000 : 0) +
          (tagMatch ? 500 : 0) +
          (exactTitle ? 200 : 0) +
          (titleMatch ? 100 : 0);
        return { page, position, titleMatch, entry, score };
      })
      .filter((item) => item.position >= 0 || item.titleMatch || item.entry)
      .sort((a, b) => b.score - a.score);
    if (!matches.length) {
      results.append(
        dkEl('p', 'dk-help', 'No matches found. Try a shorter name or a related term.'),
      );
      return;
    }
    const count = dkEl('p', 'dk-help');
    const list = dkEl('div');
    results.append(count, list);
    let shown = 0;
    function showMore() {
      more.remove();
      const limit = Math.min(shown + (shown ? 10 : 5), matches.length);
      for (const item of matches.slice(shown, limit)) {
        const card = dkEl('article', 'dk-guide db-result');
        if (item.entry) {
          card.classList.add('db-result-featured');
          card.append(dkEl('span', 'db-result-label', 'Direct match · ' + item.entry.label));
          card.append(dkEl('h3', 'db-result-title', item.entry.signature));
          const description = item.entry.description.replace(/\s+/g, ' ');
          card.append(
            dkEl(
              'p',
              '',
              description.length > 600 ? description.slice(0, 600).trimEnd() + '…' : description,
            ),
          );
          if (item.entry.example) {
            card.append(
              dkEl('strong', '', 'Examples'),
              dkEl('pre', 'db-result-example', item.entry.example),
            );
          }
          card.append(dkEl('p', 'dk-help', 'From ' + item.page.title));
        } else {
          card.append(dkEl('strong', '', item.page.title));
          card.append(dkEl('p', '', dbSnippet(item.page.text, Math.max(0, item.position))));
        }
        card.append(dkBtn('Read page', () => dbRead(item.page, query)));
        list.append(card);
      }
      shown = limit;
      count.textContent = `Showing ${shown} of ${matches.length} matching pages, best matches first.`;
      if (shown < matches.length) results.append(more);
    }
    const more = dkBtn('Show more results', showMore);
    showMore();
  }
  let options = [];
  let selected = 0;
  function hideSuggestions() {
    suggestions.hidden = true;
    suggestions.replaceChildren();
    options = [];
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }
  function acceptSuggestion(value) {
    input.value = value;
    hideSuggestions();
    search();
    input.focus();
  }
  function drawSuggestions() {
    suggestions.replaceChildren();
    if (!options.length) return hideSuggestions();
    const hint = dkEl(
      'div',
      'db-suggestions-hint',
      '↑ ↓ choose · Tab or Enter completes · Esc dismisses',
    );
    hint.setAttribute('aria-hidden', 'true');
    suggestions.append(hint);
    options.forEach((value, index) => {
      const option = dkBtn(value, () => acceptSuggestion(value), 'db-suggestion');
      option.id = 'db-suggestion-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(index === selected));
      option.onmousedown = (event) => event.preventDefault();
      suggestions.append(option);
    });
    suggestions.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', 'db-suggestion-' + selected);
  }
  input.oninput = () => {
    search();
    const prefix = input.value.trim();
    if (!prefix) return hideSuggestions();
    const compare = dbSheet === 'vim' ? (s) => s : (s) => s.toLowerCase();
    const needle = compare(prefix);
    options = dbSuggestionIndex(dbPack, dbSheet)
      .filter(
        (value) =>
          compare(value) !== needle &&
          (compare(value).startsWith(needle) ||
            compare(value)
              .split(/\s+/)
              .some((word) => word.startsWith(needle))),
      )
      .sort((a, b) => Number(compare(b).startsWith(needle)) - Number(compare(a).startsWith(needle)))
      .slice(0, 6);
    selected = 0;
    drawSuggestions();
  };
  input.onkeydown = (event) => {
    if (!options.length) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      hideSuggestions();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      selected =
        (selected + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      drawSuggestions();
    } else if (event.key === 'Tab' || event.key === 'Enter') {
      if (event.key === 'Tab' && event.shiftKey) return;
      event.preventDefault();
      acceptSuggestion(options[selected]);
    }
  };
  input.onblur = () => setTimeout(hideSuggestions, 150);
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
  if (dbSheet === 'node' && page.path === 'licenses/node-license.txt') {
    source.href = 'https://github.com/nodejs/node/blob/v26.13.0/LICENSE';
  } else if (dbSheet === 'npm') {
    source.href =
      page.path === 'LICENSE'
        ? 'https://github.com/npm/cli/blob/v12.2.2/LICENSE'
        : DB_MANUALS.npm.source + page.path.replace(/^docs\/output\//, '').replace(/\.html$/, '/');
  } else if (dbSheet === 'jq' && page.path === 'licenses/CC-BY-3.0.txt') {
    source.href = 'https://creativecommons.org/licenses/by/3.0/';
  } else if (dbSheet === 'vim' && page.path === 'licenses/OPUBL-1.0.txt') {
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
    const length =
      query.endsWith('()') &&
      page.text.slice(position, position + query.length).toLowerCase() !== query.toLowerCase()
        ? query.length - 1
        : query.length;
    const mark = dkEl('mark', '', page.text.slice(position, position + length));
    text.append(mark, document.createTextNode(page.text.slice(position + length)));
    requestAnimationFrame(() => mark.scrollIntoView({ block: 'center' }));
  } else text.textContent = page.text;
  body.append(source, text);
  root.append(header, body);
}

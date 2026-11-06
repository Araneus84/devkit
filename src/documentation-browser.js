/* Documentation is rendered as text, never as executable third-party HTML. */
let dbPack = null;
let dbQuery = '';
let dbSheet = 'python';
const DB_PACKS = new Map();
const DB_MANUALS = {
  python: {
    id: 'python-3.15',
    name: 'Python 3.15',
    filename: 'python-3.15.json',
    source: 'https://docs.python.org/3.15/',
    example: 'sorted, pathlib, exceptions',
  },
  bash: {
    id: 'bash-5.3',
    name: 'GNU Bash 5.3',
    filename: 'bash-5.3.json',
    source: 'https://www.gnu.org/software/bash/manual/',
    example: 'quoting, arrays, pipelines',
  },
};

function dbFind(text, query) {
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
        !/^[a-zA-Z0-9_./-]+\.html(?:#[a-zA-Z0-9_.-]+)?$/.test(page.path) ||
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
    'Search full ' + SHEETS[sheet].name + ' documentation',
    () => dbOpen('', sheet),
    'dk-btn primary',
  );
  button.style.marginBottom = '1rem';
  main.querySelector('.page-header')?.after(button);
}

function dbOpen(initialQuery = '', sheet = 'python') {
  dbSheet = sheet;
  dbPack = DB_PACKS.get(sheet) || null;
  dbQuery = initialQuery;
  dkStopTest();
  dkShow();
  dbRender();
}

async function dbLoadOnline(status) {
  status.textContent = 'Loading documentation…';
  try {
    const base = new URL(location.href);
    if (base.pathname.endsWith('/dist/devkit.html'))
      base.pathname = base.pathname.replace(/dist\/devkit\.html$/, '');
    else base.pathname = base.pathname.replace(/[^/]*$/, '');
    const response = await fetch(
      new URL('documentation-packs/' + DB_MANUALS[dbSheet].filename, base),
    );
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
  header.append(title, dkBtn('Close ✕', dkClose));
  root.append(header);
  const body = dkEl('div', 'dk-home');
  root.append(body);
  if (!dbPack) {
    const status = dkEl('p', 'dk-help', 'Load the manual to search its contents.');
    body.append(status);
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      body.append(dkBtn('Load online manual', () => dbLoadOnline(status), 'dk-btn primary'));
    }
    const label = dkEl('label', 'dk-help', ' Or choose a downloaded documentation pack: ');
    const input = dkEl('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.setAttribute('aria-label', 'Choose ' + SHEETS[dbSheet].name + ' documentation pack');
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
  input.setAttribute('aria-label', 'Search ' + SHEETS[dbSheet].name + ' documentation');
  input.value = dbQuery;
  body.append(input);
  const results = dkEl('div');
  body.append(results);
  function search() {
    dbQuery = input.value;
    results.replaceChildren();
    const query = dbQuery.trim().toLowerCase();
    if (!query) {
      results.append(dkEl('p', 'dk-help', `${dbPack.pages.length} manual pages ready to search.`));
      return;
    }
    const matches = dbPack.pages
      .map((page) => {
        const position = dbFind(page.text, query);
        const titleMatch = page.title.toLowerCase().includes(query);
        return { page, position, titleMatch };
      })
      .filter((item) => item.position >= 0 || item.titleMatch)
      .sort((a, b) => Number(b.titleMatch) - Number(a.titleMatch));
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
  source.href = DB_MANUALS[dbSheet].source + page.path;
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

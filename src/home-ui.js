/* ─────────────────────────────────────────
   HOME DASHBOARD — landing page with search prompt, recents, usage and categories.
───────────────────────────────────────── */
function dkGreeting() {
  const h = new Date().getHours();
  return h < 5
    ? 'Working late'
    : h < 12
      ? 'Good morning'
      : h < 18
        ? 'Good afternoon'
        : 'Good evening';
}

function dkTimeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
}

function dkSheetTile(key, sectionId, sub) {
  const sheet = SHEETS[key];
  if (!sheet) return '';
  const cat = dkCategoryOf(key);
  const section = sectionId ? sheet.sections.find((s) => s.id === sectionId) : null;
  return `<button type="button" class="hm-tile" style="--cat:${cat ? cat.hue : 'var(--accent)'}" data-sheet="${key}" onclick="setSheet('${key}', ${section ? `'${section.id}'` : 'null'}, this)">
    <span class="hm-tile-icon">${sheet.icon}</span>
    <span class="hm-tile-text">
      <strong>${escapeHTML(sheet.name)}</strong>
      <small>${escapeHTML(section ? section.title : sub || (cat ? cat.name : ''))}</small>
    </span>
  </button>`;
}

function dkCommandRow(cmd, meta) {
  return `<div class="hm-cmd">
    <code title="${escapeAttr(cmd)}">${escapeHTML(cmd)}</code>
    <span class="hm-cmd-meta">${escapeHTML(meta)}</span>
    <button type="button" class="mini-btn copy" onclick="copyCmd(this, '${escapeAttr(cmd)}')" title="Copy command">Copy</button>
  </div>`;
}

function dkCommandLocation() {
  const map = new Map();
  for (const [key, sheet] of Object.entries(SHEETS))
    for (const section of sheet.sections)
      for (const c of section.cmds) if (!map.has(c.cmd)) map.set(c.cmd, key);
  return map;
}

function renderHome() {
  const main = document.getElementById('main');
  const cats = dkCategoryList();
  const sheetKeys = Object.keys(SHEETS);
  const totalCmds = sheetKeys.reduce((n, k) => n + dkSheetCommandCount(k), 0);
  const recipes = typeof DK_RECIPES === 'object' ? Object.keys(DK_RECIPES).length : 0;
  const where = dkCommandLocation();

  const recents = state.recentSheets.filter((r) => SHEETS[r.sheet]).slice(0, 6);
  const pinned = [...state.pinnedSheets].filter((k) => SHEETS[k]);
  const visited = Object.entries(state.sheetVisits)
    .filter(([k]) => SHEETS[k])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k);
  const used = Object.entries(state.cmdUse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const copied = state.history.slice(0, 5);
  const favs = [...state.favorites]
    .map((id) => {
      const [k, ...rest] = id.split('::');
      return SHEETS[k] ? { key: k, cmd: rest.join('::') } : null;
    })
    .filter(Boolean)
    .slice(0, 5);
  const runbooks = SHEETS.runbooks
    ? SHEETS.runbooks.sections.filter((s) => !s.id.startsWith('dk-guide') && s.id !== 'rb-quick')
    : [];

  let html = `<div class="home">
  <section class="hm-hero">
    <div class="hm-hero-text">
      <p class="hm-eyebrow">${dkGreeting()}, Alex</p>
      <h1>What are you trying to do?</h1>
      <p class="hm-lede">${sheetKeys.length} cheatsheets, ${totalCmds.toLocaleString()} commands, guided builders and runbooks. Search by intent, or jump straight in.</p>
    </div>
    <form class="hm-ask" onsubmit="return dkHomeAsk(event)">
      <span class="hm-ask-icon" aria-hidden="true">⌕</span>
      <input id="home-ask" type="text" placeholder="e.g. why is DNS failing for one host" aria-label="Search all tools by intent" autocomplete="off" spellcheck="false" />
      <button type="submit" class="hm-ask-go">Search</button>
    </form>
    <div class="hm-chips" role="list" aria-label="Quick searches">
      ${DK_INTENTS.map((t) => `<button type="button" role="listitem" class="hm-chip" onclick="usSetQuery('${escapeAttr(t)}')">${escapeHTML(t)}</button>`).join('')}
    </div>
  </section>

  <section class="hm-stats" aria-label="Library at a glance">
    <div class="hm-stat"><strong>${sheetKeys.length}</strong><span>cheatsheets</span></div>
    <div class="hm-stat"><strong>${totalCmds.toLocaleString()}</strong><span>commands</span></div>
    <div class="hm-stat"><strong>${Object.keys(BUILDERS).length}</strong><span>guided builders</span></div>
    <div class="hm-stat"><strong>${recipes}</strong><span>recipes</span></div>
    <div class="hm-stat"><strong>${state.favorites.size}</strong><span>favorites</span></div>
  </section>`;

  const jump = recents.length
    ? recents.map((r) => dkSheetTile(r.sheet, r.section, dkTimeAgo(r.time))).join('')
    : '';
  html += `<div class="hm-cols">
    <section class="hm-card">
      <header><h2>Jump back in</h2></header>
      ${jump ? `<div class="hm-tiles">${jump}</div>` : '<p class="hm-empty">Sheets you open show up here so you can get back in one click.</p>'}
      ${pinned.length ? `<h3 class="hm-sub">Pinned</h3><div class="hm-tiles">${pinned.map((k) => dkSheetTile(k)).join('')}</div>` : '<p class="hm-hint">Tip: hit ★ next to any sheet in the sidebar to pin it here.</p>'}
    </section>
    <section class="hm-card">
      <header><h2>${used.length ? 'Most used commands' : 'Your commands'}</h2></header>
      ${
        used.length
          ? used
              .map(([cmd, n]) =>
                dkCommandRow(
                  cmd,
                  (where.has(cmd) ? SHEETS[where.get(cmd)].name + ' · ' : '') + n + '×',
                ),
              )
              .join('')
          : '<p class="hm-empty">Copy a command and your most used ones are ranked here.</p>'
      }
      ${copied.length ? `<h3 class="hm-sub">Recently copied</h3>${copied.map((h) => dkCommandRow(h.cmd, dkTimeAgo(h.time))).join('')}` : ''}
      ${favs.length ? `<h3 class="hm-sub">Favorites</h3>${favs.map((f) => dkCommandRow(f.cmd, SHEETS[f.key].name)).join('')}` : ''}
    </section>
  </div>`;

  if (visited.length > 1) {
    html += `<section class="hm-card hm-wide"><header><h2>Your most visited</h2></header><div class="hm-tiles">${visited.map((k) => dkSheetTile(k)).join('')}</div></section>`;
  }

  if (runbooks.length) {
    html += `<section class="hm-card hm-wide hm-fire" style="--cat:#ff7a45">
      <header><h2>Something broken? Start a runbook</h2><button type="button" class="hm-link" onclick="setSheet('runbooks', null, this)">All runbooks →</button></header>
      <div class="hm-chips">${runbooks
        .slice(0, 12)
        .map(
          (s) =>
            `<button type="button" class="hm-chip hm-chip-fire" onclick="setSheet('runbooks', '${s.id}', this)">${escapeHTML(s.title)}</button>`,
        )
        .join('')}</div>
    </section>`;
  }

  html += '<h2 class="hm-heading">Browse by category</h2><div class="hm-cats">';
  cats.forEach((cat) => {
    const count = cat.sheets.reduce((n, k) => n + dkSheetCommandCount(k), 0);
    html += `<article class="hm-cat" style="--cat:${cat.hue}" data-cat="${cat.id}">
      <header>
        <span class="hm-cat-icon">${cat.icon}</span>
        <div><h3>${escapeHTML(cat.name)}</h3><p>${escapeHTML(cat.blurb)}</p></div>
      </header>
      <div class="hm-cat-meta">${cat.sheets.length} sheet${cat.sheets.length === 1 ? '' : 's'} · ${count.toLocaleString()} commands</div>
      <div class="hm-cat-sheets">
        ${cat.sheets.map((k) => `<button type="button" class="hm-sheet" data-sheet="${k}" onclick="setSheet('${k}', null, this)"><span>${SHEETS[k].icon}</span>${escapeHTML(SHEETS[k].name)}</button>`).join('')}
      </div>
    </article>`;
  });
  html += '</div></div>';

  main.innerHTML = html;
  updateStatusCount(totalCmds, 'Home', 'command');
}

function dkHomeAsk(event) {
  event.preventDefault();
  const value = document.getElementById('home-ask').value.trim();
  if (value) usSetQuery(value);
  return false;
}

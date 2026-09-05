function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('theme-icon').textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  save('theme');
  applyTheme();
}

function highlight(text, q) {
  if (!q) return escapeHTML(text);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escapeHTML(text).replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function cmdId(sheetKey, cmd) {
  // Create a stable ID for a command across sessions
  return `${sheetKey}::${cmd}`;
}

function renderSidebar() {
  const sb = document.getElementById('sidebar');
  let html = '';

  // Special pages section
  const builderCount = Object.keys(BUILDERS).length;
  html += '<div class="sidebar-section">';
  html += '<div class="sidebar-label">Special</div>';
  html += `<div class="nav-item ${state.activeSheet === '__favorites' ? 'active' : ''}" onclick="setSheet('__favorites', null, this)">
    <span class="nav-icon">⭐</span>
    <span class="nav-label">Favorites</span>
    <span class="nav-count">${state.favorites.size}</span>
  </div>`;
  html += `<div class="nav-item ${state.activeSheet === '__builder' ? 'active' : ''}" onclick="setSheet('__builder', null, this)">
    <span class="nav-icon">⚙</span>
    <span class="nav-label">Command Builder</span>
    <span class="nav-count">${builderCount}</span>
  </div>`;
  html += '</div>';

  // Cheatsheets section — now expandable
  html += '<div class="sidebar-section">';
  html += `<div class="sidebar-label">
    <span class="label-text">Cheatsheets</span>
    <span class="label-actions">
      <button class="label-btn" onclick="expandAllSheets(event)" title="Expand all">＋</button>
      <button class="label-btn" onclick="collapseAllSheets(event)" title="Collapse all">−</button>
    </span>
  </div>`;

  for (const [key, sheet] of Object.entries(SHEETS)) {
    const cmdCount = sheet.sections.reduce((sum, s) => sum + s.cmds.length, 0);
    const isActive = state.activeSheet === key;
    const isExpanded = state.expandedSheets.has(key);

    html += `<div class="nav-group">
      <div class="nav-toggle ${isActive ? 'has-active' : ''} ${isExpanded ? 'expanded' : ''}" onclick="toggleSheetExpand('${key}', event)">
        <span class="chevron">▶</span>
        <span class="nav-icon">${sheet.icon}</span>
        <span class="nav-label">${sheet.name}</span>
        <span class="nav-count">${cmdCount}</span>
      </div>
      <div class="nav-sub">
        <div class="nav-sub-item all-sections ${isActive && !state.activeSection ? 'active' : ''}" onclick="setSheet('${key}', null, this)">
          <span class="sub-label">All sections</span>
          <span class="sub-count">${cmdCount}</span>
        </div>`;

    sheet.sections.forEach(section => {
      const secActive = isActive && state.activeSection === section.id;
      html += `<div class="nav-sub-item ${secActive ? 'active' : ''}" onclick="setSheet('${key}', '${section.id}', this)">
        <span class="sub-dot" style="background:${section.color}"></span>
        <span class="sub-label">${section.title}</span>
        <span class="sub-count">${section.cmds.length}</span>
      </div>`;
    });

    html += `</div>
    </div>`;
  }
  html += '</div>';

  sb.innerHTML = html;
}

function toggleSheetExpand(key, event) {
  event.stopPropagation();
  if (state.expandedSheets.has(key)) {
    state.expandedSheets.delete(key);
  } else {
    state.expandedSheets.add(key);
  }
  save('expandedSheets');
  renderSidebar();
}

function expandAllSheets(event) {
  if (event) event.stopPropagation();
  Object.keys(SHEETS).forEach(key => state.expandedSheets.add(key));
  save('expandedSheets');
  renderSidebar();
}

function collapseAllSheets(event) {
  if (event) event.stopPropagation();
  state.expandedSheets.clear();
  save('expandedSheets');
  renderSidebar();
}

function setSheet(key, sectionId, navElement) {
  const isSameSheet = state.activeSheet === key && state.activeSection === sectionId;

  // Double-click on active item scrolls to top
  if (isSameSheet) {
    const main = document.getElementById('main');
    main.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  state.activeSheet = key;
  state.activeSection = sectionId || null;
  state.searchQuery = '';
  document.getElementById('search').value = '';

  // Expand the sheet if not already expanded (only for real sheets)
  const specialPages = ['__favorites', '__builder'];
  if (!specialPages.includes(key) && !state.expandedSheets.has(key)) {
    state.expandedSheets.add(key);
    save('expandedSheets');
  }

  save('activeSheet');
  save('activeSection');
  renderSidebar();
  renderMain();

  // Scroll main to top when changing sheet/section
  document.getElementById('main').scrollTop = 0;
  toggleMobileNav(false);
}

function toggleMobileNav(force) {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (!sidebar || !backdrop || !window.matchMedia('(max-width: 768px)').matches) return;
  const open = force === undefined ? !sidebar.classList.contains('mobile-open') : force;
  sidebar.classList.toggle('mobile-open', open);
  backdrop.classList.toggle('open', open);
}

function renderMain() {
  const main = document.getElementById('main');
  const q = state.searchQuery.toLowerCase();

  if (q) { renderSearchResults(q); return; }

  if (state.activeSheet === '__favorites') {
    renderFavorites(q);
  } else if (state.activeSheet === '__builder') {
    renderBuilderPage(q);
  } else {
    renderSheet(state.activeSheet, q);
  }
}

function renderSearchResults(q) {
  const main = document.getElementById('main');
  let total = 0;
  let html = `<div class="page-header"><div class="page-icon" style="background:#4f8ef720;color:var(--accent);border:1px solid var(--accent-dim)">🔍</div><div class="page-title-block"><div class="page-title">Search results</div><div class="page-subtitle">Matches across every cheatsheet</div></div><div class="page-meta" id="search-result-count"></div></div>`;
  for (const [sheetKey, sheet] of Object.entries(SHEETS)) {
    let group = '';
    let groupTotal = 0;
    sheet.sections.forEach(section => {
      const matches = section.cmds.filter(c => `${sheet.name} ${section.title} ${c.cmd} ${c.desc} ${c.platform || ''}`.toLowerCase().includes(q));
      if (matches.length) { group += renderSectionHTML(sheetKey, section, matches, q); groupTotal += matches.length; }
    });
    if (groupTotal) {
      total += groupTotal;
      html += `<div class="page-header" style="margin-top:22px"><div class="page-icon" style="background:${sheet.iconBg}20;color:${sheet.iconBg};border:1px solid ${sheet.iconBg}40">${sheet.icon}</div><div class="page-title-block"><div class="page-title">${escapeHTML(sheet.name)}</div><div class="page-subtitle">${groupTotal} matching command${groupTotal === 1 ? '' : 's'}</div></div></div>${group}`;
    }
  }
  if (!total) html += '<div class="empty"><div class="empty-icon">🔍</div><p><strong>No commands match your search.</strong><br>Try a tool, distro, flag, or command name.</p></div>';
  main.innerHTML = html;
  const count = document.getElementById('search-result-count');
  if (count) count.textContent = `${total} result${total === 1 ? '' : 's'}`;
  updateStatusCount(total, 'Search');
}

function renderSheet(key, q) {
  const sheet = SHEETS[key];
  if (!sheet) return;

  // Filter to a single section if one is active
  const sectionsToShow = state.activeSection
    ? sheet.sections.filter(s => s.id === state.activeSection)
    : sheet.sections;

  const activeSec = state.activeSection ? sheet.sections.find(s => s.id === state.activeSection) : null;
  const subtitleText = activeSec ? `${sheet.name} · ${activeSec.title}` : sheet.subtitle;

  const main = document.getElementById('main');
  let html = `
    <div class="page-header">
      <div class="page-icon" style="background:${sheet.iconBg}20;color:${sheet.iconBg};border:1px solid ${sheet.iconBg}40">${sheet.icon}</div>
      <div class="page-title-block">
        <div class="page-title">${activeSec ? activeSec.title : sheet.name}</div>
        <div class="page-subtitle">${subtitleText}</div>
      </div>
      <div class="page-meta">${sheet.meta}</div>
    </div>
  `;

  if (key === 'linux' && !state.activeSection) {
    html += `
      <div class="section-header" style="margin-top:-8px"><div class="section-dot" style="background:#fcc624"></div><div class="section-title">Package manager translator</div><div class="section-badge">Quick reference</div></div>
      <div class="distro-translator" aria-label="Package manager command translation">
        <div class="distro-head">What you want to do</div><div class="distro-head">Ubuntu / Debian</div><div class="distro-head">Arch / CachyOS</div><div class="distro-head">Fedora / RHEL</div>
        <div class="distro-action">Update everything</div><div class="distro-command">apt update && apt upgrade</div><div class="distro-command">pacman -Syu</div><div class="distro-command">dnf upgrade --refresh</div>
        <div class="distro-action">Install a package</div><div class="distro-command">apt install package</div><div class="distro-command">pacman -S package</div><div class="distro-command">dnf install package</div>
        <div class="distro-action">Search packages</div><div class="distro-command">apt search keyword</div><div class="distro-command">pacman -Ss keyword</div><div class="distro-command">dnf search keyword</div>
        <div class="distro-action">Remove a package</div><div class="distro-command">apt remove package</div><div class="distro-command">pacman -Rns package</div><div class="distro-command">dnf remove package</div>
        <div class="distro-action">AUR package</div><div class="distro-command">—</div><div class="distro-command">paru -S package</div><div class="distro-command">—</div>
      </div>`;
  }

  let totalVisible = 0;
  let sectionsHtml = '';

  sectionsToShow.forEach(section => {
    const filteredCmds = section.cmds.filter(c => {
      if (!q) return true;
      return c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || section.title.toLowerCase().includes(q);
    });

    if (!filteredCmds.length) return;
    totalVisible += filteredCmds.length;

    sectionsHtml += renderSectionHTML(key, section, filteredCmds, q);
  });

  if (totalVisible === 0) {
    sectionsHtml = `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <p><strong>No commands match your search.</strong><br>Try different keywords or clear the search.</p>
      </div>
    `;
  }

  html += sectionsHtml;
  main.innerHTML = html;
  updateStatusCount(totalVisible, sheet.name);
}

function renderSectionHTML(sheetKey, section, cmds, q) {
  let html = `<div class="section" id="section-${section.id}">
    <div class="section-header" onclick="toggleSection('${section.id}')">
      <div class="section-dot" style="background:${section.color}"></div>
      <div class="section-title">${section.title}</div>
      <div class="section-badge">${cmds.length}</div>
      <div class="section-arrow">▼</div>
    </div>
    <div class="cmd-list">`;

  cmds.forEach(c => {
    const id = cmdId(sheetKey, c.cmd);
    const isFav = state.favorites.has(id);
    const note = state.notes[id];
    const hasNote = note && note.trim().length > 0;
    const builderKey = (c._sheetKey || sheetKey) + '::' + c.cmd;
    const hasBuilder = BUILDERS[builderKey] !== undefined;
    const safety = getSafetyHint(c.cmd);

    const classes = ['cmd-item'];
    if (sheetKey === 'ansible') classes.push('an-reference');
    if (isFav) classes.push('is-favorite');
    if (hasNote) classes.push('has-note');
    if (hasBuilder) classes.push('has-builder');

    html += `
      <div class="${classes.join(' ')}" data-id="${escapeHTML(id)}">
        <div class="cmd-body">
          <code>${q ? highlight(c.cmd, q) : sheetKey === 'ansible' ? escapeHTML(c.cmd) : syntaxHighlight(c.cmd)}</code>
          <div class="cmd-desc">${highlight(c.desc, q)}</div>
          ${(c.platform || safety) ? `<div class="cmd-meta">${c.platform ? `<span class="cmd-tag">${escapeHTML(c.platform)}</span>` : ''}${safety ? '<span class="cmd-tag warning">Review before running</span>' : ''}</div>` : ''}
          ${safety ? `<div class="cmd-safety"><strong>Heads up:</strong> ${safety}</div>` : ''}
          ${hasNote ? `<div class="cmd-note">${escapeHTML(note)}</div>` : ''}
        </div>
        <div class="cmd-actions">
          <button class="mini-btn star ${isFav ? 'active' : ''}" onclick="toggleFavorite('${escapeAttr(id)}')" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">★</button>
          <button class="mini-btn note ${hasNote ? 'active' : ''}" onclick="openNote('${escapeAttr(id)}', this)" title="Edit note">✎</button>
          <button class="mini-btn copy" onclick="copyCmd(this, '${escapeAttr(c.cmd)}')" title="Copy command">Copy</button>
        </div>
      </div>
    `;
  });

  html += '</div></div>';
  return html;
}

function getSafetyHint(cmd) {
  const s = cmd.toLowerCase();
  if (/\b(rm\s+-[a-z]*r|shred|mkfs|dd\s+if=|wipefs)\b/.test(s)) return 'This can permanently remove data. Verify the target and use a dry run or backup where available.';
  if (/\b(apt|pacman|paru|dnf|yum)\s+.*\b(remove|erase|autoremove|rns)\b/.test(s)) return 'This may remove packages and dependencies. Review the transaction before confirming.';
  if (/\b(mir|purge|--force|-f)\b/.test(s)) return 'This command can make broad or irreversible changes. Confirm its scope before running it.';
  return '';
}

function escapeAttr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderBuilderPage(q) {
  const main = document.getElementById('main');

  // First visit: render the static shell (header + search box + results container)
  // Subsequent calls from search: only update the results container
  if (!document.getElementById('builder-results')) {
    main.innerHTML = `
      <div class="page-header">
        <div class="page-icon" style="background:#4f8ef720;color:var(--accent);border:1px solid var(--accent-dim)">⚙</div>
        <div class="page-title-block">
          <div class="page-title">Command Builder</div>
          <div class="page-subtitle">Build complex commands interactively — pick flags, set values, copy the result</div>
        </div>
        <div class="page-meta" id="builder-result-count"></div>
      </div>
      <div class="builder-page-search-wrap" style="position:relative;margin-bottom:20px">
        <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none">🔍</span>
        <input id="builder-page-input" class="builder-page-search"
          placeholder="Search builders by command or tool..."
          style="padding-left:36px" autocomplete="off" spellcheck="false">
      </div>
      <div id="builder-results"></div>
    `;

    // Attach the input listener once — update only the results, never recreate the input
    const input = document.getElementById('builder-page-input');
    input.addEventListener('input', function() {
      renderBuilderResults(this.value.toLowerCase().trim());
    });
    input.focus();
  }

  // Render results (called on first load and on every keystroke)
  renderBuilderResults(q);
}

function renderBuilderResults(q) {
  const container = document.getElementById('builder-results');
  const countEl   = document.getElementById('builder-result-count');
  if (!container) return;

  // Group builders by sheet, filtered by q
  const grouped = {};
  Object.entries(BUILDERS).forEach(([key, def]) => {
    const sheetKey = key.split('::')[0];
    const sheet = SHEETS[sheetKey];
    if (!sheet) return;
    const matchesQ = !q ||
      def.name.toLowerCase().includes(q) ||
      def.description.toLowerCase().includes(q) ||
      sheet.name.toLowerCase().includes(q);
    if (!matchesQ) return;
    if (!grouped[sheetKey]) grouped[sheetKey] = { sheet, items: [] };
    grouped[sheetKey].items.push({ key, def });
  });

  const totalVisible = Object.values(grouped).reduce((a, g) => a + g.items.length, 0);
  if (countEl) countEl.textContent = totalVisible + ' builders';
  updateStatusCount(totalVisible, 'Command Builder');

  if (totalVisible === 0) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚙</div><p><strong>No builders match your search.</strong></p></div>`;
    return;
  }

  let html = '';
  Object.entries(grouped).forEach(([sheetKey, group]) => {
    const { sheet, items } = group;
    html += `
      <div class="builder-group">
        <div class="builder-group-header">
          <div class="builder-group-icon" style="background:${sheet.iconBg}22;color:${sheet.iconBg};border:1px solid ${sheet.iconBg}44">${sheet.icon}</div>
          <span class="builder-group-name">${sheet.name}</span>
          <span class="builder-group-count">${items.length}</span>
        </div>
        <div class="builder-cards">`;

    items.forEach(({ key, def }) => {
      const flagCount = (def.flags || []).filter(f => !f.hidden).length;
      const argCount  = (def.args  || []).filter(a => a.required !== false).length;
      html += `
        <div class="builder-card" style="--card-accent:${sheet.iconBg}" onclick="openBuilder('${escapeAttr(key)}')">
          <div class="builder-card-name">${escapeHTML(def.name)}</div>
          <div class="builder-card-desc">${escapeHTML(def.description)}</div>
          <div class="builder-card-meta">
            ${flagCount ? `<span class="builder-card-flags">⚑ ${flagCount} flags</span>` : ''}
            ${argCount  ? `<span class="builder-card-flags">◈ ${argCount} inputs</span>` : ''}
            <span class="builder-card-open">Open →</span>
          </div>
        </div>`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}

function renderFavorites(q) {
  const main = document.getElementById('main');
  let html = `
    <div class="page-header">
      <div class="page-icon" style="background:#f7c94820;color:#f7c948;border:1px solid #f7c94840">⭐</div>
      <div class="page-title-block">
        <div class="page-title">Favorites</div>
        <div class="page-subtitle">Your starred commands across all sheets</div>
      </div>
      <div class="page-meta">${state.favorites.size} pinned</div>
    </div>
  `;

  if (state.favorites.size === 0) {
    html += `
      <div class="empty">
        <div class="empty-icon">⭐</div>
        <p><strong>No favorites yet.</strong><br>Click the star icon on any command to pin it here.</p>
      </div>
    `;
    main.innerHTML = html;
    updateStatusCount(0, 'Favorites');
    return;
  }

  // Group favorites by sheet
  const grouped = {};
  for (const favId of state.favorites) {
    const [sheetKey, ...cmdParts] = favId.split('::');
    const cmd = cmdParts.join('::');
    if (!SHEETS[sheetKey]) continue;

    // Find the command and its section
    let found = null;
    for (const section of SHEETS[sheetKey].sections) {
      const c = section.cmds.find(c => c.cmd === cmd);
      if (c) {
        found = { sheet: SHEETS[sheetKey], section, cmd: c };
        break;
      }
    }
    if (!found) continue;

    if (q && !found.cmd.cmd.toLowerCase().includes(q) && !found.cmd.desc.toLowerCase().includes(q)) continue;

    if (!grouped[sheetKey]) grouped[sheetKey] = { sheet: found.sheet, cmds: [] };
    grouped[sheetKey].cmds.push({ ...found.cmd, _section: found.section, _sheetKey: sheetKey });
  }

  let total = 0;
  for (const [sheetKey, group] of Object.entries(grouped)) {
    total += group.cmds.length;
    html += renderSectionHTML(sheetKey, {
      id: `fav-${sheetKey}`,
      title: `${group.sheet.name} · ${group.cmds.length}`,
      color: group.sheet.iconBg,
    }, group.cmds, q);
  }

  if (total === 0) {
    html += `
      <div class="empty">
        <div class="empty-icon">🔍</div>
        <p><strong>No favorites match your search.</strong></p>
      </div>
    `;
  }

  main.innerHTML = html;
  updateStatusCount(total, 'Favorites');
}

function updateStatusCount(count, name) {
  document.getElementById('status-name').textContent = name;
  document.getElementById('status-counts').textContent = `${count} command${count === 1 ? '' : 's'}`;
}

function toggleSection(id) {
  const el = document.getElementById('section-' + id);
  if (el) el.classList.toggle('collapsed');
}

/* ─────────────────────────────────────────
   FAVORITES
───────────────────────────────────────── */
function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  save('favorites');
  renderSidebar();
  renderMain();
}


/* ─────────────────────────────────────────
   NOTES
───────────────────────────────────────── */
function openNote(id) {
  state.currentNoteId = id;
  const [sheetKey, ...cmdParts] = id.split('::');
  const cmd = cmdParts.join('::');
  document.getElementById('note-modal-cmd').textContent = cmd;
  document.getElementById('note-modal-text').value = state.notes[id] || '';
  document.getElementById('note-modal').classList.add('open');
  setTimeout(() => document.getElementById('note-modal-text').focus(), 50);
}

function closeModal() {
  document.getElementById('note-modal').classList.remove('open');
  state.currentNoteId = null;
}

function saveNote() {
  const text = document.getElementById('note-modal-text').value.trim();
  if (text) {
    state.notes[state.currentNoteId] = text;
  } else {
    delete state.notes[state.currentNoteId];
  }
  save('notes');
  closeModal();
  renderMain();
}

function deleteNote() {
  delete state.notes[state.currentNoteId];
  save('notes');
  closeModal();
  renderMain();
}

/* ─────────────────────────────────────────
   COMMAND BUILDER
───────────────────────────────────────── */
let currentBuilder = null;

function openBuilder(builderKey) {
  const def = BUILDERS[builderKey];
  if (!def) return;
  currentBuilder = { def, values: {}, flags: {}, flagValues: {} };

  // Set defaults
  (def.args || []).forEach(a => {
    currentBuilder.values[a.key] = a.default || '';
  });
  (def.flags || []).forEach(f => {
    currentBuilder.flags[f.flag] = f.alwaysOn || false;
    if (f.valueDefault) currentBuilder.flagValues[f.flag] = f.valueDefault;
  });

  document.getElementById('builder-title').textContent = def.name;
  document.getElementById('builder-sub').textContent = def.description;
  renderBuilderBody(def);
  updateBuilderPreview();
  document.getElementById('builder-modal').classList.add('open');
  if (typeof ceFocusRequest === 'function') ceFocusRequest('sx-command-preview');
}

function closeBuilder() {
  document.getElementById('builder-modal').classList.remove('open');
  currentBuilder = null;
}

function resetBuilder() {
  if (!currentBuilder) return;
  const def = currentBuilder.def;
  currentBuilder.values = {};
  currentBuilder.flags = {};
  currentBuilder.flagValues = {};
  (def.args || []).forEach(a => { currentBuilder.values[a.key] = a.default || ''; });
  (def.flags || []).forEach(f => {
    currentBuilder.flags[f.flag] = f.alwaysOn || false;
    if (f.valueDefault) currentBuilder.flagValues[f.flag] = f.valueDefault;
  });
  renderBuilderBody(def);
  updateBuilderPreview();
}

function renderBuilderBody(def) {
  const body = document.getElementById('builder-body');
  let html = '';

  // Required args section
  const reqArgs = (def.args || []).filter(a => a.required !== false);
  if (reqArgs.length) {
    html += `<div class="builder-section">
      <div class="builder-section-title required-section">Required fields</div>`;
    (def.args || []).forEach(a => {
      const val = currentBuilder.values[a.key] || '';
      if (a.type === 'select') {
        html += `<div class="builder-input-row">
          <span class="builder-input-label">${a.label}</span>
          <select onchange="builderArgChange('${escapeAttr(a.key)}', this.value)" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:5px 8px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:11.5px;outline:none;">
            ${(a.options || []).map(o => `<option value="${escapeHTML(o.value)}" ${val === o.value ? 'selected' : ''}>${escapeHTML(o.label)}</option>`).join('')}
          </select>
        </div>`;
      } else {
        html += `<div class="builder-input-row">
          <span class="builder-input-label">${a.label}${a.required ? ' *' : ''}</span>
          <input type="text" placeholder="${escapeHTML(a.placeholder || '')}"
            value="${escapeHTML(val)}"
            oninput="builderArgChange('${escapeAttr(a.key)}', this.value)"
          />
          ${a.required ? '' : '<span class="builder-input-hint">optional</span>'}
        </div>`;
      }
    });
    html += `</div>`;
  }

  // Optional args section
  const optArgs = (def.args || []).filter(a => a.required === false);
  if (optArgs.length) {
    html += `<div class="builder-section">
      <div class="builder-section-title">Optional arguments</div>`;
    optArgs.forEach(a => {
      const val = currentBuilder.values[a.key] || '';
      html += `<div class="builder-input-row">
        <span class="builder-input-label">${a.label}</span>
        <input type="text" placeholder="${escapeHTML(a.placeholder || '')}"
          value="${escapeHTML(val)}"
          oninput="builderArgChange('${escapeAttr(a.key)}', this.value)"
        />
        <span class="builder-input-hint">optional</span>
      </div>`;
    });
    html += `</div>`;
  }

  // Flags section
  const visibleFlags = (def.flags || []).filter(f => !f.hidden);
  if (visibleFlags.length) {
    html += `<div class="builder-section">
      <div class="builder-section-title">Options & flags</div>`;
    visibleFlags.forEach(f => {
      const checked = currentBuilder.flags[f.flag] || false;
      const fval = currentBuilder.flagValues[f.flag] || f.valueDefault || '';
      const esc = escapeAttr(f.flag);
      html += `
        <label class="builder-flag ${checked ? 'checked' : ''}" for="flag-${escapeHTML(f.flag.replace(/[^a-zA-Z0-9]/g,''))}">
          <input type="checkbox" id="flag-${escapeHTML(f.flag.replace(/[^a-zA-Z0-9]/g,''))}"
            ${checked ? 'checked' : ''}
            onchange="builderFlagToggle('${esc}', this.checked)"
          />
          <div class="builder-flag-body">
            <div class="builder-flag-name">${escapeHTML(f.flag)}</div>
            <div class="builder-flag-desc">${escapeHTML(f.desc)}</div>
            ${f.valuePrompt ? `
              <div class="builder-flag-value-input">
                <label>${escapeHTML(f.valuePrompt)}</label>
                <input type="text" placeholder="${escapeHTML(f.valueDefault || '')}"
                  value="${escapeHTML(fval)}"
                  oninput="builderFlagValueChange('${esc}', this.value)"
                  onclick="event.stopPropagation()"
                />
              </div>
            ` : ''}
          </div>
        </label>`;
    });
    html += `</div>`;
  }

  body.innerHTML = html;
}

function builderArgChange(key, value) {
  if (!currentBuilder) return;
  currentBuilder.values[key] = value;
  updateBuilderPreview();
}

function builderFlagToggle(flag, checked) {
  if (!currentBuilder) return;
  currentBuilder.flags[flag] = checked;
  // Re-render just the label class without full re-render for performance
  const id = 'flag-' + flag.replace(/[^a-zA-Z0-9]/g, '');
  const el = document.getElementById(id);
  if (el) el.closest('.builder-flag').classList.toggle('checked', checked);
  updateBuilderPreview();
}

function builderFlagValueChange(flag, value) {
  if (!currentBuilder) return;
  currentBuilder.flagValues[flag] = value;
  updateBuilderPreview();
}

function buildCommandString() {
  if (!currentBuilder) return '';
  const { def, values, flags, flagValues } = currentBuilder;

  let parts = [def.base];

  // Args: required positional args that come before flags
  const preArgs = [];
  const postArgs = [];
  (def.args || []).forEach((a, i) => {
    const v = (values[a.key] || '').trim();
    if (!v && a.required === false) return;
    const val = v || (a.placeholder || a.key);
    // Most CLIs have positional args before flags but some after
    if (def.argsAfterFlags) postArgs.push(a.quote ? `"${val}"` : val);
    else preArgs.push(a.quote ? `"${val}"` : val);
  });

  parts = parts.concat(preArgs);

  // Separate filter-mode flags (tcpdump expression) from regular flags
  const regularFlags = [];
  const filterFlags = [];

  (def.flags || []).forEach(f => {
    if (!flags[f.flag] && !f.alwaysOn) return;
    const fval = (flagValues[f.flag] || f.valueDefault || '').trim();
    const flagStr = f.join !== undefined
      ? (fval ? `${f.flag}${f.join}${f.quote ? `"${fval}"` : fval}` : f.flag)
      : f.flag;

    if (f.filterMode) filterFlags.push(flagStr);
    else regularFlags.push(flagStr);
  });

  parts = parts.concat(regularFlags);
  parts = parts.concat(postArgs);

  // Add filter expression if any (tcpdump style — space separated)
  if (filterFlags.length) parts.push(filterFlags.join(' and '));

  return parts.filter(Boolean).join(' ');
}

function updateBuilderPreview() {
  const cmd = buildCommandString();
  const previewEl = document.getElementById('builder-preview-text');
  if (!previewEl) return;

  // Colorize the preview
  const { def } = currentBuilder;
  const baseParts = def.base.split(' ');
  let colored = baseParts.map(p => `<span style="color:var(--accent);font-weight:600">${escapeHTML(p)}</span>`).join(' ');

  // Get everything after the base command
  const afterBase = cmd.slice(def.base.length).trim();
  if (afterBase) {
    const tokens = afterBase.split(' ');
    const coloredTokens = tokens.map(t => {
      if (t.startsWith('-')) return `<span style="color:var(--cyan)">${escapeHTML(t)}</span>`;
      if (t.startsWith('"') || t.startsWith("'")) return `<span style="color:#b8d490">${escapeHTML(t)}</span>`;
      return `<span style="color:var(--text2)">${escapeHTML(t)}</span>`;
    });
    colored += ' ' + coloredTokens.join(' ');
  }

  previewEl.innerHTML = colored || '<span style="color:var(--text3)">Start filling in options above...</span>';
}

function copyBuiltCommand() {
  const cmd = buildCommandString();
  if (!cmd) return;
  const btn = document.querySelector('#builder-modal .btn.primary');
  const orig = btn.textContent;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(cmd).then(() => {
      addToHistory(cmd);
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
  } else {
    fallbackCopy(cmd);
    addToHistory(cmd);
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  }
}



/* ─────────────────────────────────────────
   COPY & HISTORY
───────────────────────────────────────── */
function copyCmd(btn, text) {
  const finalText = text.replace(/\\'/g, "'").replace(/\\\\/g, '\\').replace(/\\n/g, '\n');

  const doCopy = () => {
    btn.textContent = '✓';
    btn.classList.add('ok');
    addToHistory(finalText);
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 1500);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(finalText).then(doCopy).catch(() => {
      // Fall back
      fallbackCopy(finalText);
      doCopy();
    });
  } else {
    fallbackCopy(finalText);
    doCopy();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

function addToHistory(cmd) {
  // Remove duplicates
  state.history = state.history.filter(h => h.cmd !== cmd);
  state.history.unshift({ cmd: cmd, time: Date.now() });
  // Keep last 50
  if (state.history.length > 50) state.history = state.history.slice(0, 50);
  save('history');
  updateHistoryBadge();
  if (document.getElementById('history-panel').classList.contains('open')) {
    renderHistory();
  }
}

function updateHistoryBadge() {
  const badge = document.getElementById('history-badge');
  if (state.history.length > 0) {
    badge.style.display = 'block';
    badge.textContent = state.history.length > 99 ? '99+' : state.history.length;
  } else {
    badge.style.display = 'none';
  }
}

function renderHistory() {
  const body = document.getElementById('history-body');
  if (state.history.length === 0) {
    body.innerHTML = '<div class="history-empty">No commands copied yet.<br>Copied commands will appear here.</div>';
    return;
  }

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  };

  body.innerHTML = state.history.map((h, i) => `
    <div class="history-item" onclick="copyFromHistory(${i})">
      <div class="history-cmd">${escapeHTML(h.cmd)}</div>
      <div class="history-meta">
        <span>${formatTime(h.time)}</span>
        <span>·</span>
        <span>click to copy again</span>
      </div>
    </div>
  `).join('');
}

function copyFromHistory(i) {
  const item = state.history[i];
  if (!item) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(item.cmd).catch(() => fallbackCopy(item.cmd));
  } else {
    fallbackCopy(item.cmd);
  }
  // Move to top
  state.history.splice(i, 1);
  state.history.unshift({ ...item, time: Date.now() });
  save('history');
  renderHistory();
}

function clearHistory() {
  if (confirm('Clear all copy history? This cannot be undone.')) {
    state.history = [];
    save('history');
    renderHistory();
    updateHistoryBadge();
  }
}

function togglePanel(name) {
  if (name === 'history') {
    const panel = document.getElementById('history-panel');
    const btn = document.getElementById('history-btn');
    const wasOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !wasOpen);
    if (btn) btn.classList.toggle('active', !wasOpen);
    if (!wasOpen) renderHistory();
  }
}

/* ─────────────────────────────────────────
   SEARCH & KEYBOARD
───────────────────────────────────────── */
document.getElementById('search').addEventListener('input', function() {
  state.searchQuery = this.value.trim();
  renderMain();
});

document.addEventListener('keydown', function(e) {
  // Cmd/Ctrl + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const s = document.getElementById('search');
    s.focus();
    s.select();
  }
  // Cmd/Ctrl + B to toggle sidebar (on desktop)
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    const sb = document.getElementById('sidebar');
    sb.style.display = sb.style.display === 'none' ? '' : 'none';
  }
  // Escape closes things
  if (e.key === 'Escape') {
    const builder = document.getElementById('builder-modal');
    if (builder.classList.contains('open')) { closeBuilder(); return; }
    const modal = document.getElementById('note-modal');
    if (modal.classList.contains('open')) { closeModal(); return; }
    const panel = document.getElementById('history-panel');
    if (panel.classList.contains('open')) { togglePanel('history'); return; }
    const s = document.getElementById('search');
    if (document.activeElement === s) {
      s.value = '';
      state.searchQuery = '';
      renderMain();
      s.blur();
    }
  }
  // Cmd/Ctrl + Enter to save note when modal open
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const modal = document.getElementById('note-modal');
    if (modal.classList.contains('open')) {
      e.preventDefault();
      saveNote();
    }
  }
});

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
// Validate stored state — clear activeSection if it doesn't belong to activeSheet
if (state.activeSection && SHEETS[state.activeSheet]) {
  const validSection = SHEETS[state.activeSheet].sections.some(s => s.id === state.activeSection);
  if (!validSection) {
    state.activeSection = null;
    save('activeSection');
  }
}
// If activeSheet no longer exists in SHEETS, reset
if (!['__favorites','__builder'].includes(state.activeSheet) && !SHEETS[state.activeSheet]) {
  state.activeSheet = 'gam7';
  state.activeSection = null;
  save('activeSheet');
  save('activeSection');
}

/* ─────────────────────────────────────────
   VIEW MODES
───────────────────────────────────────── */
function setView(mode) {
  state.viewMode = mode;
  save('viewMode');
  applyView();
}

function applyView() {
  document.body.setAttribute('data-view', state.viewMode);
  ['comfortable','compact','cards'].forEach(m => {
    const btn = document.getElementById('view-' + m);
    if (btn) btn.classList.toggle('active', m === state.viewMode);
  });
}

/* ─────────────────────────────────────────
   FONT SIZE
───────────────────────────────────────── */
function setFontSize(size) {
  state.fontSize = parseInt(size, 10);
  save('fontSize');
  applyFontSize();
}

function applyFontSize() {
  document.documentElement.style.setProperty('--ui-font-size', state.fontSize + 'px');
  const slider = document.getElementById('font-slider');
  if (slider) slider.value = state.fontSize;
}

/* ─────────────────────────────────────────
   SYNTAX HIGHLIGHTING
───────────────────────────────────────── */
function syntaxHighlight(cmd) {
  // Escape HTML first
  let s = cmd
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Quoted strings (single or double) — do first to avoid re-processing
  s = s.replace(/(&quot;[^&]*&quot;|'[^']*')/g,
    m => `<span class="syn-str">${m}</span>`);

  // Flags: --flag, -f, /FLAG (Windows), +flag
  s = s.replace(/(?<![a-zA-Z])(--?[a-zA-Z][\w-]*|\/[A-Z]+(?::[^\s]*)?|\+[a-zA-Z][\w-]*)/g,
    m => `<span class="syn-flag">${m}</span>`);

  // Paths and files (contains / or \ or .ext)
  s = s.replace(/(?:^|\s)((?:~|\.\.?)?\/[\w./-]+|[\w.-]+\.(?:json|yaml|yml|txt|log|sh|py|js|tf|conf|cfg|ini|pem|key|crt|pfx|csv|xml|md|gz|tar|zip))/g,
    (m, path) => m.replace(path, `<span class="syn-path">${path}</span>`));

  // Pipes, redirects, &&, ||
  s = s.replace(/(\s)(\|{1,2}|&amp;&amp;|\|\||\s&gt;\s|\s&gt;&gt;\s|\s2&gt;)(\s)/g,
    (m, a, op, b) => `${a}<span class="syn-op">${op}</span>${b}`);

  // SQL keywords
  s = s.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT INTO|UPDATE|DELETE|CREATE|DROP|ALTER|INDEX|TABLE|AS|AND|OR|NOT|IN|LIKE|IS NULL|IS NOT NULL|COUNT|SUM|AVG|MAX|MIN|DISTINCT|UNION|WITH)\b/gi,
    m => `<span class="syn-kw">${m}</span>`);

  // Numbers (standalone)
  s = s.replace(/(?<![a-zA-Z#-])(\b\d+(?:\.\d+)?\b)(?![a-zA-Z])/g,
    m => `<span class="syn-num">${m}</span>`);

  return s;
}

/* ─────────────────────────────────────────
   SIDEBAR RESIZE
───────────────────────────────────────── */
function initSidebarResize() {
  const resizer = document.getElementById('sidebar-resizer');
  const sidebar = document.getElementById('sidebar');
  if (!resizer || !sidebar) return;

  let dragging = false;
  let startX = 0;
  let startW = 0;

  resizer.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = sidebar.offsetWidth;
    resizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const newW = Math.max(160, Math.min(400, startW + e.clientX - startX));
    sidebar.style.width = newW + 'px';
    state.sidebarWidth = newW;
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    save('sidebarWidth');
  });
}

function applySidebarWidth() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.width = state.sidebarWidth + 'px';
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */

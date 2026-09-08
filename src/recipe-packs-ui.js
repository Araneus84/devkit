/* Local recipe-pack library UI. Importing or removing a pack reloads the static app. */
function rpStore(packs) {
  const normalized = rpValidateLibrary(packs);
  const text = JSON.stringify(normalized);
  if (text.length > 4000000) throw Error('Recipe-pack library exceeds 4 MB.');
  localStorage.setItem(RP_STORAGE, text);
  return normalized;
}
function rpInstall(value) {
  const pack = rpValidatePack(value),
    next = rpPacks.filter((item) => item.id !== pack.id);
  next.push(pack);
  rpStore(next);
  return pack;
}
function rpRemove(id) {
  rpStore(rpPacks.filter((pack) => pack.id !== id));
  location.reload();
}
function rpOpen() {
  dkShow();
  const root = document.getElementById('dk-root');
  root.replaceChildren();
  const header = dkEl('header', 'dk-header'),
    title = dkEl('div');
  title.append(
    dkEl('span', 'dk-eyebrow', 'DEVKIT / EXTENSIONS'),
    dkEl('h2', '', 'Recipe packs'),
    dkEl(
      'p',
      'dk-help',
      'Add JSON-only guided recipes without installing code. Packs stay in this browser and work offline.',
    ),
  );
  header.append(title, dkBtn('Close ✕', dkClose));
  root.append(header);
  const body = dkEl('div', 'dk-home');
  body.append(
    dkEl(
      'p',
      'dk-help',
      'DevKit validates IDs, modules, fields, filenames, limits and every template placeholder. The fixed interpreter supports only text substitution and named formatting filters; pack files cannot run JavaScript, add HTML, fetch URLs or execute generated commands. Review generated output before using it.',
    ),
  );
  const input = dkEl('input', 'dk-input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.setAttribute('aria-label', 'Choose recipe pack');
  const status = dkEl('p', '');
  status.setAttribute('role', 'status');
  let candidate = null;
  const install = dkBtn(
    'Import selected pack',
    () => {
      try {
        const pack = rpInstall(candidate);
        status.textContent = 'Imported ' + pack.name + '. Reloading DevKit…';
        location.reload();
      } catch (error) {
        status.textContent = error.message;
      }
    },
    'dk-btn primary',
  );
  install.disabled = true;
  input.onchange = async () => {
    candidate = null;
    install.disabled = true;
    try {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 1000000) throw Error('Use a recipe pack under 1 MB.');
      candidate = rpValidatePack(JSON.parse(await file.text()));
      status.textContent =
        candidate.name +
        ' · ' +
        candidate.recipes.length +
        ' recipe' +
        (candidate.recipes.length === 1 ? '' : 's') +
        ' · ready to import locally.';
      install.disabled = false;
    } catch (error) {
      status.textContent = error.message;
    }
  };
  const actions = dkEl('div', 'rp-actions');
  actions.append(
    install,
    dkBtn('Download example pack', () =>
      dkDownloadText(
        JSON.stringify(RP_EXAMPLE_PACK, null, 2),
        'devkit-example-recipe-pack.json',
        'application/json',
      ),
    ),
  );
  body.append(dkEl('h3', '', 'Import a data-only pack'), input, status, actions);
  if (rpWarnings.length) {
    const warning = dkEl('div', 'rp-card rp-warning');
    warning.append(
      dkEl('strong', '', 'Saved packs were not loaded'),
      dkEl('p', '', rpWarnings.join(' ')),
    );
    body.append(warning);
  }
  body.append(dkEl('h3', '', rpPacks.length ? 'Installed locally' : 'No packs installed'));
  const grid = dkEl('div', 'rp-grid');
  for (const pack of rpPacks) {
    const card = dkEl('section', 'rp-card');
    card.append(
      dkEl('h3', '', pack.name),
      dkEl('p', '', pack.description),
      dkEl(
        'code',
        '',
        pack.id +
          ' · ' +
          pack.recipes.length +
          ' recipes' +
          (pack.author ? ' · ' + pack.author : ''),
      ),
    );
    const buttons = dkEl('div', 'rp-actions');
    buttons.append(
      dkBtn('Export', () =>
        dkDownloadText(
          JSON.stringify(pack, null, 2),
          pack.id + '.recipe-pack.json',
          'application/json',
        ),
      ),
      dkBtn('Remove', () => rpRemove(pack.id)),
    );
    card.append(buttons);
    grid.append(card);
  }
  body.append(grid);
  const format = dkEl('details', 'rp-card');
  format.append(dkEl('summary', '', 'Pack format and supported filters'));
  const pre = dkEl(
    'pre',
    'rp-format',
    'Placeholders use <<part.field|filter>>. Supported filters: raw, shell, json, yaml, lines, space, csv, upper and lower. Output segments with a part key appear only when that optional block is present. Packs support the same safe field controls as built-in guided recipes.',
  );
  format.append(pre);
  body.append(format);
  root.append(body);
}
const rpPreviousHome = dkHome;
dkHome = function (sheet) {
  rpPreviousHome(sheet);
  document.querySelector('#dk-root .dk-header')?.append(dkBtn('Recipe packs', rpOpen));
};
const rpPreviousBuilder = renderBuilderPage;
renderBuilderPage = function (query) {
  rpPreviousBuilder(query);
  const header = document.querySelector('#main .page-header');
  if (header) header.append(dkBtn('Recipe packs', rpOpen, 'mini-btn'));
};
const rpHeaderButton = dkBtn('Packs', rpOpen, 'icon-btn rp-header');
rpHeaderButton.title = 'Import and manage data-only recipe packs';
document.querySelector('.header')?.append(rpHeaderButton);

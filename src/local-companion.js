/* Optional loopback companion workspace. No request is made until the user connects or runs an action. */
const LC_SESSION = 'devkit:local-companion:v1';
let lcConnection = null;
function lcSession(read = true) {
  try {
    return read ? JSON.parse(sessionStorage.getItem(LC_SESSION) || 'null') : null;
  } catch {
    return null;
  }
}
function lcEndpoint(value) {
  const url = new URL(String(value || 'http://127.0.0.1:3210'));
  if (
    url.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost'].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw Error('Use a loopback URL such as http://127.0.0.1:3210.');
  return url.origin;
}
function lcLanguage(filename, profile) {
  const value = (profile + ' ' + filename).toLowerCase();
  if (/ansible/.test(value)) return 'ansible';
  if (/\.json\b|package/.test(value)) return 'json';
  if (/\.ya?ml\b|compose|kubernetes|github|gitlab/.test(value)) return 'yaml';
  if (/\.py\b|python/.test(value)) return 'python';
  if (/\.ps1\b|powershell/.test(value)) return 'powershell';
  if (/\.tf\b|terraform/.test(value)) return 'terraform';
  if (/\.sh\b|bash/.test(value)) return 'bash';
  return 'yaml';
}
function lcCurrentDocument() {
  const visible = [...CE_EDITORS.values()]
    .reverse()
    .find((item) => item.el.isConnected && item.cm.getWrapperElement().getClientRects().length);
  if (visible) {
    const filename =
      visible.el.id === 'dd-preview'
        ? ddState?.filename
        : visible.el.id === 'dk-preview'
          ? typeof dkOutput === 'function'
            ? dkOutput().filename
            : 'generated.txt'
          : visible.el.id === 'ab-preview'
            ? abState?.kind === 'inventory'
              ? 'inventory.yml'
              : 'site.yml'
            : 'generated.txt';
    return {
      content: visible.cm.getValue(),
      filename,
      language: lcLanguage(filename, ddState?.profile || dkActive?.sheet || ''),
    };
  }
  if (ddState) {
    const result = ddOutput();
    return {
      content: result.text || '',
      filename: ddState.filename,
      language: lcLanguage(ddState.filename, ddState.profile),
    };
  }
  if (dkActive) {
    const result = dkOutput();
    return {
      content: result.text || '',
      filename: result.filename,
      language: lcLanguage(result.filename, dkActive.sheet),
    };
  }
  return { content: '', filename: 'input.yml', language: 'yaml' };
}
async function lcNetworkError(error) {
  if (location.protocol !== 'https:') return error.message;
  for (const name of ['loopback-network', 'local-network-access'])
    try {
      const permission = await navigator.permissions.query({ name });
      if (permission.state === 'denied')
        return 'Local network access is blocked for this site. Allow it in the browser site settings, then connect again.';
    } catch {}
  return 'The browser could not reach the local companion. If prompted, allow Local network access for this site, then connect again.';
}
async function lcRequest(pathname, options = {}) {
  if (!lcConnection) throw Error('Connect to the companion first.');
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(lcConnection.url + pathname, {
      method: options.method || 'GET',
      headers: {
        'X-DevKit-Token': lcConnection.token,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
      targetAddressSpace: 'loopback',
    });
    let data;
    try {
      data = await response.json();
    } catch {
      throw Error('The companion returned an unreadable response.');
    }
    if (!response.ok)
      throw Error(data.error || data.message || `Companion request failed (${response.status}).`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError')
      throw Error('The companion did not respond within 15 seconds.');
    if (error instanceof TypeError) throw Error(await lcNetworkError(error));
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
function lcSetStatus(node, text, kind = '') {
  node.className = 'lc-status ' + kind;
  node.textContent = text;
}
function lcRenderTools(host, tools) {
  host.replaceChildren();
  for (const [name, tool] of Object.entries(tools || {})) {
    const chip = dkEl('span', 'lc-tool ' + (tool.available ? 'available' : 'missing'));
    chip.append(
      dkEl('strong', '', name),
      document.createTextNode(tool.available ? ' · ' + tool.version : ' · unavailable'),
    );
    chip.title = tool.available ? 'Command: ' + tool.command : 'Not found on PATH';
    host.append(chip);
  }
}
function lcOpen() {
  const current = lcCurrentDocument(),
    saved = lcSession() || {};
  dkShow();
  const root = document.getElementById('dk-root');
  root.replaceChildren();
  const header = dkEl('header', 'dk-header'),
    title = dkEl('div');
  title.append(
    dkEl('span', 'dk-eyebrow', 'DEVKIT / LOCAL'),
    dkEl('h2', '', 'Local companion'),
    dkEl(
      'p',
      'dk-help',
      'Check generated text with installed tools and read Git status through a small loopback-only service.',
    ),
  );
  header.append(title, dkBtn('Close ✕', dkClose));
  root.append(header);
  const body = dkEl('div', 'dk-home lc-home'),
    connectCard = dkEl('section', 'dk-guide lc-connect');
  connectCard.append(
    dkEl('h3', '', 'Connect this browser session'),
    dkEl(
      'p',
      'dk-help',
      'Run node companion/devkit-companion.cjs --root . and paste the URL and one-time token printed in its terminal. DevKit sends nothing until you connect.',
    ),
  );
  const connection = dkEl('div', 'lc-connect-grid'),
    url = dkEl('input', 'dk-input'),
    token = dkEl('input', 'dk-input');
  url.value = saved.url || 'http://127.0.0.1:3210';
  url.setAttribute('aria-label', 'Companion URL');
  url.spellcheck = false;
  token.type = 'password';
  token.value = saved.token || '';
  token.placeholder = 'One-time token';
  token.setAttribute('aria-label', 'Companion token');
  token.autocomplete = 'off';
  const connect = dkBtn(
    'Connect',
    async () => {
      connect.disabled = true;
      lcSetStatus(status, 'Connecting…');
      try {
        lcConnection = { url: lcEndpoint(url.value), token: token.value.trim() };
        if (!lcConnection.token) throw Error('Enter the token printed by the companion.');
        const health = await lcRequest('/health'),
          inventory = await lcRequest('/tools');
        try {
          sessionStorage.setItem(LC_SESSION, JSON.stringify(lcConnection));
        } catch {}
        rootName.textContent = health.root;
        version.textContent = health.name + ' ' + health.version + ' connected';
        lcRenderTools(tools, inventory.tools);
        actions.hidden = false;
        lcSetStatus(status, 'Connected. Choose a controlled action below.', 'ready');
      } catch (error) {
        lcConnection = null;
        actions.hidden = true;
        lcSetStatus(status, error.message, 'error');
      } finally {
        connect.disabled = false;
      }
    },
    'dk-btn primary',
  );
  connection.append(url, token, connect);
  const status = dkEl('p', 'lc-status', 'Not connected.');
  status.setAttribute('role', 'status');
  const meta = dkEl('div', 'lc-meta'),
    version = dkEl('strong', '', 'offline'),
    rootName = dkEl('code', '', '—');
  meta.append(dkEl('span', '', 'Service: '), version, dkEl('span', '', 'Root: '), rootName);
  connectCard.append(connection, status, meta);
  body.append(connectCard);
  const toolsCard = dkEl('section', 'dk-guide');
  toolsCard.append(
    dkEl('h3', '', 'Installed tools'),
    dkEl(
      'p',
      'dk-help',
      'Detection uses fixed version commands and is refreshed by the companion every 30 seconds.',
    ),
  );
  const tools = dkEl('div', 'lc-tools');
  toolsCard.append(tools);
  body.append(toolsCard);
  const actions = dkEl('section', 'dk-guide lc-actions');
  actions.hidden = true;
  const actionHead = dkEl('div', 'lc-action-head');
  actionHead.append(
    dkEl('h3', '', 'Validate or format text'),
    dkBtn('Read Git status', async () => {
      lcSetStatus(actionStatus, 'Reading Git status…');
      try {
        const result = await lcRequest('/git/status');
        git.textContent = result.output || result.message;
        git.hidden = false;
        lcSetStatus(actionStatus, result.message, result.ok ? 'ready' : 'error');
      } catch (error) {
        lcSetStatus(actionStatus, error.message, 'error');
      }
    }),
  );
  actions.append(actionHead);
  const git = dkEl('pre', 'lc-result');
  git.hidden = true;
  actions.append(git);
  const controls = dkEl('div', 'lc-controls'),
    language = dkEl('select', 'dk-input');
  language.setAttribute('aria-label', 'Validation language');
  for (const value of ['yaml', 'ansible', 'json', 'bash', 'python', 'powershell', 'terraform']) {
    const option = dkEl(
      'option',
      '',
      value === 'yaml' ? 'YAML' : value[0].toUpperCase() + value.slice(1),
    );
    option.value = value;
    language.append(option);
  }
  language.value = current.language;
  const useCurrent = dkBtn('Use current DevKit output', () => {
    const next = lcCurrentDocument();
    editor.value = next.content;
    language.value = next.language;
    source.textContent = next.filename || 'current output';
    lcSetStatus(actionStatus, 'Loaded ' + source.textContent + '.');
  });
  controls.append(language, useCurrent);
  actions.append(controls);
  const source = dkEl('code', 'lc-source', current.filename),
    editor = dkEl('textarea', 'dk-input lc-editor');
  editor.value = current.content;
  editor.rows = 16;
  editor.spellcheck = false;
  editor.setAttribute('aria-label', 'Companion input');
  actions.append(source, editor);
  const buttons = dkEl('div', 'lc-buttons'),
    validate = dkBtn('Validate', () => lcRun('/validate')),
    format = dkBtn('Format', () => lcRun('/format'));
  buttons.append(
    validate,
    format,
    dkBtn('Copy text', async () => {
      try {
        await navigator.clipboard.writeText(editor.value);
        lcSetStatus(actionStatus, 'Copied text.', 'ready');
      } catch {
        lcSetStatus(
          actionStatus,
          'Clipboard access was blocked. Select the text and copy it manually.',
          'error',
        );
      }
    }),
  );
  actions.append(buttons);
  const actionStatus = dkEl('p', 'lc-status', 'Ready.');
  actionStatus.setAttribute('role', 'status');
  const result = dkEl('pre', 'lc-result');
  result.hidden = true;
  actions.append(actionStatus, result);
  body.append(actions);
  root.append(body);
  async function lcRun(pathname) {
    validate.disabled = format.disabled = true;
    result.hidden = true;
    lcSetStatus(actionStatus, pathname === '/format' ? 'Formatting…' : 'Validating…');
    try {
      const data = await lcRequest(pathname, {
        method: 'POST',
        body: { language: language.value, content: editor.value },
      });
      if (pathname === '/format' && data.ok && typeof data.content === 'string')
        editor.value = data.content;
      const details = [
        data.message,
        data.detail,
        ...(data.diagnostics || []).map(
          (item) =>
            (item.line
              ? `Line ${item.line}${item.column ? `, column ${item.column}` : ''}: `
              : '') + item.message,
        ),
      ]
        .filter(Boolean)
        .join('\n');
      result.textContent = details;
      result.hidden = false;
      lcSetStatus(actionStatus, data.message, data.ok ? 'ready' : 'error');
    } catch (error) {
      lcSetStatus(actionStatus, error.message, 'error');
    } finally {
      validate.disabled = format.disabled = false;
    }
  }
}
const lcHeaderButton = dkBtn('Local', lcOpen, 'icon-btn lc-header');
lcHeaderButton.title = 'Connect to optional local validation tools';
document.querySelector('.header')?.append(lcHeaderButton);

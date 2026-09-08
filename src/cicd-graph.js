/* Dependency-aware visual pipeline map for GitHub Actions, GitLab CI and Jenkins. */
function cgLines(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
}
function cgModel() {
  const p = ddProfile(),
    root = ddState.blocks[0];
  if (!root) return null;
  if (p.id === 'github-actions') {
    if (!Array.isArray(root.slots?.jobs)) return null;
    return {
      platform: p.id,
      columns: [
        {
          name: 'Jobs',
          items: root.slots.jobs.map((node) => ({
            node,
            name: node.values.name || 'Untitled job',
            needs: cgLines(node.values.needs),
          })),
        },
      ],
    };
  }
  if (p.id === 'gitlab-ci') {
    if (!Array.isArray(root.slots?.stages)) return null;
    return {
      platform: p.id,
      columns: root.slots.stages.map((stage) => ({
        name: stage.values.name || 'Untitled stage',
        items: (stage.slots?.jobs || []).map((node) => ({
          node,
          name: node.values.name || 'Untitled job',
          needs: cgLines(node.values.needs),
        })),
      })),
    };
  }
  if (p.id === 'jenkins') {
    if (!Array.isArray(root.slots?.stages)) return null;
    return {
      platform: p.id,
      columns: root.slots.stages.map((node, index) => ({
        name: 'Step ' + (index + 1),
        items:
          node.type === 'parallel'
            ? (node.slots?.branches || []).map((branch) => ({
                node: branch,
                name: branch.values.name || 'Parallel branch',
                needs: index ? ['@previous'] : [],
              }))
            : [
                {
                  node,
                  name: node.values.name || 'Untitled stage',
                  needs: index ? ['@previous'] : [],
                },
              ],
      })),
    };
  }
  return null;
}
function cgFocus(id) {
  const card = document.querySelector('.dd-node[data-node="' + CSS.escape(id) + '"]');
  if (!card) return;
  ddCollapsed.delete(id);
  const found = ddFind(id);
  for (let parent = found?.parent; parent; parent = ddFind(parent)?.parent)
    ddCollapsed.delete(parent);
  ddRender();
  requestAnimationFrame(() => {
    const target = document.querySelector('.dd-node[data-node="' + CSS.escape(id) + '"]');
    target?.scrollIntoView({ block: 'center' });
    target?.querySelector('.dd-node-title')?.focus();
    target?.classList.add('us-target');
  });
}
function cgSetNeed(node, name, enabled) {
  const current = cgLines(node.values.needs),
    next = enabled ? [...new Set([...current, name])] : current.filter((x) => x !== name);
  ddChange(() => (node.values.needs = next.join('\n')));
}
function cgWouldCycle(items, item, candidate) {
  const graph = new Map(
      items.map((x) => [x.name, x === item ? [...new Set([...x.needs, candidate.name])] : x.needs]),
    ),
    active = new Set(),
    done = new Set();
  function visit(name) {
    if (active.has(name)) return true;
    if (done.has(name) || !graph.has(name)) return false;
    active.add(name);
    for (const next of graph.get(name)) if (visit(next)) return true;
    active.delete(name);
    done.add(name);
    return false;
  }
  return [...graph.keys()].some(visit);
}
function cgEdges(host, model) {
  const svg = host.querySelector('svg'),
    box = host.getBoundingClientRect();
  svg.setAttribute('width', box.width);
  svg.setAttribute('height', box.height);
  svg.querySelectorAll(':scope > path').forEach((path) => path.remove());
  const byName = new Map();
  host.querySelectorAll('.cg-node').forEach((el) => byName.set(el.dataset.name, el));
  for (const column of model.columns)
    for (const item of column.items) {
      const to = host.querySelector('.cg-node[data-node="' + CSS.escape(item.node.id) + '"]');
      for (const need of item.needs) {
        let from = byName.get(need);
        if (need === '@previous') {
          const index = model.columns.indexOf(column);
          from =
            index > 0 ? host.querySelector('.cg-column:nth-of-type(' + index + ') .cg-node') : null;
        }
        if (!from || !to) continue;
        const a = from.getBoundingClientRect(),
          b = to.getBoundingClientRect(),
          line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x1 = a.right - box.left,
          y1 = a.top + a.height / 2 - box.top,
          x2 = b.left - box.left,
          y2 = b.top + b.height / 2 - box.top,
          m = (x1 + x2) / 2;
        line.setAttribute('d', `M ${x1} ${y1} C ${m} ${y1}, ${m} ${y2}, ${x2} ${y2}`);
        line.setAttribute('marker-end', 'url(#cg-arrow)');
        svg.append(line);
      }
    }
}
function cgRender() {
  const model = cgModel();
  if (!model) return null;
  const all = model.columns.flatMap((x) => x.items),
    names = all.map((x) => x.name),
    duplicates = new Set(names.filter((x, i) => names.indexOf(x) !== i));
  const details = dkEl('details', 'cg-map');
  details.open = true;
  const summary = dkEl('summary');
  summary.append(
    dkEl('strong', '', 'Pipeline map'),
    dkEl(
      'span',
      '',
      all.length + ' job' + (all.length === 1 ? '' : 's') + ' · dependencies update the file',
    ),
  );
  details.append(summary);
  const canvas = dkEl('div', 'cg-canvas'),
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
    marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.id = 'cg-arrow';
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('refX', '7');
  marker.setAttribute('refY', '4');
  marker.setAttribute('orient', 'auto');
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow.setAttribute('d', 'M0,0 L8,4 L0,8 z');
  marker.append(arrow);
  defs.append(marker);
  svg.append(defs);
  canvas.append(svg);
  const columns = dkEl('div', 'cg-columns');
  const stageIndex = new Map();
  model.columns.forEach((column, index) =>
    column.items.forEach((item) => stageIndex.set(item.node.id, index)),
  );
  for (const column of model.columns) {
    const lane = dkEl('section', 'cg-column');
    lane.append(dkEl('h4', '', column.name));
    for (const item of column.items) {
      const card = dkEl('article', 'cg-node');
      card.dataset.node = item.node.id;
      card.dataset.name = item.name;
      if (duplicates.has(item.name)) card.classList.add('invalid');
      const open = dkBtn(item.name, () => cgFocus(item.node.id), 'cg-open');
      card.append(open);
      if (model.platform !== 'jenkins') {
        const dependencies = dkEl('div', 'cg-needs');
        dependencies.append(dkEl('span', '', 'Needs'));
        for (const candidate of all.filter((x) => x.node.id !== item.node.id)) {
          const label = dkEl('label'),
            check = dkEl('input');
          check.type = 'checkbox';
          check.checked = item.needs.includes(candidate.name);
          const later =
              model.platform === 'gitlab-ci' &&
              stageIndex.get(candidate.node.id) > stageIndex.get(item.node.id),
            cycle = !check.checked && cgWouldCycle(all, item, candidate);
          check.disabled = later || cycle;
          check.setAttribute('aria-label', item.name + ' depends on ' + candidate.name);
          if (later || cycle)
            label.title = later
              ? 'GitLab jobs cannot need a later stage.'
              : 'This dependency would create a cycle.';
          check.onchange = () => cgSetNeed(item.node, candidate.name, check.checked);
          label.append(check, document.createTextNode(candidate.name));
          dependencies.append(label);
        }
        if (all.length === 1) dependencies.append(dkEl('small', '', 'No other jobs yet'));
        card.append(dependencies);
      } else if (item.needs.length)
        card.append(dkEl('small', 'cg-implicit', 'after previous stage'));
      lane.append(card);
    }
    columns.append(lane);
  }
  canvas.append(columns);
  details.append(
    canvas,
    dkEl(
      'p',
      'cg-help',
      model.platform === 'jenkins'
        ? 'Jenkins columns run left to right; cards within a parallel column run together.'
        : 'Tick dependencies here or edit Needs in the blocks. Invalid cycles and later-stage links are disabled.',
    ),
  );
  requestAnimationFrame(() => cgEdges(canvas, model));
  return details;
}
const cgPreviousRender = ddRender;
ddRender = function () {
  cgPreviousRender();
  const graph = cgRender();
  if (!graph) return;
  const output = document.querySelector('#dk-root .dk-output'),
    preview = document.getElementById('dd-preview');
  output.insertBefore(graph, preview);
};

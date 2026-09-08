const { chromium } = require(process.env.DEVKIT_PLAYWRIGHT || 'playwright'),
  assert = require('node:assert/strict'),
  path = require('node:path'),
  { pathToFileURL } = require('node:url');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DEVKIT_CHROME ? { executablePath: process.env.DEVKIT_CHROME } : {}),
  });
  try {
    for (const entry of ['index.html', 'dist/devkit.html']) {
      const page = await browser.newPage(),
        errors = [],
        network = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('request', (r) => {
        if (!/^(file|data|blob):/.test(r.url())) network.push(r.url());
      });
      const editor = () =>
        page.evaluate(() =>
          [...CE_EDITORS.values()]
            .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
            .cm.getValue(),
        );
      const setEditor = (value) =>
        page.evaluate(
          (value) =>
            [...CE_EDITORS.values()]
              .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
              .cm.setValue(value),
          value,
        );
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', entry)).href);
      await page.evaluate(() => {
        localStorage.clear();
        dkDrafts = {};
        pwState = pwBlank();
        ddOpen('yaml', 'k8s');
      });
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((x) => x.el.id === 'dd-preview' && x.el.isConnected),
      );
      await setEditor(
        'apiVersion: v1\nkind: ConfigMap\ndata:\n\tpassword: "AKIAABCDEFGHIJKLMNOP"   ',
      );
      await page.waitForFunction(() => document.querySelectorAll('.dg-row').length >= 4);
      const firstText = await page.locator('.dg-panel').innerText();
      assert.match(firstText, /AWS access-key-shaped value detected/);
      assert.match(firstText, /Indentation tabs are unsafe/);
      assert.match(firstText, /Trailing whitespace/);
      assert(await page.locator('.dg-mark.error').count());
      assert.deepEqual(await page.evaluate(() => dkSchemaGet('yaml').validation.diagnosticRules), [
        'kubernetes',
        'compose',
        'ansible-playbook',
      ]);
      await page
        .getByRole('button', { name: /^Replace with/ })
        .first()
        .click();
      await page.waitForFunction(
        () =>
          ![...CE_EDITORS.values()]
            .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
            .cm.getValue()
            .includes('AKIA'),
      );
      assert((await editor()).includes('${AWS_ACCESS_KEY_ID}'));
      await page.getByRole('button', { name: 'Convert tabs to spaces' }).click();
      await page.waitForFunction(
        () =>
          ![...CE_EDITORS.values()]
            .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
            .cm.getValue()
            .includes('\t'),
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dg-row')].some((x) =>
          x.textContent.includes('metadata.name'),
        ),
      );
      await page.getByRole('button', { name: 'Add metadata.name' }).click();
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
          .cm.getValue()
          .includes('metadata:'),
      );
      assert((await editor()).includes('name: app'));
      await page.evaluate(() => ddOpen('github-actions', 'cicd'));
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((x) => x.el.id === 'dd-preview' && x.el.isConnected),
      );
      await setEditor(
        'name: CI\non:\n  push:\njobs:\n  test:\n    steps:\n      - run: npm test\n',
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dg-row')].some((x) =>
          x.textContent.includes('needs runs-on'),
        ),
      );
      const issue = page.getByRole('button', { name: /Job test needs runs-on/ });
      await issue.click();
      assert.equal(
        await page.evaluate(
          () =>
            [...CE_EDITORS.values()]
              .find((x) => x.el.id === 'dd-preview' && x.el.isConnected)
              .cm.getCursor().line,
        ),
        4,
      );
      await page.evaluate(() => ddOpen('python', 'python'));
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((x) => x.el.id === 'dd-preview' && x.el.isConnected),
      );
      await setEditor('def broken(:\n    pass\n');
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dg-row')].some((x) =>
          x.textContent.includes('Python syntax'),
        ),
      );
      assert(await page.locator('.dg-mark.error').count());
      const project = await page.evaluate(() => {
        const p = pwCreateProject('blank', 'Diagnostics');
        const f = pwAddFile(p, 'package.json', '{"scripts": []}\n');
        pwOpenFile(p.id, f.id);
        return { id: p.id, fileId: f.id };
      });
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((x) => x.el.id === 'dd-preview' && x.el.isConnected),
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll('.dg-row')].some((x) =>
          x.textContent.includes('scripts must be an object'),
        ),
      );
      await page.evaluate((id) => pwShowProject(id), project.id);
      await page.getByRole('button', { name: 'Add shared variable' }).click();
      const name = page.getByLabel('Shared variable name').last(),
        value = page.getByLabel('Shared variable value').last();
      await name.fill('API_TOKEN');
      await name.press('Tab');
      const token = 'ghp_' + 'A'.repeat(36);
      await value.fill(token);
      await value.press('Tab');
      await page.waitForFunction(() =>
        document.querySelector('.dg-variable-warning')?.textContent.includes('not saved'),
      );
      assert.equal(
        await page.evaluate((id) => pwState.projects[id].variables.API_TOKEN, project.id),
        '',
      );
      assert((await value.inputValue()).startsWith('ghp_'));
      const direct = await page.evaluate(() => {
        const syntax = dgAnalyze('password: "literal-secret-value"\n', {
            profile: 'yaml',
            mode: 'yaml',
            filename: 'config.yml',
            path: 'config.yml',
            sheet: 'linux',
          }),
          placeholder = dgAnalyze('password: "${PASSWORD}"\n', {
            profile: 'yaml',
            mode: 'yaml',
            filename: 'config.yml',
            path: 'config.yml',
            sheet: 'linux',
          }),
          k8s = 'apiVersion: v1\nkind: ConfigMap\nmetadata: {}\n',
          ansible = '- name: Configure hosts\n  hosts:\n  tasks: []\n',
          k8sIssue = dgAnalyze(k8s, {
            profile: 'yaml',
            mode: 'yaml',
            filename: 'manifest.yml',
            path: 'manifest.yml',
            sheet: 'k8s',
          }).find((x) => x.message.includes('metadata.name')),
          ansibleIssue = dgAnalyze(ansible, {
            profile: 'ansible',
            mode: 'yaml',
            filename: 'playbook.yml',
            path: 'playbook.yml',
            sheet: 'ansible',
          }).find((x) => x.message.includes('needs hosts')),
          k8sFixed = k8sIssue.fix.apply(k8s),
          ansibleFixed = ansibleIssue.fix.apply(ansible);
        return {
          literal: syntax.some((x) => x.source === 'secret'),
          placeholder: placeholder.some((x) => x.source === 'secret'),
          located: syntax.some((x) => x.line === 0 && x.ch > 0),
          k8sFixed,
          ansibleFixed,
        };
      });
      assert(direct.literal);
      assert(!direct.placeholder);
      assert(direct.located);
      assert.equal((direct.k8sFixed.match(/^metadata:/gm) || []).length, 1);
      assert.match(direct.k8sFixed, /metadata:\n  name: app/);
      assert.equal((direct.ansibleFixed.match(/^\s*hosts:/gm) || []).length, 1);
      assert.match(direct.ansibleFixed, /  hosts: all/);
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await page.close();
    }
    console.log(
      'PASS: parser-backed source ranges, schema rules, markers, caret navigation, non-duplicating schema repairs, secret and style repairs, safe shared variables, offline operation and both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

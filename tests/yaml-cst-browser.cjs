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
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (!/^(file|data|blob):/.test(request.url())) network.push(request.url());
      });
      const setEditor = (value) =>
          page.evaluate(
            (value) =>
              [...CE_EDITORS.values()]
                .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
                .cm.setValue(value),
            value,
          ),
        editor = () =>
          page.evaluate(() =>
            [...CE_EDITORS.values()]
              .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
              .cm.getValue(),
          );
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', entry)).href);
      await page.evaluate(() => {
        localStorage.clear();
        dkDrafts = {};
        pwState = pwBlank();
        ddOpen('yaml', 'ansible');
      });
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((item) => item.el.id === 'dd-preview' && item.el.isConnected),
      );
      const yaml =
        '# application\nname: "old" # display name\ndefaults: &defaults\n  retries: 3 # policy\ncopy: *defaults\n';
      assert.equal(
        await page.evaluate(() => dkSchemaGet('yaml').editor.preserveSyntax),
        'yaml-cst',
      );
      await setEditor(yaml);
      await page.getByRole('button', { name: 'Sync code to blocks now', exact: true }).click();
      await page.waitForFunction(() => ddState.sxYaml && !ddState.sxDirty);
      await page.getByLabel('Text value', { exact: true }).first().fill('new');
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
          ?.cm.getValue()
          .includes('name: "new" # display name'),
      );
      const number = page.getByLabel('Numeric value', { exact: true }).first();
      await number.fill('invalid');
      assert(await page.evaluate(() => ddState.sxYaml && ddState.sxCode.includes('# policy')));
      await number.fill('4');
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
          ?.cm.getValue()
          .includes('retries: 4 # policy'),
      );
      let output = await editor();
      assert.match(output, /# application/);
      assert.match(output, /defaults: &defaults/);
      assert.match(output, /copy: \*defaults/);
      assert.match(await page.locator('#sx-status').innerText(), /document tree/);
      await page.evaluate(() => ddOpen('github-actions', 'cicd'));
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((item) => item.el.id === 'dd-preview' && item.el.isConnected),
      );
      const ci = await page.evaluate(() =>
        DD_PROFILES['github-actions']
          .generate(DD_PROFILES['github-actions'].seed(DD_PROFILES['github-actions']))
          .replace(/^name: CI$/m, '# workflow\nname: "CI" # title'),
      );
      await setEditor(ci);
      await page.getByRole('button', { name: 'Sync code to blocks now', exact: true }).click();
      await page.waitForFunction(() => ddState.sxYaml && !ddState.sxDirty);
      assert.equal(await page.evaluate(() => ddState.blocks[0].type), 'workflow');
      await page.getByLabel('Workflow name', { exact: true }).fill('Release');
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
          ?.cm.getValue()
          .includes('name: "Release" # title'),
      );
      assert.match(await editor(), /# workflow/);
      await page.evaluate(() => ddOpen('gitlab-ci', 'cicd'));
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((item) => item.el.id === 'dd-preview' && item.el.isConnected),
      );
      const gitlab = await page.evaluate(() =>
        DD_PROFILES['gitlab-ci']
          .generate(DD_PROFILES['gitlab-ci'].seed(DD_PROFILES['gitlab-ci']))
          .replace(/^stages:/m, '# pipeline\nstages:'),
      );
      await setEditor(gitlab);
      await page.getByRole('button', { name: 'Sync code to blocks now', exact: true }).click();
      await page.waitForFunction(() => ddState.sxYaml && !ddState.sxDirty);
      assert.equal(await page.evaluate(() => ddState.blocks[0].type), 'pipeline');
      await page.getByLabel('Job name', { exact: true }).first().fill('renamed_job');
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((item) => item.el.id === 'dd-preview' && item.el.isConnected)
          ?.cm.getValue()
          .includes('renamed_job:'),
      );
      assert.match(await editor(), /# pipeline/);
      await page.evaluate(() => {
        dkClose();
        abOpen();
      });
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()].some((item) => item.el.id === 'ab-preview' && item.el.isConnected),
      );
      const play =
        '---\n# play comment\n- name: "Typed play" # title\n  hosts: all\n  tasks:\n    - name: Ping\n      ansible.builtin.ping: {}\n';
      await page.evaluate(
        (value) =>
          [...CE_EDITORS.values()]
            .find((item) => item.el.id === 'ab-preview' && item.el.isConnected)
            .cm.setValue(value),
        play,
      );
      await page
        .locator('#ab-dialog')
        .getByRole('button', { name: 'Sync code to blocks now', exact: true })
        .click();
      await page.waitForFunction(() => abState.sxYaml && !abState.sxDirty);
      await page.evaluate(() =>
        abEdit(() => {
          abState.doc[0].name = 'Changed play';
        }),
      );
      await page.waitForFunction(() =>
        [...CE_EDITORS.values()]
          .find((item) => item.el.id === 'ab-preview' && item.el.isConnected)
          ?.cm.getValue()
          .includes('- name: "Changed play" # title'),
      );
      assert.match(
        await page.evaluate(() =>
          [...CE_EDITORS.values()]
            .find((item) => item.el.id === 'ab-preview' && item.el.isConnected)
            .cm.getValue(),
        ),
        /# play comment/,
      );
      await page.evaluate(() => abClose());
      const projectText = await page.evaluate((source) => {
        const project = pwCreateProject('blank', 'CST project'),
          file = pwAddFile(project, 'config.yml', source),
          draft = pwDraft(project, file, source),
          name = draft.blocks[0].slots.items.find((node) => node.values.key === 'name');
        name.values.value = 'project-new';
        return { text: pwText(draft), state: draft.sxYaml };
      }, yaml);
      assert(projectText.state);
      assert.match(projectText.text, /name: "project-new" # display name/);
      assert.match(projectText.text, /copy: \*defaults/);
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await page.close();
    }
    console.log(
      'PASS: generic YAML, GitHub Actions, GitLab CI, Ansible and project drafts preserve comments, anchors, aliases and quote styles through real block edits in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

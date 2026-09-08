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
      const page = await browser.newPage({ viewport: { width: 1450, height: 950 } }),
        errors = [],
        network = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('request', (r) => {
        if (/^https?:/.test(r.url())) network.push(r.url());
      });
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', entry)).href);
      await page.evaluate(() => {
        localStorage.clear();
        dkDrafts = {};
        ddOpen('github-actions', 'cicd');
        ewReset(true);
        const p = ddProfile(),
          w = ddState.blocks[0],
          n = (t, v = {}, s = {}) => ddNode(p, t, v, s);
        ddChange(() =>
          w.slots.jobs.push(
            n(
              'job',
              { name: 'deploy' },
              { steps: [n('run', { name: 'Deploy', text: 'echo deploy' })] },
            ),
          ),
        );
      });
      assert.equal(await page.locator('.cg-node').count(), 2);
      const dependency = page.getByLabel('deploy depends on test');
      assert(!(await dependency.isDisabled()));
      await dependency.check();
      await page.waitForFunction(() =>
        document.getElementById('dd-preview').value.includes('needs:'),
      );
      assert.match(await page.locator('#dd-preview').inputValue(), /needs:\s*- test/);
      await page.waitForFunction(
        () => document.querySelectorAll('.cg-canvas svg > path').length === 1,
      );
      assert.equal(await page.locator('.cg-canvas svg > path').count(), 1);
      assert(
        await page.getByLabel('test depends on deploy').isDisabled(),
        'cycle-producing dependency was enabled',
      );
      await page.getByRole('button', { name: 'deploy', exact: true }).click();
      await page.waitForFunction(() => document.activeElement?.classList.contains('dd-node-title'));
      await page.evaluate(() => {
        dkDrafts = {};
        ddOpen('gitlab-ci', 'cicd');
        ewReset(true);
        const p = ddProfile(),
          r = ddState.blocks[0],
          n = (t, v = {}, s = {}) => ddNode(p, t, v, s);
        ddChange(() =>
          r.slots.stages.push(
            n(
              'stage',
              { name: 'deploy' },
              {
                jobs: [
                  n(
                    'job',
                    { name: 'release' },
                    { script: [n('command', { text: 'echo release' })] },
                  ),
                ],
              },
            ),
          ),
        );
      });
      assert.equal(await page.locator('.cg-column').count(), 2);
      assert(
        await page.getByLabel('unit_tests depends on release').isDisabled(),
        'later GitLab stage dependency was enabled',
      );
      await page.getByLabel('release depends on unit_tests').check();
      await page.waitForFunction(() =>
        document.getElementById('dd-preview').value.includes('needs:'),
      );
      assert.match(await page.locator('#dd-preview').inputValue(), /needs:\s*- unit_tests/);
      await page.evaluate(() => {
        dkDrafts = {};
        ddOpen('jenkins', 'cicd');
        ewReset(true);
      });
      assert.equal(await page.locator('.cg-column').count(), 2);
      assert.equal(await page.locator('.cg-node').count(), 2);
      assert.match(await page.locator('.cg-node').nth(1).innerText(), /after previous stage/);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole('button', { name: 'Preview', exact: true }).click();
      assert(await page.locator('.cg-map').isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await page.close();
    }
    console.log(
      'PASS: CI/CD maps share the block model, edit needs, draw edges, prevent cycles and invalid GitLab stage links, focus blocks, visualize Jenkins order, remain mobile and offline in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

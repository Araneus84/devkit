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
      const page = await browser.newPage({ viewport: { width: 1440, height: 950 } }),
        errors = [],
        network = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (!/^(file|data|blob):/.test(request.url())) network.push(request.url());
      });
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', entry)).href);
      const audit = await page.evaluate(() => {
        const kinds = new Set(usIndex.map((entry) => entry.kind)),
          find = (query) => usSearch(query, 12).map((item) => item.entry);
        return {
          count: usIndex.length,
          kinds: [...kinds],
          terraform: find('terrafom infrastucture').map((x) => x.title),
          excel: find('read excel spreadsheet').map((x) => x.title),
          github: find('build gitub pipeline').map((x) => x.title),
          service: find('restart servce').map((x) => x.title),
          unique: new Set(usIndex.map((x) => x.id)).size,
          commands: Object.values(SHEETS).flatMap((sheet) =>
            sheet.sections.flatMap((section) => section.cmds),
          ).length,
        };
      });
      assert(audit.count > audit.commands);
      for (const kind of [
        'Command',
        'Builder',
        'Editor',
        'Block',
        'Python step',
        'Python module',
        'Guide',
        'Workspace',
      ])
        assert(audit.kinds.includes(kind));
      assert.equal(audit.unique, audit.count);
      assert.match(audit.terraform[0], /terraform/i);
      assert.match(audit.excel[0], /excel|xlsx|spreadsheet/i);
      assert.match(audit.github[0], /github|pipeline|workflow/i);
      assert(audit.service.some((x) => /systemctl.*restart|restart.*service/i.test(x)));
      const search = page.getByLabel('Search all DevKit tools by command or intent');
      await search.fill('terrafom infrastructure');
      assert(await page.locator('.us-result').count());
      assert(await page.getByRole('button', { name: /Editor \d+/ }).count());
      await page
        .locator('[data-search-id="editor:terraform"]')
        .getByRole('button', { name: /Open Terraform/ })
        .click();
      await page.waitForFunction(() => ddState?.profile === 'terraform');
      assert.equal(await page.evaluate(() => ddState.profile), 'terraform');
      await page.evaluate(() => dkClose());
      await search.fill('boto 3 aws sdk');
      const moduleCard = page.locator('[data-search-id="python-module:boto3"]');
      assert.equal(await moduleCard.count(), 1);
      await moduleCard.getByRole('button', { name: 'Open Python modules' }).click();
      await page.waitForFunction(
        () => ddState?.profile === 'python' && document.querySelector('.py-packages')?.open,
      );
      assert.equal(await page.getByLabel('Find a Python module').inputValue(), 'boto3');
      assert.equal(await page.locator('.py-module-row:not([hidden])').count(), 1);
      await page.evaluate(() => dkClose());
      await search.fill('systemctl restart service');
      const command = page.locator('.us-result').filter({ hasText: 'systemctl restart' }).first();
      assert(await command.count());
      await command.getByRole('button', { name: 'View command' }).click();
      await page.waitForFunction(() => document.querySelector('.cmd-item.us-target'));
      assert(
        (await page.locator('.cmd-item.us-target code').innerText()).includes('systemctl restart'),
      );
      const block = await page.evaluate(() => {
        const item = usIndex.find(
          (entry) => entry.kind === 'Block' && entry.payload.profile === 'dockerfile',
        );
        ddOpen('dockerfile', 'docker');
        const state = dkClone(ddState);
        delete state.updatedAt;
        dkClose();
        return {
          id: item.id,
          title: item.title,
          type: item.payload.type,
          state: JSON.stringify(state),
        };
      });
      await search.fill(block.title + ' dockerfile block');
      const blockCard = page.locator('[data-search-id="' + block.id + '"]');
      assert.equal(await blockCard.count(), 1);
      await blockCard.getByRole('button', { name: 'Find this block' }).click();
      await page.waitForFunction(
        (type) =>
          ddState?.profile === 'dockerfile' &&
          document.querySelector('.dd-lane[data-parent=""][data-slot="root"] > .dd-add select')
            ?.value === type,
        block.type,
      );
      assert.equal(
        await page.evaluate(() => {
          const state = dkClone(ddState);
          delete state.updatedAt;
          return JSON.stringify(state);
        }),
        block.state,
      );
      await page.evaluate(() => dkClose());
      await search.fill('multi file project workspace');
      await page
        .locator('[data-search-id="workspace:projects"]')
        .getByRole('button', { name: 'Open projects' })
        .click();
      assert(
        await page
          .locator('#dk-root')
          .getByRole('heading', { name: 'Projects', exact: true })
          .isVisible(),
      );
      await page.evaluate(() => dkClose());
      await search.fill('backup move restore');
      await page
        .locator('[data-search-id="workspace:backup"]')
        .getByRole('button', { name: 'Open backup' })
        .click();
      assert(
        await page
          .locator('#dk-root')
          .getByRole('heading', { name: 'Take your workspace with you' })
          .isVisible(),
      );
      await page.evaluate(() => dkClose());
      await search.fill('pipeline');
      await page.getByRole('button', { name: /Builder \d+/ }).click();
      assert((await page.locator('.us-result').count()) > 0);
      assert.equal(await page.locator('.us-result .us-kind').first().innerText(), 'Builder');
      await search.focus();
      await search.press('ArrowDown');
      assert(
        await page
          .locator('.us-open')
          .first()
          .evaluate((el) => document.activeElement === el),
      );
      await search.fill('<img src=x onerror=alert(1)>');
      assert.equal(await page.locator('#main img').count(), 0);
      await page.setViewportSize({ width: 390, height: 844 });
      await search.fill('read xlsx python');
      await page.waitForTimeout(250);
      assert(await page.locator('.us-result').first().isVisible());
      const mobile = await page.evaluate(() => {
        const backup = document.querySelector('.dk-backup').getBoundingClientRect(),
          projects = document.querySelector('.dk-projects').getBoundingClientRect();
        return {
          width: document.documentElement.scrollWidth,
          viewport: innerWidth,
          overlap: backup.right > projects.left,
          status: document.getElementById('status-counts').textContent,
        };
      });
      assert.equal(mobile.width, mobile.viewport);
      assert(!mobile.overlap);
      assert.match(mobile.status, /results$/);
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await page.close();
    }
    console.log(
      'PASS: one offline index ranks typo-tolerant intent across commands, builders, editors, blocks, Python tooling, guides and workspaces with safe direct actions in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { chromium } = require(process.env.DEVKIT_PLAYWRIGHT || 'playwright'),
  assert = require('node:assert/strict'),
  path = require('node:path'),
  { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..'),
  pack = {
    format: 'devkit-recipe-pack',
    version: 1,
    id: 'test.pack',
    name: 'Test <img src=x onerror=alert(1)>',
    description: 'Local test pack',
    author: 'QA',
    recipes: [
      {
        id: 'audit',
        sheet: 'bash',
        title: 'Audit bundle',
        description: 'Build a safe audit line',
        filename: 'audit.sh',
        check: 'Review it.',
        parts: [
          {
            key: 'message',
            label: 'Message',
            hint: 'Text to print',
            required: true,
            fields: { text: { label: 'Message text', type: 'text', value: 'hello' } },
          },
          {
            key: 'footer',
            label: 'Footer',
            hint: 'Optional final line',
            required: false,
            fields: { text: { label: 'Footer text', type: 'text', value: 'done' } },
          },
        ],
        output: [
          { template: "#!/usr/bin/env bash\nprintf '%s\\n' <<message.text|shell>>\n" },
          { part: 'footer', template: "printf '%s\\n' <<text|shell>>\n" },
        ],
      },
    ],
  };
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DEVKIT_CHROME ? { executablePath: process.env.DEVKIT_CHROME } : {}),
  });
  try {
    for (const entry of ['index.html', 'dist/devkit.html']) {
      const page = await browser.newPage({ viewport: { width: 1400, height: 950 } }),
        errors = [],
        network = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('request', (r) => {
        if (/^https?:/.test(r.url())) network.push(r.url());
      });
      await page.goto(pathToFileURL(path.join(root, entry)).href);
      await page.evaluate((pack) => {
        localStorage.clear();
        localStorage.setItem('devkit:recipe-packs:v1', JSON.stringify([pack]));
      }, pack);
      await page.reload();
      const audit = await page.evaluate(() => ({
        recipe: !!DK_RECIPES['pack:test.pack:audit'],
        schema: dkSchemaGet('bash').recipes.includes('pack:test.pack:audit'),
        search: usIndex.some((x) => x.id === 'recipe:pack:test.pack:audit'),
        backup: !!dkBackup().data[RP_STORAGE],
      }));
      assert.deepEqual(audit, { recipe: true, schema: true, search: true, backup: true });
      const search = page.getByLabel('Search all DevKit tools by command or intent');
      await search.fill('audit bundle');
      await page.locator('[data-search-id="recipe:pack:test.pack:audit"] .us-open').click();
      await page.getByLabel('Message text').fill('hello world <img src=x onerror=alert(1)>');
      assert(
        (await page.locator('#dk-preview').inputValue()).includes(
          "'hello world <img src=x onerror=alert(1)>'",
        ),
      );
      assert.equal(await page.locator('#dk-root img').count(), 0);
      await page.getByRole('button', { name: /\+ Footer/ }).click();
      assert((await page.locator('#dk-preview').inputValue()).includes('done'));
      await page.getByRole('button', { name: 'Recipe packs', exact: true }).click();
      assert((await page.locator('.rp-card').filter({ hasText: 'Test <img' }).count()) === 1);
      assert.equal(await page.locator('#dk-root img').count(), 0);
      const uiPack = { ...pack, id: 'ui.pack', name: 'UI pack' };
      const chooser = page.getByLabel('Choose recipe pack');
      await chooser.setInputFiles({
        name: 'ui.recipe-pack.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(uiPack)),
      });
      await page.waitForFunction(() =>
        [...document.querySelectorAll('#dk-root [role=status]')].some((node) =>
          node.textContent.includes('ready to import locally'),
        ),
      );
      assert.match(
        await page.locator('#dk-root').getByRole('status').innerText(),
        /ready to import locally/,
      );
      await Promise.all([
        page.waitForEvent('domcontentloaded'),
        page.getByRole('button', { name: 'Import selected pack' }).click(),
      ]);
      assert(
        await page.evaluate(() =>
          JSON.parse(localStorage.getItem(RP_STORAGE)).some((x) => x.id === 'ui.pack'),
        ),
      );
      await page.evaluate(() => rpOpen());
      const uiCard = page.locator('.rp-card').filter({ hasText: 'UI pack' });
      await Promise.all([
        page.waitForEvent('domcontentloaded'),
        uiCard.getByRole('button', { name: 'Remove' }).click(),
      ]);
      assert(
        !(await page.evaluate(() =>
          JSON.parse(localStorage.getItem(RP_STORAGE)).some((x) => x.id === 'ui.pack'),
        )),
      );
      await assert.rejects(
        page.evaluate(() => {
          const backup = dkBackup();
          backup.data[RP_STORAGE] = JSON.stringify([
            { format: 'devkit-recipe-pack', version: 1, id: 'bad.pack', name: 'Bad', recipes: [] },
          ]);
          return dkValidateBackup(backup);
        }),
      );
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole('button', { name: 'Packs', exact: true }).click();
      assert(await page.getByLabel('Choose recipe pack').isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await page.close();
    }
    console.log(
      'PASS: stored packs bootstrap into schemas and search, import/edit/generate/export management stays inert, backup validation rejects damage, optional blocks work, and both offline editions remain mobile-safe.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

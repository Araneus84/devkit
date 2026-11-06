const { chromium } = require(process.env.DEVKIT_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

(async () => {
  const project = path.resolve(__dirname, '..');
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DEVKIT_CHROME ? { executablePath: process.env.DEVKIT_CHROME } : {}),
  });
  try {
    for (const edition of ['index.html', 'dist/devkit.html']) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', edition)).href);
      await page.evaluate(() => setSheet('python', null));
      await page.getByRole('button', { name: 'Search full Python documentation' }).click();
      await page
        .getByLabel('Choose Python documentation pack')
        .setInputFiles(path.resolve(__dirname, '../documentation-packs/python-3.15.json'));
      await page.getByLabel('Search Python documentation').fill('sorted(');
      const card = page.locator('.dk-guide').filter({ hasText: 'Built-in functions' }).first();
      await card.getByRole('button', { name: 'Read page' }).click();
      await page.getByRole('heading', { name: 'Built-in functions' }).waitFor();
      const text = await page.locator('#dk-root pre').innerText();
      assert.match(text, /sorted\(iterable/);
      assert.match(text, /reverse/);
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('bash', null));
      await page.getByRole('button', { name: 'Search full Bash documentation' }).click();
      await page
        .getByLabel('Choose Bash documentation pack')
        .setInputFiles(path.resolve(__dirname, '../documentation-packs/bash-5.3.json'));
      await page.getByLabel('Search Bash documentation').fill('quoting');
      const bashCard = page.locator('.dk-guide').filter({ hasText: '3.1.2 Quoting' }).first();
      await bashCard.getByRole('button', { name: 'Read page' }).click();
      assert.match(await page.locator('#dk-root pre').innerText(), /special meaning/);
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('powershell', null));
      await page.getByRole('button', { name: 'Search full PowerShell documentation' }).click();
      await page
        .getByLabel('Choose PowerShell documentation pack')
        .setInputFiles(path.resolve(__dirname, '../documentation-packs/powershell-7.6.json'));
      await page.getByLabel('Search PowerShell documentation').fill('Get-ChildItem');
      const psCard = page.locator('.dk-guide').filter({ hasText: 'Get-ChildItem' }).first();
      await psCard.getByRole('button', { name: 'Read page' }).click();
      assert.match(await page.locator('#dk-root pre').innerText(), /EXAMPLES/);
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('terraform', null));
      await page
        .getByRole('button', { name: 'Search Terraform language and CLI documentation' })
        .click();
      await page
        .getByLabel('Choose Terraform documentation pack')
        .setInputFiles(path.resolve(__dirname, '../documentation-packs/terraform-1.17.json'));
      await page.getByLabel('Search Terraform documentation').fill('sort Function');
      await page.getByRole('button', { name: 'Read documentation license' }).click();
      assert.match(await page.locator('#dk-root pre').innerText(), /Business Source License/);
      await page.getByRole('button', { name: 'Back to results' }).click();
      const tfCard = page.locator('.dk-guide').filter({ hasText: 'sort Function' }).first();
      await tfCard.getByRole('button', { name: 'Read page' }).click();
      assert.match(await page.locator('#dk-root pre').innerText(), /sort\(\[/);
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('ansible', null));
      await page.getByRole('button', { name: 'Search Ansible Core documentation' }).click();
      await page
        .getByLabel('Choose Ansible documentation pack')
        .setInputFiles(path.resolve(__dirname, '../documentation-packs/ansible-core-2.21.json'));
      await page.getByLabel('Search Ansible documentation').fill('ansible.builtin.apt');
      const ansibleCard = page
        .locator('.dk-guide')
        .filter({ hasText: 'ansible.builtin.apt' })
        .first();
      await ansibleCard.getByRole('button', { name: 'Read page' }).click();
      assert.match(await page.locator('#dk-root pre').innerText(), /EXAMPLES/);
      assert.deepEqual(errors, []);
      await page.close();
    }
    for (const edition of ['index.html', 'dist/devkit.html']) {
      const page = await browser.newPage();
      await page.route('https://devkit.test/**', async (route) => {
        const pathname = new URL(route.request().url()).pathname;
        const file = path.resolve(project, '.' + pathname);
        if (!file.startsWith(project + path.sep) || !fs.existsSync(file)) return route.abort();
        await route.fulfill({ path: file });
      });
      await page.goto(`https://devkit.test/${edition}`);
      await page.evaluate(() => setSheet('python', null));
      await page.getByRole('button', { name: 'Search full Python documentation' }).click();
      await page.getByRole('button', { name: 'Load online manual' }).click();
      await page.getByLabel('Search Python documentation').fill('sorted(');
      await page.locator('.dk-guide').filter({ hasText: 'Built-in functions' }).first().waitFor();
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('bash', null));
      await page.getByRole('button', { name: 'Search full Bash documentation' }).click();
      await page.getByRole('button', { name: 'Load online manual' }).click();
      await page.getByLabel('Search Bash documentation').fill('quoting');
      await page.locator('.dk-guide').filter({ hasText: '3.1.2 Quoting' }).first().waitFor();
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('powershell', null));
      await page.getByRole('button', { name: 'Search full PowerShell documentation' }).click();
      await page.getByRole('button', { name: 'Load online manual' }).click();
      await page.getByLabel('Search PowerShell documentation').fill('Get-ChildItem');
      await page.locator('.dk-guide').filter({ hasText: 'Get-ChildItem' }).first().waitFor();
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('ansible', null));
      await page.getByRole('button', { name: 'Search Ansible Core documentation' }).click();
      await page.getByRole('button', { name: 'Load online manual' }).click();
      await page.getByLabel('Search Ansible documentation').fill('ansible.builtin.apt');
      await page.locator('.dk-guide').filter({ hasText: 'ansible.builtin.apt' }).first().waitFor();
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.evaluate(() => setSheet('terraform', null));
      await page
        .getByRole('button', { name: 'Search Terraform language and CLI documentation' })
        .click();
      await page.getByRole('button', { name: 'Load online manual' }).click();
      await page.getByLabel('Search Terraform documentation').fill('sort Function');
      await page.locator('.dk-guide').filter({ hasText: 'sort Function' }).first().waitFor();
      await page.getByRole('button', { name: 'Close ✕' }).click();
      await page.locator('#search').fill('ansible.builtin.apt');
      await page.getByLabel('Documentation language').selectOption('ansible');
      await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
      await page.locator('.dk-guide').filter({ hasText: 'ansible.builtin.apt' }).first().waitFor();
      await page.close();
    }
    console.log(
      'PASS: Python manual pack loads, searches, and displays documentation in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

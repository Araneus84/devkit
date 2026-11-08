const { chromium } = require(process.env.DEVKIT_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.DEVKIT_CHROME ? { executablePath: process.env.DEVKIT_CHROME } : {}),
  });
  try {
    for (const edition of ['index.html', 'dist/devkit.html']) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(pathToFileURL(path.join(root, edition)).href);
      async function open(sheet, label, file) {
        await page.evaluate((id) => dbOpen('', id), sheet);
        await page
          .getByLabel(`Choose ${label} documentation pack`)
          .setInputFiles(path.join(root, 'documentation-packs', file));
        return page.getByLabel(`Search ${label} documentation`);
      }
      let input = await open('python', 'Python', 'python-3.15.json');
      await input.fill('ab');
      await page.getByRole('option', { name: 'abs()', exact: true }).waitFor();
      await input.press('ArrowDown');
      assert.equal(
        await page
          .getByRole('option', { name: 'abs()', exact: true })
          .getAttribute('aria-selected'),
        'false',
      );
      await input.press('ArrowUp');
      await input.press('Tab');
      assert.equal(await input.inputValue(), 'abs()');
      assert.match(
        await page.locator('.db-result').first().innerText(),
        /absolute value of a number/i,
      );
      await input.fill('os.gete');
      await page.getByRole('option', { name: 'os.getenv()', exact: true }).click();
      assert.match(await page.locator('.db-result').first().innerText(), /environment variable/i);
      await input.fill('abs');
      await input.press('Escape');
      assert.equal(await input.getAttribute('aria-expanded'), 'false');
      await input.press('Tab');
      assert.notEqual(
        await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
        'Search Python documentation',
      );
      for (const [sheet, label, file, query, expected] of [
        [
          'powershell',
          'PowerShell',
          'powershell-7.6.json',
          'Get-ChildItem',
          /items and child items/i,
        ],
        ['ansible', 'Ansible', 'ansible-core-2.21.json', 'ansible.builtin.apt', /apt.packages/i],
        ['terraform', 'Terraform', 'terraform-1.17.json', 'sort', /list of strings/i],
        ['docker', 'Docker', 'docker-2026-11.json', 'docker run', /container/i],
        ['bash', 'Bash', 'bash-5.3.json', 'Quoting', /special meaning/i],
        ['git', 'Git', 'git-2026-11.json', 'git commit', /commit/i],
        ['vim', 'Vim', 'vim-2026-11.json', ':w', /write/i],
        ['sql', 'SQL', 'postgresql-18.6.json', 'SELECT', /select/i],
        [
          'k8s',
          'Kubernetes',
          'kubernetes-2026-11.json',
          'Objects In Kubernetes',
          /Kubernetes objects/i,
        ],
        ['curl', 'curl', 'curl-2026-11.json', '--header', /header/i],
        ['node', 'Node.js', 'node-26.13.0.json', 'fs.readFile()', /asynchronously reads/i],
        ['jq', 'jq', 'jq-1.8.json', 'map()', /apply/i],
        ['npm', 'npm', 'npm-12.2.2.json', 'npm-ci', /npm ci/i],
        ['yaml', 'YAML', 'yaml-1.2.2.json', 'Node Anchors', /anchor/i],
        ['json', 'JSON', 'json-rfc8259.json', 'JSON Grammar', /json/i],
      ]) {
        await page.getByRole('button', { name: 'Close ✕' }).click();
        input = await open(sheet, label, file);
        if (sheet === 'powershell') {
          await input.fill('Get-Chi');
          await page.getByRole('option', { name: 'Get-ChildItem', exact: true }).waitFor();
          await input.press('Tab');
          assert.equal(await input.inputValue(), 'Get-ChildItem');
        }
        if (sheet === 'node') {
          await input.fill('fs.readF');
          await page.getByRole('option', { name: 'fs.readFile()', exact: true }).waitFor();
          await page.getByRole('option', { name: 'fs.readFile()', exact: true }).click();
          assert.equal(await input.inputValue(), 'fs.readFile()');
        }
        await input.fill(query);
        const first = page.locator('.db-result').first();
        assert.match(await first.innerText(), /Direct match/, `${sheet}: missing direct match`);
        assert.match(await first.innerText(), expected, `${sheet}: missing relevant description`);
      }
      assert.deepEqual(errors, []);
      await page.close();
      const hosted = await browser.newPage();
      const fs = require('node:fs');
      await hosted.route('https://devkit.test/**', async (route) => {
        const file = path.resolve(root, '.' + new URL(route.request().url()).pathname);
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.abort();
        await route.fulfill({ path: file });
      });
      await hosted.goto(`https://devkit.test/${edition}`);
      await hosted.evaluate(() => dbOpen('', 'python'));
      await hosted.getByRole('button', { name: 'Load online manual' }).click();
      const hostedSearch = hosted.getByLabel('Search Python documentation');
      await hostedSearch.fill('ab');
      await hostedSearch.press('Tab');
      assert.equal(await hostedSearch.inputValue(), 'abs()');
      assert.match(await hosted.locator('.db-result').first().innerText(), /absolute value/i);
      await hosted.close();
    }
    console.log(
      'PASS: cross-manual direct matches, offline packs, Tab completion, click, Escape and ordinary focus in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

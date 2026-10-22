// Category navigation and the home dashboard: coverage, rendering, pinning, filtering, usage tracking.
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
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } }),
        page = await context.newPage(),
        errors = [],
        network = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('request', (r) => /^https?:/.test(r.url()) && network.push(r.url()));
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', entry)).href);
      await page.waitForSelector('.home');

      // Every sheet belongs to exactly one declared category (no silent "Other" bucket).
      const coverage = await page.evaluate(() => {
        const seen = new Map();
        for (const c of DK_CATEGORIES)
          for (const k of c.sheets) seen.set(k, (seen.get(k) || 0) + 1);
        return {
          missing: Object.keys(SHEETS).filter((k) => !seen.has(k)),
          duplicated: [...seen].filter(([, n]) => n > 1).map(([k]) => k),
          unknown: [...seen.keys()].filter((k) => !SHEETS[k]),
          other: dkCategoryList().some((c) => c.id === 'other'),
        };
      });
      assert.deepEqual(coverage.missing, [], 'sheets without a category');
      assert.deepEqual(coverage.duplicated, []);
      assert.deepEqual(coverage.unknown, []);
      assert.equal(coverage.other, false);

      // Home dashboard is the default landing page with all categories.
      assert.equal(await page.locator('.hm-cat').count(), 7);
      assert((await page.locator('.hm-stat').count()) >= 4);
      assert.equal(await page.locator('.nav-cat').count(), 7);
      assert(await page.locator('.hm-hero h1').isVisible());

      // Intent chips run the unified search.
      await page.locator('.hm-chip').first().click();
      assert((await page.locator('.us-result').count()) > 0);
      await page.locator('#search').fill('');
      await page.locator('#search').dispatchEvent('input');
      await page.waitForSelector('.home');

      // Category cards open sheets, which then show up as recents and in the sidebar.
      await page.locator('.hm-sheet[data-sheet="dns"]').click();
      assert.equal(await page.locator('.page-title').first().innerText(), 'DNS Operations');
      assert(
        await page
          .locator('.nav-cat[data-cat="network"]')
          .evaluate((e) => e.classList.contains('open')),
      );
      assert(
        await page
          .locator('.nav-toggle[data-sheet="dns"]')
          .evaluate((e) => e.classList.contains('has-active')),
      );

      // Sidebar sections can be collapsed and the state is remembered.
      await page.locator('.nav-cat[data-cat="network"] .nav-cat-head').click();
      assert.equal(
        await page.locator('.nav-cat[data-cat="network"] .nav-sheet-btn').first().isVisible(),
        true,
        'active category stays open',
      );
      await page.locator('.nav-cat[data-cat="cloud"] .nav-cat-head').click();
      assert(
        await page
          .locator('.nav-cat[data-cat="cloud"]')
          .evaluate((e) => e.classList.contains('open')),
      );
      await page.reload();
      await page.waitForSelector('.nav-cat[data-cat="cloud"].open');

      // Pinning, filtering and recents.
      await page.locator('.nav-toggle[data-sheet="docker"] .nav-pin').click({ force: true });
      assert.equal(await page.locator('.pinned-cat .nav-toggle[data-sheet="docker"]').count(), 1);
      await page.locator('.nav-filter').fill('load bal');
      assert.equal(await page.locator('.nav-cat:not(.pinned-cat) .nav-toggle').count(), 1);
      await page.locator('.nav-filter').fill('zzzz-nothing');
      assert(await page.locator('.nav-empty').isVisible());
      await page.locator('.nav-filter').fill('');
      await page.locator('.nav-item', { hasText: 'Home' }).click();
      await page.waitForSelector('.home');
      assert(await page.locator('.hm-tiles .hm-tile[data-sheet="dns"]').count());
      assert(
        await page.locator('.hm-tiles .hm-tile[data-sheet="docker"]').count(),
        'pinned shows on home',
      );

      // Copying a command ranks it under "Most used".
      await page.evaluate(() => {
        addToHistory('ls -lah');
        addToHistory('ls -lah');
        renderHome();
      });
      assert.match(await page.locator('.hm-cmd').first().innerText(), /ls -lah/);
      assert.match(await page.locator('.hm-cmd-meta').first().innerText(), /2×/);

      // No horizontal scroll on a phone and the drawer lists the categories.
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(200);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        await page.evaluate(() => innerWidth),
      );
      await page.locator('#mobile-menu-btn').click();
      assert(await page.locator('.nav-cat-head').first().isVisible());

      assert.deepEqual(network, [], entry + ' used the network');
      assert.deepEqual(errors, [], entry + ' had page errors');
      await context.close();
    }
    console.log(
      'PASS: categories cover every sheet; home dashboard, sidebar groups, pins, filter, recents, usage and mobile drawer work in both editions.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

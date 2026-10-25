import { test, expect } from '@playwright/test';

test('metric history renders formulas and hides the full baseline table', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/#likelihood-entropy-results');
  const results = page.locator('#likelihood-entropy-results');
  await expect(results).toContainText('-8.437898');
  await expect(page.locator('#likelihood-entropy-baseline .katex')).not.toHaveCount(0);
  await expect(results.locator('.stress-table')).not.toBeVisible();
  await results.locator('summary').click();
  await expect(results.locator('.stress-table tbody tr')).toHaveCount(113);
  await results.locator('summary').click();
  await results.screenshot({ path: '../.cache/website-preview/kl-baseline.png', style: '.site-header { visibility: hidden; }' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('stress suites keep phases and paired controls separate', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/#paired-structural');
  const paired = page.locator('[data-suite="paired"]');
  await expect(paired.locator('.stress-status')).toContainText('0/5 positive');
  await expect(paired.locator('circle')).toHaveCount(5);
  const adaptive = page.locator('[data-suite="adaptive"]');
  await expect(adaptive.locator('circle')).toHaveCount(14);
  await adaptive.locator('.stress-phase').selectOption('dev');
  await adaptive.locator('.stress-metric').selectOption('nll');
  await expect(adaptive.locator('.stress-status')).toContainText('dev');
  await expect(adaptive.locator('circle')).toHaveCount(14);
  const corruption = page.locator('[data-suite="corruption"]');
  await expect(corruption.locator('circle')).toHaveCount(39);
  await expect(corruption.locator('.stress-table')).not.toBeVisible();
  await corruption.locator('.stress-family').selectOption('collapse');
  await expect(corruption.locator('circle')).toHaveCount(7);
  await corruption.locator('.stress-raw summary').click();
  await expect(corruption.locator('.stress-table tbody tr')).toHaveCount(7);
  await corruption.locator('.stress-raw summary').click();
  await corruption.locator('.stress-family').selectOption('all');
  await corruption.screenshot({ path: '../.cache/website-preview/corruption-stress.png', style: '.site-header { visibility: hidden; }' });
  await expect(page.locator('[data-suite="matched"] .stress-status')).toContainText('3/3 positive');
  await paired.screenshot({ path: '../.cache/website-preview/paired-stress.png', style: '.site-header { visibility: hidden; }' });
  await page.locator('#theme-toggle').click();
  await paired.screenshot({ path: '../.cache/website-preview/paired-stress-dark.png', style: '.site-header { visibility: hidden; }' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
});

test('adversarial margins include every configuration and expose negative likelihood margins', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/#adversarial-samples');
  await expect(page.locator('#adversarial-status')).toContainText('73 configurations');
  await expect(page.locator('.adversarial-panel')).toHaveCount(6);
  await expect(page.locator('#adversarial-results .adversarial-point')).toHaveCount(438);
  await expect(page.locator('[data-metric="conditional"] h4')).toContainText('73/73');
  await expect(page.locator('[data-metric="nll"] h4')).toContainText('40/73');
  await expect(page.locator('[data-metric="nll"] .negative')).toHaveCount(33);
  await page.locator('[data-metric="nll"] .negative').first().focus();
  await expect(page.locator('#adversarial-detail')).toContainText('Qwen3-8B-Base NLL');
  await page.locator('#adversarial-metric').selectOption('nll');
  await expect(page.locator('#adversarial-summary tbody tr')).toHaveCount(4);
  await expect(page.locator('#adversarial-points tbody tr')).toHaveCount(73);
  await expect(page.locator('#adversarial-summary tbody tr').nth(1)).toContainText('1/10');
  await page.locator('#adversarial-results').screenshot({ path: '../.cache/website-preview/adversarial-light.png', style: '.site-header { visibility: hidden; }' });
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  await page.locator('#adversarial-results').screenshot({ path: '../.cache/website-preview/adversarial-dark.png', style: '.site-header { visibility: hidden; }' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('downstream figures show all settings and preserve raw point counts', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/#downstream-performance');
  await expect(page.locator('#downstream-status')).toContainText('0.892');
  await expect(page.locator('#downstream-scatter g[tabindex]')).toHaveCount(24);
  await expect(page.locator('#downstream-correlations tbody tr')).toHaveCount(5);
  await expect(page.locator('#downstream-points tbody tr')).toHaveCount(24);
  await expect(page.locator('#downstream-comparison tbody tr')).toHaveCount(5);
  for (const [metric, expected] of [['sol','0.943'], ['ed','0.923'], ['gm','0.857'], ['nll','0.942']]) {
    await page.locator('#downstream-metric').selectOption(metric);
    await expect(page.locator('#downstream-status')).toContainText(expected);
    await expect(page.locator('#downstream-scatter g[tabindex]')).toHaveCount(24);
  }
  await page.locator('#downstream-metric').selectOption('conditional');
  await page.locator('#downstream-results').screenshot({ path: '../.cache/website-preview/downstream-light.png', style: '.site-header { visibility: hidden; }' });
  await page.locator('#downstream-setting').selectOption('t13');
  await expect(page.locator('#downstream-status')).toContainText('-0.108');
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  await page.locator('#downstream-results').screenshot({ path: '../.cache/website-preview/downstream-dark.png', style: '.site-header { visibility: hidden; }' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('dark theme persists, supports keyboard input, and remains readable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark mode', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '../.cache/website-preview/dark-desktop.png' });
  await page.goto('/#notation-compression');
  await expect(page.locator('#notation-compression .katex-display').first()).toBeVisible();
  await page.screenshot({ path: '../.cache/website-preview/dark-equations.png' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(toggle).toBeInViewport();
  await page.screenshot({ path: '../.cache/website-preview/dark-mobile.png' });
  await page.emulateMedia({ media: 'print' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await page.emulateMedia({ media: 'screen' });
  await toggle.click();
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('theme toggle still works when local storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('reading, math, bibliography, mobile layout, and comments', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  let embedRequests = 0;
  await page.route('https://hypothes.is/embed.js', route => {
    embedRequests++;
    return route.fulfill({ contentType: 'application/javascript', body: 'window.annotationTestLoaded = true;' });
  });
  await page.setViewportSize({ width: 1400, height: 1050 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.katex').first()).toBeVisible();
  expect(embedRequests).toBe(0);
  await page.screenshot({ path: '../.cache/website-preview/desktop.png' });
  await page.goto('/#prefix-free-codes');
  await expect(page.locator('#prefix-free-codes')).toHaveAttribute('open', '');
  await page.locator('a[id^="citation-"]').first().click();
  await expect(page).toHaveURL(/#bib-/);
  await page.locator('.reference-backlinks a').first().click();
  await expect(page).toHaveURL(/#citation-/);
  await page.locator('#comment-button').click();
  await expect(page.locator('#comments-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#comments-dialog')).not.toBeVisible();
  await page.locator('#comment-button').click();
  await page.locator('#enable-comments').click();
  await expect(page.locator('#comment-button')).toContainText('Comments enabled');
  expect(embedRequests).toBe(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '../.cache/website-preview/mobile.png' });
  expect(errors).toEqual([]);
});

test('annotation loading failures allow retry', async ({ page }) => {
  await page.route('https://hypothes.is/embed.js', route => route.abort());
  await page.goto('/');
  await page.locator('#comment-button').click();
  await page.locator('#enable-comments').click();
  await expect(page.locator('#comment-status')).toContainText('could not load');
  await expect(page.locator('#enable-comments')).toBeEnabled();
  await page.unroute('https://hypothes.is/embed.js');
  await page.route('https://hypothes.is/embed.js', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.locator('#enable-comments').click();
  await expect(page.locator('#comment-button')).toContainText('Comments enabled');
});

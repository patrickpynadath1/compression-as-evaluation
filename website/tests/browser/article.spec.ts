import { test, expect } from '@playwright/test';

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

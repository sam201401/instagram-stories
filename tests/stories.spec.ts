import { test, expect } from '@playwright/test';

test.describe('Instagram Stories Feature', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text())); // Log app console
    await page.goto('http://localhost:5173');
    await page.waitForSelector('img', { timeout: 10000 });
  });

  test('loads the story list with 10 thumbnails', async ({ page }) => {
    await expect(page.locator('img')).toHaveCount(10);
  });

  test('opens a story and auto-advances', async ({ page }) => {
    await page.locator('img').first().click();
    const viewerImage = page.locator('div[style*="position: fixed"] img');
    const initialSrc = await viewerImage.getAttribute('src');
    console.log('TEST LOG: Initial image src:', initialSrc); // Terminal log
    await expect(viewerImage).toHaveAttribute('src', /1366919/); // Story 1

    await page.waitForTimeout(6000);
    const afterSrc = await viewerImage.getAttribute('src');
    console.log('TEST LOG: After 6s src:', afterSrc); // Terminal log
    await expect(viewerImage).toHaveAttribute('src', /1547813/); // Story 2
  });

  test('navigates manually with taps', async ({ page }) => {
    await page.locator('img').first().click();
    const viewerImage = page.locator('div[style*="position: fixed"] img');
    await page.locator('div[style*="position: fixed"]').click({ position: { x: 300, y: 300 } });
    await expect(viewerImage).toHaveAttribute('src', /1547813/);
    await page.locator('div[style*="position: fixed"]').click({ position: { x: 50, y: 300 } });
    await expect(viewerImage).toHaveAttribute('src', /1366919/);
  });
});
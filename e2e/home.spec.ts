import { test, expect } from '@playwright/test';

/**
 * Note: To run these tests, you need to install Playwright first:
 * npm install -D @playwright/test
 * npx playwright install
 */

test.describe('Pokedex App', () => {
  test('should navigate to the home page', async ({ page }) => {
    // Start from the index page
    await page.goto('/');
    
    // The new page should contain an h1 with "Pokedex" or similar title
    // Adjust selector based on actual content
    await expect(page).toHaveTitle(/Pokedex/i);
    
    // Check if search input exists
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should load pokemon list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pokemon cards to appear
    // Using a class selector that matches the cards
    const firstCard = page.locator('.card').first();
    await expect(firstCard).toBeVisible();
    
    // Check if image is loaded
    await expect(firstCard.locator('img')).toBeVisible();
  });

  test('should navigate to detail page', async ({ page }) => {
    await page.goto('/');
    
    // Click on the first card
    const firstCard = page.locator('.card').first();
    await firstCard.click();
    
    // Check if URL changed
    await expect(page).toHaveURL(/\/pokemon\//);
    
    // Check if detail content is visible
    await expect(page.locator('h1')).toBeVisible();
  });
});

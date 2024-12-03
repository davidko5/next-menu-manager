import { test, expect } from '@playwright/test';
const { describe, beforeEach } = test;

describe('add-navigation-page', () => {
  beforeEach(async ({ page }) => {
    // Firstly go to the home page
    await page.goto('http://localhost:3000/');
    // Click on the add navigation button
    await page.click('text=+ Dodaj nawigację');
    // Check if the URL is correct
    await expect(page).toHaveURL('http://localhost:3000/add-navigation');
  });

  test('Check header presence', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dodaj nawigację');
  });

  test('Check if possible to initialize item', async ({ page }) => {
    await page.getByTestId('initial-add-button').click();
    await expect(page.getByTestId('menu-item-manage')).toBeVisible();
  });

  test('Check if possible to add item', async ({ page }) => {
    await page.getByTestId('initial-add-button').click();
    // await expect(page.getByTestId('menu-item-manage')).toBeVisible();

    await page.getByRole('textbox', {name: 'Nazwa'}).fill('Promocje');
    await page.getByRole('textbox', {name: 'Link'}).nth(1).fill('http://example.com');
    await page.getByTestId('item-manage-confirm-button').click();
    await expect(page.getByTestId('menu-item-viewing-container')).toContainText('Promocje');
  });
});

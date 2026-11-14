import { test, expect } from '@playwright/test';

test.describe('SEIM Earthquake Simulation App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads dashboard layout and controls', async ({ page }) => {
    // Assert title and brand
    await expect(page).toHaveTitle(/SEIM - Earthquake Simulation/i);
    await expect(page.getByText('SEIM Simulation')).toBeVisible();

    // Assert Navbar actions and buttons
    await expect(page.getByRole('button', { name: /Refresh/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Mode:/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Simulation Panel/i })).toBeVisible();

    // Assert Map container is present
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();

    // Assert Layer controls
    await expect(page.getByRole('button', { name: /Sensors/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Buildings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Distance Rings/i })).toBeVisible();
  });

  test('switches simulation tabs and updates severity calculations', async ({ page }) => {
    // Check initial Simulation tab
    await expect(page.getByText('Epicenter & Magnitude')).toBeVisible();
    await expect(page.getByText('Structural Impact Summary')).toBeVisible();

    // Switch to Structures tab
    await page.getByRole('button', { name: /Structures/i }).click();
    await expect(page.getByPlaceholder(/Filter by building name/i)).toBeVisible();

    // Switch to Bands & Legend tab
    await page.getByRole('button', { name: /Bands & Legend/i }).click();
    await expect(page.getByText('Severe')).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
    await expect(page.getByText('Moderate')).toBeVisible();
    await expect(page.getByText('Low')).toBeVisible();
  });

  test('allows magnitude adjustments and preset epicenter selection', async ({ page }) => {
    // Adjust magnitude slider
    const slider = page.locator('#magnitude-slider');
    await slider.fill('7.2');
    await expect(page.getByText('7.2')).toBeVisible();

    // Click North Fault preset button
    await page.getByRole('button', { name: /North Fault/i }).click();
    await expect(page.locator('#lat-input')).toHaveValue('13.040000');
    await expect(page.locator('#lon-input')).toHaveValue('77.600000');
  });

  test('toggles layers on and off', async ({ page }) => {
    const sensorsBtn = page.getByRole('button', { name: /Sensors/i });
    await expect(sensorsBtn).toHaveClass(/active/);
    await sensorsBtn.click();
    await expect(sensorsBtn).not.toHaveClass(/active/);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Futures Risk Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded and Alpine to initialize
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Give Alpine time to mount
  });

  test.describe('Simple Mode Calculations', () => {
    test('should calculate correct R:R ratio for MNQ', async ({ page }) => {
      // The page already loads with default values, so let's verify them first
      const winningTradesInput = page.locator('label:has-text("Winning Trades") + input');
      const losingTradesInput = page.locator('label:has-text("Losing Trades") + input');
      const ticksGainedInput = page.locator('label:has-text("Profit Target (Ticks)") + input');
      const ticksLostInput = page.locator('label:has-text("Stop Loss (Ticks)") + input');
      
      // Clear and set values
      await winningTradesInput.clear();
      await winningTradesInput.fill('2');
      await losingTradesInput.clear();
      await losingTradesInput.fill('2');
      await ticksGainedInput.clear();
      await ticksGainedInput.fill('120');
      await ticksLostInput.clear();
      await ticksLostInput.fill('68');
      
      // Wait for calculations
      await page.waitForTimeout(500);
      
      // Verify R:R calculation (120/68 = 1.76)
      const rrValue = await page.locator('label:has-text("R ratio")').locator('..').locator('div').last().textContent();
      expect(rrValue).toBe('1.76:1');
      
      // Verify win percentage (2/(2+2) = 50%)
      const winPercent = await page.locator('label:has-text("Win/Loss %")').locator('..').locator('div').last().textContent();
      expect(winPercent).toBe('50%');
    });

    test('should calculate correct daily P&L for MNQ', async ({ page }) => {
      // Use more specific selectors for the stats grid
      const statsGrid = page.locator('.grid').first();
      
      const grossDaily = await statsGrid.locator('.border:has-text("Gross Daily")').locator('div').nth(1).textContent();
      expect(grossDaily).toBe('$52.00');
      
      const commission = await statsGrid.locator('.border:has-text("Commissions")').locator('div').nth(1).textContent();
      expect(commission).toBe('$5.40');
      
      const netDaily = await statsGrid.locator('.border:has-text("Net P/L (Total)")').locator('div').nth(1).textContent();
      expect(netDaily).toBe('$46.60');
    });

    test('should calculate expectancy correctly', async ({ page }) => {
      await page.waitForTimeout(500);
      
      // Find expectancy value
      const expectancySection = page.locator('h4:has-text("Expectancy")').locator('..');
      const expectancyValue = await expectancySection.locator('span:has-text("Per Trade:")').locator('..').locator('span').nth(1).textContent();
      const expectancy = parseFloat(expectancyValue.replace('$', ''));
      expect(expectancy).toBeCloseTo(11.65, 1);
      
      // Expectancy in R
      const expectancyR = await expectancySection.locator('span:has-text("In R terms:")').locator('..').locator('span').last().textContent();
      expect(expectancyR).toContain('0.343R');
    });

    test('should scale P&L with multiple accounts', async ({ page }) => {
      // Find and update number of accounts
      const accountsInput = page.locator('label:has-text("Number of Accounts")').locator('..').locator('input');
      await accountsInput.clear();
      await accountsInput.fill('5');
      
      await page.waitForTimeout(500);
      
      // Use more specific selectors for the stats grid
      const statsGrid = page.locator('.grid').first();
      
      // Net total for 5 accounts should be $46.60 * 5 = $233.00
      const netTotal = await statsGrid.locator('.border:has-text("Net P/L (Total)")').locator('div').nth(1).textContent();
      expect(netTotal).toBe('$233.00');
      
      // Weekly: $233 * 5 = $1,165.00
      const weeklyTotal = await statsGrid.locator('.border:has-text("Weekly Total")').locator('div').nth(1).textContent();
      expect(weeklyTotal).toBe('$1165.00'); // No comma in the output
    });
  });

  test.describe('Target Simulation Mode', () => {
    test('should enable target simulation and show controls', async ({ page }) => {
      // Find and click the target simulation toggle - force click the hidden checkbox
      const targetToggle = page.locator('input[x-model="useTargetSimulation"]');
      await targetToggle.click({ force: true });
      
      await page.waitForTimeout(500);
      
      // Verify target controls are visible
      await expect(page.locator('button:has-text("Conservative")')).toBeVisible();
      await expect(page.locator('button:has-text("Moderate")')).toBeVisible();
      await expect(page.locator('button:has-text("Aggressive")')).toBeVisible();
    });
  });

  test.describe('Breakeven Simulation', () => {
    test('should enable breakeven simulation', async ({ page }) => {
      // Find and click the breakeven simulation toggle - force click the hidden checkbox
      const breakevenToggle = page.locator('input[x-model="useBreakevenStop"]');
      await breakevenToggle.click({ force: true });
      
      await page.waitForTimeout(500);
      
      // Check that BE indicator appears
      await expect(page.locator('span:has-text("BE")[title="Breakeven simulation active"]')).toBeVisible();
      
      // Verify breakeven controls are visible
      await expect(page.locator('label:has-text("BE Trigger (Points)")')).toBeVisible();
    });
  });

  test.describe('Detailed View', () => {
    test('should toggle detailed view and show table', async ({ page }) => {
      // Set number of accounts first
      const accountsInput = page.locator('label:has-text("Number of Accounts")').locator('..').locator('input');
      await accountsInput.clear();
      await accountsInput.fill('3');
      
      // Toggle detailed view - force click the hidden checkbox
      const detailedViewToggle = page.locator('input[x-model="showDetailedView"]');
      await detailedViewToggle.click({ force: true });
      
      await page.waitForTimeout(500);
      
      // Verify table is visible
      await expect(page.locator('table')).toBeVisible();
      
      // Verify correct number of account rows (3 accounts + 1 total row)
      const rows = await page.locator('tbody tr').count();
      expect(rows).toBe(4); // 3 accounts + 1 total row
    });
  });

  test.describe('URL Sharing', () => {
    test('should open share modal and generate URL', async ({ page }) => {
      // Click share button
      await page.click('button:has-text("Share")');
      
      await page.waitForTimeout(500);
      
      // Verify modal is visible
      await expect(page.locator('h3:has-text("Share Your Configuration")')).toBeVisible();
      
      // Verify URL contains parameters - using the actual parameter names
      const shareURL = await page.locator('input[readonly]').inputValue();
      expect(shareURL).toContain('wt='); // winning trades
      expect(shareURL).toContain('lt='); // losing trades
      expect(shareURL).toContain('tg='); // ticks gained
      expect(shareURL).toContain('tl='); // ticks lost
      
      // Close modal
      await page.click('button:has-text("Close")');
      await expect(page.locator('h3:has-text("Share Your Configuration")')).not.toBeVisible();
    });

    test('should not show share modal on page refresh', async ({ page }) => {
      // Navigate with parameters - using the correct parameter names
      await page.goto('/?c=ES&wt=5&lt=3&tg=200&tl=100&nc=2');
      
      await page.waitForTimeout(1000);
      
      // Verify share modal is NOT visible
      await expect(page.locator('h3:has-text("Share Your Configuration")')).not.toBeVisible();
      
      // Verify values were loaded - check the subtitle which shows the active contract
      const subtitle = await page.locator('p.text-sm').textContent();
      expect(subtitle).toContain('ES Performance Calculator');
      
      // Verify other values loaded correctly
      const winningTradesInput = page.locator('label:has-text("Winning Trades") + input');
      expect(await winningTradesInput.inputValue()).toBe('5');
      
      const losingTradesInput = page.locator('label:has-text("Losing Trades") + input');
      expect(await losingTradesInput.inputValue()).toBe('3');
    });
  });

  test.describe('Dark Mode', () => {
    test('should toggle dark mode', async ({ page }) => {
      // Check initial state
      const htmlElement = page.locator('html');
      const initialDarkMode = await htmlElement.evaluate(el => el.classList.contains('dark'));
      
      // Find and click the dark mode toggle button
      const darkModeButton = page.locator('button[title*="Mode"]').first();
      await darkModeButton.click();
      
      await page.waitForTimeout(300);
      
      // Verify dark mode toggled
      const afterToggle = await htmlElement.evaluate(el => el.classList.contains('dark'));
      expect(afterToggle).toBe(!initialDarkMode);
    });
  });
});
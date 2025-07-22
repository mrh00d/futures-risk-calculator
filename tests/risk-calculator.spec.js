import { test, expect } from '@playwright/test';

test.describe('Futures Risk Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Simple Mode Calculations', () => {
    test('should calculate correct R:R ratio for MNQ', async ({ page }) => {
      // Set up MNQ trade parameters
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120');
      await page.fill('input[x-model="ticksLost"]', '68');
      await page.fill('input[x-model="numContracts"]', '1');
      
      // Verify R:R calculation (120/68 = 1.76)
      const rrValue = await page.textContent('text="R ratio"/../div');
      expect(rrValue).toBe('1.76:1');
      
      // Verify win percentage (2/(2+2) = 50%)
      const winPercent = await page.textContent('text="Win/Loss %"/../div');
      expect(winPercent).toBe('50%');
    });

    test('should calculate correct daily P&L for MNQ', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120');
      await page.fill('input[x-model="ticksLost"]', '68');
      await page.fill('input[x-model="numContracts"]', '1');
      
      // MNQ tick value is $0.50
      // Gross: (120 * 0.50 * 2) - (68 * 0.50 * 2) = $120 - $68 = $52
      // Commission: 1.35 * 4 trades * 1 contract = $5.40
      // Net: $52 - $5.40 = $46.60
      
      await page.waitForTimeout(500); // Allow calculations to update
      
      const grossDaily = await page.textContent('text="Gross Daily"/../div');
      expect(grossDaily).toBe('$52.00');
      
      const commission = await page.textContent('text="Commissions"/../div');
      expect(commission).toBe('$5.40');
      
      const netDaily = await page.textContent('text="Net P/L (Total)"/../div');
      expect(netDaily).toBe('$46.60');
    });

    test('should calculate expectancy correctly', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120');
      await page.fill('input[x-model="ticksLost"]', '68');
      await page.fill('input[x-model="numContracts"]', '1');
      
      await page.waitForTimeout(500);
      
      // Win rate: 50%
      // Avg win: (120 * 0.50) - 1.35 = $58.65
      // Avg loss: (68 * 0.50) + 1.35 = $35.35
      // Expectancy: (0.5 * 58.65) - (0.5 * 35.35) = $11.65
      
      const expectancyText = await page.textContent('text="Per Trade:"/../span/span');
      const expectancy = parseFloat(expectancyText);
      expect(expectancy).toBeCloseTo(11.65, 1);
      
      // Expectancy in R: 11.65 / 34 = 0.343R
      const expectancyR = await page.textContent('text="In R terms:"/../span');
      expect(expectancyR).toContain('0.343R');
    });

    test('should show R:R stays constant but expectancy changes with win rate', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="ticksGained"]', '100');
      await page.fill('input[x-model="ticksLost"]', '50');
      await page.fill('input[x-model="numContracts"]', '1');
      
      // Test with 50% win rate
      await page.fill('input[x-model="winningTrades"]', '5');
      await page.fill('input[x-model="losingTrades"]', '5');
      await page.waitForTimeout(300);
      
      let rrValue = await page.textContent('text="R ratio"/../div');
      expect(rrValue).toBe('2.00:1'); // R:R should be 100/50 = 2.0
      
      let expectancyPerTrade = await page.textContent('text="Per Trade:"/../span/span');
      let expectancy50 = parseFloat(expectancyPerTrade);
      
      // Test with 30% win rate  
      await page.fill('input[x-model="winningTrades"]', '3');
      await page.fill('input[x-model="losingTrades"]', '7');
      await page.waitForTimeout(300);
      
      rrValue = await page.textContent('text="R ratio"/../div');
      expect(rrValue).toBe('2.00:1'); // R:R should still be 2.0
      
      expectancyPerTrade = await page.textContent('text="Per Trade:"/../span/span');
      let expectancy30 = parseFloat(expectancyPerTrade);
      
      // Expectancy should be lower with 30% win rate
      expect(expectancy30).toBeLessThan(expectancy50);
      expect(expectancy30).toBeLessThan(0); // Should be negative with 30% win rate and 2:1 R:R
    });

    test('should scale P&L with multiple accounts', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120');
      await page.fill('input[x-model="ticksLost"]', '68');
      await page.fill('input[x-model="numContracts"]', '1');
      await page.fill('input[x-model="numAccounts"]', '5');
      
      await page.waitForTimeout(500);
      
      // Net per account: $46.60
      // Total for 5 accounts: $46.60 * 5 = $233.00
      const netTotal = await page.textContent('text="Net P/L (Total)"/../div');
      expect(netTotal).toBe('$233.00');
      
      // Weekly: $233 * 5 = $1,165.00
      const weeklyTotal = await page.textContent('text="Weekly Total"/../div');
      expect(weeklyTotal).toBe('$1,165.00');
    });

    test('should calculate prop firm days correctly', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120');
      await page.fill('input[x-model="ticksLost"]', '68');
      await page.fill('input[x-model="numContracts"]', '1');
      await page.fill('input[x-model="numAccounts"]', '1');
      
      // Select a prop firm target
      await page.selectOption('select[x-model="selectedPropFirm"]', 'topstep_50k');
      await page.waitForTimeout(500);
      
      // Target should be $3000
      const targetValue = await page.inputValue('input[x-model="eaProfitTarget"]');
      expect(targetValue).toBe('3000');
      
      // Days to pass: $3000 / $46.60 = 64.4 days
      const daysToPass = await page.textContent('text="Days to Pass (1 Account)"/../span[@class="font-semibold"]');
      expect(parseFloat(daysToPass)).toBeCloseTo(64.4, 0);
    });
  });

  test.describe('Target Simulation Mode', () => {
    test('should enable target simulation and show controls', async ({ page }) => {
      await page.check('input[x-model="useTargetSimulation"]');
      
      // Verify target controls are visible
      await expect(page.locator('text="Conservative"')).toBeVisible();
      await expect(page.locator('text="Moderate"')).toBeVisible();
      await expect(page.locator('text="Aggressive"')).toBeVisible();
    });

    test('should calculate blended R:R with conservative targets', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="ticksLost"]', '40'); // 10 points stop loss
      await page.fill('input[x-model="numContracts"]', '5');
      await page.check('input[x-model="useTargetSimulation"]');
      
      // Click conservative preset
      await page.click('button:has-text("Conservative")');
      await page.waitForTimeout(500);
      
      // Conservative: 60% at 1R (10pts), 30% at 2R (20pts), 10% at 3R (30pts)
      // Should set: 3 contracts at 10pts, 2 at 20pts, 0 at 30pts (rounds to nearest)
      const target1Contracts = await page.inputValue('input[x-model="target1Contracts"]');
      const target2Contracts = await page.inputValue('input[x-model="target2Contracts"]');
      const target3Contracts = await page.inputValue('input[x-model="target3Contracts"]');
      
      expect(parseInt(target1Contracts) + parseInt(target2Contracts) + parseInt(target3Contracts)).toBe(5);
      
      // Verify blended R:R is displayed
      const blendedRR = await page.textContent('text="Blended R:R:"/../span[@class="font-semibold"]');
      expect(blendedRR).toContain(':1');
    });

    test('should show warning when target contracts mismatch', async ({ page }) => {
      await page.fill('input[x-model="numContracts"]', '5');
      await page.check('input[x-model="useTargetSimulation"]');
      
      // Manually set targets that don't match
      await page.fill('input[x-model="target1Contracts"]', '2');
      await page.fill('input[x-model="target2Contracts"]', '2');
      await page.fill('input[x-model="target3Contracts"]', '2'); // Total 6, but position is 5
      
      await page.waitForTimeout(500);
      
      // Should show warning
      const warning = await page.textContent('text*=Target contracts');
      expect(warning).toContain('≠');
    });

    test('should update all calculations with target simulation', async ({ page }) => {
      await page.selectOption('select:has-text("Select Futures Contract")', 'MNQ');
      await page.fill('input[x-model="winningTrades"]', '2');
      await page.fill('input[x-model="losingTrades"]', '2');
      await page.fill('input[x-model="ticksGained"]', '120'); // This should be ignored when simulation is on
      await page.fill('input[x-model="ticksLost"]', '40'); // 10 points
      await page.fill('input[x-model="numContracts"]', '5');
      await page.check('input[x-model="useTargetSimulation"]');
      
      // Set manual targets: 3 at 10pts, 1 at 20pts, 1 at 40pts
      await page.fill('input[x-model="target1Contracts"]', '3');
      await page.fill('input[x-model="target1Points"]', '10');
      await page.fill('input[x-model="target2Contracts"]', '1');
      await page.fill('input[x-model="target2Points"]', '20');
      await page.fill('input[x-model="target3Contracts"]', '1');
      await page.fill('input[x-model="target3Points"]', '40');
      
      await page.waitForTimeout(500);
      
      // Average exit: (3*10 + 1*20 + 1*40) / 5 = 90/5 = 18 points = 72 ticks
      const avgExitTicks = await page.textContent('text="Avg Exit (Ticks):"/../span[@class="font-semibold"]');
      expect(avgExitTicks).toBe('72');
      
      // Blended R:R: 72/40 = 1.8
      const blendedRR = await page.textContent('text="Blended R:R:"/../span[@class="font-semibold"]');
      expect(blendedRR).toBe('1.80:1');
      
      // Should show indicator that we're using averaged ticks
      const usingAvg = await page.textContent('text*=Using avg');
      expect(usingAvg).toContain('72 ticks');
    });
  });

  test.describe('Contract-specific calculations', () => {
    test('should handle different tick/point ratios correctly', async ({ page }) => {
      // Test ES (4 ticks per point)
      await page.selectOption('select:has-text("Select Futures Contract")', 'ES');
      await page.fill('input[x-model="converterPoints"]', '10');
      await page.waitForTimeout(300);
      
      let ticksResult = await page.textContent('text="Points"/../following-sibling::div[contains(text(), "ticks")]');
      expect(ticksResult).toContain('40 ticks');
      
      // Test YM (1 tick per point)
      await page.selectOption('select:has-text("Select Futures Contract")', 'YM');
      await page.fill('input[x-model="converterPoints"]', '10');
      await page.waitForTimeout(300);
      
      ticksResult = await page.textContent('text="Points"/../following-sibling::div[contains(text(), "ticks")]');
      expect(ticksResult).toContain('10 ticks');
      
      // Test CL (100 ticks per point)
      await page.selectOption('select:has-text("Select Futures Contract")', 'CL');
      await page.fill('input[x-model="converterPoints"]', '1');
      await page.waitForTimeout(300);
      
      ticksResult = await page.textContent('text="Points"/../following-sibling::div[contains(text(), "ticks")]');
      expect(ticksResult).toContain('100 ticks');
    });
  });

  test.describe('URL Sharing', () => {
    test('should open share modal and generate URL', async ({ page }) => {
      // Set some values
      await page.fill('input[x-model="winningTrades"]', '3');
      await page.fill('input[x-model="losingTrades"]', '1');
      
      // Click share button
      await page.click('button:has-text("Share")');
      
      // Verify modal is visible
      await expect(page.locator('text="Share Your Configuration"')).toBeVisible();
      
      // Verify URL contains parameters
      const shareURL = await page.inputValue('input[x-model="shareURL"]');
      expect(shareURL).toContain('wt=3');
      expect(shareURL).toContain('lt=1');
      
      // Close modal
      await page.click('button:has-text("Close")');
      await expect(page.locator('text="Share Your Configuration"')).not.toBeVisible();
    });

    test('should load configuration from URL parameters', async ({ page }) => {
      // Navigate with parameters
      await page.goto('/?c=ES&wt=5&lt=3&tg=200&tl=100&nc=2&cr=2.5&na=3&pf=elite_50k&pt=2750&cd=180');
      
      await page.waitForLoadState('networkidle');
      
      // Verify contract selection
      const selectedContract = await page.inputValue('select:has-text("Select Futures Contract")');
      expect(selectedContract).toBe('ES');
      
      // Verify trade parameters
      expect(await page.inputValue('input[x-model="winningTrades"]')).toBe('5');
      expect(await page.inputValue('input[x-model="losingTrades"]')).toBe('3');
      expect(await page.inputValue('input[x-model="ticksGained"]')).toBe('200');
      expect(await page.inputValue('input[x-model="ticksLost"]')).toBe('100');
      expect(await page.inputValue('input[x-model="numContracts"]')).toBe('2');
      expect(await page.inputValue('input[x-model="numAccounts"]')).toBe('3');
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
      
      // Verify dark mode toggled
      const afterToggle = await htmlElement.evaluate(el => el.classList.contains('dark'));
      expect(afterToggle).toBe(!initialDarkMode);
      
      // Toggle back
      await darkModeButton.click();
      const afterSecondToggle = await htmlElement.evaluate(el => el.classList.contains('dark'));
      expect(afterSecondToggle).toBe(initialDarkMode);
    });
    
    test('should persist dark mode preference', async ({ page, context }) => {
      // Enable dark mode
      const darkModeButton = page.locator('button[title*="Mode"]').first();
      await darkModeButton.click();
      
      // Verify dark mode is on
      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveClass(/dark/);
      
      // Check localStorage
      const darkModeValue = await page.evaluate(() => localStorage.getItem('darkMode'));
      expect(darkModeValue).toBe('true');
    });
  });

  test.describe('Image Export', () => {
    test('should show save image button', async ({ page }) => {
      // Verify save image button exists
      const saveButton = page.locator('button:has-text("Save Image")');
      await expect(saveButton).toBeVisible();
      
      // Click should trigger html2canvas (we can't test actual download in Playwright easily)
      await saveButton.click();
      
      // Button should be re-enabled after processing
      await expect(saveButton).toBeEnabled();
    });
  });
});
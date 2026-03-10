import { test, expect } from '@playwright/test';

test('verify nsta control changes', async ({ page }) => {
  // Mock localStorage for auth
  await page.addInitScript(() => {
    localStorage.setItem('nst_current_user', JSON.stringify({
      id: 'admin_test_123',
      name: 'Admin User',
      phone: '+919999999999',
      board: 'BSEB',
      class: '10',
      stream: 'NONE',
      role: 'ADMIN',
      hasCompletedProfile: true
    }));
  });

  await page.goto('http://localhost:5000/');

  // wait a bit for popups to clear
  await page.waitForTimeout(2000);

  // click "Collect" or "Close" if any popup is there
  const collectBtn = await page.locator('button:has-text("Awesome!")').first();
  if (await collectBtn.isVisible()) {
      await collectBtn.click();
      await page.waitForTimeout(1000);
  }
  const claimBtn = await page.locator('button:has-text("Claim Bonus")').first();
  if (await claimBtn.isVisible()) {
      await claimBtn.click();
      await page.waitForTimeout(1000);
  }

  // Try to click Admin Dashboard
  const adminBtn = await page.locator('button:has-text("Admin")').first();
  if (await adminBtn.isVisible()) {
      await adminBtn.click();
  }

  await page.waitForTimeout(1000);

  // Try to open NSTA Control tab
  const nstaTab = await page.locator('button:has-text("NSTA Control")').first();
  if (await nstaTab.isVisible()) {
      await nstaTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'feature_control.png', fullPage: true });
  }

  // Go back to dashboard if possible
  const backBtn = await page.locator('button:has-text("Dashboard")').first();
  if (await backBtn.isVisible()) {
      await backBtn.click();
  }

  // Click Revision Logic
  const revisionTab = await page.locator('button:has-text("Revision Logic")').first();
  if (await revisionTab.isVisible()) {
      await revisionTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'revision_logic.png', fullPage: true });
  }

});

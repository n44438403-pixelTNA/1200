import { test, expect } from '@playwright/test';

test('verify admin directly', async ({ page }) => {
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

  await page.goto('http://localhost:5000/?admin_bypass=1');

  await page.waitForTimeout(2000);

  // click Admin Tab directly
  const adminBtn = await page.locator('button:has-text("Admin")').first();
  if (await adminBtn.isVisible()) {
      await adminBtn.click();
      await page.waitForTimeout(1000);

      const nstaTab = await page.locator('button:has-text("NSTA Control")').first();
      if (await nstaTab.isVisible()) {
          await nstaTab.click();
          await page.waitForTimeout(1000);
          await page.screenshot({ path: 'nsta_control_direct.png', fullPage: true });
      }

      await page.goto('http://localhost:5000/?admin_bypass=1');
      await page.waitForTimeout(1000);
      const adminBtn2 = await page.locator('button:has-text("Admin")').first();
      if (await adminBtn2.isVisible()) {
          await adminBtn2.click();
          await page.waitForTimeout(1000);
          const revisionTab = await page.locator('button:has-text("Revision Logic")').first();
          if (await revisionTab.isVisible()) {
              await revisionTab.click();
              await page.waitForTimeout(1000);
              await page.screenshot({ path: 'revision_logic_direct.png', fullPage: true });
          }
      }

  }

});

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.localStorage.setItem('nst_current_user', JSON.stringify({
      id: 'fake_admin_123',
      role: 'ADMIN',
      hasCompletedProfile: true,
      board: 'CBSE',
      class: '10',
      stream: null,
      name: 'Admin User'
    }));
    window.localStorage.setItem('nst_has_seen_welcome', 'true');
    const today = new Date().toDateString();
    window.sessionStorage.setItem('login_bonus_shown_' + today, 'true');
    window.sessionStorage.setItem('app_session_splash', 'true');
    // Mute all adminCustomPopups via session storage flag
    window.sessionStorage.setItem('hidden_popups', 'ALL_MOCKED');
  });

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5000/');

    await page.waitForTimeout(2000);

    // Evaluate more aggressively to completely click the dismiss button
    await page.evaluate(() => {
        // Destroy the actual elements so it won't trigger re-renders
        const overlays = document.querySelectorAll('.fixed.inset-0.z-50');
        for (const o of overlays) o.remove();
    });

    await page.waitForTimeout(1000);

    // Expand the "CONTENT & ANALYSIS" group instead
    await page.evaluate(() => {
        // Find the group header for CONTENT & ANALYSIS and click it
        const headers = Array.from(document.querySelectorAll('div, span, h3, h2, h4, button, li, p')).filter(h => h.textContent && h.textContent.includes('CONTENT & ANALYSIS'));
        if (headers.length > 0) {
           headers[headers.length-1].click();
        }
    });

    await page.waitForTimeout(2000);

    // Click "Content Manager" tab directly from AdminDashboard
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, div, span, p, a, li')).filter(b => b.textContent && b.textContent.includes('Content Manager'));
        if (buttons.length > 0) buttons[buttons.length - 1].click();
    });

    await page.waitForTimeout(2000);

    // Select board, class, subject
    // Usually selecting directly causes rerenders
    await page.evaluate(() => {
      // Just click the first chapter card since it's already on CBSE / 10 / Science probably
      const manageBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Manage Content'));
      if (manageBtns.length > 0) manageBtns[0].click();
    });

    await page.waitForTimeout(2000);

    // Scroll down to the Quick Notes Manager
    await page.evaluate(() => {
        const qn = Array.from(document.querySelectorAll('h4')).find(h => h.textContent && h.textContent.includes('Quick Notes Breakdown'));
        if (qn) qn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'verification_admin_quick_notes_final_7.png' });
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();

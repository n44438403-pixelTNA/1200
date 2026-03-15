const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Inject a fake admin user to bypass login and reach the admin dashboard
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
    window.sessionStorage.setItem('login_bonus_shown_' + today, 'true'); // Bypass login bonus
    window.sessionStorage.setItem('app_session_splash', 'true');
  });

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5000/');

    // Wait for the app to load
    await page.waitForTimeout(3000);

    // We should be on the StudentDashboard. Click on the "Admin Panel" tab.
    // The Admin panel button has "Crown" icon and text "Admin Panel" or similar.
    // Wait, since role is ADMIN, the StudentDashboard should have a way to go to Admin Panel.
    // Actually, maybe it is just rendered directly if the role is Admin?
    // Let's just screenshot and see if we can click content manager.

    // Let's try to click on the sidebar toggle if we are in mobile view. But it's 1280x720 by default.
    // Click on Admin Panel if it exists in the nav bar.
    await page.evaluate(() => {
        // Try to find the "Content Manager" tab in Admin Dashboard
        const tabs = Array.from(document.querySelectorAll('button'));
        const contentTab = tabs.find(t => t.textContent && t.textContent.includes('Content Manager'));
        if (contentTab) contentTab.click();
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification_admin_content_1.png' });

    // Click on the first chapter edit button
    await page.evaluate(() => {
        const editButtons = Array.from(document.querySelectorAll('button'));
        const contentBtn = editButtons.find(b => b.textContent && b.textContent.includes('Manage Content'));
        if (contentBtn) contentBtn.click();
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification_admin_content_2.png' });

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();

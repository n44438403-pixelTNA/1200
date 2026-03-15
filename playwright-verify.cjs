const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

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
    window.sessionStorage.setItem('app_session_splash', 'true');
  });

  try {
    await page.goto('http://localhost:5000/');

    // Wait for the app to load
    await page.waitForTimeout(3000);

    // We are on the student dashboard, click "Admin Panel" or similar if it exists, otherwise navigate manually
    // Actually if role is ADMIN, it should show Admin Dashboard or at least give access.
    // Let's verify what the homepage renders for ADMIN.
    await page.screenshot({ path: 'verification_admin_home.png' });

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();

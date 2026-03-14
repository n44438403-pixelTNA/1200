import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['Pixel 5'],
  });

  await context.addInitScript(() => {
    // Clear out user to force onboarding
    window.localStorage.removeItem('nst_current_user');
    window.localStorage.setItem('nst_terms_accepted', 'true');
    window.localStorage.setItem('nst_has_seen_welcome', 'true');
  });

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // aggressively dismiss any popups
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const dismissBtn = buttons.find(b => b.textContent && b.textContent.includes('Dismiss'));
        if (dismissBtn) dismissBtn.click();
    });

    await page.waitForTimeout(1000);

    // Log into fake user via evaluate to trigger onboarding
    await page.evaluate(() => {
         const user = {
            id: 'test_user_1',
            email: 'test@example.com',
            name: '',
            mobile: '',
            role: 'STUDENT',
            createdAt: new Date().toISOString(),
            lastLoginDate: new Date().toISOString(),
            streak: 1,
            credits: 100,
            redeemedCodes: [],
            profileCompleted: false // Forces onboarding!
         };
         window.localStorage.setItem('nst_current_user', JSON.stringify(user));
         window.location.reload();
    });

    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/home/jules/verification/onboarding.png' });
    console.log('Successfully saved screenshot to /home/jules/verification/onboarding.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();

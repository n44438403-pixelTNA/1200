const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set fake user in localStorage
  const fakeUser = {
    uid: "admin123",
    role: "admin",
    name: "Admin",
    email: "admin@nst.com",
    hasCompletedProfile: true,
    board: "CBSE",
    class: "12",
    stream: "Science"
  };

  await page.addInitScript(user => {
    window.localStorage.setItem('nst_current_user', JSON.stringify(user));
    window.sessionStorage.setItem('app_session_splash', 'true');
    window.localStorage.setItem('nst_has_seen_welcome', 'true');
    window.sessionStorage.setItem('login_bonus_shown_' + new Date().toDateString(), 'true');
  }, fakeUser);

  await page.goto('http://localhost:5000/admin', { waitUntil: 'networkidle' });

  // Wait a bit for modals
  await page.waitForTimeout(1000);

  // Handle all possible modals and overlays
  try {
      const dismissBtn = await page.locator('button:has-text("Dismiss")').first();
      if (await dismissBtn.isVisible({ timeout: 2000 })) {
          await dismissBtn.click();
      }
  } catch(e) {}

  await page.waitForTimeout(500);

  try {
      // Force remove fixed overlays just in case
      await page.evaluate(() => {
          document.querySelectorAll('.fixed').forEach(el => el.remove());
      });
  } catch(e) {}

  await page.waitForTimeout(500);

  // Go to Content Manager tab
  const contentManagerTab = await page.locator('button:has-text("CONTENT MANAGER")').first();
  if (await contentManagerTab.isVisible()) {
      await contentManagerTab.click();
  }

  // Click on Chapter Content
  const chapterContentBtn = await page.locator('button:has-text("Chapter Content")').first();
  if (await chapterContentBtn.isVisible()) {
      await chapterContentBtn.click();
  }

  // Wait for the form to appear
  await page.waitForTimeout(1000);

  // Scroll to Quick Notes Breakdown
  const quickNotesSection = await page.locator('h3:has-text("Quick Notes Breakdown")').first();
  if (await quickNotesSection.isVisible()) {
      await quickNotesSection.scrollIntoViewIfNeeded();
  }

  await page.screenshot({ path: 'verification_admin_quick_notes_final_8.png' });
  await browser.close();
  console.log('Screenshot saved to verification_admin_quick_notes_final_8.png');
})();

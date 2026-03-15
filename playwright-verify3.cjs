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
  });

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5000/');
    await page.waitForTimeout(3000);

    // Dismiss the notification dialog
    await page.evaluate(() => {
        const dismissBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Dismiss'));
        if (dismissBtn) dismissBtn.click();
    });

    await page.waitForTimeout(1000);

    // Open CONTENT & SYLLABUS section in Admin
    await page.evaluate(() => {
        const contentHeader = Array.from(document.querySelectorAll('h3, div, span, button')).find(el => el.textContent && el.textContent.includes('CONTENT & SYLLABUS'));
        if (contentHeader) contentHeader.click();
    });

    await page.waitForTimeout(1000);

    // Click "Content Manager"
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const contentMgr = buttons.find(b => b.textContent && b.textContent.includes('Content Manager'));
        if (contentMgr) contentMgr.click();
    });

    await page.waitForTimeout(2000);

    // Select a board, class, subject
    await page.evaluate(() => {
        const selects = document.querySelectorAll('select');
        if (selects.length > 0) {
            selects[0].value = 'CBSE'; selects[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
        const selects = document.querySelectorAll('select');
        if (selects.length > 1) {
            selects[1].value = '10'; selects[1].dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
        const selects = document.querySelectorAll('select');
        if (selects.length > 2) {
            selects[2].value = 'Science'; selects[2].dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    await page.waitForTimeout(2000);

    // Click "Manage Content" on the first chapter
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const manageBtn = buttons.find(b => b.textContent && b.textContent.includes('Manage Content'));
        if (manageBtn) manageBtn.click();
    });

    await page.waitForTimeout(2000);

    // Scroll down to the Quick Notes Manager
    await page.evaluate(() => {
        const qn = Array.from(document.querySelectorAll('h4')).find(h => h.textContent && h.textContent.includes('Quick Notes Breakdown'));
        if (qn) qn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'verification_admin_quick_notes.png' });
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();

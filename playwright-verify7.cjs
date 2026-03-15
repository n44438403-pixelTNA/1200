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

    await page.waitForTimeout(4000);

    // Evaluate more aggressively to completely click the dismiss button
    await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
            if (b.innerText === 'Dismiss') {
                b.click();
            }
        }
    });

    await page.waitForTimeout(2000);

    // Evaluate more aggressively to completely click the dismiss button again if there are multiple overlapping Modals
    await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
            if (b.innerText === 'Dismiss') {
                b.click();
            }
        }
    });

    await page.waitForTimeout(1000);

    // If it's still there, force hide it by manipulating the DOM directly
    await page.evaluate(() => {
        // Find any div with z-index large enough or contains 'New Notification'
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
            if (div.style.zIndex >= 50 || (div.className && div.className.includes('fixed inset-0'))) {
                div.remove();
            }
        });
    });

    await page.waitForTimeout(1000);

    // Click "Content Manager" tab directly from AdminDashboard
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const contentMgr = buttons.find(b => b.textContent && b.textContent.includes('Content Manager'));
        if (contentMgr) contentMgr.click();
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

    await page.screenshot({ path: 'verification_admin_quick_notes_final_4.png' });
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})();

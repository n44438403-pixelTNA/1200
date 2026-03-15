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
    window.localStorage.setItem('ai_terms_accepted', 'true'); // Accept terms and conditions if present
  }, fakeUser);

  await page.goto('http://localhost:5000/admin', { waitUntil: 'load' });

  // Wait a bit for modals
  await page.waitForTimeout(2000);

  // Use evaluate to forcefully click terms, dismisses, and remove modals
  await page.evaluate(() => {
    // If there is any element with text "I Agree & Continue", click it
    const buttons = Array.from(document.querySelectorAll('button'));
    let agree = buttons.find(b => b.textContent && b.textContent.includes('I Agree & Continue'));
    if (agree) agree.click();

    let dismiss = buttons.find(b => b.textContent && b.textContent.includes('Dismiss'));
    if (dismiss) dismiss.click();

    // Kill any remaining overlays (fixed position divs that cover the screen)
    const fixedDivs = document.querySelectorAll('div.fixed.inset-0');
    fixedDivs.forEach(div => div.remove());
  });

  await page.waitForTimeout(1000);

  // Use evaluate to forcefully remove modals or click dismiss (run again just in case new ones appeared)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    let dismiss = buttons.find(b => b.textContent && b.textContent.includes('Dismiss'));
    if (dismiss) dismiss.click();

    const fixedDivs = document.querySelectorAll('div.fixed.inset-0');
    fixedDivs.forEach(div => div.remove());
  });

  await page.waitForTimeout(1000);

  // Click on "CONTENT MANAGER" tab using text
  await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tab = buttons.find(b => b.textContent && b.textContent.includes('CONTENT MANAGER'));
      if (tab) tab.click();
  });

  await page.waitForTimeout(1000);

  // Click on "Chapter Content"
  await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chapterContentBtn = buttons.find(b => b.textContent && b.textContent.includes('Chapter Content'));
      if (chapterContentBtn) chapterContentBtn.click();
  });

  // Wait for the form to appear
  await page.waitForTimeout(1000);

  // Scroll down
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);

  // Scroll to "Quick Notes Breakdown" just in case
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const quickNotes = headings.find(h => h.textContent && h.textContent.includes('Quick Notes'));
    if (quickNotes) {
      quickNotes.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verification_admin_quick_notes_final_10.png' });
  await browser.close();
  console.log('Screenshot saved to verification_admin_quick_notes_final_10.png');
})();

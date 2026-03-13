import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['Pixel 5'],
  });

  await context.addInitScript(() => {
    const mockUser = {
      hasCompletedProfile: true,
      board: "CBSE",
      stream: "SCIENCE",
      class: "Class 10",
      id: 'user123',
      email: 'student@example.com',
      displayName: 'Test Student',
      role: 'STUDENT',
      profileCompleted: true,
      classLevel: '10',
      credits: 1250,
      subscriptionLevel: 'PREMIUM'
    };
    window.localStorage.setItem('nst_current_user', JSON.stringify(mockUser));
    window.localStorage.setItem('nst_terms_accepted', 'true');
    window.localStorage.setItem('nst_has_seen_welcome', 'true');
    window.sessionStorage.setItem('app_session_splash', 'true');
    window.sessionStorage.setItem('login_bonus_shown_' + new Date().toDateString(), 'true');

    // Attempt to bypass inbox notifications manually
    const mockInbox = [];
    window.localStorage.setItem('nst_user_bulky', JSON.stringify({ inbox: mockInbox }));
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

    await page.evaluate(async () => {
      const dummyAnalysis = {
        id: 'analysis_123',
        type: 'ANALYSIS',
        title: 'Analysis: Math Chapter 1 Quiz',
        subject: 'Mathematics',
        timestamp: Date.now(),
        data: {
          result: {
            chapterId: '123',
            chapterTitle: 'Math Chapter 1',
            subjectName: 'Mathematics',
            score: 8,
            totalQuestions: 10,
            omrData: [
              { qIndex: 0, selected: 1, correct: 1 },
              { qIndex: 1, selected: 0, correct: 2 },
            ],
            topicAnalysis: {
              'Algebra': { correct: 1, total: 2 }
            }
          },
          questions: [
            {
              question: '<p>What is 2+2?</p>',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              topic: 'Algebra',
              explanation: '<p>2+2 is 4.</p>'
            },
            {
              question: '<p>What is 3+3?</p>',
              options: ['6', '7', '8', '9'],
              correctAnswer: 0,
              topic: 'Algebra',
              explanation: '<p>3+3 is 6.</p>'
            }
          ]
        }
      };

      const dbRequest = window.indexedDB.open('nst_downloads_db');
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['downloads'], 'readwrite');
        const objectStore = transaction.objectStore('downloads');
        objectStore.put(dummyAnalysis);
      };
    });

    await page.waitForTimeout(1000);

    // Use History tab directly via UI
    await page.evaluate(() => {
       const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
       const historyBtn = buttons.find(b => b.textContent && b.textContent.includes('History'));
       if (historyBtn) historyBtn.click();
    });

    await page.waitForTimeout(1000);

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const savedOfflineBtn = buttons.find(b => b.textContent && b.textContent.includes('Saved Offline'));
        if (savedOfflineBtn) savedOfflineBtn.click();
    });

    await page.waitForTimeout(1000);
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const analysisBtn = buttons.find(b => b.textContent && b.textContent.includes('Test Analysis'));
        if (analysisBtn) analysisBtn.click();
    });

    await page.waitForTimeout(1000);
    await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div'));
        const analysisItem = items.find(d => d.textContent && d.textContent.includes('Analysis: Math Chapter 1 Quiz'));
        if (analysisItem) analysisItem.click();
    });

    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/home/jules/verification/verification.png' });
    console.log('Successfully saved screenshot to /home/jules/verification/verification.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();

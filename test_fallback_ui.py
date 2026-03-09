from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 414, 'height': 896}, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1")
    page = context.new_page()

    page.goto("http://localhost:5000/")

    page.wait_for_timeout(2000)

    user_data = '{"id":"test_user","role":"STUDENT","name":"Test","profileCompleted":true,"board":"CBSE","classLevel":"10","stream":null}'
    page.evaluate(f"localStorage.setItem('nst_current_user', '{user_data}');")
    page.evaluate("localStorage.setItem('nst_active_student_tab', 'INVALID_TAB_XXXX');")
    page.evaluate("localStorage.setItem('nst_terms_accepted', 'true');")
    page.evaluate("localStorage.setItem('nst_has_seen_welcome', 'true');")

    page.goto("http://localhost:5000/")

    page.wait_for_timeout(4000)

    page.screenshot(path="verification_fallback.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)

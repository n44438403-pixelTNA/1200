from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:5000')
        # Test code here to check if the app runs
        print("Playwright ran successfully")
        browser.close()

if __name__ == '__main__':
    test()

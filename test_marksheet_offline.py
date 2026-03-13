import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

# Let's check exactly how MarksheetCard is invoked in DownloadsPage.
print(re.search(r"<MarksheetCard[\s\S]*?/>", content).group(0))

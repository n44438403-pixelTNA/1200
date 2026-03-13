import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { MarksheetCard } from './MarksheetCard';", "import { MarksheetCard } from './MarksheetCard';\nimport { DownloadsPage } from './DownloadsPage';")

with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)

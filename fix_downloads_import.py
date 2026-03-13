import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

if 'import { DownloadsPage }' not in content:
    content = content.replace("import { CreditConfirmationModal } from './CreditConfirmationModal';", "import { CreditConfirmationModal } from './CreditConfirmationModal';\nimport { DownloadsPage } from './DownloadsPage';")

with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)

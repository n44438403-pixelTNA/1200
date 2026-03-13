import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

# Remove usageLog states
content = re.sub(r"const \[usageLog, setUsageLog\] = useState<UsageHistoryEntry\[\]>\(\[\]\);\n", "", content)

# Remove the useEffect that maps usageHistory
usage_effect = r"useEffect\(\(\) => \{\n\s*if \(user\?.usageHistory\) \{\n\s*setUsageLog\(user.usageHistory.slice\(\).reverse\(\)\);\n\s*\}\n\s*\}, \[user\]\);"
content = re.sub(usage_effect, "", content)

with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)

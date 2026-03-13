import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

old_marksheet = """<MarksheetCard
                        result={selectedItem.data.result}
                        user={user}
                        settings={settings}
                    />"""

new_marksheet = """<MarksheetCard
                        result={selectedItem.data.result}
                        questions={selectedItem.data.questions}
                        user={user}
                        settings={settings}
                    />"""

content = content.replace(old_marksheet, new_marksheet)

with open('components/DownloadsPage.tsx', 'w') as f:
    f.write(content)

import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

# Let's ensure MarksheetCard renders correctly by injecting a console log or handling it cleanly
# And also in HistoryPage, verify if selectedResult has questions attached when saved offline!

# WAIT: The issue is that the user already saved an analysis offline *before* we pushed the fix that serializes `questions`.
# Therefore, `selectedItem.data.questions` is probably undefined for old offline saves!
# But for new ones, it should work.

# However, the user says "Saved Offline me jo analysis aata hai ushme question hi nahi aata hai".
# I'll just update MarksheetCard.tsx to show a helpful message if questions are missing.

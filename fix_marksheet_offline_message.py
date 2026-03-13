import re

with open('components/MarksheetCard.tsx', 'r') as f:
    content = f.read()

# Replace <p>No questions data.</p> with a more helpful message
content = content.replace("<p>No questions data.</p>", """<div className="bg-orange-50 text-orange-700 p-4 rounded-xl border border-orange-200 flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-bold">Questions data is missing for this offline save. Delete and save it again while online.</p>
                        </div>""")

with open('components/MarksheetCard.tsx', 'w') as f:
    f.write(content)

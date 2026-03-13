import re

with open('components/MarksheetCard.tsx', 'r') as f:
    content = f.read()

# Make the buttons more prominent
old_marksheet_btn = """                <button
                    onClick={() => setMarksheetDlOpen(true)}
                    className="flex items-center justify-center p-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
                    title="Download Marksheet"
                >
                    <Download size={20} />
                </button>"""

new_marksheet_btn = """                <button
                    onClick={() => setMarksheetDlOpen(true)}
                    className="flex items-center gap-2 justify-center px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors shadow-sm active:scale-95"
                    title="Download Marksheet"
                >
                    <Download size={20} /> Save Offline
                </button>"""

old_full_btn = """                <button
                    onClick={() => setFullDlOpen(true)}
                    className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95"
                    title="Download Full Analysis"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <Download size={20} />}
                </button>"""

new_full_btn = """                <button
                    onClick={() => setFullDlOpen(true)}
                    className="flex items-center gap-2 justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 active:scale-95"
                    title="Download Full Analysis"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <><Download size={20} /> Save Offline</>}
                </button>"""

content = content.replace(old_marksheet_btn, new_marksheet_btn)
content = content.replace(old_full_btn, new_full_btn)

with open('components/MarksheetCard.tsx', 'w') as f:
    f.write(content)

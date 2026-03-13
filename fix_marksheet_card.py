import re

with open('components/MarksheetCard.tsx', 'r') as f:
    content = f.read()

if 'import { downloadManager }' not in content:
    content = content.replace("import { downloadAsMHTML } from '../utils/downloadUtils';", "import { downloadAsMHTML } from '../utils/downloadUtils';\nimport { downloadManager } from '../utils/downloadManager';\nimport { DownloadOptionsModal } from './DownloadOptionsModal';\nimport { HardDriveDownload } from 'lucide-react';")

# Replace standard download buttons
old_btn = """                <button
                    onClick={() => downloadAsMHTML('marksheet-style-1', `Marksheet_${user.name}`)}
                    className="flex items-center justify-center p-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
                    title="Download Marksheet"
                >
                    <Download size={20} />
                </button>"""

new_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `marksheet_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Marksheet: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result }
                        });
                        if(success) alert('Marksheet saved for offline viewing in the Downloads tab.');
                    }}
                    className="flex items-center gap-2 justify-center px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors shadow-sm active:scale-95"
                    title="Save Offline"
                >
                    <HardDriveDownload size={20} /> Save Offline
                </button>"""

old_full_btn = """                <button
                    onClick={() => downloadAsMHTML('full-report-print-container', `Full_Analysis_${user.name}`)}
                    className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95"
                    title="Download Full Analysis"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <Download size={20} />}
                </button>"""

new_full_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `analysis_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Analysis: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result }
                        });
                        if(success) alert('Analysis report saved for offline viewing in the Downloads tab.');
                    }}
                    className="flex items-center gap-2 justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 active:scale-95"
                    title="Save Offline"
                >
                    {isDownloadingAll ? <span className="animate-spin">⏳</span> : <><HardDriveDownload size={20} /> Save Offline</>}
                </button>"""

content = content.replace(old_btn, new_btn)
content = content.replace(old_full_btn, new_full_btn)

# Ensure margin bottom so it's not hidden behind bottom nav
content = content.replace('<div className="marksheet-card-wrapper max-w-full overflow-hidden pb-12">', '<div className="marksheet-card-wrapper max-w-full overflow-hidden pb-24">')
content = content.replace('<div className="marksheet-card-wrapper max-w-full overflow-hidden pb-6">', '<div className="marksheet-card-wrapper max-w-full overflow-hidden pb-24">')

with open('components/MarksheetCard.tsx', 'w') as f:
    f.write(content)

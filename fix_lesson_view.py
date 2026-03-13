import re

with open('components/LessonView.tsx', 'r') as f:
    content = f.read()

if 'import { downloadManager }' not in content:
    content = content.replace("import { downloadAsMHTML } from '../utils/downloadUtils';", "import { downloadAsMHTML } from '../utils/downloadUtils';\nimport { downloadManager } from '../utils/downloadManager';\nimport { HardDriveDownload } from 'lucide-react';")

# Add the explicit Offline button
old_download_btn = """                    <button
                        onClick={handleDownloadRequest}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Download size={16} /> Download Report (10 CR)
                    </button>"""

new_download_btn = """                    <button
                        onClick={handleDownloadRequest}
                        className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-200 flex items-center gap-2 border border-slate-200"
                    >
                        <Download size={16} /> Share/PDF (10 CR)
                    </button>
                    <button
                        onClick={async () => {
                            const success = await downloadManager.saveDownload({
                                id: chapter.id,
                                type: 'LESSON',
                                title: chapter.title,
                                subject: subject.name,
                                timestamp: Date.now(),
                                data: { chapter, content: contentData, subject } // Use contentData to avoid naming collisions
                            });
                            if (success) alert('Saved for offline use! View in the Downloads tab.');
                        }}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-emerald-700 flex items-center gap-2"
                    >
                        <HardDriveDownload size={16} /> Save Offline (Free)
                    </button>"""

# Fix the content mapping
content = content.replace("data: { chapter, content, subject }", "data: { chapter, content: contentData, subject }") # fallback just in case
content = content.replace(old_download_btn, new_download_btn)

# Ensure margin bottom so it's not hidden behind bottom nav
content = content.replace('<div className="relative pb-24">', '<div className="relative pb-32">')

with open('components/LessonView.tsx', 'w') as f:
    f.write(content)

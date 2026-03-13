import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

# I will just write a very simple Generic HTML Viewer inside DownloadsPage for generic Notes,
# and use `McqView` / `LessonView` for interactive things, relying on their internal error handling or the injected data.
# Wait, my downloadManager.saveDownload logic actually saves the raw payload in `data: { content: { ... } }`.
# Let's just create a simple "Offline Note Viewer" built into DownloadsPage.

new_reader = """
    if (activeView === 'PDF' && selectedItem?.data) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen overflow-hidden">
                <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                    <button onClick={() => setActiveView('LIST')} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-slate-800 text-sm line-clamp-1">{selectedItem.title}</h2>
                        <p className="text-[10px] text-slate-500">Offline Reading Mode</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-20 max-w-3xl mx-auto">
                        <div className="prose prose-slate max-w-none note-text" dangerouslySetInnerHTML={{ __html: selectedItem.data.content?.html?.quickNotes || selectedItem.data.content?.html?.deepDive || selectedItem.data.content?.content || 'No text content available offline.' }} />
                    </div>
                </div>
            </div>
        );
    }
"""

old_lesson_view = "    if (activeView === 'LESSON' && selectedItem?.data) {"

content = content.replace(old_lesson_view, new_reader + "\n" + old_lesson_view)

# Update activeView state
content = content.replace("const [activeView, setActiveView] = useState<'LIST' | 'LESSON' | 'ANALYSIS'>('LIST');", "const [activeView, setActiveView] = useState<'LIST' | 'LESSON' | 'ANALYSIS' | 'PDF'>('LIST');")

old_handle_open = """    const handleOpen = (item: DownloadItem) => {
        setSelectedItem(item);
        if (item.type === 'LESSON') {
            setActiveView('LESSON');
        } else if (item.type === 'ANALYSIS') {
            setActiveView('ANALYSIS');
        } else {
            alert('Viewer for this file type is not available offline.');
        }
    };"""

new_handle_open = """    const handleOpen = (item: DownloadItem) => {
        setSelectedItem(item);
        if (item.type === 'LESSON') {
            if (item.id.startsWith('pdfview_') || item.id.startsWith('note_')) {
                setActiveView('PDF');
            } else {
                setActiveView('LESSON');
            }
        } else if (item.type === 'ANALYSIS') {
            setActiveView('ANALYSIS');
        } else {
            alert('Viewer for this file type is not available offline.');
        }
    };"""

content = content.replace(old_handle_open, new_handle_open)

with open('components/DownloadsPage.tsx', 'w') as f:
    f.write(content)

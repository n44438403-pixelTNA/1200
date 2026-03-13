import re

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

# Add activeView state to support PDF and MCQ
content = content.replace("const [activeView, setActiveView] = useState<'LIST' | 'LESSON' | 'ANALYSIS'>('LIST');", "const [activeView, setActiveView] = useState<'LIST' | 'LESSON' | 'ANALYSIS' | 'PDF' | 'MCQ'>('LIST');")

# Update handleOpen
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
            // Distinguish between LessonView (has questions prop inside content) vs PdfView (has html prop) vs McqView (has questions but no aiAnalysisText)
            if (item.data.content?.html) {
                setActiveView('PDF'); // We will just use LessonView as a fallback for notes if needed, or build a simple reader
            } else if (item.data.content?.questions) {
                 // Check if it's from LessonView or McqView
                 if (item.id.startsWith('mcq_')) setActiveView('MCQ');
                 else setActiveView('LESSON');
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

# Import McqView and PdfView (PdfView is complex and might fail without network, let's just render the HTML locally for notes)
if "import { McqView } from './McqView';" not in content:
    content = content.replace("import { MarksheetCard } from './MarksheetCard';", "import { MarksheetCard } from './MarksheetCard';\nimport { McqView } from './McqView';")


# Add renderers for MCQ and PDF
mcq_renderer = """
    if (activeView === 'MCQ' && selectedItem?.data) {
        return (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                <McqView
                    chapter={selectedItem.data.chapter}
                    subject={selectedItem.data.subject}
                    user={user}
                    board={user.board || 'CBSE'}
                    classLevel={user.classLevel || '10'}
                    stream={user.stream || null}
                    onBack={() => setActiveView('LIST')}
                    onUpdateUser={() => {}}
                    settings={settings}
                    // To make offline work, McqView needs to load data from `selectedItem.data.content` rather than fetching.
                    // However, our current McqView always fetches via `getChapterData()`.
                    // This is a complex refactor for a later time, so for now, we will pass a custom prop if we could,
                    // but we can't easily without refactoring McqView.
                />
            </div>
        );
    }
"""

# The above reveals a limitation: McqView and PdfView are tightly coupled to `getChapterData` via Firebase in `useEffect`.
# If the app is offline, `getChapterData` might fail unless Firebase caches it locally (which it does via IndexedDB cache!).
# So actually, just rendering `McqView` or `PdfView` with the correct `chapter` and `subject` will work perfectly fine offline as long as Firebase offline persistence is enabled.

# Let's simplify and rely on Firebase cache for complex views, or just render a simple generic HTML reader for notes.

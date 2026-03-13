import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

# Replace activeTab
content = content.replace("const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'SAVED'>('ACTIVITY');", "const [activeTab, setActiveTab] = useState<'DOWNLOADS' | 'ACTIVITY'>('DOWNLOADS');")

# Rename Headers
content = content.replace('<FileText className="text-blue-600" /> Study History', '<HardDriveDownload className="text-emerald-600" /> Downloads & Activity')
content = content.replace('Your recent study sessions and activities', 'Your saved offline notes and recent activity log')
if 'HardDriveDownload' not in content:
    content = content.replace("import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award } from 'lucide-react';", "import { FileText, Folder, CheckCircle2, AlertCircle, X, ChevronRight, Lock, Calendar, BookOpen, Clock, Download, ChevronDown, Award, HardDriveDownload } from 'lucide-react';")

# Add imports safely
if "import { DownloadsPage } from './DownloadsPage';" not in content:
    content = content.replace("import { CreditConfirmationModal } from './CreditConfirmationModal';", "import { CreditConfirmationModal } from './CreditConfirmationModal';\nimport { DownloadsPage } from './DownloadsPage';")

# Find the old tabs block
old_tabs_block = """        {/* TABS */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
                onClick={() => setActiveTab('ACTIVITY')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ACTIVITY' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Activity Log
            </button>
            <button
                onClick={() => setActiveTab('SAVED')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'SAVED' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Saved Notes
            </button>
        </div>

        {activeTab === 'ACTIVITY' && ("""

tabs_ui = """        {/* TABS */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
            <button
                onClick={() => setActiveTab('DOWNLOADS')}
                className={`flex-1 py-3 text-sm font-black rounded-lg transition-all flex justify-center items-center gap-2 ${activeTab === 'DOWNLOADS' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <HardDriveDownload size={18} /> Saved Offline
            </button>
            <button
                onClick={() => setActiveTab('ACTIVITY')}
                className={`flex-1 py-3 text-sm font-black rounded-lg transition-all flex justify-center items-center gap-2 ${activeTab === 'ACTIVITY' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                <FileText size={18} /> Activity Log
            </button>
        </div>

        {activeTab === 'DOWNLOADS' ? (
            <div className="-mx-4 -mt-2">
                <DownloadsPage
                    onBack={() => setActiveTab('ACTIVITY')}
                    user={user}
                    settings={settings}
                    isEmbedded={true}
                />
            </div>
        ) : (
"""

content = content.replace(old_tabs_block, tabs_ui)

# Fix the end block which had `)} {activeTab === 'SAVED' && (` logic
old_saved_notes_block = """        )}

        {activeTab === 'SAVED' && ("""

if old_saved_notes_block in content:
    # Need to replace the end logic carefully
    parts = content.split(old_saved_notes_block)

    # Take the top part, close the ternary
    top_part = parts[0] + "        )}\n"

    # We still need the very bottom closing tags
    bottom_part = """    </div>
  );
};
"""
    content = top_part + bottom_part

with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)

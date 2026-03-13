import re

def modify_app_tsx():
    with open('App.tsx', 'r') as f:
        content = f.read()

    # Import DownloadsPage
    if 'import { DownloadsPage }' not in content:
        content = content.replace("import { ErrorBoundary } from './components/ErrorBoundary';", "import { ErrorBoundary } from './components/ErrorBoundary';\nimport { DownloadsPage } from './components/DownloadsPage';")

        # Add to ContentViewStep type
        content = content.replace("'HISTORY' |", "'HISTORY' | 'DOWNLOADS' |")

        # Add route to renderAppContent
        route = """
      case 'DOWNLOADS':
        return <DownloadsPage
            onBack={() => setContentViewStep('HOME')}
            user={user}
            settings={settings}
        />;
"""
        content = content.replace("case 'HISTORY':", f"{route}\n      case 'HISTORY':")

        with open('App.tsx', 'w') as f:
            f.write(content)

def modify_student_sidebar():
    with open('components/StudentSidebar.tsx', 'r') as f:
        content = f.read()

    if 'HardDriveDownload' not in content:
        content = content.replace("import { Crown, Star, ShieldAlert, Zap, Lock, RefreshCw, Smartphone } from 'lucide-react';", "import { Crown, Star, ShieldAlert, Zap, Lock, RefreshCw, Smartphone, HardDriveDownload } from 'lucide-react';")

        btn = """
        <button
            onClick={() => { onClose(); onNavigate('DOWNLOADS'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
                <HardDriveDownload size={20} />
            </div>
            <div>
                <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors text-sm block">Offline Downloads</span>
                <span className="text-[10px] font-bold text-slate-500 block">Access notes without internet</span>
            </div>
        </button>
"""
        # Insert before specific item
        content = content.replace("<button onClick={() => { onClose(); onNavigate('AI_CHAT'); }}", f"{btn}\n        <button onClick={{() => {{ onClose(); onNavigate('AI_CHAT'); }}}}")

        with open('components/StudentSidebar.tsx', 'w') as f:
            f.write(content)

def modify_download_options_modal():
    with open('components/DownloadOptionsModal.tsx', 'r') as f:
        content = f.read()

    if 'onDownloadOffline' not in content:
        # Add lucide icons
        content = content.replace('import { Download, FileText, Globe, X } from \'lucide-react\';', 'import { Download, FileText, Globe, X, HardDriveDownload } from \'lucide-react\';')

        # Add prop
        content = content.replace('onDownloadMhtml?: () => void;', 'onDownloadMhtml?: () => void;\n    onDownloadOffline?: () => void;\n    offlineLabel?: string;')

        content = content.replace('onDownloadMhtml, title = "Download Options" }) => {', 'onDownloadMhtml, onDownloadOffline, offlineLabel = "Save for Offline", title = "Download Options" }) => {')

        # Add offline button
        offline_btn = """
                    {onDownloadOffline && (
                        <button
                            onClick={() => { onDownloadOffline(); onClose(); }}
                            className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 hover:border-emerald-200 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                                    <HardDriveDownload size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-800 text-sm">{offlineLabel}</p>
                                    <p className="text-[10px] text-slate-500">Access anytime in app</p>
                                </div>
                            </div>
                            <div className="bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-400 border border-slate-100">.app</div>
                        </button>
                    )}
"""
        content = content.replace('</div>\n            </div>\n        </div>', f'{offline_btn}                </div>\n            </div>\n        </div>')

        with open('components/DownloadOptionsModal.tsx', 'w') as f:
            f.write(content)

def modify_marksheet_card():
    with open('components/MarksheetCard.tsx', 'r') as f:
        content = f.read()

    if 'import { downloadManager }' not in content:
        content = content.replace("import { downloadAsMHTML } from '../utils/downloadUtils';", "import { downloadAsMHTML } from '../utils/downloadUtils';\nimport { downloadManager } from '../utils/downloadManager';\nimport { DownloadOptionsModal } from './DownloadOptionsModal';")

        # add modal state
        content = content.replace("const [isDownloadingAll, setIsDownloadingAll] = useState(false);", "const [isDownloadingAll, setIsDownloadingAll] = useState(false);\n  const [marksheetDlOpen, setMarksheetDlOpen] = useState(false);\n  const [fullDlOpen, setFullDlOpen] = useState(false);")

        # add modal UI
        modals_ui = """
      <DownloadOptionsModal
          isOpen={marksheetDlOpen}
          onClose={() => setMarksheetDlOpen(false)}
          title="Save Marksheet"
          onDownloadMhtml={() => {
              downloadAsMHTML('marksheet-style-1', `Marksheet_${user.name}`);
              setMarksheetDlOpen(false);
          }}
          onDownloadOffline={async () => {
              setMarksheetDlOpen(false);
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
      />
      <DownloadOptionsModal
          isOpen={fullDlOpen}
          onClose={() => setFullDlOpen(false)}
          title="Save Full Analysis"
          onDownloadMhtml={() => {
              downloadAsMHTML('full-report-print-container', `Full_Analysis_${user.name}`);
              setFullDlOpen(false);
          }}
          onDownloadOffline={async () => {
              setFullDlOpen(false);
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
      />
"""
        content = content.replace("<div className=\"marksheet-card-wrapper", f"{modals_ui}\n    <div className=\"marksheet-card-wrapper")

        # replace button clicks
        content = content.replace("onClick={() => downloadAsMHTML('marksheet-style-1', `Marksheet_${user.name}`)}", "onClick={() => setMarksheetDlOpen(true)}")
        content = content.replace("onClick={() => downloadAsMHTML('full-report-print-container', `Full_Analysis_${user.name}`)}", "onClick={() => setFullDlOpen(true)}")

        with open('components/MarksheetCard.tsx', 'w') as f:
            f.write(content)

def modify_lesson_view():
    with open('components/LessonView.tsx', 'r') as f:
        content = f.read()

    if 'import { downloadManager }' not in content:
        content = content.replace("import { downloadAsMHTML } from '../utils/downloadUtils';", "import { downloadAsMHTML } from '../utils/downloadUtils';\nimport { downloadManager } from '../utils/downloadManager';")

    old_fn_start = "const handleConfirmDownload = async (type: 'PDF' | 'MHTML') => {"
    old_fn_body = """
        let cost = 10;

        if (!user.isPremium && user.role !== 'ADMIN') {
            if (user.credits < cost) {
                setAlertConfig({isOpen: true, message: `Insufficient Credits! Download costs ${cost} coins.`});
                return;
            }
            onDeductCredits(cost, "Premium Analysis Download");
        }

        setIsDownloading(true);
        setDownloadModalOpen(false);
        setTimeout(() => {
            if (type === 'PDF') {
                window.print();
            } else {
                downloadAsMHTML('printable-analysis-report', `${chapter.title}_Analysis`);
            }
            setIsDownloading(false);
            setAlertConfig({isOpen: true, message: `Download Complete! (${cost} Coins Deducted)`});
        }, 1000);
    };
"""

    new_fn = """const handleConfirmDownload = async (type: 'PDF' | 'MHTML' | 'OFFLINE') => {
        let cost = 10;

        if (!user.isPremium && user.role !== 'ADMIN') {
            if (user.credits < cost) {
                setAlertConfig({isOpen: true, message: `Insufficient Credits! Download costs ${cost} coins.`});
                return;
            }
            onDeductCredits(cost, "Premium Analysis Download");
        }

        if (type === 'OFFLINE') {
            setIsDownloading(true);
            setDownloadModalOpen(false);

            try {
                const success = await downloadManager.saveDownload({
                    id: chapter.id,
                    type: 'LESSON',
                    title: chapter.title,
                    subject: subject.name,
                    timestamp: Date.now(),
                    data: { chapter, content, subject }
                });

                if (success) {
                    setAlertConfig({isOpen: true, message: `Saved for Offline Use! (${!user.isPremium && user.role !== 'ADMIN' ? cost + ' Coins Deducted' : 'Free'})`});
                } else {
                    setAlertConfig({isOpen: true, message: "Failed to save for offline use."});
                }
            } catch (e) {
                setAlertConfig({isOpen: true, message: "An error occurred while saving."});
            } finally {
                setIsDownloading(false);
            }
            return;
        }

        setIsDownloading(true);
        setDownloadModalOpen(false);
        setTimeout(() => {
            if (type === 'PDF') {
                window.print();
            } else {
                downloadAsMHTML('printable-analysis-report', `${chapter.title}_Analysis`);
            }
            setIsDownloading(false);
            setAlertConfig({isOpen: true, message: `Download Complete! (${!user.isPremium && user.role !== 'ADMIN' ? cost + ' Coins Deducted' : 'Free'})`});
        }, 1000);
    };"""

    content = content.replace(old_fn_start + old_fn_body, new_fn)

    old_modal = """               <DownloadOptionsModal
                   isOpen={downloadModalOpen}
                   onClose={() => setDownloadModalOpen(false)}
                   title="Download Analysis Report"
                   onDownloadPdf={() => handleConfirmDownload('PDF')}
                   onDownloadMhtml={() => handleConfirmDownload('MHTML')}
               />"""

    new_modal = """               <DownloadOptionsModal
                   isOpen={downloadModalOpen}
                   onClose={() => setDownloadModalOpen(false)}
                   title="Download Analysis Report"
                   onDownloadPdf={() => handleConfirmDownload('PDF')}
                   onDownloadMhtml={() => handleConfirmDownload('MHTML')}
                   onDownloadOffline={() => handleConfirmDownload('OFFLINE')}
               />"""

    content = content.replace(old_modal, new_modal)

    with open('components/LessonView.tsx', 'w') as f:
        f.write(content)


modify_app_tsx()
modify_student_sidebar()
modify_download_options_modal()
modify_marksheet_card()
modify_lesson_view()

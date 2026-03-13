import re

# 1. Update PdfView.tsx
with open('components/PdfView.tsx', 'r') as f:
    pdf_content = f.read()

# Make sure downloadManager is imported (it should be since the last commit)
if 'import { downloadManager }' not in pdf_content:
    pdf_content = pdf_content.replace("import { speakText, stopSpeech } from '../utils/textToSpeech';", "import { speakText, stopSpeech } from '../utils/textToSpeech';\nimport { downloadManager } from '../utils/downloadManager';\nimport { HardDriveDownload } from 'lucide-react';")

# Find the header buttons and inject the save button
old_header_btns = """                     <div className="flex items-center gap-2">
                         <button onClick={toggleFullScreen} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border border-slate-200" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                             {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                         </button>
                         <button onClick={handleShare} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                         </button>
                     </div>"""

new_header_btns = """                     <div className="flex items-center gap-2">
                         <button
                            onClick={async () => {
                                const success = await downloadManager.saveDownload({
                                    id: `pdfview_${chapter.id}_${syllabusMode}`,
                                    type: 'LESSON',
                                    title: `${chapter.title} Notes`,
                                    subject: subject.name,
                                    timestamp: Date.now(),
                                    data: { content: { html: contentData, notes: contentData?.premiumNotes }, chapter, subject }
                                });
                                if (success) alert('Notes saved offline in Downloads hub.');
                            }}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors shrink-0 border border-emerald-200"
                            title="Save Offline"
                         >
                            <HardDriveDownload size={16} />
                         </button>
                         <button onClick={toggleFullScreen} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border border-slate-200" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                             {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                         </button>
                         <button onClick={handleShare} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 border border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                         </button>
                     </div>"""

pdf_content = pdf_content.replace(old_header_btns, new_header_btns)
with open('components/PdfView.tsx', 'w') as f:
    f.write(pdf_content)

# 2. Update McqView.tsx
with open('components/McqView.tsx', 'r') as f:
    mcq_content = f.read()

if 'import { downloadManager }' not in mcq_content:
    mcq_content = mcq_content.replace("import { updateDoc, doc, arrayUnion } from 'firebase/firestore';", "import { updateDoc, doc, arrayUnion } from 'firebase/firestore';\nimport { downloadManager } from '../utils/downloadManager';\nimport { HardDriveDownload } from 'lucide-react';")

old_mcq_header = """           <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
               <Crown size={14} className="text-blue-600" />
               <span className="font-black text-blue-800 text-xs">{user.credits} CR</span>
           </div>
       </div>"""

new_mcq_header = """           <div className="flex items-center gap-2">
               <button
                  onClick={async () => {
                      const success = await downloadManager.saveDownload({
                          id: `mcq_${chapter.id}`,
                          type: 'LESSON',
                          title: `${chapter.title} MCQs`,
                          subject: subject.name,
                          timestamp: Date.now(),
                          data: { content: { questions: questions }, chapter, subject }
                      });
                      if (success) alert('MCQ practice set saved offline in Downloads hub.');
                  }}
                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200"
                  title="Save Offline"
               >
                  <HardDriveDownload size={16} />
               </button>
               <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                   <Crown size={14} className="text-blue-600" />
                   <span className="font-black text-blue-800 text-xs">{user.credits} CR</span>
               </div>
           </div>
       </div>"""

mcq_content = mcq_content.replace(old_mcq_header, new_mcq_header)
with open('components/McqView.tsx', 'w') as f:
    f.write(mcq_content)

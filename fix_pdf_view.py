import re

with open('components/PdfView.tsx', 'r') as f:
    content = f.read()

if 'import { downloadManager }' not in content:
    content = content.replace("import { speakText, stopSpeech } from '../utils/textToSpeech';", "import { speakText, stopSpeech } from '../utils/textToSpeech';\nimport { downloadManager } from '../utils/downloadManager';\nimport { HardDriveDownload } from 'lucide-react';")

# Add the Offline save button for Note content
new_note_overlay = """
                  <button onClick={() => { setActiveNoteContent(null); stopAllSpeech(); }} className="bg-white/80 backdrop-blur-md text-slate-800 p-3 rounded-full hover:bg-white shadow-lg border border-slate-200">
                      <ArrowLeft size={24} />
                  </button>

                  <button
                      onClick={async () => {
                          try {
                              const success = await downloadManager.saveDownload({
                                  id: `note_${chapter.id}`,
                                  type: 'LESSON',
                                  title: activeNoteContent.title,
                                  subject: subject.name,
                                  timestamp: Date.now(),
                                  data: {
                                      content: { content: activeNoteContent.content },
                                      chapter,
                                      subject
                                  }
                              });
                              if (success) {
                                  alert('Note saved for offline use! View it in the Downloads tab.');
                              } else {
                                  alert('Failed to save offline.');
                              }
                          } catch(e) { console.error(e); }
                      }}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-emerald-700 flex items-center gap-2"
                  >
                      <HardDriveDownload size={18} /> Save Offline
                  </button>
"""
old_note_overlay = """
                  <button onClick={() => { setActiveNoteContent(null); stopAllSpeech(); }} className="bg-white/80 backdrop-blur-md text-slate-800 p-3 rounded-full hover:bg-white shadow-lg border border-slate-200">
                      <ArrowLeft size={24} />
                  </button>
"""
content = content.replace(old_note_overlay, new_note_overlay)

with open('components/PdfView.tsx', 'w') as f:
    f.write(content)

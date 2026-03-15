const fs = require('fs');

let content = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

// 1. Add state variable for quickNoteEntries
content = content.replace(
`  const [deepDiveEntries, setDeepDiveEntries] = useState<DeepDiveEntry[]>([]);`,
`  const [deepDiveEntries, setDeepDiveEntries] = useState<DeepDiveEntry[]>([]);
  const [quickNoteEntries, setQuickNoteEntries] = useState<{id: string, title: string, content: string}[]>([]);`);

// 2. Add to payload in saveChapterContent
content = content.replace(
`          [syllabusMode === 'SCHOOL' ? 'schoolDeepDiveEntries' : 'competitionDeepDiveEntries']: deepDiveEntries,`,
`          [syllabusMode === 'SCHOOL' ? 'schoolDeepDiveEntries' : 'competitionDeepDiveEntries']: deepDiveEntries,
          [syllabusMode === 'SCHOOL' ? 'schoolQuickNoteEntries' : 'competitionQuickNoteEntries']: quickNoteEntries,`);

// 3. Fallback in payload
content = content.replace(
`              deepDiveEntries: deepDiveEntries, // Fallback`,
`              deepDiveEntries: deepDiveEntries, // Fallback
              quickNoteEntries: quickNoteEntries, // Fallback`);

// 4. Update in applyContentData
content = content.replace(
`          setDeepDiveEntries(data.schoolDeepDiveEntries || data.deepDiveEntries || []);
          setAdditionalNotes(data.schoolAdditionalNotes || data.additionalNotes || []);`,
`          setDeepDiveEntries(data.schoolDeepDiveEntries || data.deepDiveEntries || []);
          setAdditionalNotes(data.schoolAdditionalNotes || data.additionalNotes || []);
          setQuickNoteEntries(data.schoolQuickNoteEntries || data.quickNoteEntries || []);`);

content = content.replace(
`          setDeepDiveEntries(data.competitionDeepDiveEntries || []);
          setAdditionalNotes(data.competitionAdditionalNotes || []);`,
`          setDeepDiveEntries(data.competitionDeepDiveEntries || []);
          setAdditionalNotes(data.competitionAdditionalNotes || []);
          setQuickNoteEntries(data.competitionQuickNoteEntries || []);`);

// 5. Render UI for Quick Notes manager
const quickNotesUI = `
                              {/* QUICK NOTES MANAGER */}
                              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4">
                                  <h4 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                                      <Zap size={20} /> Quick Notes Breakdown
                                  </h4>
                                  <p className="text-[10px] text-yellow-600 mb-4">
                                      Add multiple entries for <b>Quick Notes</b>.
                                      <br/>• <b>Title:</b> Displayed as the topic name.
                                      <br/>• <b>Content:</b> Add plain text separated by new lines for points.
                                  </p>

                                  <div className="space-y-4 mb-4">
                                      {quickNoteEntries.map((entry, idx) => (
                                          <div key={idx} className="bg-white p-4 rounded-xl border border-yellow-200 shadow-sm space-y-3 relative group">
                                              <div className="absolute top-2 right-2 flex gap-1">
                                                  <button onClick={() => setQuickNoteEntries(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                      <Trash2 size={16} />
                                                  </button>
                                              </div>

                                              <span className="text-xs font-bold text-yellow-500 uppercase">Quick Note {idx + 1}</span>

                                              {/* TITLE INPUT */}
                                              <div className="flex items-center bg-slate-50 border border-yellow-200 rounded-lg overflow-hidden">
                                                  <div className="px-3 py-2 text-slate-400 font-bold text-xs">Title</div>
                                                  <input
                                                      type="text"
                                                      value={entry.title || ''}
                                                      onChange={e => {
                                                          const updated = [...quickNoteEntries];
                                                          updated[idx].title = e.target.value;
                                                          setQuickNoteEntries(updated);
                                                      }}
                                                      placeholder="e.g. Introduction to Physics"
                                                      className="flex-1 bg-transparent p-2 text-xs font-bold outline-none text-slate-800"
                                                  />
                                              </div>

                                              {/* TEXT CONTENT */}
                                              <textarea
                                                  value={entry.content}
                                                  onChange={e => {
                                                      const updated = [...quickNoteEntries];
                                                      updated[idx].content = e.target.value;
                                                      setQuickNoteEntries(updated);
                                                  }}
                                                  className="w-full p-3 border border-yellow-200 rounded-lg text-xs font-mono h-32 focus:ring-1 focus:ring-yellow-300 outline-none"
                                                  placeholder="Point 1...\\nPoint 2..."
                                              />
                                          </div>
                                      ))}
                                  </div>

                                  <button
                                      onClick={() => setQuickNoteEntries([...quickNoteEntries, { id: Date.now().toString(), title: '', content: '' }])}
                                      className="w-full py-3 bg-white border border-yellow-300 text-yellow-600 font-bold rounded-xl hover:bg-yellow-50 border-dashed flex items-center justify-center gap-2"
                                  >
                                      <Plus size={16} /> Add Quick Note
                                  </button>
                              </div>
`;

content = content.replace(
`                              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">`,
quickNotesUI + `\n                              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">`);

fs.writeFileSync('components/AdminDashboard.tsx', content, 'utf8');
console.log('AdminDashboard.tsx patched');

import re

with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()

# Change Tab State and Labels
content = content.replace("const [activeTab, setActiveTab] = useState<'DOWNLOADS' | 'ACTIVITY'>('DOWNLOADS');", "const [activeTab, setActiveTab] = useState<'DOWNLOADS' | 'MCQ_HISTORY'>('DOWNLOADS');")
content = content.replace("setActiveTab('ACTIVITY')", "setActiveTab('MCQ_HISTORY')")
content = content.replace("activeTab === 'ACTIVITY'", "activeTab === 'MCQ_HISTORY'")
content = content.replace("<FileText size={18} /> Activity Log", "<BookOpen size={18} /> Past Tests")
content = content.replace("Your saved offline notes and recent activity log", "Your saved offline notes and past test results")

# Replace the Activity Log logic with simple mcqHistory mapping
# Find the start of the <div className="space-y-4"> that contains usageLog and replace it entirely.
# The usageLog section ends with a series of `</div>` and `</details>`. We can just write a clean block to replace the rest of the component after `activeTab === 'DOWNLOADS' ? (...) : (`

# Let's find exactly where the `isEmbedded={true} /> </div> ) : (` is.
split_token = "            </div>\n        ) : (\n"

if split_token in content:
    parts = content.split(split_token)
    top = parts[0] + split_token

    bottom_replacement = """
            <div className="space-y-4 pb-20">
                {(!user.mcqHistory || user.mcqHistory.length === 0) ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                        <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No past tests found. Complete some MCQs to see your history here.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {[...(user.mcqHistory || [])].sort((a,b) => b.date - a.date).map((item, i) => (
                            <div
                                key={`${item.chapterId}-${i}`}
                                onClick={() => setSelectedResult(item)}
                                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                                    (item.score / item.totalQuestions) >= 0.8 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                    (item.score / item.totalQuestions) >= 0.5 ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    'bg-rose-50 border-rose-100 text-rose-600'
                                }`}>
                                    {Math.round((item.score / item.totalQuestions) * 100)}%
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mb-1">{item.chapterTitle}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.subjectName}</span>
                                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
"""

    with open('components/HistoryPage.tsx', 'w') as f:
        f.write(top + bottom_replacement)

import React, { useState, useEffect } from 'react';
import { ArrowLeft, HardDriveDownload, Trash2, FileText, BrainCircuit, Play, Search, AlertCircle, BookOpen, Clock } from 'lucide-react';
import { downloadManager, DownloadItem } from '../utils/downloadManager';
import { LessonView } from './LessonView';
import { MarksheetCard } from './MarksheetCard';
import { formatDuration } from '../utils/timeUtils';

export const DownloadsPage = ({
    onBack,
    user,
    settings,
    isEmbedded
}: {
    onBack: () => void,
    user: any,
    settings: any,
    isEmbedded?: boolean
}) => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<'LIST' | 'LESSON' | 'ANALYSIS' | 'PDF'>('LIST');
    const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'ALL' | 'LESSON' | 'ANALYSIS'>('ALL');

    useEffect(() => {
        loadDownloads();
    }, []);

    const loadDownloads = async () => {
        setLoading(true);
        try {
            const items = await downloadManager.getAllDownloads();
            setDownloads(items.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
            console.error("Failed to load downloads", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string, type: string) => {
        e.stopPropagation();
        if (confirm('Delete this saved item?')) {
            await downloadManager.removeDownload(id, type as any);
            loadDownloads();
        }
    };

    const handleOpen = (item: DownloadItem) => {
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
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return 'Unknown size';
        const kb = bytes / 1024;
        if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
        return `${kb.toFixed(0)} KB`;
    };


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

    if (activeView === 'LESSON' && selectedItem?.data) {
        return (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                <button onClick={() => setActiveView('LIST')} className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-md z-50 text-slate-700 hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <LessonView
                    content={selectedItem.data.content}
                    subject={selectedItem.data.subject}
                    classLevel={user.classLevel || '10' as any}
                    chapter={selectedItem.data.chapter}
                    loading={false}
                    onBack={() => setActiveView('LIST')}
                    user={user}
                    settings={settings}
                />
            </div>
        );
    }

    if (activeView === 'ANALYSIS' && selectedItem?.data) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setActiveView('LIST')} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="font-bold text-slate-800 text-lg">Offline Analysis</h2>
                </div>
                <div className="p-4 max-w-2xl mx-auto">
                    <MarksheetCard
                        result={selectedItem.data.result}
                        questions={selectedItem.data.questions}
                        user={user}
                        settings={settings}
                    />
                </div>
            </div>
        );
    }

    const filteredDownloads = downloads.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'ALL' || d.type === activeCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
            {!isEmbedded && (
            <div className="bg-white px-4 pt-12 pb-4 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <HardDriveDownload size={22} className="text-emerald-600" />
                            Offline Downloads
                        </h1>
                        <p className="text-xs font-medium text-slate-500">Access your saved materials without internet</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search downloads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-100 text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-transparent focus:border-emerald-300 focus:bg-white transition-all font-medium placeholder:font-normal"
                    />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory('ALL')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => setActiveCategory('LESSON')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'LESSON' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                        Notes & MCQs
                    </button>
                    <button
                        onClick={() => setActiveCategory('ANALYSIS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ANALYSIS' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                    >
                        Test Analysis
                    </button>
                </div>
            </div>
            )}

            {isEmbedded && (
                <div className="px-4 pt-2 pb-4 bg-slate-50 sticky top-0 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search downloads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white text-slate-700 text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all font-medium placeholder:font-normal shadow-sm"
                        />
                    </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory('ALL')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => setActiveCategory('LESSON')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'LESSON' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                        Notes & MCQs
                    </button>
                    <button
                        onClick={() => setActiveCategory('ANALYSIS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'ANALYSIS' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                    >
                        Test Analysis
                    </button>
                </div>
                </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto pt-0">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                ) : filteredDownloads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                            <HardDriveDownload size={32} className="text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Downloads Yet</h3>
                        <p className="text-sm text-slate-500 max-w-[250px]">
                            Save notes, analysis, and MCQs for offline viewing. They will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredDownloads.map(item => (
                            <div
                                key={`${item.id}-${item.type}`}
                                onClick={() => handleOpen(item)}
                                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
                                    item.type === 'LESSON' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                    item.type === 'ANALYSIS' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                    'bg-slate-50 border-slate-200 text-slate-500'
                                }`}>
                                    {item.type === 'LESSON' ? <BookOpen size={24} /> :
                                     item.type === 'ANALYSIS' ? <BrainCircuit size={24} /> :
                                     <FileText size={24} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 flex-wrap">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.subject}</span>
                                        <span className="flex items-center gap-0.5"><Clock size={10} /> {new Date(item.timestamp).toLocaleDateString()}</span>
                                        <span>• {formatSize(item.size || 0)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, item.id, item.type)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && downloads.length > 0 && (
                    <div className="mt-6 flex items-center gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <AlertCircle size={16} className="text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-blue-700 font-medium">These files are saved securely on your device. Clearing browser data or uninstalling the app will remove them.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

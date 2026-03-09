import React from 'react';
import { SystemSettings } from '../../types';
import { ArrowLeft, Save, RotateCcw, BrainCircuit } from 'lucide-react';
import { safeSetLocalStorage } from '../../utils/safeStorage';

interface Props {
    settings: SystemSettings;
    onUpdateSettings: (s: SystemSettings) => void;
    onBack: () => void;
}

export const RevisionLogicPanel: React.FC<Props> = ({ settings, onUpdateSettings, onBack }) => {
    const localSettings = settings;
    const setLocalSettings = onUpdateSettings;

    const saveChanges = () => {
        // Also persist locally as fallback
        safeSetLocalStorage('nst_system_settings', JSON.stringify(localSettings));
        alert("Revision Engine Configuration Saved Successfully!");
    };

    return (
        <div className="bg-slate-50 min-h-screen p-6 animate-in fade-in pb-32">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <BrainCircuit className="text-purple-600" /> Revision Logic Config
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Master Revision Engine Settings</p>
                    </div>
                </div>
            </div>

            {/* --- REVISION LOGIC CONFIGURATION --- */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><BrainCircuit size={18} className="text-purple-500" /> Revision Engine Config</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Strong Topic (Min %)</label>
                    <input
                        type="number"
                        value={localSettings.revisionConfig?.thresholds.strong ?? 80}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            revisionConfig: {
                                ...localSettings.revisionConfig!,
                                thresholds: {
                                    ...localSettings.revisionConfig?.thresholds!,
                                    strong: parseInt(e.target.value) || 0
                                }
                            } as any
                        })}
                        className="w-full p-2 border rounded-lg font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Scores above this are "Strong"</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Average Topic (Min %)</label>
                    <input
                        type="number"
                        value={localSettings.revisionConfig?.thresholds.average ?? 50}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            revisionConfig: {
                                ...localSettings.revisionConfig!,
                                thresholds: {
                                    ...localSettings.revisionConfig?.thresholds!,
                                    average: parseInt(e.target.value) || 0
                                }
                            } as any
                        })}
                        className="w-full p-2 border rounded-lg font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Scores between this and Strong are "Average"</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Mastery Score (Min %)</label>
                    <input
                        type="number"
                        value={localSettings.revisionConfig?.thresholds.mastery ?? 80}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            revisionConfig: {
                                ...localSettings.revisionConfig!,
                                thresholds: {
                                    ...localSettings.revisionConfig?.thresholds!,
                                    mastery: parseInt(e.target.value) || 0
                                }
                            } as any
                        })}
                        className="w-full p-2 border rounded-lg font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Score needed to count towards Mastery</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Mastery Count</label>
                    <input
                        type="number"
                        value={localSettings.revisionConfig?.mastery.requiredCount ?? 2}
                        onChange={(e) => setLocalSettings({
                            ...localSettings,
                            revisionConfig: {
                                ...localSettings.revisionConfig!,
                                mastery: {
                                    requiredCount: parseInt(e.target.value) || 1
                                }
                            } as any
                        })}
                        className="w-full p-2 border rounded-lg font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">How many times user must score high to Master a topic</p>
                </div>
            </div>

            {/* TIME INTERVALS */}
            <div className="space-y-6">
                {['weak', 'average', 'strong', 'mastered'].map(status => {
                    // Helper to get seconds safely
                    const getSeconds = (type: 'revision' | 'mcq') => {
                        // @ts-ignore
                        return localSettings.revisionConfig?.intervals?.[status]?.[type] || 0;
                    };

                    // Helper to update seconds
                    const updateSeconds = (type: 'revision' | 'mcq', totalSeconds: number) => {
                            const newIntervals = {
                                weak: { revision: 86400, mcq: 259200 },
                                average: { revision: 259200, mcq: 432000 },
                                strong: { revision: 604800, mcq: 864000 },
                                mastered: { revision: 2592000, mcq: 864000 },
                                ...(localSettings.revisionConfig?.intervals || {})
                            };
                            // @ts-ignore
                            newIntervals[status] = {
                                // @ts-ignore
                                ...newIntervals[status],
                                [type]: totalSeconds
                            };

                            setLocalSettings({
                                ...localSettings,
                                revisionConfig: {
                                    thresholds: localSettings.revisionConfig?.thresholds || { strong: 80, average: 50, mastery: 80 },
                                    mastery: localSettings.revisionConfig?.mastery || { requiredCount: 2 },
                                    intervals: newIntervals
                                }
                            });
                    };

                    const renderTimeInput = (label: string, type: 'revision' | 'mcq', color: string) => {
                        const totalSeconds = getSeconds(type);
                        const d = Math.floor(totalSeconds / (24 * 3600));
                        const h = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                        const m = Math.floor((totalSeconds % 3600) / 60);

                        return (
                            <div className={"p-3 rounded-xl border " + color + " bg-white flex flex-col gap-2"}>
                                <span className="text-[10px] font-bold uppercase">{label}</span>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={d} onChange={e => updateSeconds(type, (parseInt(e.target.value||'0')*86400) + h*3600 + m*60)} className="w-12 p-1 border rounded text-xs font-bold text-center" /> d
                                    <input type="number" value={h} onChange={e => updateSeconds(type, d*86400 + (parseInt(e.target.value||'0')*3600) + m*60)} className="w-12 p-1 border rounded text-xs font-bold text-center" /> h
                                </div>
                            </div>
                        );
                    };

                    return (
                        <div key={status} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-700 capitalize mb-3">{status} Status Topic</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderTimeInput('Next Revision Note Date', 'revision', 'border-blue-200 text-blue-700')}
                                {renderTimeInput('Next MCQ Practice Date', 'mcq', 'border-purple-200 text-purple-700')}
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>

            {/* STICKY SAVE BUTTON - COMPACT MOBILE */}
            <div className="fixed bottom-8 right-6 z-[9999] flex justify-end safe-area-bottom">
                <button
                    onClick={saveChanges}
                    className="w-12 h-12 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center border-2 border-white"
                    title="Save Changes"
                >
                    <Save size={20} />
                </button>
            </div>
        </div>
    );
};

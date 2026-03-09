import React from 'react';
import { Home, BrainCircuit, Sparkles, History, User as UserIconOutline } from 'lucide-react';
import { StudentTab } from '../../../types';

interface Props {
  activeTab: StudentTab;
  onTabChange: (tab: StudentTab) => void;
  setContentViewStep: (step: 'SUBJECTS' | 'CHAPTERS' | 'PLAYER') => void;
}

export const StudentBottomNav: React.FC<Props> = ({ activeTab, onTabChange, setContentViewStep }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[1080px] mx-auto bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[9999] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex justify-around items-center h-[65px] py-[6px]">
        <button onClick={() => { onTabChange('HOME'); setContentViewStep('SUBJECTS'); }} className={`flex flex-col items-center justify-center w-full h-full gap-1.5 ${activeTab === 'HOME' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home size={24} fill={activeTab === 'HOME' ? "currentColor" : "none"} />
          <span className="text-[12px] font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            onTabChange('REVISION' as any);
          }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1.5 ${activeTab === 'REVISION' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="relative">
            <BrainCircuit size={24} fill={activeTab === 'REVISION' ? "currentColor" : "none"} />
          </div>
          <span className="text-[12px] font-bold">Revision</span>
        </button>

        <button
          onClick={() => {
            onTabChange('AI_HUB');
          }}
          className={`flex flex-col items-center justify-center w-full h-full gap-1.5 ${activeTab === 'AI_HUB' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="relative">
            <Sparkles size={24} fill={activeTab === 'AI_HUB' ? "currentColor" : "none"} />
          </div>
          <span className="text-[12px] font-bold">AI Hub</span>
        </button>

        <button onClick={() => onTabChange('HISTORY')} className={`flex flex-col items-center justify-center w-full h-full gap-1.5 ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-400'}`}>
          <History size={24} />
          <span className="text-[12px] font-bold">History</span>
        </button>

        <button onClick={() => onTabChange('PROFILE')} className={`flex flex-col items-center justify-center w-full h-full gap-1.5 ${activeTab === 'PROFILE' ? 'text-blue-600' : 'text-slate-400'}`}>
          <UserIconOutline size={24} fill={activeTab === 'PROFILE' ? "currentColor" : "none"} />
          <span className="text-[12px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};

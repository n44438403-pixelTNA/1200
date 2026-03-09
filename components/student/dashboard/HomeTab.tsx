import React from 'react';
import { User, SystemSettings, Subject } from '../../../types';
import { getSubjectsList } from '../../../constants';
import { checkFeatureAccess } from '../../../utils/permissionUtils';
import { BookOpen, BarChart3, Video, Lock } from 'lucide-react';
import { PerformanceGraph } from '../../PerformanceGraph';
import { StudyGoalTimer } from '../../StudyGoalTimer';
import { safeSetLocalStorage } from '../../../utils/safeStorage';

interface Props {
  user: User;
  settings?: SystemSettings;
  dailyStudySeconds: number;
  dailyTargetSeconds: number;
  setDailyTargetSeconds: (s: number) => void;
  isLayoutEditing: boolean;
  toggleLayoutVisibility: (id: string) => void;
  onTabChange: (tab: any) => void;
  handleContentSubjectSelect: (subject: Subject) => void;
  showAlert: (msg: string, type: 'SUCCESS'|'ERROR'|'INFO') => void;
}

const DashboardSectionWrapper = ({
    id,
    children,
    label,
    settings,
    isLayoutEditing,
    onToggleVisibility
}: {
    id: string,
    children: React.ReactNode,
    label: string,
    settings?: SystemSettings,
    isLayoutEditing: boolean,
    onToggleVisibility: (id: string) => void
}) => {
    const isVisible = settings?.dashboardLayout?.[id]?.visible !== false;

    if (!isVisible && !isLayoutEditing) return null;

  return (
        <div className={`relative ${isLayoutEditing ? 'border-2 border-dashed border-yellow-400 p-2 rounded-xl mb-4 bg-yellow-50/10' : ''}`}>
            {isLayoutEditing && (
                <div className="absolute -top-3 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow z-50 flex items-center gap-2">
                    <span>{label}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleVisibility(id); }}
                        className={`px-2 py-0.5 rounded text-xs ${isVisible ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                        {isVisible ? 'ON' : 'OFF'}
                    </button>
                </div>
            )}
            <div className={!isVisible ? 'opacity-50 grayscale pointer-events-none' : ''}>
                {children}
            </div>
        </div>
    );
};

export const HomeTab: React.FC<Props> = ({ user, settings, dailyStudySeconds, dailyTargetSeconds, setDailyTargetSeconds, isLayoutEditing, toggleLayoutVisibility, onTabChange, handleContentSubjectSelect, showAlert }) => {
  return (
    <div className="space-y-3">
      {/* PERFORMANCE GRAPH */}
      <DashboardSectionWrapper id="section_performance" label="Performance" settings={settings} isLayoutEditing={isLayoutEditing} onToggleVisibility={toggleLayoutVisibility}>
          <PerformanceGraph
              history={user.mcqHistory || []}
              user={user}
              onViewNotes={(topic) => {
                  onTabChange('PDF');
              }}
          />
      </DashboardSectionWrapper>

      {/* STUDY TIMER & MYSTERY BUTTON */}
      <DashboardSectionWrapper id="section_timer" label="Study Goal" settings={settings} isLayoutEditing={isLayoutEditing} onToggleVisibility={toggleLayoutVisibility}>
          <div className="relative">
              <StudyGoalTimer
                  dailyStudySeconds={dailyStudySeconds}
                  targetSeconds={dailyTargetSeconds}
                  onSetTarget={(s) => {
                      setDailyTargetSeconds(s);
                      safeSetLocalStorage(`nst_goal_${user.id}`, (s / 3600).toString());
                  }}
              />

          </div>
      </DashboardSectionWrapper>

      {/* MAIN ACTION BUTTONS */}
      <DashboardSectionWrapper id="section_main_actions" label="Main Actions" settings={settings} isLayoutEditing={isLayoutEditing} onToggleVisibility={toggleLayoutVisibility}>
          <div className="grid grid-cols-2 gap-3 w-[96%] mx-auto">
              {/* STUDY SECTION */}
              <div className="col-span-2 bg-white rounded-[20px] p-5 border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)] mb-3">
                  <h3 className="font-black text-slate-800 text-lg mb-3 flex items-center gap-2">
                      <BookOpen className="text-blue-600" size={24} /> Study
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                      {getSubjectsList(user.classLevel || '10', user.stream || 'Science', user.board).map((subject) => {
                          if ((settings?.hiddenSubjects || []).includes(subject.id)) return null;
                          return (
                              <button
                                  key={subject.id}
                                  onClick={() => {
                                      onTabChange('COURSES');
                                      handleContentSubjectSelect(subject);
                                  }}
                                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95 border-2 ${
                                      subject.id.includes('science') ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                      subject.id.includes('math') ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                      subject.id.includes('social') ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                      'bg-slate-50 border-slate-100 text-slate-700'
                                  }`}
                              >
                                  <div className={`p-2 rounded-full bg-white shadow-sm`}>
                                      <BookOpen size={20} className={
                                          subject.id.includes('science') ? 'text-purple-600' :
                                          subject.id.includes('math') ? 'text-blue-600' :
                                          subject.id.includes('social') ? 'text-orange-600' :
                                          'text-slate-600'
                                      } />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase text-center leading-tight">
                                      {subject.name}
                                  </span>
                              </button>
                          );
                      })}
                  </div>
              </div>

              {(() => {
                  const isLocked = false;
                  return (
                      <button
                          onClick={() => {
                              onTabChange('ANALYTICS');
                          }}
                          className={`bg-white border-2 border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all hover:border-blue-200 h-32 relative overflow-hidden ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                      >
                          <BarChart3 size={28} className="text-blue-600 mb-1" />
                          <span className="font-black text-slate-700 text-sm tracking-wide uppercase text-center">My Analysis</span>
                          {isLocked && <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Lock size={12} /></div>}
                      </button>
                  );
              })()}

              {(() => {
                  const access = checkFeatureAccess('VIDEO_ACCESS', user, settings || {});
                  const isLocked = !access.hasAccess;
                  return (
                      <button
                          onClick={() => {
                              if (isLocked) { showAlert("🔒 Video content is locked by Admin.", "ERROR"); return; }
                              onTabChange('UNIVERSAL_VIDEO');
                          }}
                          className={`bg-white border-2 border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all hover:border-rose-200 h-32 relative overflow-hidden ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                      >
                          <div className="relative">
                              <Video size={28} className="text-rose-600 mb-1" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></div>
                          </div>
                          <span className="font-black text-slate-700 text-sm tracking-wide uppercase text-center">Universal Video</span>
                          {isLocked && <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Lock size={12} /></div>}
                      </button>
                  );
              })()}
          </div>
      </DashboardSectionWrapper>
    </div>
  );
};

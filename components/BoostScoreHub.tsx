import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle, Clock, BookOpen, AlertCircle, TrendingUp, RefreshCw, Zap, Target, Edit3 } from 'lucide-react';
import { User } from '../types';

interface BoostScoreHubProps {
  onBack: () => void;
  user?: User | null;
}

export const BoostScoreHub: React.FC<BoostScoreHubProps> = ({ onBack, user }) => {
  const [activeTab, setActiveTab] = useState<'TODAY' | 'WEAK' | 'AVERAGE' | 'STRONG' | 'MASTERY' | 'MISTAKE' | 'MCQ'>('TODAY');

  const now = Date.now();

  // Process data from mcqHistory to categorize topics
  const { todayTasks, weakTopics, averageTopics, strongTopics, masteryTopics, mistakeTopics, mcqPending } = useMemo(() => {
    const history = user?.mcqHistory || [];

    // Aggregate by topic
    const topicMap: Record<string, { scores: number[], dates: number[], totalQuestions: number, mistakes: number, lastDate: number }> = {};

    history.forEach(session => {
        const topic = session.chapterTitle || 'Unknown Topic';
        const date = session.date ? new Date(session.date).getTime() : 0;
        if (!topicMap[topic]) {
            topicMap[topic] = { scores: [], dates: [], totalQuestions: 0, mistakes: 0, lastDate: 0 };
        }
        topicMap[topic].scores.push(session.score);
        topicMap[topic].dates.push(date);
        topicMap[topic].totalQuestions += session.totalQuestions || 0;
        // Approximation of mistakes if detailed data isn't easily mapped
        const correct = Math.round((session.score / 100) * (session.totalQuestions || 10));
        topicMap[topic].mistakes += ((session.totalQuestions || 10) - correct);

        if (date > topicMap[topic].lastDate) {
            topicMap[topic].lastDate = date;
        }
    });

    const weak: any[] = [];
    const avg: any[] = [];
    const strong: any[] = [];
    const mastery: any[] = [];
    const mistakes: any[] = [];
    const today: any[] = [];
    const mcq: any[] = [];

    // Categorization Logic based on requirements
    Object.keys(topicMap).forEach(topic => {
        const data = topicMap[topic];
        const latestScore = data.scores[data.scores.length - 1]; // Score of the most recent attempt
        const lastDate = data.lastDate;

        // Count how many times scored > 80%
        const highScoresCount = data.scores.filter(s => s >= 80).length;

        let status = 'PENDING';
        let dueDate = 0;
        let daysToWait = 0;

        if (highScoresCount >= 2) {
            status = 'MASTERY';
            daysToWait = 30; // 30 days for mastery revision
        } else if (latestScore >= 80) {
            status = 'STRONG';
            daysToWait = 7; // 7 days for strong
        } else if (latestScore >= 50) {
            status = 'AVERAGE';
            daysToWait = 5; // 5 days for average
        } else {
            status = 'WEAK';
            daysToWait = 3; // 3 days for weak
        }

        dueDate = lastDate + (daysToWait * 24 * 60 * 60 * 1000);

        const item = { topic, latestScore, status, lastDate, dueDate, mistakes: data.mistakes };

        // Check if due for revision today
        if (now >= dueDate) {
            // It's due today or overdue
            // But we need to check if it's already in the "MCQ Phase" (e.g. they revised notes)
            // For simplicity in this logic, we push to Today Task for notes revision first.
            // If they had a recent REVISION session, it moves to MCQ pending.

            // Check if there's a recent REVISION session after the dueDate
            const recentRevisions = history.filter(h => h.topic === topic && h.mode === 'REVISION' && (h.date ? new Date(h.date).getTime() : 0) >= dueDate - (24 * 60 * 60 * 1000));

            if (recentRevisions.length > 0) {
                 // Notes revised, now wait for MCQ phase (e.g., 5/7/10 days after revision)
                 const lastRevDate = recentRevisions[recentRevisions.length - 1].date ? new Date(recentRevisions[recentRevisions.length - 1].date).getTime() : 0;
                 let mcqWaitDays = 5;
                 if (status === 'STRONG') mcqWaitDays = 10;
                 if (status === 'AVERAGE') mcqWaitDays = 7;
                 if (status === 'MASTERY') mcqWaitDays = 10; // "revisun ke 10 din baad aayega mastry wala page ke topic ka mcq"

                 const mcqDueDate = lastRevDate + (mcqWaitDays * 24 * 60 * 60 * 1000);

                 if (now >= mcqDueDate) {
                     mcq.push({ ...item, dueDate: mcqDueDate, status: 'MCQ_READY' });
                 } else {
                     // Waiting for MCQ
                 }
            } else {
                today.push(item);
            }
        } else {
            // Not due yet, put in respective bucket
            if (status === 'WEAK') weak.push(item);
            if (status === 'AVERAGE') avg.push(item);
            if (status === 'STRONG') strong.push(item);
            if (status === 'MASTERY') mastery.push(item);
        }

        if (data.mistakes > 0) {
            mistakes.push(item);
        }
    });

    // Sort by due date
    const sortByDueDate = (a: any, b: any) => a.dueDate - b.dueDate;

    return {
        todayTasks: today.sort(sortByDueDate),
        weakTopics: weak.sort(sortByDueDate),
        averageTopics: avg.sort(sortByDueDate),
        strongTopics: strong.sort(sortByDueDate),
        masteryTopics: mastery.sort(sortByDueDate),
        mistakeTopics: mistakes.sort((a,b) => b.mistakes - a.mistakes), // sort by most mistakes
        mcqPending: mcq.sort(sortByDueDate)
    };
  }, [user?.mcqHistory]);


  const tabs = [
    { id: 'TODAY', label: 'Today Task', icon: Target, data: todayTasks, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'WEAK', label: 'Weak Topics', icon: AlertCircle, data: weakTopics, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'AVERAGE', label: 'Average', icon: RefreshCw, data: averageTopics, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'STRONG', label: 'Strong', icon: TrendingUp, data: strongTopics, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'MASTERY', label: 'Mastery', icon: Zap, data: masteryTopics, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'MISTAKE', label: 'Mistakes', icon: Edit3, data: mistakeTopics, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'MCQ', label: 'MCQs', icon: CheckCircle, data: mcqPending, color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

  const renderTopicCard = (item: any, isToday: boolean, isMCQ: boolean) => {
      const daysUntil = Math.max(0, Math.ceil((item.dueDate - now) / (1000 * 60 * 60 * 24)));

      return (
          <div key={item.topic} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h4 className="font-semibold text-slate-800">{item.topic}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium
                          ${item.latestScore >= 80 ? 'bg-green-100 text-green-700' :
                            item.latestScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}>
                          Latest Score: {item.latestScore}%
                      </span>
                      {activeTab === 'MISTAKE' && (
                          <span className="text-orange-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {item.mistakes} Mistakes
                          </span>
                      )}
                      {!isToday && !isMCQ && (
                          <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" /> Revise in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                          </span>
                      )}
                  </div>
              </div>

              <div className="flex gap-2">
                 {isToday && (
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                         <BookOpen className="w-4 h-4" /> Revise Notes
                     </button>
                 )}
                 {isMCQ && (
                     <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2">
                         <CheckCircle className="w-4 h-4" /> Start MCQ
                     </button>
                 )}
              </div>
          </div>
      );
  };

  const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Boost Your Score</h1>
          <p className="text-xs text-slate-500">Smart spaced repetition for mastery</p>
        </div>
      </div>

      <div className="p-4">
        {/* Horizontal Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all
                ${activeTab === tab.id
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color.replace('text-', 'text-opacity-80 text-')}`} />
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs
                ${activeTab === tab.id ? 'bg-slate-700 text-white' : tab.bg + ' ' + tab.color}`}>
                {tab.data.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-4">
            {currentTabData.length === 0 ? (
                <div className="mt-12 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Target, { className: "w-8 h-8 text-slate-400" })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Topics Here</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                        {`You don't have any topics in the ${tabs.find(t => t.id === activeTab)?.label} category right now. Keep practicing!`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentTabData.map((item: any, idx: number) => renderTopicCard(item, activeTab === 'TODAY', activeTab === 'MCQ'))}
                </div>
            )}
        </div>

        {/* Educational Info Box */}
        {activeTab === 'WEAK' && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Why are these here?
                </h4>
                <p className="text-sm text-blue-700">Topics where you scored below 50% appear here. They will surface in your "Today Task" every 3 days for revision until your score improves.</p>
            </div>
        )}
      </div>
    </div>
  );
};

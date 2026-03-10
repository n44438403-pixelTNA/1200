const fs = require('fs');
let content = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

// Insert a button inside the ACTIVITY_LOG tab header to navigate to REVISION_LOGIC
const activityLogHeader = `      {activeTab === 'ACTIVITY_LOG' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 mb-6"><button onClick={() => setActiveTab('DASHBOARD')} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><ArrowLeft size={20} /></button><h3 className="text-xl font-black text-slate-800 flex-1">Activity Log</h3>
                  <button onClick={() => setActiveTab('REVISION_LOGIC')} className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors flex items-center gap-2">
                      <BrainCircuit size={16} /> Revision Config
                  </button>
              </div>`;

content = content.replace(
    /\{\s*activeTab === 'ACTIVITY_LOG' && \(\s*<div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in slide-in-from-bottom-4">\s*<div className="flex items-center gap-4 mb-6"><button onClick=\{\(\) => setActiveTab\('DASHBOARD'\)\} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><ArrowLeft size=\{20\} \/><\/button><h3 className="text-xl font-black text-slate-800">Activity Log<\/h3><\/div>/,
    activityLogHeader
);

fs.writeFileSync('components/AdminDashboard.tsx', content);
console.log('Activity Log Tab updated with Revision Config button');

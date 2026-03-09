const fs = require('fs');
let content = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

if (!content.includes("import { RevisionLogicPanel }")) {
    content = content.replace("import { NstaFeatureManager } from './admin/NstaFeatureManager';", "import { NstaFeatureManager } from './admin/NstaFeatureManager';\nimport { RevisionLogicPanel } from './admin/RevisionLogicPanel';");
}

const revisionLogicTab = `
      {activeTab === 'REVISION_LOGIC' && (
          <RevisionLogicPanel settings={localSettings} onUpdateSettings={setLocalSettings} onBack={() => setActiveTab('DASHBOARD')} />
      )}
`;

if (!content.includes("<RevisionLogicPanel")) {
    content = content.replace("{activeTab === 'NSTA_CONTROL' && (", revisionLogicTab + "\n      {activeTab === 'NSTA_CONTROL' && (");
}

fs.writeFileSync('components/AdminDashboard.tsx', content);
console.log('AdminDashboard updated');

import re

with open('components/StudentSidebar.tsx', 'r') as f:
    content = f.read()

if 'DOWNLOADS' not in content:
    content = content.replace("{ id: 'HISTORY', icon: History, label: 'History', color: 'text-slate-600', featureId: 'f21', category: 'LEARNING' },", "{ id: 'HISTORY', icon: History, label: 'History', color: 'text-slate-600', featureId: 'f21', category: 'LEARNING' },\n        { id: 'DOWNLOADS' as any, icon: HardDriveDownload, label: 'Downloads', color: 'text-emerald-600', featureId: 'f21', category: 'LEARNING' },")

with open('components/StudentSidebar.tsx', 'w') as f:
    f.write(content)

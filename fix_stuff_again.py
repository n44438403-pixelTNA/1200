import re

with open('components/StudentSidebar.tsx', 'r') as f:
    content = f.read()

# Identify the Boost Score button logic and remove it
content = re.sub(r"\{\s*id:\s*'BOOST_SCORE'.*?\},?", "", content)
with open('components/StudentSidebar.tsx', 'w') as f:
    f.write(content)

with open('components/StudentDashboard.tsx', 'r') as f:
    dash_content = f.read()

dash_content = re.sub(r"if\s*\(activeTab\s*===\s*'BOOST_SCORE'\)\s*return\s*<BoostScoreHub.*?>;", "", dash_content)
dash_content = re.sub(r"import\s+\{\s*BoostScoreHub\s*\}\s+from\s+'\.\/BoostScoreHub';", "", dash_content)

with open('components/StudentDashboard.tsx', 'w') as f:
    f.write(dash_content)

# Fix MarksheetOffline
with open('components/MarksheetCard.tsx', 'r') as f:
    content = f.read()

old_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `marksheet_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Marksheet: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result }
                        });
                        if(success) alert('Marksheet saved for offline viewing in the Downloads tab.');
                    }}"""

new_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `marksheet_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Marksheet: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result, questions }
                        });
                        if(success) alert('Marksheet saved for offline viewing in the Downloads tab.');
                    }}"""

old_full_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `analysis_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Analysis: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result }
                        });
                        if(success) alert('Analysis report saved for offline viewing in the Downloads tab.');
                    }}"""

new_full_btn = """                <button
                    onClick={async () => {
                        const success = await downloadManager.saveDownload({
                            id: `analysis_${result.chapterId || Date.now()}`,
                            type: 'ANALYSIS',
                            title: `Analysis: ${result.chapterTitle || 'Quiz'}`,
                            subject: result.subjectName || 'General',
                            timestamp: Date.now(),
                            data: { result, questions }
                        });
                        if(success) alert('Analysis report saved for offline viewing in the Downloads tab.');
                    }}"""

content = content.replace(old_btn, new_btn)
content = content.replace(old_full_btn, new_full_btn)
with open('components/MarksheetCard.tsx', 'w') as f:
    f.write(content)

with open('components/DownloadsPage.tsx', 'r') as f:
    content = f.read()

content = content.replace('<MarksheetCard \n                        result={selectedItem.data.result} \n                        user={user} \n                        settings={settings} \n                    />', '<MarksheetCard \n                        result={selectedItem.data.result} \n                        questions={selectedItem.data.questions} \n                        user={user} \n                        settings={settings} \n                    />')
with open('components/DownloadsPage.tsx', 'w') as f:
    f.write(content)

# Fix ChevronRight in HistoryPage
with open('components/HistoryPage.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { BookOpen, Calendar, ChevronDown, ChevronUp, Trash2, Search, FileText, CheckCircle2, Lock, AlertCircle, Folder , HardDriveDownload} from 'lucide-react';", "import { BookOpen, Calendar, ChevronDown, ChevronUp, Trash2, Search, FileText, CheckCircle2, Lock, AlertCircle, Folder, HardDriveDownload, ChevronRight } from 'lucide-react';")
with open('components/HistoryPage.tsx', 'w') as f:
    f.write(content)

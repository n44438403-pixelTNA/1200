const fs = require('fs');

let content = fs.readFileSync('components/PdfView.tsx', 'utf8');

content = content.replace(
`            // 1. QUICK REVISION EXTRACTION
            const quickGroups: {title: string, points: string[]}[] = [];

            try {
                entries.forEach((entry, index) => {`,
`            // 1. QUICK REVISION EXTRACTION
            const quickGroups: {title: string, points: string[]}[] = [];

            // First load from dedicated quick notes (new feature)
            let dedicatedQuickNotes: any[] = [];
            if (syllabusMode === 'SCHOOL') {
                dedicatedQuickNotes = data.schoolQuickNoteEntries || data.quickNoteEntries || [];
            } else {
                dedicatedQuickNotes = data.competitionQuickNoteEntries || [];
            }

            dedicatedQuickNotes.forEach((entry) => {
                if (entry.title && entry.content) {
                    const points = entry.content.split('\\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                    if (points.length > 0) {
                        quickGroups.push({ title: entry.title, points: points });
                    }
                }
            });

            // Then try legacy HTML extraction from entries
            try {
                entries.forEach((entry, index) => {`);

fs.writeFileSync('components/PdfView.tsx', content, 'utf8');
console.log('PdfView.tsx patched');

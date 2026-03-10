const fs = require('fs');

// Patch AnalyticsPage.tsx
let analyticsContent = fs.readFileSync('components/AnalyticsPage.tsx', 'utf8');

// Change from 7 days to 365 days (or keep the latest logic but fix the 7 day bug)
// Since it's Annual Report, maybe just use all data from the current year, or just let it use historyRaw directly.
// The user just wants the data.
analyticsContent = analyticsContent.replace(
    /const history = historyRaw.filter\(h => \{\s*const d = new Date\(h.date\);\s*const limit = new Date\(\);\s*limit.setDate\(limit.getDate\(\) - 7\);\s*return d >= limit;\s*\}\);/,
    `const history = historyRaw;`
);

// Let's also update the label if it says "Last 30 Days" but it's an Annual Report
analyticsContent = analyticsContent.replace(
    /Performance Analytics \(Last 30 Days\)/g,
    "Performance Analytics (Overall)"
);

fs.writeFileSync('components/AnalyticsPage.tsx', analyticsContent);
console.log('AnalyticsPage updated');

// Patch RevisionHub.tsx
let revisionContent = fs.readFileSync('components/RevisionHub.tsx', 'utf8');

// Remove the 7-day restriction so Revision Hub analyzes all past MCQ results for topic strength
revisionContent = revisionContent.replace(
    /\/\/ FILTER: Last 7 Days Only \(As per "7 din ka history" requirement\)\s*const sevenDaysAgo = Date\.now\(\) - 7 \* 24 \* 60 \* 60 \* 1000;\s*const history = \(user\.mcqHistory \|\| \[\]\)\.filter\(h => new Date\(h\.date\)\.getTime\(\) > sevenDaysAgo\);/,
    `// Use full history for comprehensive topic mastery analysis
            const history = user.mcqHistory || [];`
);

fs.writeFileSync('components/RevisionHub.tsx', revisionContent);
console.log('RevisionHub updated');

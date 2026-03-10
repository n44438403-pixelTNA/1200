const fs = require('fs');

console.log("AnalyticsPage History Filter (Line 22):");
const analyticsPage = fs.readFileSync('components/AnalyticsPage.tsx', 'utf8');
const match = analyticsPage.match(/const history = historyRaw.filter\([\s\S]*?\}\);/);
console.log(match ? match[0] : "Not found");

console.log("\nRevisionHub History Filter (Line 98):");
const revisionHub = fs.readFileSync('components/RevisionHub.tsx', 'utf8');
const match2 = revisionHub.match(/const history = \(user\.mcqHistory \|\| \[\]\)\.filter\([\s\S]*?\);/);
console.log(match2 ? match2[0] : "Not found");

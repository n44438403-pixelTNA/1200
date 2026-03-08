const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const parseMCQStart = code.indexOf('let newQuestions: MCQItem[] = [];');
const parseMCQEnd = code.indexOf('if (newTopicNotes.length > 0) {', parseMCQStart);

console.log(code.substring(parseMCQStart, parseMCQEnd));

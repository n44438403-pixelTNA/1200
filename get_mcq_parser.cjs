const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const parseMCQStart = code.indexOf('const parseMCQTextRobust =');
const parseMCQEnd = code.indexOf('// --- UNIFIED IMPORT HANDLER (MCQ + NOTES) ---', parseMCQStart);

console.log(code.substring(parseMCQStart, parseMCQEnd));

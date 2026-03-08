const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const parseMCQStart = code.indexOf('// --- UNIFIED IMPORT HANDLER (MCQ + NOTES) ---');
const parseMCQEnd = code.indexOf('// 4. CLEANUP & SET STATE', parseMCQStart);

console.log(code.substring(parseMCQStart, parseMCQEnd));

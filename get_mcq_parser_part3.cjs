const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');


const parseMCQStart = code.indexOf('const q = qLine.replace(/^\\*\\*|\\*\\*$/g, \'\').replace(/^(?:❓\\s*\\*?\\*?Question:\\*?\\*?\\s*)/i, \'\').trim();');
const parseMCQEnd = code.indexOf('questions.push({', parseMCQStart);

console.log(code.substring(parseMCQStart, parseMCQEnd));

const fs = require('fs');
const file = 'utils/full_syllabus_data.ts';
let code = fs.readFileSync(file, 'utf8');

// The new Social Science syllabus replacements.
// Remove existing BSEB-9-Social Science and BSEB-10-Social Science
code = code.replace(/"BSEB-9-Social Science": \[\s*[\s\S]*?\s*\],/g, '');
code = code.replace(/"BSEB-10-Social Science": \[\s*[\s\S]*?\s*\],/g, '');

fs.writeFileSync(file, code);

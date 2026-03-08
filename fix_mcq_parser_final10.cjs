const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /const diffMatch = part.match\(\/\(\?:📊\\s\*Difficulty Level:\|Difficulty Level:\|Difficulty:\|कठिनाई:\)\\s\*\(\🟢 Easy\|\🟡 Medium\|\🔴 Hard\|Easy\|Medium\|Hard\|आसान\|मध्यम\|कठिन\)\/i\);/,
    "const diffMatch = part.match(/(?:📊\\s*Difficulty Level:|Difficulty Level:|Difficulty:|कठिनाई:)\\s*(🟢 Easy|🟡 Medium|🔴 Hard|Easy|Medium|Hard|आसान|मध्यम|कठिन)/i);"
);

fs.writeFileSync(file, code);

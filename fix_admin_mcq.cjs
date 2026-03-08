const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `const optMatch = part.match(/(?:Options:|विकल्प:)\\s*\\n?[\\s\\S]*?(?:✅\\s*Correct Answer:|सही उत्तर:|Answer:|Ans:)/i);`;
if (!code.includes(target1)) {
    code = code.replace(
        /const optMatch = part\.match\(\/\(\?:Options:\|विकल्प:\)\\s\*\\n\?\[\\s\\S\]\*\?\(\?:✅\\s\*Correct Answer:\|सही उत्तर:\|Answer:\|Ans:\)\/i\);/g,
        target1
    );
}

const target2 = `let ansRaw = ansLine.replace(/^(Answer|Ans|Correct|उत्तर|✅\\s*Correct Answer)\\s*[:\\s-]*\\s*/i, '').trim();`;
if (!code.includes(target2)) {
    code = code.replace(
        /let ansRaw = ansLine\.replace\(\/\^\(Answer\|Ans\|Correct\|उत्तर\)\\s\*\[:\\s-\]\*\\s\*\/\i, ''\)\.trim\(\);/g,
        target2
    );
}

fs.writeFileSync(file, code);

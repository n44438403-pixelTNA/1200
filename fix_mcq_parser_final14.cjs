const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');


const rx1 = /const conceptMatch = part\.match\(\/\(\?:💡\\s\*Concept:\|Concept:\|अवधारणा:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=\\s\*🔎\|\\s\*🎯\|\\s\*⚠\|\\s\*🧠\|\\s\*📊\|\\s\*Explanation:\|\\s\*Exam Tip:\|\\s\*Mistake:\|\\s\*Trick:\|\\s\*Difficulty\|\$\)\/i\);/g;

code = code.replace(
    /const conceptMatch = part\.match\(\/\(\?:💡\\s\*Concept:\|Concept:\|अवधारणा:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🔎\|🎯\|⚠\|🧠\|📊\|Explanation:\|Exam Tip:\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const conceptMatch = part.match(/(?:💡\\s*Concept:|Concept:|अवधारणा:)\\s*([\\s\\S]*?)(?=\\s*🔎|\\s*🎯|\\s*⚠|\\s*🧠|\\s*📊|\\s*Explanation:|\\s*Exam Tip:|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);"
);

fs.writeFileSync(file, code);

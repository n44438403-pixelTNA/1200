const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /const conceptMatch = part\.match\(\/\(\?:💡\\s\*Concept:\|Concept:\|अवधारणा:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🔎\|🎯\|⚠\|🧠\|📊\|Explanation:\|Exam Tip:\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const conceptMatch = part.match(/(?:💡\\\\s*Concept:|Concept:|अवधारणा:)\\\\s*([\\\\s\\\\S]*?)(?=🔎|🎯|⚠|🧠|📊|Explanation:|Exam Tip:|Mistake:|Trick:|Difficulty|$)/i);"
);

fs.writeFileSync(file, code);

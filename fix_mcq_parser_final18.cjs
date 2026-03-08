const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex2 = /const conceptMatch = part.match\(\/\(\?:💡\\s\*Concept:\|Concept:\|अवधारणा:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🔎\|🎯\|⚠\|🧠\|📊\|Explanation:\|Exam Tip:\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g;
console.log(code.match(regex2));

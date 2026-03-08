const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /const diffMatch = part.match\(\/\(\?:📊\\s\*Difficulty Level:\|Difficulty Level:\|Difficulty:\|कठिनाई:\)\\s\*\(\🟢 Easy\|\🟡 Medium\|\🔴 Hard\|Easy\|Medium\|Hard\|आसान\|मध्यम\|कठिन\)\/i\);/;

code = code.replace(
    /const diffMatch = part\.match\(\/\(\?:📊\\s\*Difficulty Level:\|Difficulty Level:\|Difficulty:\|कठिनाई:\)\\s\*\(\🟢 Easy\|\🟡 Medium\|\🔴 Hard\|Easy\|Medium\|Hard\|आसान\|मध्यम\|कठिन\)\/i\);/g,
    "const diffMatch = part.match(/(?:📊\\s*Difficulty Level:|Difficulty Level:|Difficulty:|कठिनाई:)\\s*(🟢 Easy|🟡 Medium|🔴 Hard|Easy|Medium|Hard|आसान|मध्यम|कठिन)/i);"
);

// We should replace both occurances. There are two instances in the file as per the memory! "Both parsing blocks must be kept in sync when updating parser logic."
code = code.replace(
    /const conceptMatch = part\.match\(\/\(\?:💡\\s\*Concept:\|Concept:\|अवधारणा:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🔎\|🎯\|⚠\|🧠\|📊\|Explanation:\|Exam Tip:\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const conceptMatch = part.match(/(?:💡\\s*Concept:|Concept:|अवधारणा:)\\s*([\\s\\S]*?)(?=\\s*🔎|\\s*🎯|\\s*⚠|\\s*🧠|\\s*📊|\\s*Explanation:|\\s*Exam Tip:|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);"
);

code = code.replace(
    /const expMatch = part\.match\(\/\(\?:🔎\\s\*Explanation:\|Explanation:\|व्याख्या:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🎯\|⚠\|🧠\|📊\|Exam Tip:\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const expMatch = part.match(/(?:🔎\\s*Explanation:|Explanation:|व्याख्या:)\\s*([\\s\\S]*?)(?=\\s*🎯|\\s*⚠|\\s*🧠|\\s*📊|\\s*Exam Tip:|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);"
);

code = code.replace(
    /const tipMatch = part\.match\(\/\(\?:🎯\\s\*Exam Tip:\|Exam Tip:\|परीक्षा टिप:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=⚠\|🧠\|📊\|Mistake:\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const tipMatch = part.match(/(?:🎯\\s*Exam Tip:|Exam Tip:|परीक्षा टिप:)\\s*([\\s\\S]*?)(?=\\s*⚠|\\s*🧠|\\s*📊|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);"
);

code = code.replace(
    /const mistakeMatch = part\.match\(\/\(\?:⚠\\s\*Common Mistake:\|Common Mistake:\|सामान्य गलती:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=🧠\|📊\|Trick:\|Difficulty\|\$\)\/i\);/g,
    "const mistakeMatch = part.match(/(?:⚠\\s*Common Mistake:|Common Mistake:|सामान्य गलती:)\\s*([\\s\\S]*?)(?=\\s*🧠|\\s*📊|\\s*Trick:|\\s*Difficulty|$)/i);"
);

code = code.replace(
    /const memoryMatch = part\.match\(\/\(\?:🧠\\s\*Memory Trick:\|Memory Trick:\|Trick:\|याद रखने का तरीका:\)\\s\*\\(\[\\s\\S\]\*\?\\)\(\?=📊\|Difficulty\|\$\)\/i\);/g,
    "const memoryMatch = part.match(/(?:🧠\\s*Memory Trick:|Memory Trick:|Trick:|याद रखने का तरीका:)\\s*([\\s\\S]*?)(?=\\s*📊|\\s*Difficulty|$)/i);"
);

fs.writeFileSync(file, code);

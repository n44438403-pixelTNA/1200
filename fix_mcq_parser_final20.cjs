const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');


const replaceMap = {
    "const conceptMatch = part.match(/(?:💡\\s*Concept:|Concept:|अवधारणा:)\\s*([\\s\\S]*?)(?=🔎|🎯|⚠|🧠|📊|Explanation:|Exam Tip:|Mistake:|Trick:|Difficulty|$)/i);": "const conceptMatch = part.match(/(?:💡\\s*Concept:|Concept:|अवधारणा:)\\s*([\\s\\S]*?)(?=\\s*🔎|\\s*🎯|\\s*⚠|\\s*🧠|\\s*📊|\\s*Explanation:|\\s*Exam Tip:|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);",
    "const expMatch = part.match(/(?:🔎\\s*Explanation:|Explanation:|व्याख्या:)\\s*([\\s\\S]*?)(?=🎯|⚠|🧠|📊|Exam Tip:|Mistake:|Trick:|Difficulty|$)/i);": "const expMatch = part.match(/(?:🔎\\s*Explanation:|Explanation:|व्याख्या:)\\s*([\\s\\S]*?)(?=\\s*🎯|\\s*⚠|\\s*🧠|\\s*📊|\\s*Exam Tip:|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);",
    "const tipMatch = part.match(/(?:🎯\\s*Exam Tip:|Exam Tip:|परीक्षा टिप:)\\s*([\\s\\S]*?)(?=⚠|🧠|📊|Mistake:|Trick:|Difficulty|$)/i);": "const tipMatch = part.match(/(?:🎯\\s*Exam Tip:|Exam Tip:|परीक्षा टिप:)\\s*([\\s\\S]*?)(?=\\s*⚠|\\s*🧠|\\s*📊|\\s*Mistake:|\\s*Trick:|\\s*Difficulty|$)/i);",
    "const mistakeMatch = part.match(/(?:⚠\\s*Common Mistake:|Common Mistake:|सामान्य गलती:)\\s*([\\s\\S]*?)(?=🧠|📊|Trick:|Difficulty|$)/i);": "const mistakeMatch = part.match(/(?:⚠\\s*Common Mistake:|Common Mistake:|सामान्य गलती:)\\s*([\\s\\S]*?)(?=\\s*🧠|\\s*📊|\\s*Trick:|\\s*Difficulty|$)/i);",
    "const memoryMatch = part.match(/(?:🧠\\s*Memory Trick:|Memory Trick:|Trick:|याद रखने का तरीका:)\\s*([\\s\\S]*?)(?=📊|Difficulty|$)/i);": "const memoryMatch = part.match(/(?:🧠\\s*Memory Trick:|Memory Trick:|Trick:|याद रखने का तरीका:)\\s*([\\s\\S]*?)(?=\\s*📊|\\s*Difficulty|$)/i);"
}

for (const [key, value] of Object.entries(replaceMap)) {
    code = code.replace(key, value);
    code = code.replace(key, value); // Apply twice if needed
}

fs.writeFileSync(file, code);

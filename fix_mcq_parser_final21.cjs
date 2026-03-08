const fs = require('fs');
const file = 'components/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// The new MCQ format has lines like:
// ❓ Question: भारत पूर्णतः उत्तर-पूर्वी गोलार्द्ध में स्थित है...
// OR
// ❓ प्रश्न: भारत पूर्णतः उत्तर-पूर्वी गोलार्द्ध में स्थित है...
// OR just questions starting without numbers, we want to ensure any numbering is stripped if it exists but the user asked not to generate it.
// The user asks "ap ab aysa nktes ko support karega aur. Mcq" and provides a new format.
// Format is:
// 📘 Question 1
// 🔥 PYQ Inspired: UPSC/State PSC (Geography Foundation)
// 📖 Topic: भारत की भौगोलिक अवस्थिति
// ❓ Question: ...
// Options:
// A) ...
// B) ...
// C) ...
// D) ...
// ✅ Correct Answer:
// B) ...
// 💡 Concept:
// ...
// 🔎 Explanation:
// ...
// 🎯 Exam Tip: ...
// ⚠ Common Mistake: ...
// 🧠 Memory Trick: ...
// 📊 Difficulty Level: 🟡 Medium

code = code.replace(
    /const optA = optText.match\(\/\(\?:A\\\)\|A\\\.\\\|1\\\)\)\\s\*\(\.\*\?\)\(\?=\\n\\s\*\(\?:B\\\)\|B\\\.\\\|2\\\)\)\|\$\)\/i\)\?\.\[1\]\?\.trim\(\) \|\| 'Option A';/,
    "const optA = optText.match(/(?:A\\)|A\\.|1\\))\\s*(.*?)(?=\\n\\s*(?:B\\)|B\\.|2\\))|$)/i)?.[1]?.trim() || 'Option A';"
);

// We need to verify if the regexes for `expMatch`, `conceptMatch`, `tipMatch`, `mistakeMatch`, `memoryMatch`, `diffMatch` cover the optional newline after the colon that may be in the new format.
// e.g. "✅ Correct Answer:\nB) कर्क रेखा (23°30' N)"
code = code.replace(
    /const ansMatch = part\.match\(\/\(\?:✅\\s\*Correct Answer:\|सही उत्तर:\|Answer:\|Ans:\)\\s\*\(\[A-D1-4\]\)\/i\);/,
    "const ansMatch = part.match(/(?:✅\\s*Correct Answer:|सही उत्तर:|Answer:|Ans:)\\s*\\n?\\s*([A-D1-4])/i);"
);

// Modify options block to handle "Options:\nA) ...\nB) ..."
code = code.replace(
    /const optMatch = part\.match\(\/\(\?:Options:\|विकल्प:\)\[\\s\\S\]\*\?\(\?:✅\\s\*Correct Answer:\|सही उत्तर:\|Answer:\|Ans:\)\/i\);/,
    "const optMatch = part.match(/(?:Options:|विकल्प:)\\s*\\n?[\\s\\S]*?(?:✅\\s*Correct Answer:|सही उत्तर:|Answer:|Ans:)/i);"
);


fs.writeFileSync(file, code);

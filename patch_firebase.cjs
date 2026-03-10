const fs = require('fs');
let content = fs.readFileSync('firebase.ts', 'utf8');

// Use { merge: true } for setDoc on user_data and users collections
content = content.replace(
    /promises\.push\(setDoc\(doc\(db, "users", user\.id\), coreProfile\)\.catch\(e => console\.error\("Firestore Core Save Error:", e\)\)\);/,
    'promises.push(setDoc(doc(db, "users", user.id), coreProfile, { merge: true }).catch(e => console.error("Firestore Core Save Error:", e)));'
);

content = content.replace(
    /promises\.push\(setDoc\(doc\(db, "user_data", user\.id\), bulkyData\)\.catch\(e => console\.error\("Firestore Bulky Data Save Error:", e\)\)\);/,
    'promises.push(setDoc(doc(db, "user_data", user.id), bulkyData, { merge: true }).catch(e => console.error("Firestore Bulky Data Save Error:", e)));'
);

fs.writeFileSync('firebase.ts', content);
console.log('firebase.ts patched');

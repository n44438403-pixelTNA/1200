const fs = require('fs');
let content = fs.readFileSync('components/admin/NstaFeatureManager.tsx', 'utf8');

const startIdx = content.indexOf('{/* --- REVISION LOGIC CONFIGURATION --- */}');
const endIdx = content.indexOf('{/* Category Filter - Horizontal Scroll */}');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
    fs.writeFileSync('components/admin/NstaFeatureManager.tsx', content);
    console.log('Successfully removed revision logic from NstaFeatureManager');
} else {
    console.log('Indices not found');
}

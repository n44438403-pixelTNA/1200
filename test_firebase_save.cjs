const fs = require('fs');
const content = fs.readFileSync('firebase.ts', 'utf8');

const match = content.match(/export const saveUserToLive = async \([^)]*\) => \{[\s\S]*?\}\n\};\n/);
if (match) {
    console.log(match[0]);
} else {
    console.log("Could not find saveUserToLive function");
}

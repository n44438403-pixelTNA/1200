const fs = require('fs');
const file = 'index.css';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove max-width wrapper constraint
code = code.replace(/max-width: 1080px; \/\* Enhanced Mobile\/Tablet maximum width for better readability \*\//g, 'max-width: 100%;');

// 2. Change wrapper padding/margin to be edge to edge on mobile
// In index.css
code = code.replace(/body \{\n  background-color: #0f1a3a; \/\* Dark premium background to act as 'letterboxing' on desktop \*\//g, 'body {\n  background-color: #0f1a3a;');
code = code.replace(/#root \{\n  width: 100%;/g, '#root {\n  width: 100%;');

code = code.replace(/max-width: 720px;/g, 'max-width: 100%;');

// Add specific styles per instructions
code += `\n
.card {
  width: calc(100% - 20px) !important;
  margin: 10px auto !important;
  padding: 20px !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
  background: #ffffff !important;
  margin-bottom: 20px !important;
}

body {
    margin: 0;
    padding: 0;
}

.main-container {
    margin-top: 0px;
    padding-top: 10px;
}
`;

// Replace `topic-card` styles to match
code = code.replace(/\.topic-card \{[\s\S]*?\}/g, `.topic-card {
  width: calc(100% - 20px) !important;
  margin: 10px auto !important;
  padding: 20px !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
  background: #ffffff !important;
  margin-bottom: 20px !important;
}`);

// Dark mode background override
code = code.replace(/\.dark-mode \.bg-white \{\n    background-color: #000000 !important;\n    border-color: #333333 !important;\n\}/g, `.dark-mode .bg-white {
    background-color: #000000 !important;
    border-color: #333333 !important;
}`);


fs.writeFileSync(file, code);

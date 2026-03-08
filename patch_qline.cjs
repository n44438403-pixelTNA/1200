const fs = require('fs');
let code = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');

const regexToReplace = /\/\/\s*If we matched the 📘 header, the actual question text is usually a few lines down marked with ❓\s*if \(\/📘\/\.test\(line\)\) \{\s*for \(let j = 1; j <= 4; j\+\+\) \{\s*if \(i \+ j < lines\.length && \/❓\/\.test\(lines\[i\+j\]\)\) \{\s*qLine = lines\[i\+j\];\s*qOffset = j;\s*break;\s*\}\s*\}\s*\}/g;

const newLogic = `// If we matched the 📘 header or "Question [Number]", the actual question text is usually a few lines down marked with ❓ or 'Question:'
                              if (/📘/.test(line) || /^Question\\s+\\d+/i.test(line)) {
                                  for (let j = 1; j <= 5; j++) {
                                      if (i + j < lines.length && /^(?:❓\\s*\\*?\\*?Question|Question:)/i.test(lines[i+j])) {
                                          qLine = lines[i+j];
                                          qOffset = j;
                                          break;
                                      }
                                  }

                                  // If the line containing 'Question:' is just the header and the actual question starts on the NEXT line
                                  if (/^(?:❓\\s*\\*?\\*?Question:\\*?\\*?\\s*|Question:\\s*)$/i.test(qLine.trim()) && i + qOffset + 1 < lines.length) {
                                      qOffset++;
                                      qLine = lines[i + qOffset];
                                  }
                              }`;

code = code.replace(regexToReplace, newLogic);
fs.writeFileSync('components/AdminDashboard.tsx', code);

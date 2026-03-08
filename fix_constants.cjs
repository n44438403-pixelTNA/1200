const fs = require('fs');
const file = 'constants.ts';
let code = fs.readFileSync(file, 'utf8');

// The new Social Science syllabus replacements.
// Modify getSubjectsList logic for Class 9/10 to remove sst and add history, geography, polity, economics
code = code.replace(
    /if \(board === 'BSEB' && \(classLevel === '9' \|\| classLevel === '10'\)\) \{[\s\S]*?\} else \{/,
`if (board === 'BSEB' && (classLevel === '9' || classLevel === '10')) {
          selectedSubjects = [
              pool.math,
              pool.science,
              pool.history,
              pool.geography,
              pool.polity,
              pool.economics,
              pool.english,
              pool.hindi,
              pool.sanskrit,
              pool.computer
          ].filter(Boolean);
      } else {`
);

fs.writeFileSync(file, code);

const fs = require('fs');

let content = fs.readFileSync('types.ts', 'utf8');

content = content.replace(
`export interface DeepDiveEntry {
  id: string;
  title?: string; // NEW: Topic Name
  htmlContent: string;
  pdfLink: string;
}`,
`export interface DeepDiveEntry {
  id: string;
  title?: string; // NEW: Topic Name
  htmlContent: string;
  pdfLink: string;
}

export interface QuickNoteEntry {
  id: string;
  title: string;
  content: string; // Multiline text, each line is a bullet point
}`);

content = content.replace(
`  // MODE SPECIFIC UNLIMITED ENTRIES
  schoolDeepDiveEntries?: DeepDiveEntry[];
  competitionDeepDiveEntries?: DeepDiveEntry[];
  schoolAdditionalNotes?: AdditionalNoteEntry[];
  competitionAdditionalNotes?: AdditionalNoteEntry[];`,
`  // MODE SPECIFIC UNLIMITED ENTRIES
  schoolDeepDiveEntries?: DeepDiveEntry[];
  competitionDeepDiveEntries?: DeepDiveEntry[];
  schoolAdditionalNotes?: AdditionalNoteEntry[];
  competitionAdditionalNotes?: AdditionalNoteEntry[];

  quickNoteEntries?: QuickNoteEntry[];
  schoolQuickNoteEntries?: QuickNoteEntry[];
  competitionQuickNoteEntries?: QuickNoteEntry[];`);

fs.writeFileSync('types.ts', content, 'utf8');
console.log('types.ts patched');

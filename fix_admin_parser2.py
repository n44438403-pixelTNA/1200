import re

with open('components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix python raw string issues by using raw strings 'r"""'
replacement = r"""            // 1.5 EXTRACT IMPLICIT HTML BLOCKS AND PLAIN TEXT NOTES
            let textForMcq = rawText.replace(noteRegex, "");

            // Parse plain text notes that exist between questions.
            // A question usually ends with "Difficulty Level: ...". Text after that but before the next "Question" or "PYQ" is a note.
            const noteBetweenQsRegex = /(?:📊\s*Difficulty Level:[^\n]*\n|🧠\s*Memory Trick:[^\n]*\n)([\s\S]*?)(?=\n\s*(?:Question\s*\d+|🔥\s*PYQ|❓\s*Question)|\Z)/gi;

            let plainNoteMatch;
            while ((plainNoteMatch = noteBetweenQsRegex.exec(textForMcq)) !== null) {
                const rawNote = plainNoteMatch[1].trim();

                // If it's substantial text and doesn't look like stray question parts
                if (rawNote.length > 30 && !rawNote.match(/^(?:A\)|B\)|C\)|D\)|✅|💡)/i)) {
                    let title = rawNote.split('\n')[0].trim();
                    if (title.length > 50) title = "Topic Note";

                    let htmlContent = `<h3>${title}</h3><p>` + rawNote.substring(title.length).trim().replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>') + `</p>`;

                    newTopicNotes.push({
                        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        title: title,
                        topic: title,
                        content: htmlContent,
                        isPremium: false
                    });

                    // Remove from MCQ parsing
                    textForMcq = textForMcq.replace(rawNote, "");
                }
            }

            // Also keep the existing HTML block extractor
            // Matches any standalone HTML blocks starting with <h...>
"""

old_block = r"""            // 1.5 EXTRACT IMPLICIT HTML BLOCKS
            let textForMcq = rawText.replace(noteRegex, "");

            // Matches any standalone HTML blocks starting with <h...>"""

content = content.replace(old_block, replacement)

with open('components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

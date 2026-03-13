import re

with open('components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# We need to enhance `handleUnifiedImport` to parse raw text notes that aren't wrapped in `<NOTE>` or `<h1>` tags.
# Look at the user's example:
# रासायनिक अभिक्रियाएँ एवं उनके समीकरण
# Definition: जब एक या...
# Key Concepts: ...

# We will modify "1.5 EXTRACT IMPLICIT HTML BLOCKS" to also match blocks that don't have HTML but don't look like questions.
# A block is NOT a question if it doesn't start with ❓, Question, Option, etc.
# We can extract anything between `Question X` blocks that isn't part of a question.

# Actually, the user's notes are interleaved between questions.
# A question block starts with `Question \d` or `🔥 PYQ` or `📖 Topic` and ends when the next one starts OR when a note block starts.
# A note block in the user's format doesn't have a clear starting tag, but it usually comes after a question block ends (after Difficulty Level) and before the next question starts.

# To be perfectly safe without breaking the regex engine, let's add a specific parsing rule for plain text notes:
# Any text that sits between `📊 Difficulty Level: ...` (or the end of a question) and the next `Question \d` or `🔥 PYQ`.

replacement = """            // 1.5 EXTRACT IMPLICIT HTML BLOCKS AND PLAIN TEXT NOTES
            let textForMcq = rawText.replace(noteRegex, "");

            // Strategy: Split the whole text by 'Question X' or '🔥 PYQ'
            const segments = textForMcq.split(/(?:Question\s*\d+|🔥\s*PYQ\s*Inspired:.*?)(?=\\n|$)/i);

            // Loop through segments. A segment will contain the rest of the question AND potentially some trailing notes.
            segments.forEach((seg, idx) => {
                // The note part usually comes AFTER the last standard MCQ field (like Difficulty Level or Memory Trick)
                const noteSplit = seg.split(/(?:📊\\s*Difficulty Level:.*?\\n|🧠\\s*Memory Trick:.*?\\n)/i);

                // If there's text after the MCQ fields, it's likely a standalone note!
                if (noteSplit.length > 1) {
                    const rawNote = noteSplit[noteSplit.length - 1].trim();

                    // Filter out empty or pure whitespace or just a few characters
                    if (rawNote.length > 30 && !rawNote.match(/^(?:A\\)|B\\)|C\\)|D\\)|✅|💡)/i)) {
                        // We found a trailing note block!
                        // Format it as HTML
                        let title = rawNote.split('\\n')[0].trim();
                        if (title.length > 50) title = "Topic Note"; // Fallback if first line is too long

                        let htmlContent = `<h3>${title}</h3><p>` + rawNote.substring(title.length).trim().replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>') + `</p>`;

                        newTopicNotes.push({
                            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            title: title,
                            topic: title,
                            content: htmlContent,
                            isPremium: false
                        });

                        // Remove this note from the textForMcq so it doesn't confuse the MCQ parser
                        textForMcq = textForMcq.replace(rawNote, "");
                    }
                }
            });

            // Also keep the existing HTML block extractor
"""

# Let's use string replace safely
old_html_extractor = """            // 1.5 EXTRACT IMPLICIT HTML BLOCKS
            let textForMcq = rawText.replace(noteRegex, "");"""

content = content.replace(old_html_extractor, replacement)

with open('components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

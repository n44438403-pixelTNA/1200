import re

with open('components/BoostScoreHub.tsx', 'r') as f:
    content = f.read()

# Fix the bug where BoostScoreHub requires `session.topic` (which doesn't exist on MCQResult, it has `chapterTitle` or `topicAnalysis`)
# Also it checks `session.mode !== 'NORMAL'` which might exclude things unnecessarily.

old_logic = "        if (!session.topic || session.mode !== 'NORMAL') return; // Only count initial practices, not revisions\n        const date = session.date ? new Date(session.date).getTime() : 0;\n        if (!topicMap[session.topic]) {"
new_logic = "        const topic = session.chapterTitle || 'Unknown Topic';\n        const date = session.date ? new Date(session.date).getTime() : 0;\n        if (!topicMap[topic]) {"

content = content.replace(old_logic, new_logic)

# Fix references to session.topic
content = content.replace("topicMap[session.topic].scores.push(session.score);", "topicMap[topic].scores.push(session.score);")
content = content.replace("topicMap[session.topic].dates.push(date);", "topicMap[topic].dates.push(date);")
content = content.replace("topicMap[session.topic].totalQuestions += session.totalQuestions || 0;", "topicMap[topic].totalQuestions += session.totalQuestions || 0;")
content = content.replace("topicMap[session.topic].mistakes += ((session.totalQuestions || 10) - correct);", "topicMap[topic].mistakes += ((session.totalQuestions || 10) - correct);")
content = content.replace("if (date > topicMap[session.topic].lastDate) {", "if (date > topicMap[topic].lastDate) {")
content = content.replace("topicMap[session.topic].lastDate = date;", "topicMap[topic].lastDate = date;")

with open('components/BoostScoreHub.tsx', 'w') as f:
    f.write(content)

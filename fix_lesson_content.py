import re

with open('components/LessonView.tsx', 'r') as f:
    content = f.read()

# I need to ensure `contentData` is actually the prop name. Let's check `LessonView` signature.
content = content.replace("data: { chapter, content: contentData, subject }", "data: { chapter, content, subject }")

with open('components/LessonView.tsx', 'w') as f:
    f.write(content)

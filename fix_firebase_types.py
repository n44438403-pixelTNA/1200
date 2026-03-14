import re

file_path = "firebase.ts"
with open(file_path, "r") as f:
    content = f.read()

# Make sure TeacherCode is imported in firebase.ts if it wasn't
if "import { TeacherCode }" in content:
    content = content.replace("import { TeacherCode } from './types';", "")

if "TeacherCode" not in content[:1000]:
    content = content.replace("import { User, ActivityLogEntry, InboxMessage, LessonContent } from './types';", "import { User, ActivityLogEntry, InboxMessage, LessonContent, TeacherCode } from './types';")

with open(file_path, "w") as f:
    f.write(content)

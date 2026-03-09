import re

with open('components/RevisionHub.tsx', 'r') as f:
    content = f.read()

# Fix strict typescript type checking where `user.mcqHistory` might not match expected
content = content.replace("const rawList = (user.mcqHistory || [])", "const rawList: any[] = (user.mcqHistory || [])")

with open('components/RevisionHub.tsx', 'w') as f:
    f.write(content)
print("Updated RevisionHub")

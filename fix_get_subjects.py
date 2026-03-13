import re

file_path = "constants.ts"
with open(file_path, "r") as f:
    content = f.read()

replacements = {
    '''  else if (['6', '7', '8'].includes(classLevel)) {
      selectedSubjects = [
          pool.math,
          pool.science,
          pool.history,
          pool.geography,
          pool.polity,
          pool.english,
          pool.hindi,
          pool.sanskrit,
          pool.computer
      ].filter(Boolean);
  }''': '''  else if (['6', '7', '8'].includes(classLevel)) {
      selectedSubjects = [
          pool.math,
          pool.physics,
          pool.chemistry,
          pool.biology,
          pool.history,
          pool.geography,
          pool.polity,
          pool.english,
          pool.hindi,
          pool.sanskrit,
          pool.computer
      ].filter(Boolean);
  }'''
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced getSubjectsList")
    else:
        print("Could not find getSubjectsList")

with open(file_path, "w") as f:
    f.write(content)

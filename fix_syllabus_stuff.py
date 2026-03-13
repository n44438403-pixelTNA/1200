import re

with open('constants.ts', 'r') as f:
    content = f.read()

new_logic = """if (classLevel === 'COMPETITION') {
      selectedSubjects = [
          pool.history,
          pool.polity,
          pool.geography,
          pool.economics,
          pool.physics,
          pool.chemistry,
          pool.biology,
          pool.math
      ].filter(Boolean);
  }
  else if (['6', '7', '8'].includes(classLevel)) {
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
  }
  else if (['9', '10'].includes(classLevel)) {
      selectedSubjects = [
          pool.math,
          pool.physics,
          pool.chemistry,
          pool.biology,
          pool.history,
          pool.geography,
          pool.polity,
          pool.economics,
          pool.english,
          pool.hindi,
          pool.sanskrit,
          pool.computer
      ].filter(Boolean);
  }
  else {
      if (stream === 'Science')"""

old_logic_regex = r"if\s*\(classLevel\s*===\s*'COMPETITION'\)\s*\{[\s\S]*?else\s*\{\s*if\s*\(stream\s*===\s*'Science'\)"
content = re.sub(old_logic_regex, new_logic, content)

with open('constants.ts', 'w') as f:
    f.write(content)

with open('utils/full_syllabus_data.ts', 'r') as f:
    content = f.read()

injection = """  "BSEB-6-History": [],
  "BSEB-6-Geography": [],
  "BSEB-6-Political Science": [],
  "BSEB-7-History": [],
  "BSEB-7-Geography": [],
  "BSEB-7-Political Science": [],
  "BSEB-8-History": [],
  "BSEB-8-Geography": [],
  "BSEB-8-Political Science": [],
  "BSEB-9-Physics": [],
  "BSEB-9-Chemistry": [],
  "BSEB-9-Biology": [],
  "BSEB-9-History": [],
  "BSEB-9-Geography": [],
  "BSEB-9-Political Science": [],
  "BSEB-9-Economics": [],
  "BSEB-10-Physics": [],
  "BSEB-10-Chemistry": [],
  "BSEB-10-Biology": [],
  "BSEB-10-History": [],
  "BSEB-10-Geography": [],
  "BSEB-10-Political Science": [],
  "BSEB-10-Economics": []
"""
content = content.replace('  "NCERT-10-Economics": [],\n};\n', '  "NCERT-10-Economics": [],\n' + injection + '};\n')

with open('utils/full_syllabus_data.ts', 'w') as f:
    f.write(content)

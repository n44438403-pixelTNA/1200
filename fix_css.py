import re

with open('index.css', 'r') as f:
    css = f.read()

# Fix the dangling `.definition, .example, .exam, .mistake,` block
css = re.sub(
    r'\.definition,\s*\.example,\s*\.exam,\s*\.mistake,[\s\n]*\.card\s*{',
    '.card {',
    css
)

with open('index.css', 'w') as f:
    f.write(css)

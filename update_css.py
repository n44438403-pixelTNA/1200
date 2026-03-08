import re

with open('index.css', 'r') as f:
    css = f.read()

# Replace body styles
css = re.sub(
    r'body\s*{[^}]+background-color:\s*#0f1a3a;[^}]+}',
    r'''body {
  background-color: #f5f7fb;
  font-family: system-ui, -apple-system, sans-serif !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}''', css)

css = re.sub(
    r'body\s*{\s*margin:\s*0;\s*padding:\s*0;\s*}',
    '', css
)

# Replace topic-card styles completely to match the user's request exactly
# First, remove old topic-card styles
css = re.sub(r'\.topic-card\s*{[^}]+}', '', css)
css = re.sub(r'\.topic-card\s*h2\s*{[^}]+}', '', css)
css = re.sub(r'\.topic-card\s*div\s*{[^}]+}', '', css)
css = re.sub(r'\.visual-facts\s*ul,\s*\.recap\s*ul\s*{[^}]+}', '', css)
css = re.sub(r'\.exam\s*{[^}]+}', '', css)
css = re.sub(r'\.mistake\s*{[^}]+}', '', css)
css = re.sub(r'\.memory\s*{[^}]+}', '', css)
css = re.sub(r'\.definition,\s*\.example,\s*\.exam,\s*\.mistake,\s*\.memory\s*{[^}]+}', '', css)
css = re.sub(r'\.definition\s*{[^}]+}', '', css)
css = re.sub(r'\.example\s*{[^}]+}', '', css)
css = re.sub(r'\.quick-revision\s*{[^}]+}', '', css)


new_styles = """
.topic-card{
background:#ffffff;
padding:22px;
border-radius:14px;
box-shadow:0 4px 14px rgba(0,0,0,0.08);
margin-bottom:30px;
}

.topic-card h2{
margin-top:0;
margin-bottom:15px;
}

.topic-card div{
margin-top:12px;
line-height:1.6;
}

.visual-facts ul,
.recap ul{
padding-left:20px;
}

.exam{
background:#eaf5ff;
padding:10px;
border-radius:8px;
}

.mistake{
background:#ffecec;
padding:10px;
border-radius:8px;
}

.memory{
background:#f1fff2;
padding:10px;
border-radius:8px;
}
"""

css += new_styles

# write back
with open('index.css', 'w') as f:
    f.write(css)

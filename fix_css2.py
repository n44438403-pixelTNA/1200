import re

with open('index.css', 'r') as f:
    css = f.read()

# Make sure .definition, .example etc classes are also added back for fallback/safety
# but they might be handled inline in html template.
# Let's add them back nicely for general safety
missing_classes = """
.definition, .example, .exam, .mistake, .memory {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.definition {
  background: #e0f2fe;
  border-left: 4px solid #3b82f6;
}

.example {
  background: #dcfce7;
  border-left: 4px solid #22c55e;
}

.quick-revision {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  font-weight: 500;
}
"""

with open('index.css', 'a') as f:
    f.write(missing_classes)

import re

file_path = "types.ts"
with open(file_path, "r") as f:
    content = f.read()

replacements = {
    "export type Role = 'STUDENT' | 'ADMIN' | 'SUB_ADMIN';": "export type Role = 'STUDENT' | 'ADMIN' | 'SUB_ADMIN' | 'TEACHER';",
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced Role type")
    else:
        print("Could not find Role type")

# Add TeacherCode interface
teacher_code_interface = """
export interface TeacherCode {
  id: string; // Document ID
  code: string; // The actual code e.g. TCH-XXXXX
  price: number;
  active: boolean;
  createdAt: number; // Timestamp
  maxUses: number;
  currentUses: number;
}
"""

if "export interface TeacherCode" not in content:
    content += "\n" + teacher_code_interface
    print("Added TeacherCode interface")

with open(file_path, "w") as f:
    f.write(content)

import re

file_path = "utils/full_syllabus_data.ts"
with open(file_path, "r") as f:
    content = f.read()

replacements = {
    '"BSEB-9-Science": [\n    "हमारे आस-पास के पदार्थ",\n    "क्या हमारे आस-पास के पदार्थ शुद्ध हैं",\n    "परमाणु एवं अणु",\n    "परमाणु की संरचना",\n    "जीवन की मौलिक इकाई",\n    "ऊतक",\n    "जीवों में विविधता",\n    "गति",\n    "बल तथा गति के नियम",\n    "गुरुत्वाकर्षण",\n    "कार्य तथा ऊर्जा",\n    "ध्वनि",\n    "हम बीमार क्यों होते हैं",\n    "प्राकृतिक संपदा",\n    "खाद्य संसाधनों में सुधार"\n  ],': '''  "BSEB-9-Chemistry": [
    "हमारे आस-पास के पदार्थ",
    "क्या हमारे आस-पास के पदार्थ शुद्ध हैं",
    "परमाणु एवं अणु",
    "परमाणु की संरचना"
  ],
  "BSEB-9-Biology": [
    "जीवन की मौलिक इकाई",
    "ऊतक",
    "जीवों में विविधता",
    "हम बीमार क्यों होते हैं",
    "प्राकृतिक संपदा",
    "खाद्य संसाधनों में सुधार"
  ],
  "BSEB-9-Physics": [
    "गति",
    "बल तथा गति के नियम",
    "गुरुत्वाकर्षण",
    "कार्य तथा ऊर्जा",
    "ध्वनि"
  ],''',
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced 9")
    else:
        print("Could not find 9")

with open(file_path, "w") as f:
    f.write(content)

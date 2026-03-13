import re

file_path = "utils/full_syllabus_data.ts"
with open(file_path, "r") as f:
    content = f.read()

replacements = {
    '"BSEB-8-Social Science": [\n    "How, When and Where",\n    "From Trade to Territory",\n    "Ruling the Countryside",\n    "Tribals, Dikus and the Vision of a Golden Age",\n    "When People Rebel",\n    "Weavers, Iron Smelters and Factory Owners",\n    "Civilising the \'Native\', Educating the Nation",\n    "Women, Caste and Reform",\n    "The Making of the National Movement",\n    "India After Independence",\n    "Resources",\n    "Land, Soil, Water, Natural Vegetation and Wildlife",\n    "Mineral and Power Resources",\n    "Agriculture",\n    "Industries",\n    "Human Resources",\n    "The Indian Constitution",\n    "Understanding Secularism"\n  ],': '''  "BSEB-8-History": [
    "How, When and Where",
    "From Trade to Territory",
    "Ruling the Countryside",
    "Tribals, Dikus and the Vision of a Golden Age",
    "When People Rebel",
    "Weavers, Iron Smelters and Factory Owners",
    "Civilising the 'Native', Educating the Nation",
    "Women, Caste and Reform",
    "The Making of the National Movement",
    "India After Independence"
  ],
  "BSEB-8-Geography": [
    "Resources",
    "Land, Soil, Water, Natural Vegetation and Wildlife",
    "Mineral and Power Resources",
    "Agriculture",
    "Industries",
    "Human Resources"
  ],
  "BSEB-8-Political Science": [
    "The Indian Constitution",
    "Understanding Secularism",
    "Why Do We Need a Parliament?",
    "Understanding Laws",
    "Judiciary",
    "Understanding Our Criminal Justice System",
    "Understanding Marginalisation",
    "Confronting Marginalisation",
    "Public Facilities",
    "Law and Social Justice"
  ],''',
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced 8")
    else:
        print("Could not find 8")

with open(file_path, "w") as f:
    f.write(content)

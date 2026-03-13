import re

file_path = "utils/full_syllabus_data.ts"
with open(file_path, "r") as f:
    content = f.read()

# Define the new content for class 6, 7, 8 Social Science
replacements = {
    '"BSEB-6-Social Science": [\n    "What, Where, How and When?",\n    "From Hunting–Gathering to Growing Food",\n    "In the Earliest Cities",\n    "What Books and Burials Tell Us",\n    "Kingdoms, Kings and an Early Republic",\n    "New Questions and Ideas",\n    "Ashoka, The Emperor Who Gave Up War",\n    "Vital Villages, Thriving Towns",\n    "Traders, Kings and Pilgrims",\n    "New Empires and Kingdoms",\n    "Buildings, Paintings and Books",\n    "The Earth in the Solar System",\n    "Globe: Latitudes and Longitudes",\n    "Motions of the Earth",\n    "Maps",\n    "Major Domains of the Earth",\n    "Major Landforms of the Earth",\n    "Our Country – India",\n    "India: Climate, Vegetation and Wildlife"\n  ],': '''  "BSEB-6-History": [
    "What, Where, How and When?",
    "From Hunting–Gathering to Growing Food",
    "In the Earliest Cities",
    "What Books and Burials Tell Us",
    "Kingdoms, Kings and an Early Republic",
    "New Questions and Ideas",
    "Ashoka, The Emperor Who Gave Up War",
    "Vital Villages, Thriving Towns",
    "Traders, Kings and Pilgrims",
    "New Empires and Kingdoms",
    "Buildings, Paintings and Books"
  ],
  "BSEB-6-Geography": [
    "The Earth in the Solar System",
    "Globe: Latitudes and Longitudes",
    "Motions of the Earth",
    "Maps",
    "Major Domains of the Earth",
    "Major Landforms of the Earth",
    "Our Country – India",
    "India: Climate, Vegetation and Wildlife"
  ],
  "BSEB-6-Political Science": [
    "Understanding Diversity",
    "Diversity and Discrimination",
    "What is Government?",
    "Key Elements of a Democratic Government",
    "Panchayati Raj",
    "Rural Administration",
    "Urban Administration",
    "Rural Livelihoods",
    "Urban Livelihoods"
  ],''',
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced 6")
    else:
        print("Could not find 6")

with open(file_path, "w") as f:
    f.write(content)

import re

file_path = "utils/full_syllabus_data.ts"
with open(file_path, "r") as f:
    content = f.read()

replacements = {
    '"BSEB-7-Social Science": [\n    "Tracing Changes Through a Thousand Years",\n    "New Kings and Kingdoms",\n    "The Delhi Sultans",\n    "The Mughal Empire",\n    "Rulers and Buildings",\n    "Towns, Traders and Craftspersons",\n    "Tribes, Nomads and Settled Communities",\n    "Devotional Paths to the Divine",\n    "The Making of Regional Cultures",\n    "Eighteenth-Century Political Formations",\n    "Environment",\n    "Inside Our Earth",\n    "Our Changing Earth",\n    "Air",\n    "Water",\n    "Natural Vegetation and Wildlife"\n  ],': '''  "BSEB-7-History": [
    "Tracing Changes Through a Thousand Years",
    "New Kings and Kingdoms",
    "The Delhi Sultans",
    "The Mughal Empire",
    "Rulers and Buildings",
    "Towns, Traders and Craftspersons",
    "Tribes, Nomads and Settled Communities",
    "Devotional Paths to the Divine",
    "The Making of Regional Cultures",
    "Eighteenth-Century Political Formations"
  ],
  "BSEB-7-Geography": [
    "Environment",
    "Inside Our Earth",
    "Our Changing Earth",
    "Air",
    "Water",
    "Natural Vegetation and Wildlife",
    "Human Environment—Settlement, Transport and Communication",
    "Human Environment Interactions—The Tropical and the Subtropical Region",
    "Life in the Temperate Grasslands",
    "Life in the Deserts"
  ],
  "BSEB-7-Political Science": [
    "On Equality",
    "Role of the Government in Health",
    "How the State Government Works",
    "Growing up as Boys and Girls",
    "Women Change the World",
    "Understanding Media",
    "Markets Around Us",
    "A Shirt in the Market",
    "Struggles for Equality"
  ],''',
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print("Replaced 7")
    else:
        print("Could not find 7")

with open(file_path, "w") as f:
    f.write(content)

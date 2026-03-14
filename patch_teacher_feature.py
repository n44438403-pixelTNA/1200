import re

file_path = "utils/featureRegistry.ts"
with open(file_path, "r") as f:
    content = f.read()

new_feature = """
    {
        id: 'TEACHERS_MODE',
        group: 'CORE',
        label: 'Teachers Mode',
        description: 'Manage Teacher Access Codes and Leaderboard',
        defaultEnabled: true,
        adminVisible: true,
        adminTab: 'TEACHERS',
        color: 'purple',
        icon: 'Briefcase'
    },
"""

# Insert right after 'USER_MANAGEMENT' feature
if "id: 'USER_MANAGEMENT'," in content:
    idx = content.find("id: 'USER_MANAGEMENT',")
    end_of_block = content.find("},", idx) + 2
    content = content[:end_of_block] + new_feature + content[end_of_block:]
    print("Injected TEACHERS_MODE feature into registry")
else:
    print("Could not find USER_MANAGEMENT")

with open(file_path, "w") as f:
    f.write(content)

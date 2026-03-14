import re

file_path = "utils/featureRegistry.ts"
with open(file_path, "r") as f:
    content = f.read()

new_feature = """
    {
        id: 'ADMIN_TEACHERS',
        label: 'Teacher Mode',
        group: 'CORE',
        surfaceLevel: 3,
        adminVisible: true,
        adminTab: 'TEACHERS',
        requiredPermission: 'VIEW_USERS',
        icon: 'Briefcase',
        color: 'purple'
    },"""

if "adminTab: 'USERS'," in content:
    idx = content.find("adminTab: 'USERS',")
    end_of_block = content.find("},", idx) + 2
    content = content[:end_of_block] + new_feature + content[end_of_block:]
    print("Injected ADMIN_TEACHERS feature into registry")
else:
    print("Could not find USERS")

with open(file_path, "w") as f:
    f.write(content)

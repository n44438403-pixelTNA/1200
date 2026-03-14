import re

file_path = "types.ts"
with open(file_path, "r") as f:
    content = f.read()

if "maintenanceMode?: boolean;" in content:
    content = content.replace("maintenanceMode?: boolean;", "maintenanceMode?: boolean;\n  isLogoutEnabled?: boolean;")
    print("Added isLogoutEnabled to types.ts")

with open(file_path, "w") as f:
    f.write(content)

file_path = "constants.ts"
with open(file_path, "r") as f:
    content = f.read()

if "maintenanceMode: false," in content:
    content = content.replace("maintenanceMode: false,", "maintenanceMode: false,\n  isLogoutEnabled: true,")
    print("Added isLogoutEnabled to constants.ts")

with open(file_path, "w") as f:
    f.write(content)

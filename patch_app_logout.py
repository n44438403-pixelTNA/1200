import re

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_btn = '<button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-full"><LogOut size={20} /></button>'
new_btn = '{(state.settings.isLogoutEnabled !== false || state.user?.role === \'ADMIN\' || state.user?.role === \'SUB_ADMIN\') && <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-full"><LogOut size={20} /></button>}'

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    print("Patched logout button in header in App.tsx")

with open(file_path, "w") as f:
    f.write(content)

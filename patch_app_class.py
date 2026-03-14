import re

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_div = '<div className="min-h-screen flex flex-col bg-slate-50 font-sans relative pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,32px)]">'
new_div = '<div className={`min-h-screen flex flex-col bg-slate-50 font-sans relative pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,32px)] ${user?.role === \'TEACHER\' ? \'app-role-teacher\' : \'app-role-student\'}`}>'

if old_div in content:
    content = content.replace(old_div, new_div)
    print("Replaced div class")
else:
    print("Could not find div class")

with open(file_path, "w") as f:
    f.write(content)

import re

file_path = "components/StudentSidebar.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_btn = """                    <button
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                    >
                        <LogOut size={18} /> Logout
                    </button>"""

new_btn = """                    {(settings?.isLogoutEnabled !== false || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN') && (
                        <button
                            onClick={() => {
                                onLogout();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    )}"""

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    print("Patched logout button in StudentSidebar.tsx")

with open(file_path, "w") as f:
    f.write(content)

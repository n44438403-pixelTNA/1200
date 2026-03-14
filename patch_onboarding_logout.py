import re

file_path = "components/Onboarding.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add systemSettings prop
if "import { SystemSettings }" not in content:
    content = content.replace("interface Props {", "import { SystemSettings } from '../types';\n\ninterface Props {\n  settings?: SystemSettings;")

if "export const Onboarding: React.FC<Props> = ({ user, onComplete, onLogout }) => {" in content:
    content = content.replace("export const Onboarding: React.FC<Props> = ({ user, onComplete, onLogout }) => {", "export const Onboarding: React.FC<Props> = ({ user, onComplete, onLogout, settings }) => {")

# Conditionally render logout button
old_btn = """              <button onClick={onLogout} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full">
                  <LogOut size={16} />
              </button>"""

new_btn = """              {(settings?.isLogoutEnabled !== false || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN') && (
                  <button onClick={onLogout} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-full">
                      <LogOut size={16} />
                  </button>
              )}"""

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    print("Patched logout button in Onboarding.tsx")

with open(file_path, "w") as f:
    f.write(content)

import re

file_path = "components/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

security_tab_content = """                  {/* SECURITY */}
                  {activeTab === 'CONFIG_SECURITY' && (
                      <>
                          <div><label className="text-xs font-bold uppercase text-slate-500">Admin Email</label><input type="text" value={localSettings.adminEmail || ''} onChange={e => setLocalSettings({...localSettings, adminEmail: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
                          <div><label className="text-xs font-bold uppercase text-slate-500">Admin Login Code</label><input type="text" value={localSettings.adminCode || ''} onChange={e => setLocalSettings({...localSettings, adminCode: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
                          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                              <div><p className="font-bold text-blue-800">Enable Logout Button</p><p className="text-xs text-blue-600">If disabled, students cannot log out of the app.</p></div>
                              <input type="checkbox" checked={localSettings.isLogoutEnabled ?? true} onChange={() => setLocalSettings({...localSettings, isLogoutEnabled: !localSettings.isLogoutEnabled})} className="w-6 h-6 accent-blue-600" />
                          </div>
                      </>
                  )}"""

old_security_tab = """                  {/* SECURITY */}
                  {activeTab === 'CONFIG_SECURITY' && (
                      <>
                          <div><label className="text-xs font-bold uppercase text-slate-500">Admin Email</label><input type="text" value={localSettings.adminEmail || ''} onChange={e => setLocalSettings({...localSettings, adminEmail: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
                          <div><label className="text-xs font-bold uppercase text-slate-500">Admin Login Code</label><input type="text" value={localSettings.adminCode || ''} onChange={e => setLocalSettings({...localSettings, adminCode: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
                      </>
                  )}"""

if old_security_tab in content:
    content = content.replace(old_security_tab, security_tab_content)
    print("Added isLogoutEnabled toggle to AdminDashboard")
else:
    print("Could not find old security tab")

with open(file_path, "w") as f:
    f.write(content)

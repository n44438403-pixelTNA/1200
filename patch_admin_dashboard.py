import re

file_path = "components/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add TEACHERS to AdminTab
content = content.replace("  | 'USERS' ", "  | 'USERS' \n  | 'TEACHERS' ")

# 2. Import generateTeacherCode, fetchTeacherCodes, toggleTeacherCode, deleteTeacherCode
if "import { saveChapterData" in content:
    content = content.replace("import { saveChapterData", "import { generateTeacherCode, fetchTeacherCodes, toggleTeacherCode, deleteTeacherCode, saveChapterData")

# 3. Add Teacher Code states
if "const [users, setUsers] = useState<User[]>([]);" in content:
    content = content.replace("const [users, setUsers] = useState<User[]>([]);", "const [users, setUsers] = useState<User[]>([]);\n  const [teacherCodes, setTeacherCodes] = useState<any[]>([]);\n  const [newTeacherPrice, setNewTeacherPrice] = useState('299');\n  const [newTeacherMaxUses, setNewTeacherMaxUses] = useState('5');\n  const [isGeneratingTeacherCode, setIsGeneratingTeacherCode] = useState(false);")

# 4. Add loadTeacherCodes logic inside useEffect
effect_hook = """  useEffect(() => {
      let unsubscribeDrafts: () => void;
      let unsubscribeUniversal: () => void;"""

new_effect_hook = """  useEffect(() => {
      fetchTeacherCodes().then(codes => setTeacherCodes(codes));
      let unsubscribeDrafts: () => void;
      let unsubscribeUniversal: () => void;"""

content = content.replace(effect_hook, new_effect_hook)

# 5. Add UI for the Teacher Tab
tab_buttons = """                      <button onClick={() => setActiveTab('USERS')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 ${activeTab === 'USERS' ? 'bg-slate-700 text-white font-medium shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                          <Users size={16} /> Users & Roles
                      </button>"""

new_tab_buttons = """                      <button onClick={() => setActiveTab('USERS')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 ${activeTab === 'USERS' ? 'bg-slate-700 text-white font-medium shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                          <Users size={16} /> Users & Roles
                      </button>
                      <button onClick={() => setActiveTab('TEACHERS')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 ${activeTab === 'TEACHERS' ? 'bg-purple-600 text-white font-medium shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}>
                          <Briefcase size={16} /> Teachers Mode
                      </button>"""

content = content.replace(tab_buttons, new_tab_buttons)
if "import { List, LayoutDashboard" in content:
    content = content.replace("import { List, LayoutDashboard", "import { Briefcase, List, LayoutDashboard")

teacher_tab_content = """
          {activeTab === 'TEACHERS' && (
              <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Plus size={20} className="text-purple-600" /> Generate Teacher Code
                      </h3>
                      <div className="flex gap-4 items-end">
                          <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Price / Value</label>
                              <input type="number" value={newTeacherPrice} onChange={(e) => setNewTeacherPrice(e.target.value)} className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Max Uses</label>
                              <input type="number" value={newTeacherMaxUses} onChange={(e) => setNewTeacherMaxUses(e.target.value)} className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                          </div>
                          <button
                              onClick={async () => {
                                  if (isGeneratingTeacherCode) return;
                                  setIsGeneratingTeacherCode(true);
                                  try {
                                      const newCode = await generateTeacherCode(Number(newTeacherPrice), Number(newTeacherMaxUses));
                                      setTeacherCodes([...teacherCodes, newCode]);
                                      alert(`Generated Code: ${newCode.code}`);
                                  } catch (err) {
                                      alert("Error generating code");
                                  }
                                  setIsGeneratingTeacherCode(false);
                              }}
                              disabled={isGeneratingTeacherCode}
                              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                          >
                              {isGeneratingTeacherCode ? 'Generating...' : 'Generate New Code'}
                          </button>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Ticket size={20} className="text-slate-600" /> Active Teacher Codes
                      </h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50">
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Uses</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {teacherCodes.map(code => (
                                      <tr key={code.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                          <td className="p-3 font-mono font-bold text-purple-600">{code.code}</td>
                                          <td className="p-3 text-sm text-slate-600">₹{code.price}</td>
                                          <td className="p-3 text-sm text-slate-600">{code.currentUses} / {code.maxUses}</td>
                                          <td className="p-3">
                                              <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${code.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                  {code.active ? 'ACTIVE' : 'DISABLED'}
                                              </span>
                                          </td>
                                          <td className="p-3 text-right">
                                              <div className="flex justify-end gap-2">
                                                  <button onClick={async () => {
                                                      await toggleTeacherCode(code.id, !code.active);
                                                      setTeacherCodes(teacherCodes.map(c => c.id === code.id ? {...c, active: !c.active} : c));
                                                  }} className={`p-2 rounded-lg transition-colors ${code.active ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>
                                                      <RefreshCw size={16} />
                                                  </button>
                                                  <button onClick={async () => {
                                                      if (confirm('Delete this code?')) {
                                                          await deleteTeacherCode(code.id);
                                                          setTeacherCodes(teacherCodes.filter(c => c.id !== code.id));
                                                      }
                                                  }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                      <Trash2 size={16} />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                                  {teacherCodes.length === 0 && (
                                      <tr><td colSpan={5} className="p-6 text-center text-slate-500 text-sm">No teacher codes found.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Users size={20} className="text-blue-600" /> Registered Teachers (Leaderboard)
                      </h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50">
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher Name</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Days</th>
                                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {users.filter(u => u.role === 'TEACHER').sort((a,b) => (b.totalActiveDays || 0) - (a.totalActiveDays || 0)).map((t, idx) => (
                                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                          <td className="p-3 text-sm font-bold text-slate-700 flex items-center gap-2">
                                              {idx === 0 ? <Crown size={16} className="text-yellow-500" /> : idx === 1 ? <Crown size={16} className="text-slate-400" /> : idx === 2 ? <Crown size={16} className="text-orange-600" /> : null}
                                              {t.name}
                                          </td>
                                          <td className="p-3 text-sm text-slate-600">{t.email}</td>
                                          <td className="p-3 text-sm text-slate-600">{t.totalActiveDays || 1} Days</td>
                                          <td className="p-3 text-xs text-slate-500">{t.lastActiveTime ? new Date(t.lastActiveTime).toLocaleDateString() : 'N/A'}</td>
                                      </tr>
                                  ))}
                                  {users.filter(u => u.role === 'TEACHER').length === 0 && (
                                      <tr><td colSpan={4} className="p-6 text-center text-slate-500 text-sm">No teachers registered yet.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}
"""

if "          {activeTab === 'USERS' &&" in content:
    content = content.replace("          {activeTab === 'USERS' &&", teacher_tab_content + "\n          {activeTab === 'USERS' &&")


with open(file_path, "w") as f:
    f.write(content)
print("Updated AdminDashboard.tsx")

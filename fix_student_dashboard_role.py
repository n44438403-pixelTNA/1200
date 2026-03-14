import sys

file_path = "./components/StudentDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

replacement = """
                        {/* TEACHER MODE SWITCHER */}
                        {(user.role === 'TEACHER' || user.role === 'ADMIN' || user.role === 'SUB_ADMIN') && (
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mt-6 flex items-center justify-between shadow-sm animate-in fade-in">
                                <div>
                                    <h4 className="font-black text-purple-900 flex items-center gap-2 text-sm">
                                        <Briefcase size={16} /> Teacher Mode Active
                                    </h4>
                                    <p className="text-[10px] text-purple-700 font-bold mt-1">You have Teacher access.</p>
                                </div>
                                <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm shadow-purple-200">ACTIVE</span>
                            </div>
                        )}
                        {user.role === 'STUDENT' && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 shadow-sm animate-in fade-in">
                                <h4 className="font-black text-slate-800 flex items-center gap-2 mb-2 text-sm">
                                    <Briefcase size={16} className="text-purple-600" /> Are you a Teacher?
                                </h4>
                                <button onClick={async () => {
                                    const code = prompt("Enter Teacher Code to unlock Teacher Mode:");
                                    if (!code) return;

                                    try {
                                        // Just a basic visual loader could be nice, but simple alert is fine
                                        const { verifyTeacherCode, useTeacherCode, saveUserToLive } = await import('../firebase');
                                        const validCode = await verifyTeacherCode(code.toUpperCase());
                                        if (!validCode) {
                                            alert("Invalid or expired Teacher Code.");
                                            return;
                                        }
                                        await useTeacherCode(validCode.id);
                                        const updatedUser = { ...user, role: 'TEACHER' as any };
                                        await saveUserToLive(updatedUser);
                                        // Update local state
                                        localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
                                        window.location.reload();
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error verifying code.");
                                    }
                                }} className="w-full bg-white border-2 border-purple-100 text-purple-700 font-bold py-2.5 rounded-xl text-xs hover:bg-purple-50 transition-colors shadow-sm">
                                    Enter Teacher Code
                                </button>
                            </div>
                        )}
"""

import re
content = re.sub(
    r'                        {\/\* TEACHER MODE SWITCHER \*\/}.*?                            <\/div>\n                        \)}',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open(file_path, "w") as f:
    f.write(content)

print("Updated Teacher Mode logic in StudentDashboard.tsx")

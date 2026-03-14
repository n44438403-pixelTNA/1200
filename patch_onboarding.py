import re

file_path = "components/Onboarding.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add teacher code state and firebase function import
if "import { saveUserToLive" in content:
    content = content.replace("import { saveUserToLive", "import { saveUserToLive, verifyTeacherCode, useTeacherCode ")

if "const [board, setBoard] = useState<Board | ''>('');" in content:
    content = content.replace("const [board, setBoard] = useState<Board | ''>('');", "const [board, setBoard] = useState<Board | ''>('');\n    const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');\n    const [teacherCode, setTeacherCode] = useState('');\n    const [isVerifyingCode, setIsVerifyingCode] = useState(false);")

# Update validation logic
old_validation = """    const handleNext = () => {
        if (!name.trim()) return setError('Please enter your name');
        if (isGoogleUser) {
            if (mobile.length !== 10) return setError('Enter valid 10 digit mobile number');
            if (password.length < 6) return setError('Password must be at least 6 characters');
        }
        if (!board) return setError('Please select a board');
        setError(null);
        setStep(2);
    };"""

new_validation = """    const handleNext = async () => {
        if (!name.trim()) return setError('Please enter your name');
        if (isGoogleUser) {
            if (mobile.length !== 10) return setError('Enter valid 10 digit mobile number');
            if (password.length < 6) return setError('Password must be at least 6 characters');
        }
        if (!board) return setError('Please select a board');

        if (role === 'TEACHER') {
            if (!teacherCode.trim()) return setError('Please enter a Teacher Code');
            setIsVerifyingCode(true);
            try {
                const verifiedCode = await verifyTeacherCode(teacherCode.trim());
                if (!verifiedCode) {
                    setIsVerifyingCode(false);
                    return setError('Invalid or expired Teacher Code');
                }
            } catch (err) {
                setIsVerifyingCode(false);
                return setError('Error verifying code. Please try again.');
            }
            setIsVerifyingCode(false);
        }

        setError(null);
        setStep(2);
    };"""

content = content.replace(old_validation, new_validation)

# Update UI for Step 1
old_ui_step1 = """                      <div className="flex items-center gap-3 mb-6 mt-6 pt-4 border-t border-slate-100">
                          <Target className="text-blue-500" size={24} />
                          <h2 className="text-lg font-bold text-slate-800">Select Your Board</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-3">"""

new_ui_step1 = """
                      <div className="flex flex-col gap-3 mb-6 mt-6 pt-4 border-t border-slate-100">
                          <label className="text-sm font-bold text-slate-700 block">I am a...</label>
                          <div className="grid grid-cols-2 gap-3">
                              <button
                                  onClick={() => setRole('STUDENT')}
                                  className={`p-3 rounded-xl border-2 transition-all font-bold ${role === 'STUDENT' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                              >
                                  👨‍🎓 Student
                              </button>
                              <button
                                  onClick={() => setRole('TEACHER')}
                                  className={`p-3 rounded-xl border-2 transition-all font-bold ${role === 'TEACHER' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                              >
                                  👨‍🏫 Teacher
                              </button>
                          </div>

                          {role === 'TEACHER' && (
                              <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-purple-50 rounded-xl border border-purple-200 mt-2">
                                  <label className="text-xs font-bold text-purple-800 block mb-2 uppercase tracking-wider">Teacher Access Code</label>
                                  <input
                                      type="text"
                                      value={teacherCode}
                                      onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                                      placeholder="e.g. TCH-12345"
                                      className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-800 bg-white shadow-inner uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                                  />
                                  <p className="text-[10px] text-purple-600 mt-2">Requires a valid code provided by Admin to access Teacher features.</p>
                              </div>
                          )}
                      </div>

                      <div className="flex items-center gap-3 mb-6 mt-6 pt-4 border-t border-slate-100">
                          <Target className="text-blue-500" size={24} />
                          <h2 className="text-lg font-bold text-slate-800">Select Your Board</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-3">"""

content = content.replace(old_ui_step1, new_ui_step1)

# Update completion saving logic
old_save_logic = """        const updatedUser = {
            ...user,
            name: name.trim(),
            board: board as Board,
            classLevel: classLevel as ClassLevel,
            stream: stream,
            profileCompleted: true,
            isPremium: true // Default True
        };"""

new_save_logic = """
        let initialCredits = 1000;
        let finalRole = user.role || 'STUDENT';
        let subTier = 'FREE';
        let subLevel = 'BASIC';

        if (role === 'TEACHER') {
            finalRole = 'TEACHER';
            initialCredits = 3000; // Teachers get 3x credits initially
            subTier = 'LIFETIME';
            subLevel = 'ULTRA';

            // Mark code as used
            try {
                const verifiedCode = await verifyTeacherCode(teacherCode.trim());
                if (verifiedCode) {
                    await useTeacherCode(verifiedCode.id);
                }
            } catch (err) {
                console.error("Error updating teacher code use count", err);
            }
        }

        const updatedUser = {
            ...user,
            name: name.trim(),
            board: board as Board,
            classLevel: classLevel as ClassLevel,
            stream: stream,
            role: finalRole,
            profileCompleted: true,
            isPremium: true, // Default True
            credits: Math.max(user.credits || 0, initialCredits),
            subscriptionTier: subTier,
            subscriptionLevel: subLevel
        };"""

content = content.replace(old_save_logic, new_save_logic)

with open(file_path, "w") as f:
    f.write(content)
print("Updated Onboarding.tsx")

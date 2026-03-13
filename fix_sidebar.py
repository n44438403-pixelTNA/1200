import re

with open('components/StudentSidebar.tsx', 'r') as f:
    content = f.read()

if 'HardDriveDownload' not in content:
    content = content.replace("import { X, Gift, Gamepad2, CreditCard, Crown, History, BrainCircuit, Award, Trophy, Mail, User, ChevronRight, LogOut, FileClock } from 'lucide-react';", "import { X, Gift, Gamepad2, CreditCard, Crown, History, BrainCircuit, Award, Trophy, Mail, User, ChevronRight, LogOut, FileClock, HardDriveDownload } from 'lucide-react';")

    btn = """
                            <button
                                onClick={() => { onClose(); onNavigate('DOWNLOADS'); }}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
                                        <HardDriveDownload size={18} />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors text-sm">Offline Downloads</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </button>
"""

    content = content.replace("<button onClick={() => { onClose(); onNavigate('HISTORY'); }}", f"{btn}\n                            <button onClick={{() => {{ onClose(); onNavigate('HISTORY'); }}}}")
    with open('components/StudentSidebar.tsx', 'w') as f:
        f.write(content)

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Lock, LogOut, X } from 'lucide-react';

interface Props {
    onConfirm: (password: string) => void;
    onCancel: () => void;
}

export const LogoutFrictionModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
    const [step, setStep] = useState(1);
    const [currentCode, setCurrentCode] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(10);
    const [password, setPassword] = useState('');
    const timerRef = useRef<any>(null);

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

const startStep = () => {
        setCurrentCode(generateCode());
        setUserInput('');
        setTimeLeft(10);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (timeLeft === 0 && step <= 5) {
            onCancel(); // Failed to type in time, abort
        }
    }, [timeLeft, step, onCancel]);

    useEffect(() => {
        if (step <= 5) {
            startStep();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [step]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserInput(val);

        if (val === currentCode) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => {
                setStep(prev => prev + 1);
            }, 300);
        }
    };

    const handleSubmitPassword = () => {
        if (!password.trim()) {
            alert('Password is required.');
            return;
        }
        onConfirm(password);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Cancel Button */}
                <button onClick={onCancel} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">Confirm Logout</h2>
                    <p className="text-sm text-slate-500 font-bold mt-1">
                        {step <= 5 ? `Security Check ${step} of 5` : 'Final Verification'}
                    </p>
                </div>

                {step <= 5 ? (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type this exact code</p>
                            <div className="text-3xl font-black font-mono tracking-[0.2em] text-slate-800 select-none pointer-events-none">
                                {currentCode}
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                autoFocus
                                value={userInput}
                                onChange={handleInputChange}
                                placeholder="Enter code here..."
                                className="w-full text-center text-xl font-black font-mono tracking-widest p-4 bg-white border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
                            />
                        </div>

                        {/* Timer Bar */}
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-amber-500'}`}
                                style={{ width: `${(timeLeft / 10) * 100}%` }}
                            ></div>
                        </div>
                        <p className={`text-center font-bold text-sm ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                            {timeLeft} seconds remaining
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                            <p className="text-sm font-bold text-red-800 text-center">
                                Final step: Please enter your password to confirm logout.
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-2">Account Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleSubmitPassword}
                            className="w-full py-4 bg-red-600 text-white rounded-xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={20} /> Force Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

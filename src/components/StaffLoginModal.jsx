import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STAFF_ACCOUNTS } from '../data/staffCredentials';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const StaffLoginModal = () => {
  const { isStaffLoginOpen, setIsStaffLoginOpen, loginStaff } = useApp();

  const [identifier, setIdentifier] = useState('manager');
  const [password, setPassword] = useState('dawat2026');
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState('1130');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isStaffLoginOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = pinMode 
      ? loginStaff(pin)
      : loginStaff(identifier, password);

    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  const handleQuickFill = (acc) => {
    setIdentifier(acc.username);
    setPassword(acc.password);
    setPin(acc.pin);
    setErrorMsg('');
    // Direct login for instant preview
    loginStaff(acc.username, acc.password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel border border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative bg-[#0b0e17] my-auto">
        
        {/* Header Bar */}
        <div className="shrink-0 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 py-3.5 sm:px-6 sm:py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">Staff & Kitchen Portal</h3>
              <p className="text-[11px] sm:text-xs text-amber-400/80">Banjaraa - Ek Anokhi Dawat</p>
            </div>
          </div>
          <button
            onClick={() => setIsStaffLoginOpen(false)}
            className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Quick Demo Credentials Banner */}
          <div className="glass-panel-gold rounded-2xl p-4 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Demo Logins</span>
              </span>
              <span className="text-[10px] text-stone-400 uppercase">Click any to enter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STAFF_ACCOUNTS.map(acc => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className="p-2.5 rounded-xl bg-stone-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-stone-800 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                    <span>{acc.role.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 font-mono">{acc.pin}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5 truncate">{acc.name}</div>
                  <div className="text-[9px] text-stone-500 mt-1 font-mono">{acc.username}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle PIN mode vs Password mode */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => setPinMode(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                !pinMode ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Username & Password
            </button>
            <button
              type="button"
              onClick={() => setPinMode(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                pinMode ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              4-Digit Kitchen PIN
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {pinMode ? (
              <div>
                <label className="block text-xs text-stone-400 mb-1.5 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter 4-Digit Staff PIN</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1130 or 7860"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-amber-400 focus:border-amber-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-stone-500 block text-center mt-1">
                  Manager: <code className="text-amber-400">1130</code> | Chef: <code className="text-amber-400">7860</code> | Reception: <code className="text-amber-400">2026</code>
                </span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-stone-400 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Username or Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="manager / chef / host"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1.5 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Access Staff Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

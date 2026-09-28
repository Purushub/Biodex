import React, { useState, useEffect } from 'react';
import { StudentSession, GradeLevel } from '../types';
import { soundFX } from '../utils/audio';
import {
  ShieldCheck,
  X,
  LogOut,
  CheckCircle2,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: StudentSession;
  onSaveSession: (updated: StudentSession) => void;
}

export const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
  isOpen,
  onClose,
  session,
  onSaveSession,
}) => {
  const [authTab, setAuthTab] = useState<'guest' | 'google' | 'manager'>('guest');
  const [classCode, setClassCode] = useState(session.classCode || 'BIO-EXPEDITION-2026');
  const [gradeLevel] = useState<GradeLevel>(session.gradeLevel || 'Grade 6');
  const [guestId, setGuestId] = useState(session.guestId || 'BIO-7842');
  const [sectorCoord] = useState(session.sectorCoord || 'SECTOR-7G');
  const [showCallsignConfig, setShowCallsignConfig] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Manager Login State
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [showManagerPassword, setShowManagerPassword] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);
  const [managerSuccess, setManagerSuccess] = useState(false);

  useEffect(() => {
    setClassCode(session.classCode || 'BIO-EXPEDITION-2026');
    setGuestId(session.guestId || 'BIO-7842');
    if (session.isManager) {
      setAuthTab('manager');
    } else if (session.authProvider === 'google' && session.userEmail) {
      setAuthTab('google');
    }
  }, [session]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    soundFX.playCancel();
    try {
      sessionStorage.setItem('biodex_auth_completed', 'true');
    } catch {}
    onClose();
  };

  const handleGuestEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundFX.playConfirm();
    try {
      sessionStorage.setItem('biodex_auth_completed', 'true');
    } catch {}
    const updated: StudentSession = {
      ...session,
      classCode: classCode.trim() || 'BIO-EXPEDITION-2026',
      gradeLevel,
      guestId: guestId.trim() || 'BIO-7842',
      sectorCoord,
      authProvider: 'guest',
      isManager: false,
    };
    onSaveSession(updated);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      soundFX.playConfirm();

      const { auth, googleProvider, signInWithPopup } = await import('../lib/firebase');
      const { syncUserProfile } = await import('../lib/firestoreService');

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const updatedSession: StudentSession = {
        ...session,
        firebaseUid: user.uid,
        userEmail: user.email || undefined,
        userDisplayName: user.displayName || undefined,
        authProvider: 'google',
        guestId: user.displayName || user.email?.split('@')[0] || session.guestId,
      };

      try {
        sessionStorage.setItem('biodex_auth_completed', 'true');
      } catch {}

      await syncUserProfile(updatedSession);
      onSaveSession(updatedSession);
      setIsSigningIn(false);
      onClose();
    } catch (err: unknown) {
      console.warn('Google Sign-in note:', err);
      setAuthError('Cloud authentication unavailable on localhost. You can continue as a Guest Naturalist with full local storage.');
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      soundFX.playCancel();
      const { auth, signOut } = await import('../lib/firebase');
      await signOut(auth);
      const updatedSession: StudentSession = {
        ...session,
        firebaseUid: undefined,
        userEmail: undefined,
        userDisplayName: undefined,
        authProvider: 'guest',
        guestId: 'BIO-7842',
      };
      onSaveSession(updatedSession);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleManagerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setManagerError(null);
    const cleanEmail = managerEmail.trim().toLowerCase();
    const cleanPass = managerPassword.trim();

    const isEmailValid =
      cleanEmail === 'pm@skillizee.io' ||
      cleanEmail === 'pm@skillizee' ||
      cleanEmail === 'pm@skillizee.com' ||
      cleanEmail.startsWith('pm@skillizee');

    if (isEmailValid && cleanPass === '12345') {
      soundFX.playConfirm();
      setManagerSuccess(true);
      try {
        sessionStorage.setItem('biodex_manager_auth', 'true');
        sessionStorage.setItem('biodex_auth_completed', 'true');
      } catch {}
      const updated: StudentSession = {
        ...session,
        userEmail: 'pm@skillizee.io',
        userDisplayName: 'Project Manager (Skillizee)',
        guestId: 'PM-SKILLIZEE',
        authProvider: 'manager',
        isManager: true,
      };
      setTimeout(() => {
        onSaveSession(updated);
        onClose();
      }, 400);
      return;
    }

    soundFX.playCancel();
    setManagerError('Invalid credentials. Please enter authorized manager credentials.');
  };

  const handleManagerLogout = () => {
    soundFX.playCancel();
    try {
      sessionStorage.removeItem('biodex_manager_auth');
    } catch {}
    const updated: StudentSession = {
      ...session,
      userEmail: undefined,
      userDisplayName: undefined,
      authProvider: 'guest',
      isManager: false,
      guestId: 'BIO-7842',
    };
    onSaveSession(updated);
    setAuthTab('guest');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                BioDex Access Portal
              </h2>
              <span className="font-mono text-[11px] text-slate-400">
                WWF Biodiversity Field Station
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Dismiss and Enter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Access Method Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 my-4">
          <button
            type="button"
            onClick={() => { setAuthTab('guest'); soundFX.playScanBeep(); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'guest'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Guest Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('google'); soundFX.playScanBeep(); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'google'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('manager'); soundFX.playScanBeep(); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'manager'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Manager
          </button>
        </div>

        {/* TAB 1: GUEST LOGIN (Primary & Recommended) */}
        {authTab === 'guest' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Guest Access (No Signup Required)</span>
              </div>
              <p className="text-[11px] text-emerald-800/85 leading-relaxed pl-6">
                Explore the catalog, scan species, simulate extinction forecasts, and save field observations directly to your local browser storage.
              </p>
            </div>

            {/* Prominent Quick Entry Action */}
            <button
              type="button"
              onClick={() => handleGuestEntry()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Guest Naturalist</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Optional Call Sign & Class Code Accordion */}
            <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowCallsignConfig(!showCallsignConfig)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Customize Student Call Sign / Class</span>
                <span className="text-[11px] text-emerald-600 font-bold">
                  {showCallsignConfig ? 'Collapse' : 'Edit'}
                </span>
              </button>

              {showCallsignConfig && (
                <form onSubmit={handleGuestEntry} className="mt-3 space-y-2.5 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Student ID / Call Sign
                    </label>
                    <input
                      type="text"
                      value={guestId}
                      onChange={(e) => setGuestId(e.target.value)}
                      placeholder="e.g. BIO-7842"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Classroom Expedition Code
                    </label>
                    <input
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      placeholder="e.g. BIO-EXPEDITION-2026"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Save & Enter
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE SIGN IN */}
        {authTab === 'google' && (
          <div className="space-y-4">
            {session.authProvider === 'google' && session.userEmail ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm">
                    {(session.userDisplayName || session.userEmail)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {session.userDisplayName || 'Student Naturalist'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      {session.userEmail}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold">
                      Cloud Sync Active
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleSignOut}
                    className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Cloud Account Sync
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sign in with your Google account to synchronize your observations across tablets and school workstations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>

                {authError && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-semibold">{authError}</p>
                      <button
                        type="button"
                        onClick={() => handleGuestEntry()}
                        className="mt-1.5 text-emerald-700 underline font-bold"
                      >
                        Click here to continue as Guest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGER LOGIN */}
        {authTab === 'manager' && (
          <div className="space-y-3">
            {session.isManager ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold font-mono">Manager Mode (Active)</h3>
                    <p className="text-[11px] text-emerald-700">Project Manager Entry Deletion Enabled</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Enter App
                  </button>
                  <button
                    type="button"
                    onClick={handleManagerLogout}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Switch to Guest
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManagerLogin} className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in with authorized manager credentials to manage and audit entries.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Manager Email
                  </label>
                  <input
                    type="text"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="Enter manager email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showManagerPassword ? 'text' : 'password'}
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      placeholder="Enter manager password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-9 text-xs font-mono font-bold text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowManagerPassword(!showManagerPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showManagerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {managerError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{managerError}</span>
                  </div>
                )}

                {managerSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="font-bold">Manager verified! Permissions granted.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  Log In as Manager
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

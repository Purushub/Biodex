import React, { useState, useEffect } from 'react';
import { StudentSession, GradeLevel } from '../types';
import { soundFX } from '../utils/audio';
import {
  ShieldCheck,
  School,
  Sparkles,
  X,
  LogIn,
  LogOut,
  CheckCircle2,
  User,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  Unlock,
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
  const [authTab, setAuthTab] = useState<'student' | 'manager'>('student');
  const [classCode, setClassCode] = useState(session.classCode);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(session.gradeLevel);
  const [guestId, setGuestId] = useState(session.guestId);
  const [sectorCoord, setSectorCoord] = useState(session.sectorCoord);
  const [showCloudAuth, setShowCloudAuth] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Manager Login State (pm@skillizee.io / 12345)
  const [managerEmail, setManagerEmail] = useState('pm@skillizee.io');
  const [managerPassword, setManagerPassword] = useState('');
  const [showManagerPassword, setShowManagerPassword] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);
  const [managerSuccess, setManagerSuccess] = useState(false);

  useEffect(() => {
    setClassCode(session.classCode);
    setGradeLevel(session.gradeLevel);
    setGuestId(session.guestId);
    setSectorCoord(session.sectorCoord);
    if (session.isManager) {
      setAuthTab('manager');
    }
  }, [session]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      soundFX.playConfirm();

      // Dynamically import Firebase to avoid loading it unnecessarily
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

      await syncUserProfile(updatedSession);
      onSaveSession(updatedSession);
      setIsSigningIn(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in error';
      console.warn('Google Sign-in note:', err);
      setAuthError('Cloud sync unavailable on localhost. Your data is saved locally.');
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
        guestId: 'GUEST-G6-042',
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
      try { sessionStorage.setItem('biodex_manager_auth', 'true'); } catch {}
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
      }, 500);
      return;
    }

    soundFX.playCancel();
    setManagerError('Invalid credentials. Only pm@skillizee.io with pass 12345 can log in as manager.');
  };

  const handleManagerLogout = () => {
    soundFX.playCancel();
    try { sessionStorage.removeItem('biodex_manager_auth'); } catch {}
    const updated: StudentSession = {
      ...session,
      userEmail: undefined,
      userDisplayName: undefined,
      authProvider: 'guest',
      isManager: false,
      guestId: 'BIO-7842',
    };
    onSaveSession(updated);
    setAuthTab('student');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playConfirm();
    onSaveSession({
      ...session,
      classCode,
      gradeLevel,
      guestId,
      sectorCoord,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              authTab === 'manager'
                ? 'bg-amber-50 border border-amber-200 text-amber-600'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
            }`}>
              {authTab === 'manager' ? <KeyRound className="w-5 h-5 text-amber-600" /> : <School className="w-5 h-5 text-emerald-600" />}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                {authTab === 'manager' ? 'Manager Verification' : 'Student Profile'}
              </h2>
              <span className="font-mono text-[11px] text-slate-400">
                {authTab === 'manager' ? 'Entry Deletion Privileges' : 'Field Session Config'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playCancel();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Tab Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 my-3">
          <button
            type="button"
            onClick={() => { setAuthTab('student'); soundFX.playScanBeep(); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authTab === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Naturalist Profile
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
            Manager (pm@skillizee.io)
          </button>
        </div>

        {authTab === 'manager' ? (
          <div className="space-y-3">
            {session.isManager ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold font-mono">pm@skillizee.io (Active)</h3>
                    <p className="text-[11px] text-emerald-700">Project Manager Entry Deletion Enabled</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleManagerLogout}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Switch to Guest / Student Mode
                </button>
              </div>
            ) : (
              <form onSubmit={handleManagerLogin} className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in as <strong className="font-mono text-slate-900">pm@skillizee.io</strong> to manage and delete entries from the register.
                </p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Manager ID / Email
                  </label>
                  <input
                    type="text"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="pm@skillizee.io"
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
                      placeholder="Enter password (12345)"
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
        ) : (
          <>
            {/* Guest Mode Active Badge */}
            <div className="my-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-800">Guest Mode Active</p>
                <p className="text-[11px] text-emerald-600/80">All data saved locally on this device.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                Offline OK
              </span>
            </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Classroom Code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g. BIO-EXPEDITION-2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:border-emerald-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Student ID / Call Sign
            </label>
            <input
              type="text"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-all active:scale-[0.99]"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Collapsible Cloud Auth — hidden by default to avoid confusion */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowCloudAuth(!showCloudAuth)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span>Cloud Sync (Optional)</span>
            {showCloudAuth ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCloudAuth && (
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 animate-in fade-in slide-in-from-top-1 duration-200">
              {session.authProvider === 'google' && session.userEmail ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{session.userDisplayName || 'Student User'}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate">{session.userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignOut}
                    className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                    Sign in with Google to sync surveys across devices. Requires Firebase authorized domain.
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    {isSigningIn ? 'Connecting...' : 'Sign in with Google'}
                  </button>
                </div>
              )}

              {authError && (
                <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {authError}
                </p>
              )}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};

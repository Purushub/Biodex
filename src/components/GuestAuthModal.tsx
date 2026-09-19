/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentSession, GradeLevel } from '../types';
import { soundFX } from '../utils/audio';
import { ShieldCheck, School, Sparkles, X, LogIn, LogOut, CheckCircle2, User } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { syncUserProfile } from '../lib/firestoreService';

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
  const [classCode, setClassCode] = useState(session.classCode);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(session.gradeLevel);
  const [guestId, setGuestId] = useState(session.guestId);
  const [sectorCoord, setSectorCoord] = useState(session.sectorCoord);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setClassCode(session.classCode);
    setGradeLevel(session.gradeLevel);
    setGuestId(session.guestId);
    setSectorCoord(session.sectorCoord);
  }, [session]);

  if (!isOpen) return null;

  const generateNewGuestToken = () => {
    soundFX.playScanBeep();
    const randNum = String(Math.floor(1000 + Math.random() * 9000));
    setGuestId(`BIO-${randNum}`);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      soundFX.playConfirm();
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
      console.error('Google Sign-in failed:', err);
      setAuthError(msg);
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      soundFX.playCancel();
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
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <School className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                Student Profile &amp; Auth
              </h2>
              <span className="font-mono text-[11px] text-slate-400">Classroom Session Config</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playCancel();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google Authentication Section */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cloud Authentication</span>
            {session.authProvider === 'google' ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Google Verified
              </span>
            ) : (
              <span className="bg-slate-200/70 text-slate-600 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                Guest Mode
              </span>
            )}
          </div>

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
              <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">
                Sign in with Google to sync biodiversity surveys across devices and save discoveries to Firebase Firestore.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}
              </button>
            </div>
          )}

          {authError && (
            <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
              {authError}
            </p>
          )}
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
              placeholder="e.g. GRADE6-BIO-2026"
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
      </div>
    </div>
  );
};

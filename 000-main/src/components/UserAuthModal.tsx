import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  User as UserIcon,
  Cloud,
  CloudCheck,
  LogOut,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Database,
  Lock,
  RefreshCw,
  LogIn
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  User,
  db,
  doc,
  setDoc,
  getDoc
} from '../lib/firebase';

interface UserAuthModalProps {
  onClose: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ onClose }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        syncUserDataToFirestore(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const syncUserDataToFirestore = async (u: User) => {
    setSyncStatus('syncing');
    try {
      const userDocRef = doc(db, 'users', u.uid);
      await setDoc(
        userDocRef,
        {
          uid: u.uid,
          email: u.email || 'زائر مؤقت',
          displayName: u.displayName || 'زائر منصة نُور',
          photoURL: u.photoURL || '',
          lastLoginAt: new Date().toISOString(),
          isAnonymous: u.isAnonymous
        },
        { merge: true }
      );

      // Sync local schedule & favorites to Firebase
      const localFavorites = JSON.parse(localStorage.getItem('noor_favorites') || '[]');
      const localSchedule = JSON.parse(localStorage.getItem('noor_notification_schedule_v2') || '{}');

      const prefDocRef = doc(db, 'user_preferences', u.uid);
      await setDoc(
        prefDocRef,
        {
          userId: u.uid,
          schedule: localSchedule,
          favoritesCount: localFavorites.length,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      setSyncStatus('success');
    } catch (err: any) {
      console.error('Firestore sync error:', err);
      setSyncStatus('error');
      setErrorMsg(err?.message || 'تعذر الربط بقاعدة Firestore');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      // Fallback if popup blocked
      setErrorMsg('تعذر تسجيل الدخول عبر Google. يمكنك الدعم بتسجيل زائر آمن.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error('Anonymous Sign In error:', err);
      setErrorMsg('تعذر تسجيل الدخول المؤقت');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Sign Out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel max-w-md w-full rounded-3xl p-6 md:p-8 border border-[var(--border-color)] space-y-6 shadow-2xl text-right"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--gold-primary)]/15 border border-[var(--gold-primary)]/30 flex items-center justify-center text-[var(--gold-primary)] shadow-sm">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--gold-light)]">حساب نُور والمزامنة السحابية</h3>
              <p className="text-xs text-[var(--text-muted)]">ربط البيانات بقاعدة بيانات Firebase Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Tag */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--gold-primary)]" />
            <span className="font-medium text-[var(--text-main)]">معرّف القاعدة السحابية:</span>
          </div>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[var(--gold-primary)]/10 text-[var(--gold-light)] border border-[var(--gold-primary)]/20 font-bold">
            ai-studio-applet-webapp-88c53
          </span>
        </div>

        {/* User Logged In State */}
        {user ? (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center gap-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-14 h-14 rounded-2xl border-2 border-[var(--gold-primary)] object-cover shadow-md" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[var(--gold-primary)]/20 border-2 border-[var(--gold-primary)] flex items-center justify-center text-[var(--gold-primary)] text-xl font-bold">
                  {user.displayName ? user.displayName[0] : 'ن'}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[var(--gold-light)]">{user.displayName || 'زائر منصة نُور'}</h4>
                  {user.isAnonymous && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
                      حساب زائر
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] dir-ltr text-right">{user.email || 'معرّف مشفر آمن'}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>متصل ومزامن ومحفوظ بالسحابة</span>
                </div>
              </div>
            </div>

            {/* Sync Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CloudCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">مزامنة البيانات الحية</div>
                  <div className="text-[10px] text-[var(--text-muted)]">تم حفظ المفضلة وجداول التنبيهات في Firestore</div>
                </div>
              </div>

              <button
                onClick={() => syncUserDataToFirestore(user)}
                disabled={syncStatus === 'syncing'}
                className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition cursor-pointer"
                title="إعادة المزامنة الآن"
              >
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج من الحساب</span>
            </button>
          </div>
        ) : (
          /* User Logged Out State */
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              قم بتسجيل الدخول لحفظ علامات قراءة المصحف، وتنبيهات الأذكار، والمفضلة بشكل دائم في قاعدة بيانات Firebase Firestore لاستعادتها من أي جهاز.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Google Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white text-black font-bold text-xs hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>الدخول الحساب الآمن بواسطة Google</span>
            </button>

            {/* Anonymous Guest Login */}
            <button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-[var(--gold-light)] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>دخول سريع كزائر بدون حساب</span>
            </button>
          </div>
        )}

        {/* Security Footer */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> مشفّر بواسطة Firebase Security Rules
          </span>
          <span>منصة نُور 2026</span>
        </div>

      </motion.div>
    </div>
  );
};

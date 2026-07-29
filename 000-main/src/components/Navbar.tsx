import React, { useState, useEffect } from 'react';
import { PageId, ThemeMode } from '../types';
import { NoorLogo } from './NoorLogo';
import { UserAuthModal } from './UserAuthModal';
import { auth, onAuthStateChanged, User } from '../lib/firebase';
import {
  BookOpen,
  BookText,
  Bookmark,
  Compass,
  Heart,
  History,
  Home,
  Layers,
  Library,
  Moon,
  Music,
  Bell,
  Search,
  Settings,
  Sparkles,
  Sun,
  ShieldCheck,
  UserCheck,
  Cloud,
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  theme,
  onToggleTheme,
  onOpenNotifications,
  favoritesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsubscribe();
  }, []);

  const mainNavItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'quran', label: 'القرآن', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tafsir', label: 'التفاسير', icon: <BookText className="w-4 h-4" /> },
    { id: 'hadith', label: 'الأحاديث', icon: <Layers className="w-4 h-4" /> },
    { id: 'stories', label: 'القصص', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'recitations', label: 'التلاوات', icon: <Music className="w-4 h-4" /> },
    { id: 'ruqya', label: 'الرقية', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'names', label: 'أسماء الله', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'azkar', label: 'الأذكار', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'duas', label: 'الأدعية', icon: <Heart className="w-4 h-4" /> },
    { id: 'library', label: 'المكتبة', icon: <Library className="w-4 h-4" /> },
    { id: 'sira', label: 'السيرة', icon: <BookText className="w-4 h-4" /> },
    { id: 'qibla', label: 'القبلة', icon: <Compass className="w-4 h-4" /> }
  ];

  const handleNavClick = (page: PageId) => {
    onSelectPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border-color)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick('home')}>
            <NoorLogo size="md" />
          </div>

          {/* Desktop Main Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-[var(--bg-main)]/60 p-1.5 rounded-2xl border border-[var(--border-color)] max-w-2xl overflow-x-auto">
            {mainNavItems.slice(0, 10).map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--gold-primary)] text-black font-bold shadow-md shadow-[var(--gold-primary)]/20'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--gold-soft)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Tools Bar */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Button */}
            <button
              onClick={() => handleNavClick('search')}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all flex items-center gap-2 text-xs"
              title="الباحث الشامل"
            >
              <Search className="w-4 h-4 text-[var(--gold-primary)]" />
              <span className="hidden sm:inline">ابحث...</span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => handleNavClick('favorites')}
              className="relative p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
              title="المفضلة"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-red-500 fill-red-500' : 'text-[var(--gold-primary)]'}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Last Read Button */}
            <button
              onClick={() => handleNavClick('lastRead')}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hidden sm:flex"
              title="آخر قراءة"
            >
              <History className="w-4 h-4 text-[var(--gold-primary)]" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
              title="التذكيرات والإشعارات"
            >
              <Bell className="w-4 h-4 text-[var(--gold-primary)]" />
            </button>

            {/* Firebase Cloud Sync User Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 border ${
                currentUser
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title="مزامنة السحابة وحساب المستخدم"
            >
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-xs font-bold">
                {currentUser ? (currentUser.displayName?.split(' ')[0] || 'مُزامن') : 'مزامنة'}
              </span>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hidden md:flex"
              title="لوحة الإدارة"
            >
              <Settings className="w-4 h-4 text-[var(--gold-primary)]" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
              title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[var(--bg-card)] text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-right transition-all ${
                  activePage === item.id
                    ? 'bg-[var(--gold-primary)] text-black font-bold'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-3 gap-2">
            <button
              onClick={() => handleNavClick('lastRead')}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-main)] text-[var(--text-main)]"
            >
              <History className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>آخر قراءة</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-main)] text-[var(--text-main)]"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              <span>الإدارة</span>
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-main)] text-[var(--text-main)]"
            >
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>المفضلة</span>
            </button>
          </div>
        </div>
      )}

      {/* User Auth & Firebase Sync Modal */}
      {isAuthModalOpen && (
        <UserAuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  );
};

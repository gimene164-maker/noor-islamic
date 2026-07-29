import React, { useState } from 'react';
import { StoryItem, HadithItem, Reciter, LibraryBook } from '../types';
import { HADITH_BOOKS_LIST } from '../data/hadithData';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Youtube,
  Sparkles,
  Check,
  BookOpen,
  Lock,
  KeyRound,
  BellRing,
  BarChart2,
  FileText,
  AlertCircle,
  Layers,
  Music,
  Library,
  X,
  Search,
  Send
} from 'lucide-react';

interface AdminPanelProps {
  stories: StoryItem[];
  onAddStory: (story: StoryItem) => void;
  onEditStory: (story: StoryItem) => void;
  onDeleteStory: (id: string) => void;

  hadiths: HadithItem[];
  onAddHadith: (hadith: HadithItem) => void;
  onEditHadith: (hadith: HadithItem) => void;
  onDeleteHadith: (id: string) => void;

  reciters: Reciter[];
  onAddReciter: (reciter: Reciter) => void;
  onEditReciter: (reciter: Reciter) => void;
  onDeleteReciter: (id: string) => void;

  books: LibraryBook[];
  onAddBook: (book: LibraryBook) => void;
  onEditBook: (book: LibraryBook) => void;
  onDeleteBook: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  stories,
  onAddStory,
  onEditStory,
  onDeleteStory,
  hadiths,
  onAddHadith,
  onEditHadith,
  onDeleteHadith,
  reciters,
  onAddReciter,
  onEditReciter,
  onDeleteReciter,
  books,
  onAddBook,
  onEditBook,
  onDeleteBook
}) => {
  // Passcode Protection State ('0111')
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('noor_admin_unlocked') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'stories' | 'hadiths' | 'reciters' | 'books' | 'analytics' | 'notifications'>('stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Active Editing States
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [editingHadith, setEditingHadith] = useState<HadithItem | null>(null);
  const [editingReciter, setEditingReciter] = useState<Reciter | null>(null);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);

  // Show Form Modals
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showHadithModal, setShowHadithModal] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Story Form State
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCategory, setStoryCategory] = useState<'prophets' | 'companions' | 'quran'>('prophets');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyFull, setStoryFull] = useState('');
  const [storyImage, setStoryImage] = useState('');
  const [storyYoutube, setStoryYoutube] = useState('');
  const [storyAyahs, setStoryAyahs] = useState('');
  const [storyHadiths, setStoryHadiths] = useState('');
  const [storyLessons, setStoryLessons] = useState('');

  // Hadith Form State
  const [hadithBookId, setHadithBookId] = useState('bukhari');
  const [hadithChapter, setHadithChapter] = useState('');
  const [hadithNarrator, setHadithNarrator] = useState('');
  const [hadithText, setHadithText] = useState('');
  const [hadithGrade, setHadithGrade] = useState('صحيح');

  // Reciter Form State
  const [reciterName, setReciterName] = useState('');
  const [reciterRewaya, setReciterRewaya] = useState('حفص عن عاصم');
  const [reciterServerUrl, setReciterServerUrl] = useState('');
  const [reciterPhotoUrl, setReciterPhotoUrl] = useState('');

  // Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategory, setBookCategory] = useState<'التفسير' | 'الحديث' | 'العقيدة' | 'الفقه' | 'السيرة' | 'اللغة العربية'>('التفسير');
  const [bookDescription, setBookDescription] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [bookPagesCount, setBookPagesCount] = useState<number>(300);

  // Handle Passcode Unlock ('0111')
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === '0111') {
      setIsUnlocked(true);
      setPasscodeError(false);
      sessionStorage.setItem('noor_admin_unlocked', 'true');
    } else {
      setPasscodeError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('noor_admin_unlocked');
    setPasscode('');
  };

  const showToast = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 2500);
  };

  // --- Story Actions ---
  const openNewStoryModal = () => {
    setEditingStory(null);
    setStoryTitle('');
    setStoryCategory('prophets');
    setStoryDescription('');
    setStoryFull('');
    setStoryImage('');
    setStoryYoutube('');
    setStoryAyahs('');
    setStoryHadiths('');
    setStoryLessons('');
    setShowStoryModal(true);
  };

  const openEditStoryModal = (story: StoryItem) => {
    setEditingStory(story);
    setStoryTitle(story.title);
    setStoryCategory(story.category);
    setStoryDescription(story.description);
    setStoryFull(story.fullStory);
    setStoryImage(story.imageUrl || '');
    setStoryYoutube(story.youtubeUrl || '');
    setStoryAyahs(story.ayahs ? story.ayahs.join('\n') : '');
    setStoryHadiths(story.hadiths ? story.hadiths.join('\n') : '');
    setStoryLessons(story.lessons ? story.lessons.join('\n') : '');
    setShowStoryModal(true);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyFull) {
      alert('يرجى إضافة عنوان القصة ونص القصة الكامل');
      return;
    }

    let catLabel = 'قصص الأنبياء';
    if (storyCategory === 'companions') catLabel = 'قصص الصحابة';
    if (storyCategory === 'quran') catLabel = 'قصص القرآن';

    let formattedYoutube = storyYoutube;
    if (storyYoutube.includes('watch?v=')) {
      const vId = storyYoutube.split('watch?v=')[1].split('&')[0];
      formattedYoutube = `https://www.youtube.com/embed/${vId}`;
    }

    const item: StoryItem = {
      id: editingStory ? editingStory.id : `story-${Date.now()}`,
      title: storyTitle,
      category: storyCategory,
      categoryLabel: catLabel,
      description: storyDescription,
      fullStory: storyFull,
      imageUrl: storyImage || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: formattedYoutube,
      ayahs: storyAyahs ? storyAyahs.split('\n').filter(Boolean) : [],
      hadiths: storyHadiths ? storyHadiths.split('\n').filter(Boolean) : [],
      lessons: storyLessons ? storyLessons.split('\n').filter(Boolean) : []
    };

    if (editingStory) {
      onEditStory(item);
      showToast('تم تحديث القصة بنجاح ✓');
    } else {
      onAddStory(item);
      showToast('تم إضافة القصة بنجاح 🚀');
    }
    setShowStoryModal(false);
  };

  // --- Hadith Actions ---
  const openNewHadithModal = () => {
    setEditingHadith(null);
    setHadithBookId('bukhari');
    setHadithChapter('');
    setHadithNarrator('');
    setHadithText('');
    setHadithGrade('صحيح');
    setShowHadithModal(true);
  };

  const openEditHadithModal = (h: HadithItem) => {
    setEditingHadith(h);
    setHadithBookId(h.bookId);
    setHadithChapter(h.chapter);
    setHadithNarrator(h.narrator);
    setHadithText(h.text);
    setHadithGrade(h.grade || 'صحيح');
    setShowHadithModal(true);
  };

  const handleSaveHadith = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hadithText) {
      alert('يرجى إدخال نص الحديث الشريف');
      return;
    }

    const bInfo = HADITH_BOOKS_LIST.find((b) => b.id === hadithBookId) || HADITH_BOOKS_LIST[0];

    const item: HadithItem = {
      id: editingHadith ? editingHadith.id : `hadith-${Date.now()}`,
      bookId: hadithBookId,
      bookName: bInfo.name,
      number: editingHadith ? editingHadith.number : Math.floor(Math.random() * 5000) + 1,
      chapter: hadithChapter || 'باب العامة',
      narrator: hadithNarrator || 'عن الصحابي رضي الله عنه',
      text: hadithText,
      grade: hadithGrade
    };

    if (editingHadith) {
      onEditHadith(item);
      showToast('تم تحديث الحديث الشريف بنجاح ✓');
    } else {
      onAddHadith(item);
      showToast('تم إضافة الحديث الشريف بنجاح 🚀');
    }
    setShowHadithModal(false);
  };

  // --- Reciter Actions ---
  const openNewReciterModal = () => {
    setEditingReciter(null);
    setReciterName('');
    setReciterRewaya('حفص عن عاصم');
    setReciterServerUrl('https://server10.mp3quran.net/minsh/');
    setReciterPhotoUrl('');
    setShowReciterModal(true);
  };

  const openEditReciterModal = (r: Reciter) => {
    setEditingReciter(r);
    setReciterName(r.name);
    setReciterRewaya(r.rewaya);
    setReciterServerUrl(r.serverUrl);
    setReciterPhotoUrl(r.photoUrl || '');
    setShowReciterModal(true);
  };

  const handleSaveReciter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reciterName || !reciterServerUrl) {
      alert('يرجى إدخال اسم القارئ ورابط السيرفر الصوتي');
      return;
    }

    const item: Reciter = {
      id: editingReciter ? editingReciter.id : `reciter-${Date.now()}`,
      name: reciterName,
      rewaya: reciterRewaya,
      serverUrl: reciterServerUrl.endsWith('/') ? reciterServerUrl : `${reciterServerUrl}/`,
      photoUrl: reciterPhotoUrl || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=300&q=80'
    };

    if (editingReciter) {
      onEditReciter(item);
      showToast('تم تحديث بيانات القارئ بنجاح ✓');
    } else {
      onAddReciter(item);
      showToast('تم إضافة القارئ بنجاح 🚀');
    }
    setShowReciterModal(false);
  };

  // --- Book Actions ---
  const openNewBookModal = () => {
    setEditingBook(null);
    setBookTitle('');
    setBookAuthor('');
    setBookCategory('التفسير');
    setBookDescription('');
    setBookPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setBookCoverUrl('');
    setBookPagesCount(350);
    setShowBookModal(true);
  };

  const openEditBookModal = (b: LibraryBook) => {
    setEditingBook(b);
    setBookTitle(b.title);
    setBookAuthor(b.author);
    setBookCategory(b.category);
    setBookDescription(b.description);
    setBookPdfUrl(b.pdfUrl || '');
    setBookCoverUrl(b.coverUrl || '');
    setBookPagesCount(b.pagesCount || 350);
    setShowBookModal(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookAuthor) {
      alert('يرجى إدخال عنوان الكتاب والمؤلف');
      return;
    }

    const item: LibraryBook = {
      id: editingBook ? editingBook.id : `book-${Date.now()}`,
      title: bookTitle,
      author: bookAuthor,
      category: bookCategory,
      description: bookDescription,
      pdfUrl: bookPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      coverUrl: bookCoverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      pagesCount: Number(bookPagesCount) || 300
    };

    if (editingBook) {
      onEditBook(item);
      showToast('تم تحديث الكتاب بنجاح ✓');
    } else {
      onAddBook(item);
      showToast('تم إضافة الكتاب إلى المكتبة 🚀');
    }
    setShowBookModal(false);
  };

  const handleBroadcast = (titleText: string, bodyText: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(titleText, { body: bodyText, dir: 'rtl', lang: 'ar' });
        showToast('تم إرسال التنبيه الفوري بنجاح 🔔');
      } else {
        Notification.requestPermission().then((p) => {
          if (p === 'granted') {
            new Notification(titleText, { body: bodyText, dir: 'rtl', lang: 'ar' });
            showToast('تم إرسال التنبيه الفوري بنجاح 🔔');
          } else {
            alert('الإشعارات محظورة في متصفحك.');
          }
        });
      }
    } else {
      alert('متصفحك لا يدعم الإشعارات المباشرة.');
    }
  };

  // Passcode Locking Screen (Passcode '011')
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 glass-panel rounded-3xl border border-[var(--border-color)] text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] rounded-2xl flex items-center justify-center mx-auto border border-[var(--gold-primary)]/20 shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--gold-light)]">منطقة لوحة الإدارة المشفرة</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">يرجى إدخال الرمز الخاص للمسؤول للوصول إلى كافة صلاحيات الإدارة الحيّة</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              maxLength={8}
              placeholder="أدخل رمز الدخول السرّي..."
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError(false);
              }}
              className="w-full text-center px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-lg font-mono tracking-widest text-[var(--gold-light)] focus:outline-none focus:border-[var(--gold-primary)]"
              autoFocus
            />
            <KeyRound className="w-5 h-5 text-[var(--gold-primary)] absolute left-4 top-3.5 opacity-50" />
          </div>

          {passcodeError && (
            <p className="text-xs text-red-400 font-bold flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> رمز الدخول غير صحيح! يرجى المحاولة مرة أخرى.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-soft)] text-black font-bold text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
          >
            فتح لوحة التحكم الكاملة 🔓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Toast Notification */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--gold-primary)] text-black px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--gold-primary)]" />
            <span>لوحة إدارة المنصة الكاملة</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">إضافة، تعديل، وحذف القصص، الأحاديث، القراء، والكتب في الوقت الحي</p>
        </div>

        <button
          onClick={handleLock}
          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>قفل اللوحة</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => { setActiveTab('stories'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'stories'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>إدارة القصص ({stories.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('hadiths'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'hadiths'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة الأحاديث ({hadiths.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('reciters'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'reciters'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>إدارة القراء والتلاوات ({reciters.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('books'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'books'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>إدارة المكتبة والكتب ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>الإحصائيات والنظام</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>مركز التنبيهات</span>
        </button>
      </div>

      {/* --- TAB 1: STORIES MANAGEMENT --- */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--gold-primary)]" />
              <input
                type="text"
                placeholder="البحث في قصص المنصة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <button
              onClick={openNewStoryModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قصة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories
              .filter((s) => s.title.includes(searchQuery) || s.categoryLabel.includes(searchQuery))
              .map((story) => (
                <div key={story.id} className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={story.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]" />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--gold-light)]">{story.title}</h3>
                      <p className="text-[10px] text-[var(--gold-soft)] font-semibold mt-0.5">{story.categoryLabel}</p>
                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{story.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditStoryModal(story)}
                      className="p-2 rounded-xl bg-[var(--gold-primary)]/10 text-[var(--gold-light)] hover:bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/20 transition cursor-pointer"
                      title="تعديل القصة"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف قصة "${story.title}"؟`)) {
                          onDeleteStory(story.id);
                          showToast('تم حذف القصة بنجاح');
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition cursor-pointer"
                      title="حذف القصة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: HADITHS MANAGEMENT --- */}
      {activeTab === 'hadiths' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--gold-primary)]" />
              <input
                type="text"
                placeholder="البحث في نص الحديث أو الراوي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <button
              onClick={openNewHadithModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حديث جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hadiths
              .filter((h) => h.text.includes(searchQuery) || h.narrator.includes(searchQuery) || h.bookName.includes(searchQuery))
              .map((hadith) => (
                <div key={hadith.id} className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--gold-primary)]/10 text-[var(--gold-light)] font-bold border border-[var(--gold-primary)]/20">
                        {hadith.bookName} - {hadith.chapter}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">{hadith.grade || 'صحيح'}</span>
                    </div>
                    <p className="text-xs text-[var(--text-main)] line-clamp-2 leading-relaxed font-['Amiri']">« {hadith.text} »</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{hadith.narrator}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => openEditHadithModal(hadith)}
                      className="p-1.5 rounded-lg bg-[var(--gold-primary)]/10 text-[var(--gold-light)] hover:bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/20 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا الحديث الشريف؟')) {
                          onDeleteHadith(hadith.id);
                          showToast('تم حذف الحديث الشريف');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: RECITERS MANAGEMENT --- */}
      {activeTab === 'reciters' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--gold-primary)]" />
              <input
                type="text"
                placeholder="البحث عن قارئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <button
              onClick={openNewReciterModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قارئ جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reciters
              .filter((r) => r.name.includes(searchQuery) || r.rewaya.includes(searchQuery))
              .map((reciter) => (
                <div key={reciter.id} className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={reciter.photoUrl || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=300&q=80'} alt="" className="w-12 h-12 rounded-full object-cover border border-[var(--gold-primary)]/30" />
                    <div>
                      <h3 className="text-xs font-bold text-[var(--gold-light)]">{reciter.name}</h3>
                      <span className="text-[10px] text-[var(--text-muted)] block">{reciter.rewaya}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditReciterModal(reciter)}
                      className="p-1.5 rounded-lg bg-[var(--gold-primary)]/10 text-[var(--gold-light)] hover:bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/20 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف القارئ "${reciter.name}"؟`)) {
                          onDeleteReciter(reciter.id);
                          showToast('تم حذف القارئ');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: LIBRARY BOOKS MANAGEMENT --- */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--gold-primary)]" />
              <input
                type="text"
                placeholder="البحث في عنوان الكتاب أو المؤلف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <button
              onClick={openNewBookModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books
              .filter((b) => b.title.includes(searchQuery) || b.author.includes(searchQuery) || b.category.includes(searchQuery))
              .map((book) => (
                <div key={book.id} className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'} alt="" className="w-12 h-16 rounded-lg object-cover border border-[var(--border-color)] shadow" />
                    <div className="space-y-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-md bg-[var(--gold-primary)]/10 text-[var(--gold-light)] font-bold">{book.category}</span>
                      <h3 className="text-xs font-bold text-[var(--gold-light)]">{book.title}</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">{book.author} — {book.pagesCount || 300} صفحة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditBookModal(book)}
                      className="p-2 rounded-xl bg-[var(--gold-primary)]/10 text-[var(--gold-light)] hover:bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/20 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف كتاب "${book.title}"؟`)) {
                          onDeleteBook(book.id);
                          showToast('تم حذف الكتاب من المكتبة');
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: ANALYTICS --- */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsDashboard
          stories={stories}
          hadiths={hadiths}
          reciters={reciters}
          books={books}
        />
      )}

      {/* --- TAB 6: NOTIFICATION BROADCAST --- */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[var(--gold-primary)]" />
              <span>مركز بث التنبيهات الفورية لمتصفح المستخدمين</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">اختبار وإرسال إشعارات مباشرة للمستخدمين لمواعيد الأذكار والورد والقرآن الكريم</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleBroadcast('تذكير أذكار الصباح 🌅', '«اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا» - حان وقت أذكار الصباح.')}
              className="p-5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-right space-y-2 transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-[var(--gold-light)]">بث إشعار أذكار الصباح 🌅</h4>
              <p className="text-[10px] text-[var(--text-muted)]">إرسال تنبيه فورية للمتصفح</p>
            </button>

            <button
              onClick={() => handleBroadcast('تذكير أذكار المساء 🌙', '«أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ» - حان موعد أذكار المساء وورد اليوم.')}
              className="p-5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-right space-y-2 transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-[var(--gold-light)]">بث إشعار أذكار المساء 🌙</h4>
              <p className="text-[10px] text-[var(--text-muted)]">تذكير قبيل غروب الشمس للقراءة</p>
            </button>

            <button
              onClick={() => handleBroadcast('ورد القرآن اليومي 📖', '«اقْرَأُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ» - حان وقت قراءة وردك اليومي.')}
              className="p-5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-right space-y-2 transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-[var(--gold-light)]">بث إشعار ورد القرآن 📖</h4>
              <p className="text-[10px] text-[var(--text-muted)]">تذكير بمتابعة قراءة الجزء أو الصفحة اليومية</p>
            </button>

            <button
              onClick={() => handleBroadcast('سورة الكهف يوم الجمعة 🕌', 'تذكير: قراءة سورة الكهف نور ما بين الجمعتين')}
              className="p-5 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-right space-y-2 transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-[var(--gold-light)]">بث إشعار سورة الكهف 🕌</h4>
              <p className="text-[10px] text-[var(--text-muted)]">تنبيه يوم الجمعة المباركة</p>
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL FOR STORY FORM --- */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--gold-light)]">
                {editingStory ? 'تعديل بيانات القصة' : 'إضافة قصة جديدة'}
              </h2>
              <button onClick={() => setShowStoryModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">عنوان القصة:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قصة يوسف عليه السلام"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الفئة:</label>
                  <select
                    value={storyCategory}
                    onChange={(e: any) => setStoryCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  >
                    <option value="prophets">قصص الأنبياء</option>
                    <option value="companions">قصص الصحابة</option>
                    <option value="quran">قصص القرآن</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">وصف مختصر:</label>
                <input
                  type="text"
                  placeholder="ملخص قصير للقصة..."
                  value={storyDescription}
                  onChange={(e) => setStoryDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">نص القصة الكامل:</label>
                <textarea
                  required
                  rows={5}
                  placeholder="أدخل النص التفصيلي الكامل للقصة..."
                  value={storyFull}
                  onChange={(e) => setStoryFull(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط صورة الغلاف:</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={storyImage}
                    onChange={(e) => setStoryImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط فيديو YouTube (اختياري):</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={storyYoutube}
                    onChange={(e) => setStoryYoutube(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الدروس والعبر (سطر لكل درس):</label>
                <textarea
                  rows={3}
                  placeholder="الصبر على البلاء&#10;حسن الظن بالله"
                  value={storyLessons}
                  onChange={(e) => setStoryLessons(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-[var(--text-muted)] hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] cursor-pointer"
                >
                  حفظ القصة 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR HADITH FORM --- */}
      {showHadithModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--gold-light)]">
                {editingHadith ? 'تعديل الحديث الشريف' : 'إضافة حديث جديد'}
              </h2>
              <button onClick={() => setShowHadithModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHadith} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الكتاب المصدر:</label>
                  <select
                    value={hadithBookId}
                    onChange={(e) => setHadithBookId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  >
                    {HADITH_BOOKS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الدرجة والتحقيق:</label>
                  <input
                    type="text"
                    placeholder="صحيح / متفق عليه"
                    value={hadithGrade}
                    onChange={(e) => setHadithGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">اسم الباب/الفصل:</label>
                  <input
                    type="text"
                    placeholder="كتاب الإيمان..."
                    value={hadithChapter}
                    onChange={(e) => setHadithChapter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الراوي:</label>
                  <input
                    type="text"
                    placeholder="عن عمر بن الخطاب رضي الله عنه"
                    value={hadithNarrator}
                    onChange={(e) => setHadithNarrator(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">نص الحديث الشريف:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="أدخل نص الحديث النبوي الشريف..."
                  value={hadithText}
                  onChange={(e) => setHadithText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none leading-relaxed font-['Amiri'] text-base"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHadithModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-[var(--text-muted)] hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] cursor-pointer"
                >
                  حفظ الحديث 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR RECITER FORM --- */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-[var(--border-color)] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--gold-light)]">
                {editingReciter ? 'تعديل بيانات القارئ' : 'إضافة قارئ جديد'}
              </h2>
              <button onClick={() => setShowReciterModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReciter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">اسم القارئ الكامل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عبد الباسط عبد الصمد"
                  value={reciterName}
                  onChange={(e) => setReciterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">الرواية وطريقة التلاوة:</label>
                <input
                  type="text"
                  placeholder="حفص عن عاصم (مجود)"
                  value={reciterRewaya}
                  onChange={(e) => setReciterRewaya(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط سيرفر الملفات الصوتية MP3:</label>
                <input
                  type="url"
                  required
                  placeholder="https://server7.mp3quran.net/basit/"
                  value={reciterServerUrl}
                  onChange={(e) => setReciterServerUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط الصورة الشخصية (اختياري):</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={reciterPhotoUrl}
                  onChange={(e) => setReciterPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReciterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-[var(--text-muted)] hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] cursor-pointer"
                >
                  حفظ القارئ 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR BOOK FORM --- */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-[var(--border-color)] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h2 className="text-lg font-bold text-[var(--gold-light)]">
                {editingBook ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد للمكتبة'}
              </h2>
              <button onClick={() => setShowBookModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">عنوان الكتاب:</label>
                  <input
                    type="text"
                    required
                    placeholder="تفسير الجلالين..."
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">المؤلف:</label>
                  <input
                    type="text"
                    required
                    placeholder="الإمام الحافظ..."
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">التصنيف الفقهي/العلمي:</label>
                  <select
                    value={bookCategory}
                    onChange={(e: any) => setBookCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  >
                    <option value="التفسير">التفسير</option>
                    <option value="الحديث">الحديث</option>
                    <option value="العقيدة">العقيدة</option>
                    <option value="الفقه">الفقه</option>
                    <option value="السيرة">السيرة</option>
                    <option value="اللغة العربية">اللغة العربية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">عدد الصفحات المقدر:</label>
                  <input
                    type="number"
                    value={bookPagesCount}
                    onChange={(e) => setBookPagesCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">وصف الكتاب ومحتواه:</label>
                <textarea
                  rows={3}
                  placeholder="نبذة عن فوائد وموضوع الكتاب..."
                  value={bookDescription}
                  onChange={(e) => setBookDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط صورة الغلاف:</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={bookCoverUrl}
                    onChange={(e) => setBookCoverUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--gold-light)] mb-1">رابط ملف PDF القراءة:</label>
                  <input
                    type="url"
                    placeholder="https://.../book.pdf"
                    value={bookPdfUrl}
                    onChange={(e) => setBookPdfUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-[var(--text-muted)] hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] cursor-pointer"
                >
                  حفظ الكتاب 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

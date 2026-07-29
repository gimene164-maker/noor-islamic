import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { NoorLogo } from './NoorLogo';
import {
  BookOpen,
  BookText,
  Bookmark,
  Compass,
  Heart,
  History,
  Layers,
  Library,
  Music,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Clock,
  Share2,
  Copy,
  Check,
  Headphones,
  Scroll,
  Award,
  BookMarked,
  Sun
} from 'lucide-react';

interface HomePageProps {
  onSelectPage: (page: PageId) => void;
  tasbihCount: number;
  onIncrementTasbih: () => void;
  onResetTasbih: () => void;
  lastReadData: any;
}

const DAILY_AYAH_QUOTES = [
  { text: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ', ref: 'سورة الإسراء — الآية 82' },
  { text: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', ref: 'سورة النور — الآية 35' },
  { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', ref: 'سورة البقرة — الآية 152' },
  { text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'سورة الشرح — الآية 6' },
  { text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', ref: 'سورة الطلاق — الآية 2-3' },
  { text: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', ref: 'سورة البقرة — الآية 186' }
];

const TASBIH_WORDS = ['سُبْحَانَ اللَّهِ', 'الْحَمْدُ لِلَّهِ', 'اللَّهُ أَكْبَرُ', 'لَا إِلَهَ إِلَّا اللَّهُ'];
const TASBIH_TARGETS = [33, 33, 34, 100];

export const HomePage: React.FC<HomePageProps> = ({
  onSelectPage,
  tasbihCount,
  onIncrementTasbih,
  onResetTasbih,
  lastReadData
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [tasbihWordIdx, setTasbihWordIdx] = useState(0);
  const [prayerTimes, setPrayerTimes] = useState<{ name: string; time: string; isNext: boolean }[]>([
    { name: 'الفجر', time: '04:25 ص', isNext: false },
    { name: 'الظهر', time: '12:05 م', isNext: false },
    { name: 'العصر', time: '03:35 م', isNext: true },
    { name: 'المغرب', time: '06:45 م', isNext: false },
    { name: 'العشاء', time: '08:15 م', isNext: false }
  ]);

  useEffect(() => {
    // Fetch live prayer times from Aladhan API if available
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.timings) {
          const t = data.data.timings;
          setPrayerTimes([
            { name: 'الفجر', time: t.Fajr, isNext: false },
            { name: 'الظهر', time: t.Dhuhr, isNext: false },
            { name: 'العصر', time: t.Asr, isNext: true },
            { name: 'المغرب', time: t.Maghrib, isNext: false },
            { name: 'العشاء', time: t.Isha, isNext: false }
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyQuote = () => {
    const q = DAILY_AYAH_QUOTES[quoteIndex];
    navigator.clipboard.writeText(`"${q.text}" - ${q.ref}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const currentQuote = DAILY_AYAH_QUOTES[quoteIndex];

  return (
    <div className="space-y-8 pb-20">
      
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#121212] p-8 md:p-12 text-center shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Emblem Showcase */}
        <div className="flex flex-col items-center justify-center mb-6">
          <NoorLogo size="xl" showSubtitle={false} className="mb-2 justify-center" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-semibold shadow-sm mt-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>﷽ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>
        </div>

        <h1 className="font-['Amiri'] text-4xl md:text-6xl font-bold text-[#F5F5F5] leading-tight mb-4 drop-shadow-md">
          مَرْحَبًا بِكَ فِي مَنَصَّةِ <span className="text-[#D4AF37] underline decoration-[#D4AF37]/40 underline-offset-8">نُور</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
          مرجعك الإسلامي الموثوق للقراءة، والتلاوة، والأذكار، والأحاديث، والتفاسير الميسرة بخط عالي الجودة وتصميم عصري لا مثيل له.
        </p>

        {/* Daily Changing Ayah Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto glass-panel rounded-3xl p-6 md:p-8 relative group border border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4 text-xs text-[#D4AF37] font-semibold">
            <span className="flex items-center gap-1.5 uppercase tracking-widest text-[11px]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              آية ودليل اليوم
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition border border-white/5"
                title="نسخ الآية"
              >
                {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setQuoteIndex((prev) => (prev + 1) % DAILY_AYAH_QUOTES.length)}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition border border-white/5"
                title="تغيير الآية"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="font-['Amiri'] text-2xl md:text-4xl text-[#F5F5F5] leading-loose my-4 drop-shadow-md">
            « {currentQuote.text} »
          </p>
          <span className="text-xs text-[var(--text-muted)] block text-left font-sans italic bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">
            {currentQuote.ref}
          </span>
        </motion.div>

        {/* Big Search Trigger */}
        <div className="mt-8 max-w-2xl mx-auto">
          <button
            onClick={() => onSelectPage('search')}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-[var(--bg-main)]/80 hover:bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--gold-light)] transition shadow-lg group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[var(--gold-primary)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">ابحث في القرآن، الأحاديث، الأذكار، التفاسير، الكتب...</span>
            </div>
            <span className="text-xs bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] px-3 py-1 rounded-xl font-bold">
              الباحث الشامل ↵
            </span>
          </button>
        </div>

      </motion.div>

      {/* Prayer Times Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--gold-primary)]" />
            <span>مواقيت الصلاة</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">(القاهرة، مصر)</span>
          </h2>
          <span className="text-xs text-[var(--gold-soft)] font-mono">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {prayerTimes.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl border text-center transition-all ${
                p.isNext
                  ? 'bg-gradient-to-b from-[var(--gold-primary)]/20 to-[var(--bg-card)] border-[var(--gold-primary)] shadow-lg shadow-[var(--gold-primary)]/10 scale-105'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)]'
              }`}
            >
              <span className="text-xs text-[var(--text-muted)] block mb-1 font-semibold">{p.name}</span>
              <span className="text-xl font-bold text-[var(--gold-light)] block font-mono">{p.time}</span>
              {p.isNext && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-[var(--gold-primary)] text-black text-[10px] font-bold">
                  الصلاة القادمة
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tasbih Counter & Streak Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Interactive Tasbih Counter */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 border border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[var(--gold-light)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--gold-primary)]" />
                المسبحة الرقمية والتسبيح
              </h3>
              <p className="text-xs text-[var(--text-muted)]">اضغط للعداد للزيادة وحفظ تسبيحاتك</p>
            </div>
            <button
              onClick={onResetTasbih}
              className="text-xs text-[var(--text-muted)] hover:text-red-400 underline"
            >
              إعادة العداد
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
            
            {/* Word Switcher Tabs */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              {TASBIH_WORDS.map((word, wIdx) => (
                <button
                  key={wIdx}
                  onClick={() => setTasbihWordIdx(wIdx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap text-right ${
                    tasbihWordIdx === wIdx
                      ? 'bg-[var(--gold-primary)] text-black shadow-md'
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Big Interactive Counter Ring */}
            <div className="text-center">
              <button
                onClick={onIncrementTasbih}
                className="w-36 h-36 rounded-full bg-gradient-to-br from-[var(--gold-primary)] to-[#806114] text-black font-bold flex flex-col items-center justify-center border-4 border-[var(--gold-light)] shadow-2xl shadow-[var(--gold-primary)]/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="text-4xl font-extrabold font-mono">{tasbihCount}</span>
                <span className="text-[10px] text-black/80 font-bold uppercase tracking-widest mt-1">
                  / {TASBIH_TARGETS[tasbihWordIdx]} تسبيحة
                </span>
              </button>
              <span className="text-xs text-[var(--gold-soft)] block mt-3 font-semibold">
                « {TASBIH_WORDS[tasbihWordIdx]} »
              </span>
            </div>

          </div>
        </div>

        {/* Quick Last Read Card */}
        <div className="glass-panel rounded-3xl p-6 border border-[var(--border-color)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-[var(--gold-light)] mb-4">
              <History className="w-5 h-5 text-[var(--gold-primary)]" />
              <span>آخر ما قرأت</span>
            </div>

            {lastReadData?.quran ? (
              <div className="bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
                <span className="text-xs bg-[var(--gold-primary)]/20 text-[var(--gold-primary)] px-2 py-0.5 rounded-md font-bold inline-block">
                  القرآن الكريم
                </span>
                <h4 className="text-base font-bold text-[var(--gold-light)]">
                  سورة {lastReadData.quran.surahName}
                </h4>
                <p className="text-xs text-[var(--text-muted)]">الآية رقم: {lastReadData.quran.ayahNum}</p>
                <button
                  onClick={() => onSelectPage('quran')}
                  className="w-full mt-2 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition"
                >
                  متابعة القراءة ↵
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-[var(--text-muted)]">لم تقم بحفظ أي قراءة بعد. ابدأ بقراءة القرآن الكريم الآن.</p>
                <button
                  onClick={() => onSelectPage('quran')}
                  className="px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition"
                >
                  افتح المصحف الشريف
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>الختمة الحالية: 12%</span>
            <span className="text-[var(--gold-primary)] font-bold">14 يوم متتالي 🔥</span>
          </div>
        </div>

      </div>

      {/* Main Sections Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h2 className="text-xl font-bold text-[var(--gold-light)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--gold-primary)]" />
            <span>أقسام المنصة الرئيسية والتفاعلية</span>
          </h2>
          <span className="text-xs text-[var(--gold-soft)] font-medium hidden sm:inline-block">
            اضغط على أي قسم للتصفح المباشر ✦
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {[
            { id: 'quran', title: 'القرآن الكريم', desc: '114 سورة كاملة بالخط العثماني وسهولة البحث والتعلم', tag: 'المصحف الشريف', icon: BookMarked, gradient: 'from-amber-500/15 via-yellow-600/5 to-transparent', accent: 'text-amber-500 font-bold', badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
            { id: 'tafsir', title: 'التفاسير الميسرة', desc: 'تفسير ابن كثير، السعدي، والقرطبي لكل الآيات', tag: '5 تفاسير معتمدة', icon: BookText, gradient: 'from-emerald-500/15 via-teal-600/5 to-transparent', accent: 'text-emerald-500 font-bold', badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
            { id: 'hadith', title: 'موسوعة الأحاديث', desc: 'البخاري ومسلم والكتب التسعة بالسند والدرجة', tag: '9 كتب صحيحة', icon: Scroll, gradient: 'from-cyan-500/15 via-blue-600/5 to-transparent', accent: 'text-cyan-500 font-bold', badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' },
            { id: 'stories', title: 'القصص الإسلامية', desc: 'أنبياء، صحابة، وقصص القرآن بالفيديو والنصوص', tag: 'تفاعل ووسائط', icon: Sparkles, gradient: 'from-purple-500/15 via-indigo-600/5 to-transparent', accent: 'text-purple-500 font-bold', badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' },
            { id: 'recitations', title: 'التلاوات العذبة', desc: 'الاستماع لكبار القراء مع التنزيل والمشغل الصوتي', tag: 'مشغل استماع', icon: Headphones, gradient: 'from-rose-500/15 via-pink-600/5 to-transparent', accent: 'text-rose-500 font-bold', badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' },
            { id: 'ruqya', title: 'الرقية الشرعية', desc: 'آيات وأدعية الرقية مكتوبة ومسموعة للحماية', tag: 'حصن وعلاج', icon: ShieldCheck, gradient: 'from-green-500/15 via-emerald-600/5 to-transparent', accent: 'text-green-500 font-bold', badgeBg: 'bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30' },
            { id: 'names', title: 'أسماء الله الحسنى', desc: '99 اسماً مباركاً مع المعاني والفضائل والدعاء بها', tag: 'شرح وتدبر', icon: Award, gradient: 'from-orange-500/15 via-amber-600/5 to-transparent', accent: 'text-orange-500 font-bold', badgeBg: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30' },
            { id: 'azkar', title: 'الأذكار اليومية', desc: 'أذكار الصباح والمساء والنوم مع العداد التلقائي', tag: 'عداد تفاعلي', icon: Sun, gradient: 'from-yellow-500/15 via-amber-600/5 to-transparent', accent: 'text-yellow-600 dark:text-yellow-400 font-bold', badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30' },
            { id: 'duas', title: 'الأدعية المأثورة', desc: 'مجموعة أدعية شاملة من الكتاب والسنة الشريفة', tag: 'جامع الدعاء', icon: Heart, gradient: 'from-red-500/15 via-pink-600/5 to-transparent', accent: 'text-red-500 font-bold', badgeBg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30' },
            { id: 'library', title: 'المكتبة الإسلامية', desc: 'كتب التفسير والفقه والسيرة مع قارئ PDF مدمج', tag: 'قراءة وتنزيل', icon: Library, gradient: 'from-indigo-500/15 via-violet-600/5 to-transparent', accent: 'text-indigo-500 font-bold', badgeBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
            { id: 'sira', title: 'السيرة النبوية', desc: 'الخط الزمني التفاعلي لحياة النبي ﷺ', tag: 'مخطط زمني', icon: History, gradient: 'from-teal-500/15 via-emerald-600/5 to-transparent', accent: 'text-teal-500 font-bold', badgeBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30' },
            { id: 'qibla', title: 'اتجاه القبلة', desc: 'بوصلة دقيقة ومباشرة لتحديد اتجاه الكعبة', tag: 'بوصلة حية', icon: Compass, gradient: 'from-amber-500/15 via-yellow-600/5 to-transparent', accent: 'text-amber-500 font-bold', badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
          ].map((sec, i) => {
            const IconComp = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.03 * i + 0.15 }}
                whileHover={{
                  y: -8,
                  scale: 1.035,
                  boxShadow: '0 20px 35px -10px rgba(212, 175, 55, 0.28), 0 10px 20px -5px rgba(0, 0, 0, 0.4)',
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectPage(sec.id as PageId)}
                className={`relative overflow-hidden p-6 rounded-3xl glass-panel hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition-colors duration-300 cursor-pointer group shadow-xl flex flex-col justify-between space-y-4`}
              >
                {/* Background Tint Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sec.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                {/* Decorative Star Accent */}
                <div className="absolute top-2 left-2 text-[var(--gold-primary)]/15 group-hover:text-[var(--gold-primary)]/40 text-2xl font-['Amiri'] select-none transition-colors">
                  ۞
                </div>

                <div className="relative z-10 space-y-3">
                  {/* Top Bar: Circular Icon Container + Badge Tag */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      {/* Soft Circular Backdrop Halo */}
                      <div className="absolute inset-0 rounded-full bg-[var(--gold-primary)]/15 blur-md group-hover:bg-[var(--gold-primary)]/30 transition-all" />
                      
                      {/* Circular Icon Circle */}
                      <div className={`relative w-12 h-12 rounded-full bg-[var(--bg-main)]/80 backdrop-blur-md border border-[var(--border-color)] group-hover:border-[var(--gold-primary)]/60 flex items-center justify-center ${sec.accent} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                        <IconComp className="w-6 h-6 stroke-[1.5]" />
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${sec.badgeBg} backdrop-blur-md`}>
                      {sec.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[var(--gold-light)] group-hover:text-[var(--gold-primary)] transition-colors mb-1">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="relative z-10 pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs text-[var(--text-muted)] group-hover:text-[var(--gold-light)] transition-colors">
                  <span className="font-semibold text-[11px]">تصفح القسم</span>
                  <span className="w-6 h-6 rounded-full bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] flex items-center justify-center group-hover:bg-[var(--gold-primary)] group-hover:text-black transition-all">
                    ←
                  </span>
                </div>
              </motion.div>
            );
          })}

        </div>
      </motion.div>

    </div>
  );
};

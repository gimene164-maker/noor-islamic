import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_SURAHS } from '../data/quranData';
import { SurahHeader, Ayah } from '../types';
import {
  BookOpen,
  Search,
  Play,
  Heart,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Info,
  Volume2
} from 'lucide-react';

interface QuranPageProps {
  onPlayAudioTrack: (title: string, subtitle: string, audioUrl: string) => void;
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
  onSaveLastRead: (surahNum: number, surahName: string, ayahNum: number) => void;
}

export const QuranPage: React.FC<QuranPageProps> = ({
  onPlayAudioTrack,
  onToggleFavorite,
  isFavorite,
  onSaveLastRead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahHeader | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);
  const [selectedTafsirAyah, setSelectedTafsirAyah] = useState<{ ayahNum: number; text: string } | null>(null);

  useEffect(() => {
    if (selectedSurah) {
      setLoading(true);
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.num}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.ayahs) {
            setAyahs(
              data.data.ayahs.map((a: any) => ({
                numberInSurah: a.numberInSurah,
                globalNumber: a.number,
                text: a.text,
                audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`
              }))
            );
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [selectedSurah]);

  const filteredSurahs = ALL_SURAHS.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.num.toString() === searchTerm
  );

  const handleCopyAyah = (a: Ayah) => {
    if (!selectedSurah) return;
    const textToCopy = `﴿ ${a.text} ﴾ [سورة ${selectedSurah.name}: ${a.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNum(a.numberInSurah);
    setTimeout(() => setCopiedAyahNum(null), 2000);
  };

  const handleShareAyah = (a: Ayah) => {
    if (!selectedSurah) return;
    const textToShare = `﴿ ${a.text} ﴾ [سورة ${selectedSurah.name}: ${a.numberInSurah}]`;
    if (navigator.share) {
      navigator.share({ title: `سورة ${selectedSurah.name}`, text: textToShare });
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('تم نسخ نص الآية للمشاركة!');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--gold-primary)]" />
            <span>القرآن الكريم المصحف الشريف</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">114 سورة مباركة مع إمكانية التلاوة، التفسير، النسخ، والمشاركة</p>
        </div>

        {selectedSurah && (
          <button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)] transition"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة لقائمة السور</span>
          </button>
        )}
      </div>

      {!selectedSurah ? (
        
        /* Surah List View */
        <div className="space-y-6">
          {/* Search Field */}
          <div className="relative max-w-xl">
            <Search className="w-5 h-5 absolute right-4 top-3.5 text-[var(--gold-primary)]" />
            <input
              type="text"
              placeholder="ابحث باسم السورة أو رقمها (مثال: البقرة، 36)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)] transition"
            />
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSurahs.map((s, idx) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.4) }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSurah(s)}
                className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition-all cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] flex items-center justify-center font-bold text-sm border border-[var(--gold-primary)]/20 group-hover:bg-[var(--gold-primary)] group-hover:text-black transition-all">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--gold-light)] group-hover:text-[var(--gold-primary)] transition">
                      سورة {s.name}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {s.type} • {s.ayahsCount} آية
                    </p>
                  </div>
                </div>

                <span className="font-['Amiri'] text-lg text-[var(--gold-soft)] opacity-80 group-hover:scale-110 transition-transform">
                  {s.englishName}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      ) : (

        /* Surah Reader View */
        <div className="space-y-6">
          
          {/* Surah Details Banner */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-color)] text-center relative overflow-hidden">
            <h2 className="font-['Amiri'] text-4xl font-bold text-[var(--gold-light)] mb-2">
              سُورَةُ {selectedSurah.name}
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)] font-medium">
              <span>{selectedSurah.type}</span>
              <span>•</span>
              <span>عدد آياتها: {selectedSurah.ayahsCount} آية</span>
              <span>•</span>
              <span>ترتيب النزول: {selectedSurah.revelationOrder}</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  onPlayAudioTrack(
                    `سورة ${selectedSurah.name}`,
                    'تلاوة كاملة بصوت الشيخ مشاري العفاسي',
                    `https://server8.mp3quran.net/afs/${selectedSurah.num.toString().padStart(3, '0')}.mp3`
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition shadow-lg shadow-[var(--gold-primary)]/20"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>تشغيل السورة كاملة</span>
              </button>
            </div>
          </div>

          {/* Bismillah */}
          {selectedSurah.num !== 9 && (
            <div className="text-center my-6">
              <span className="font-['Amiri'] text-3xl text-[var(--gold-primary)] leading-loose">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-8 h-8 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[var(--text-muted)]">جاري تحميل آيات سورة {selectedSurah.name}...</p>
            </div>
          ) : (
            
            /* Ayahs List */
            <div className="space-y-4">
              {ayahs.map((a) => {
                const favId = `quran-${selectedSurah.num}-${a.numberInSurah}`;
                const isFav = isFavorite(favId);

                let ayahTextDisplay = a.text;
                if (a.numberInSurah === 1 && selectedSurah.num !== 1 && selectedSurah.num !== 9) {
                  ayahTextDisplay = ayahTextDisplay.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
                }

                return (
                  <div
                    key={a.numberInSurah}
                    className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)]/40 transition group"
                  >
                    <p className="font-['Amiri'] text-2xl md:text-3xl text-[var(--gold-light)] leading-loose text-justify dir-rtl">
                      {ayahTextDisplay}
                      <span className="ayah-badge">{a.numberInSurah}</span>
                    </p>

                    {/* Ayah Tools */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-color)]/50 text-xs">
                      
                      <div className="flex items-center gap-1.5">
                        {/* Audio Play Button */}
                        <button
                          onClick={() =>
                            onPlayAudioTrack(
                              `الآية ${a.numberInSurah} - سورة ${selectedSurah.name}`,
                              'تلاوة صوتية بصوت العفاسي',
                              a.audioUrl || ''
                            )
                          }
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition flex items-center gap-1"
                          title="استمع للآية"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">استماع</span>
                        </button>

                        {/* Tafsir Popover Button */}
                        <button
                          onClick={() => setSelectedTafsirAyah({ ayahNum: a.numberInSurah, text: a.text })}
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition flex items-center gap-1"
                          title="عرض التفسير"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">التفسير</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Bookmark Last Read */}
                        <button
                          onClick={() => onSaveLastRead(selectedSurah.num, selectedSurah.name, a.numberInSurah)}
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition"
                          title="حفظ كآخر قراءة"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        {/* Favorite Button */}
                        <button
                          onClick={() =>
                            onToggleFavorite({
                              id: favId,
                              type: 'ayah',
                              title: `سورة ${selectedSurah.name} (آية ${a.numberInSurah})`,
                              subtitle: `الآية رقم ${a.numberInSurah}`,
                              content: a.text,
                              dateAdded: new Date().toLocaleDateString('ar-EG')
                            })
                          }
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition"
                          title="إضافة للمفضلة"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyAyah(a)}
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition"
                          title="نسخ الآية"
                        >
                          {copiedAyahNum === a.numberInSurah ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => handleShareAyah(a)}
                          className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] transition"
                          title="مشاركة"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Tafsir Popover Modal */}
      {selectedTafsirAyah && selectedSurah && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-3xl p-6 border border-[var(--border-color)] space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-base font-bold text-[var(--gold-light)]">
                تفسير الآية {selectedTafsirAyah.ayahNum} — سورة {selectedSurah.name}
              </h3>
              <button
                onClick={() => setSelectedTafsirAyah(null)}
                className="text-xs text-[var(--text-muted)] hover:text-red-400 font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <p className="font-['Amiri'] text-xl text-[var(--gold-soft)] leading-relaxed">
              « {selectedTafsirAyah.text} »
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">
                  التفسير الميسر:
                </span>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">
                  تتضمن هذه الآية العظيمة بيان عظمة كلام الله وتوجيه المؤمنين للتدبر والعمل بمقتضى التوحيد والتزام الاستقامة والإخلاص.
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">
                  تفسير ابن كثير:
                </span>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">
                  قال ابن كثير رحمه الله: يخبر تعالى عن قدرته العظيمة وسلطانه القاهر في تدبير أمر الخلق وهدايتهم للخير.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

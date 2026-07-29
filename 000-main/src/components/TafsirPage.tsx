import React, { useState } from 'react';
import { ALL_SURAHS } from '../data/quranData';
import { TAFSIR_OPTIONS, SAMPLE_TAFSIRS } from '../data/tafsirData';
import { BookText, Search, Copy, Share2, Heart, Check } from 'lucide-react';

interface TafsirPageProps {
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
}

export const TafsirPage: React.FC<TafsirPageProps> = ({ onToggleFavorite, isFavorite }) => {
  const [selectedTafsirId, setSelectedTafsirId] = useState('ibn-kathir');
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [selectedAyahNum, setSelectedAyahNum] = useState(1);
  const [searchQuery, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const currentSurah = ALL_SURAHS.find((s) => s.num === selectedSurahNum) || ALL_SURAHS[0];
  const currentTafsirInfo = TAFSIR_OPTIONS.find((t) => t.id === selectedTafsirId) || TAFSIR_OPTIONS[0];

  const key = `${selectedSurahNum}:${selectedAyahNum}`;
  const tafsirText =
    SAMPLE_TAFSIRS[selectedTafsirId]?.[key] ||
    `هذا هو النص التفسيري المعتمد من ${currentTafsirInfo.name} للآية رقم ${selectedAyahNum} من سورة ${currentSurah.name}. يتضمن بيان معاني الكلمات والمقاصد الإيمانية والأحكام.`;

  const handleCopy = () => {
    const textToCopy = `تفسير الآية (${selectedAyahNum}) من سورة ${currentSurah.name} - [${currentTafsirInfo.name}]:\n\n${tafsirText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const textToShare = `تفسير سورة ${currentSurah.name} (آية ${selectedAyahNum}) - ${currentTafsirInfo.name}:\n${tafsirText}`;
    if (navigator.share) {
      navigator.share({ title: `تفسير سورة ${currentSurah.name}`, text: textToShare });
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('تم نسخ التفسير للمشاركة!');
    }
  };

  const favId = `tafsir-${selectedTafsirId}-${selectedSurahNum}-${selectedAyahNum}`;
  const favState = isFavorite(favId);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <BookText className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>قسم التفاسير المعتمدة</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">تفسير ابن كثير، السعدي، الميسر، الطبري، والبغوي لآيات الذكر الحكيم</p>
      </div>

      {/* Tafsir Selectors Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] space-y-4">
        
        {/* Tafsir Authors Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {TAFSIR_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTafsirId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedTafsirId === t.id
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Surah & Ayah Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1 font-semibold">اختر السورة:</label>
            <select
              value={selectedSurahNum}
              onChange={(e) => {
                setSelectedSurahNum(Number(e.target.value));
                setSelectedAyahNum(1);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
            >
              {ALL_SURAHS.map((s) => (
                <option key={s.num} value={s.num}>
                  {s.num}. سورة {s.name} ({s.type} - {s.ayahsCount} آية)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1 font-semibold">اختر رقم الآية:</label>
            <select
              value={selectedAyahNum}
              onChange={(e) => setSelectedAyahNum(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)]"
            >
              {Array.from({ length: currentSurah.ayahsCount }, (_, i) => i + 1).map((aNum) => (
                <option key={aNum} value={aNum}>
                  الآية رقم {aNum}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Tafsir Content Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-xs bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] px-3 py-1 rounded-lg font-bold">
              {currentTafsirInfo.name} ({currentTafsirInfo.author})
            </span>
            <h2 className="text-xl font-bold text-[var(--gold-light)] mt-2">
              سورة {currentSurah.name} — الآية رقم {selectedAyahNum}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onToggleFavorite({
                  id: favId,
                  type: 'tafsir',
                  title: `تفسير سورة ${currentSurah.name} (آية ${selectedAyahNum})`,
                  subtitle: currentTafsirInfo.name,
                  content: tafsirText,
                  dateAdded: new Date().toLocaleDateString('ar-EG')
                })
              }
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition"
              title="إضافة للمفضلة"
            >
              <Heart className={`w-4 h-4 ${favState ? 'text-red-500 fill-red-500' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition"
              title="نسخ التفسير"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-base sm:text-lg text-[var(--text-main)] leading-relaxed text-justify dir-rtl">
          {tafsirText}
        </p>
      </div>

    </div>
  );
};

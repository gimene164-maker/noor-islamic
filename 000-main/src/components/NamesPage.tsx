import React, { useState } from 'react';
import { ALL_99_NAMES } from '../data/namesOfAllahData';
import { NameOfAllah } from '../types';
import { UserCheck, Search, Heart, Copy, Share2, Check, Sparkles } from 'lucide-react';

interface NamesPageProps {
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
}

export const NamesPage: React.FC<NamesPageProps> = ({ onToggleFavorite, isFavorite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredNames = ALL_99_NAMES.filter(
    (n) => n.name.includes(searchQuery) || n.meaning.includes(searchQuery)
  );

  const handleCopy = (n: NameOfAllah) => {
    const textToCopy = `اسم الله الحسنى: [${n.name}]\nالمعنى: ${n.meaning}\nالشرح: ${n.explanation}\nدليل القرآن: ${n.quranProof}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (n: NameOfAllah) => {
    const textToShare = `اسم الله الحسنى [${n.name}]: ${n.meaning}`;
    if (navigator.share) {
      navigator.share({ title: `اسم الله الحسنى: ${n.name}`, text: textToShare });
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('تم النسخ للمشاركة!');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>أسماء الله الحسنى المباركة ومعانيها</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          قال رسول الله ﷺ: «إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلاَّ وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-[var(--gold-primary)]" />
        <input
          type="text"
          placeholder="ابحث باسم أو معنى من أسماء الله الحسنى..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)] transition"
        />
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredNames.map((n) => {
          const favId = `name-${n.number}`;
          const isFav = isFavorite(favId);

          return (
            <div
              key={n.number}
              onClick={() => setSelectedName(n)}
              className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition duration-300 cursor-pointer text-center group relative overflow-hidden shadow-sm"
            >
              <span className="absolute top-2 right-2 text-[10px] font-bold text-[var(--gold-soft)] opacity-60 font-mono">
                #{n.number}
              </span>

              <h3 className="font-['Amiri'] text-3xl font-bold text-[var(--gold-light)] group-hover:scale-110 transition-transform my-2">
                {n.name}
              </h3>

              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {n.meaning}
              </p>
            </div>
          );
        })}
      </div>

      {/* Name Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="text-xs font-bold text-[var(--gold-primary)] font-mono">
                الاسم #{selectedName.number} من أسماء الله الحسنى
              </span>
              <button
                onClick={() => setSelectedName(null)}
                className="text-xs text-[var(--text-muted)] hover:text-red-400 font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-['Amiri'] text-5xl font-extrabold text-[var(--gold-light)]">
                {selectedName.name}
              </h2>
              <p className="text-xs text-[var(--gold-soft)] font-mono uppercase tracking-widest">
                {selectedName.transliteration}
              </p>
            </div>

            {/* Meaning & Explanation */}
            <div className="space-y-4">
              <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">المعنى العام:</span>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">{selectedName.meaning}</p>
              </div>

              <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">الشرح والتفصيل:</span>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">{selectedName.explanation}</p>
              </div>

              {selectedName.quranProof && (
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">الدليل من القرآن الكريم:</span>
                  <p className="font-['Amiri'] text-lg text-[var(--gold-light)]">{selectedName.quranProof}</p>
                </div>
              )}

              {selectedName.sunnahProof && (
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--gold-primary)] block mb-1">الدليل من السنة النبوية:</span>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">{selectedName.sunnahProof}</p>
                </div>
              )}

              {selectedName.benefits && (
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">الفوائد والآثار الإيمانية:</span>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">{selectedName.benefits}</p>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
              <button
                onClick={() =>
                  onToggleFavorite({
                    id: `name-${selectedName.number}`,
                    type: 'name',
                    title: `اسم الله الحسنى: ${selectedName.name}`,
                    subtitle: selectedName.transliteration,
                    content: selectedName.meaning,
                    dateAdded: new Date().toLocaleDateString('ar-EG')
                  })
                }
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-soft)] transition"
                title="إضافة للمفضلة"
              >
                <Heart className={`w-4 h-4 ${isFavorite(`name-${selectedName.number}`) ? 'text-red-500 fill-red-500' : ''}`} />
              </button>

              <button
                onClick={() => handleCopy(selectedName)}
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-soft)] transition"
                title="نسخ التفاصيل"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleShare(selectedName)}
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] text-[var(--gold-soft)] transition"
                title="مشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

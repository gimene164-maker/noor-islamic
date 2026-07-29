import React, { useState } from 'react';
import { HADITH_BOOKS_LIST, ALL_HADITHS } from '../data/hadithData';
import { HadithItem } from '../types';
import { Layers, Search, Copy, Share2, Heart, Check, BookOpen } from 'lucide-react';

interface HadithPageProps {
  hadiths?: HadithItem[];
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
}

export const HadithPage: React.FC<HadithPageProps> = ({ hadiths = ALL_HADITHS, onToggleFavorite, isFavorite }) => {
  const [selectedBookId, setSelectedBookId] = useState('bukhari');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedBookInfo = HADITH_BOOKS_LIST.find((b) => b.id === selectedBookId) || HADITH_BOOKS_LIST[0];

  const filteredHadiths = hadiths.filter((h) => {
    const matchesBook = h.bookId === selectedBookId;
    const matchesSearch =
      searchQuery === '' ||
      h.text.includes(searchQuery) ||
      h.narrator.includes(searchQuery) ||
      h.chapter.includes(searchQuery);
    return matchesBook && matchesSearch;
  });

  const handleCopy = (h: any) => {
    const textToCopy = `[${h.bookName} - ${h.chapter}]:\n${h.narrator}\n\n« ${h.text} »\n\nدرجة الحديث: ${h.grade || 'معتمد'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (h: any) => {
    const textToShare = `حديث من ${h.bookName}:\n« ${h.text} »`;
    if (navigator.share) {
      navigator.share({ title: h.bookName, text: textToShare });
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('تم نسخ الحديث للمشاركة!');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <Layers className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>موسوعة الأحاديث النبوية الشريفة</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          كتب السنة التسعة المعتمدة: البخاري، مسلم، الترمذي، أبو داود، النسائي، ابن ماجه، الموطأ، النووية، ورياض الصالحين
        </p>
      </div>

      {/* Book Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {HADITH_BOOKS_LIST.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBookId(b.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              selectedBookId === b.id
                ? 'bg-[var(--gold-primary)] text-black shadow-lg shadow-[var(--gold-primary)]/20'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-[var(--gold-primary)]" />
        <input
          type="text"
          placeholder={`ابحث في كتاب ${selectedBookInfo.name}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)] transition"
        />
      </div>

      {/* Hadiths List */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-muted)]">لا توجد أحاديث مطابقة للبحث حالياً في هذا الكتاب.</p>
          </div>
        ) : (
          filteredHadiths.map((h) => {
            const isFav = isFavorite(h.id);

            return (
              <div
                key={h.id}
                className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)]/40 transition space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] px-2.5 py-1 rounded-md">
                      {h.chapter}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono"># {h.number}</span>
                  </div>

                  {h.grade && (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {h.grade}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--gold-soft)] font-semibold">{h.narrator}</p>

                <p className="font-['Amiri'] text-xl sm:text-2xl text-[var(--gold-light)] leading-relaxed dir-rtl text-justify">
                  « {h.text} »
                </p>

                {/* Hadith Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 text-xs">
                  <button
                    onClick={() =>
                      onToggleFavorite({
                        id: h.id,
                        type: 'hadith',
                        title: `${h.bookName} - ${h.chapter}`,
                        subtitle: h.narrator,
                        content: h.text,
                        dateAdded: new Date().toLocaleDateString('ar-EG')
                      })
                    }
                    className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                    title="المفضلة"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(h)}
                    className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                    title="نسخ الحديث"
                  >
                    {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleShare(h)}
                    className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                    title="مشاركة"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

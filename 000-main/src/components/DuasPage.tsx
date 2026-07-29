import React, { useState } from 'react';
import { DUA_CATEGORIES, ALL_DUAS } from '../data/duasData';
import { Heart, Search, Copy, Share2, Check } from 'lucide-react';

interface DuasPageProps {
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
}

export const DuasPage: React.FC<DuasPageProps> = ({ onToggleFavorite, isFavorite }) => {
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = ALL_DUAS.filter((d) => {
    const matchesCategory = selectedCatId === 'all' || d.category === selectedCatId;
    const matchesSearch =
      searchQuery === '' ||
      d.text.includes(searchQuery) ||
      d.title.includes(searchQuery) ||
      d.reference.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (d: any) => {
    const textToCopy = `[${d.title}]:\n« ${d.text} »\nالمصدر: ${d.reference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (d: any) => {
    const textToShare = `دعاء [${d.title}]:\n« ${d.text} »`;
    if (navigator.share) {
      navigator.share({ title: d.title, text: textToShare });
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
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span>موسوعة الأدعية الجامية من القرآن والسنة</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">أدعية الأنبياء، أدعية القرآن الكريم، أدعية الكرب والرزق والشفاء</p>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCatId === cat.id
                ? 'bg-[var(--gold-primary)] text-black shadow-md'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-[var(--gold-primary)]" />
        <input
          type="text"
          placeholder="ابحث في الأدعية..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)] transition"
        />
      </div>

      {/* Duas List */}
      <div className="space-y-4">
        {filteredDuas.map((d) => {
          const isFav = isFavorite(d.id);

          return (
            <div
              key={d.id}
              className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)]/40 transition space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2">
                <h3 className="text-base font-bold text-[var(--gold-light)]">{d.title}</h3>
                <span className="text-[10px] text-[var(--gold-soft)] bg-[var(--gold-primary)]/10 px-2 py-0.5 rounded-md font-semibold">
                  {d.reference}
                </span>
              </div>

              <p className="font-['Amiri'] text-xl sm:text-2xl text-[var(--gold-light)] leading-relaxed dir-rtl text-justify">
                « {d.text} »
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]/30 text-xs">
                <button
                  onClick={() =>
                    onToggleFavorite({
                      id: d.id,
                      type: 'dua',
                      title: d.title,
                      subtitle: d.reference,
                      content: d.text,
                      dateAdded: new Date().toLocaleDateString('ar-EG')
                    })
                  }
                  className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                  title="المفضلة"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => handleCopy(d)}
                  className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                  title="نسخ الدعاء"
                >
                  {copiedId === d.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleShare(d)}
                  className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                  title="مشاركة"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

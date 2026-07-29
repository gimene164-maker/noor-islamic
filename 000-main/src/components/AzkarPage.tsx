import React, { useState } from 'react';
import { AZKAR_CATEGORIES } from '../data/azkarData';
import { Sparkles, CheckCircle2, RotateCw, Copy, Check } from 'lucide-react';

export const AzkarPage: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState('morning');
  const [progressState, setProgressState] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCat = AZKAR_CATEGORIES.find((c) => c.id === selectedCatId) || AZKAR_CATEGORIES[0];

  const handleIncrement = (itemId: string, targetCount: number) => {
    const current = progressState[itemId] || 0;
    if (current < targetCount) {
      if (navigator.vibrate) navigator.vibrate(30);
      setProgressState({ ...progressState, [itemId]: current + 1 });
    }
  };

  const handleResetCategory = () => {
    const updated = { ...progressState };
    currentCat.items.forEach((item) => {
      delete updated[item.id];
    });
    setProgressState(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>حصن المسلم والأذكار اليومية</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">أذكار الصباح والمساء والنوم والصلوات مع عداد تكرار تفاعلي</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {AZKAR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCatId === cat.id
                ? 'bg-[var(--gold-primary)] text-black shadow-lg shadow-[var(--gold-primary)]/20'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Reset Category Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--gold-light)]">{currentCat.title}</h2>
        <button
          onClick={handleResetCategory}
          className="text-xs text-[var(--text-muted)] hover:text-red-400 flex items-center gap-1 font-semibold"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>إعادة ضبط العدادات</span>
        </button>
      </div>

      {/* Azkar Items List */}
      <div className="space-y-4">
        {currentCat.items.map((item) => {
          const currentCount = progressState[item.id] || 0;
          const isDone = currentCount >= item.count;

          return (
            <div
              key={item.id}
              className={`glass-panel p-6 rounded-2xl border transition space-y-4 ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-[var(--border-color)] hover:border-[var(--gold-primary)]/40'
              }`}
            >
              <p className="font-['Amiri'] text-xl sm:text-2xl text-[var(--gold-light)] leading-relaxed dir-rtl text-justify">
                {item.text}
              </p>

              {item.reward && (
                <div className="bg-[var(--bg-main)]/60 p-2.5 rounded-xl border border-[var(--border-color)]/50 text-[11px] text-[var(--gold-soft)] font-medium">
                  ✨ الفضل والبركة: {item.reward}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]/40 text-xs">
                
                {/* Counter Button */}
                <button
                  onClick={() => handleIncrement(item.id, item.count)}
                  disabled={isDone}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                    isDone
                      ? 'bg-emerald-500 text-black cursor-default'
                      : 'bg-[var(--gold-primary)] text-black hover:scale-105 active:scale-95'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم بحمد الله ({item.count}/{item.count})</span>
                    </>
                  ) : (
                    <span>اضغط للتكرار ({currentCount} / {item.count})</span>
                  )}
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(item.text, item.id)}
                  className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                  title="نسخ الذكر"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

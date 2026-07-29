import React, { useState } from 'react';
import { WRITTEN_RUQYA, AUDIO_RUQYA_LIST } from '../data/ruqyaData';
import { ShieldCheck, Play, Download, Share2, Copy, Check, CheckCircle2 } from 'lucide-react';

interface RuqyaPageProps {
  onPlayAudioTrack: (title: string, subtitle: string, audioUrl: string) => void;
}

export const RuqyaPage: React.FC<RuqyaPageProps> = ({ onPlayAudioTrack }) => {
  const [activeTab, setActiveTab] = useState<'written' | 'audio'>('written');
  const [selectedCategory, setSelectedCategory] = useState<string>('eye');
  const [readProgress, setReadProgress] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentWritten = WRITTEN_RUQYA.find((r) => r.category === selectedCategory) || WRITTEN_RUQYA[0];

  const handleIncrementRead = (vKey: string, maxCount: number) => {
    const current = readProgress[vKey] || 0;
    if (current < maxCount) {
      setReadProgress({ ...readProgress, [vKey]: current + 1 });
    }
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
          <ShieldCheck className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>الرقية الشرعية المباركة (مكتوبة وصوتية)</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">حصن نفسك وأهل بيتك بآيات كتاب الله والأدعية المأثورة للشفاء والتحصين</p>
      </div>

      {/* Mode Tabs: Written vs Audio */}
      <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] max-w-sm">
        <button
          onClick={() => setActiveTab('written')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'written'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          رقية مكتوبة 📖
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'audio'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          رقية صوتية 🔊
        </button>
      </div>

      {activeTab === 'written' ? (
        
        /* Written Ruqya */
        <div className="space-y-6">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {WRITTEN_RUQYA.map((r) => (
              <button
                key={r.category}
                onClick={() => setSelectedCategory(r.category)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === r.category
                    ? 'bg-[var(--gold-primary)] text-black shadow-md'
                    : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {r.categoryLabel}
              </button>
            ))}
          </div>

          {/* Verses Container */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--gold-light)] mb-2">
              {currentWritten.title}
            </h2>

            {currentWritten.verses.map((v, idx) => {
              const vKey = `${selectedCategory}-${idx}`;
              const countRead = readProgress[vKey] || 0;
              const isCompleted = countRead >= v.count;

              return (
                <div
                  key={vKey}
                  className={`glass-panel p-6 rounded-2xl border transition space-y-4 ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-[var(--border-color)] hover:border-[var(--gold-primary)]/40'
                  }`}
                >
                  <p className="font-['Amiri'] text-xl sm:text-2xl text-[var(--gold-light)] leading-relaxed text-justify dir-rtl">
                    {v.text}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]/40 text-xs">
                    
                    {/* Interactive Count Button */}
                    <button
                      onClick={() => handleIncrementRead(vKey, v.count)}
                      disabled={isCompleted}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        isCompleted
                          ? 'bg-emerald-500 text-black cursor-default'
                          : 'bg-[var(--gold-primary)] text-black hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم القراءة ({v.count}/{v.count})</span>
                        </>
                      ) : (
                        <span>اقرأ وكرر ({countRead} / {v.count})</span>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(v.text, vKey)}
                      className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--gold-primary)]/20 text-[var(--gold-soft)] border border-[var(--border-color)] transition"
                      title="نسخ الآية"
                    >
                      {copiedId === vKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      ) : (

        /* Audio Ruqya List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AUDIO_RUQYA_LIST.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    onPlayAudioTrack(
                      item.title,
                      `بصوت ${item.reciter} (${item.duration})`,
                      item.audioUrl
                    )
                  }
                  className="w-12 h-12 rounded-2xl bg-[var(--gold-primary)] text-black flex items-center justify-center font-bold hover:scale-105 transition shadow-lg shadow-[var(--gold-primary)]/20"
                >
                  <Play className="w-5 h-5 fill-black mr-0.5" />
                </button>

                <div>
                  <h3 className="text-sm font-bold text-[var(--gold-light)]">{item.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{item.reciter}</p>
                  <span className="text-[10px] text-[var(--gold-soft)] font-mono">{item.duration}</span>
                </div>
              </div>

              <a
                href={item.audioUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition"
                title="تحميل المقطع"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

      )}

    </div>
  );
};

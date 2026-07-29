import React, { useState } from 'react';
import { RECITERS_LIST } from '../data/recitersData';
import { ALL_SURAHS } from '../data/quranData';
import { Reciter } from '../types';
import { Music, Play, Search, Download, Check } from 'lucide-react';

interface RecitationsPageProps {
  reciters?: Reciter[];
  onPlayAudioTrack: (title: string, subtitle: string, audioUrl: string) => void;
}

export const RecitationsPage: React.FC<RecitationsPageProps> = ({ reciters = RECITERS_LIST, onPlayAudioTrack }) => {
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(reciters[0] || RECITERS_LIST[0]);
  const [searchReciter, setSearchReciter] = useState('');
  const [searchSurah, setSearchSurah] = useState('');

  const filteredReciters = reciters.filter((r) => r.name.includes(searchReciter));
  const filteredSurahs = ALL_SURAHS.filter((s) => s.name.includes(searchSurah) || s.num.toString() === searchSurah);

  const getAudioUrl = (reciterServer: string, surahNum: number) => {
    const formattedNum = surahNum.toString().padStart(3, '0');
    return `${reciterServer}${formattedNum}.mp3`;
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <Music className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>المكتبة الصوتية والتلاوات المباركة</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">استمع إلى القرآن الكريم كاملاً بصوت أشهر القراء في العالم الإسلامي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reciters List Sidebar */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--gold-light)]">اختر القارئ:</h2>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--gold-primary)]" />
            <input
              type="text"
              placeholder="ابحث عن قارئ..."
              value={searchReciter}
              onChange={(e) => setSearchReciter(e.target.value)}
              className="w-full pr-10 pl-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredReciters.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReciter(r)}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                  selectedReciter.id === r.id
                    ? 'bg-[var(--gold-primary)] text-black border-[var(--gold-primary)] font-bold shadow-md'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--bg-main)]/30 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                  {r.photoUrl ? (
                    <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🎙️</span>
                  )}
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold truncate">{r.name}</h3>
                  <p className="text-[10px] opacity-80 truncate">{r.rewaya}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surahs List for Selected Reciter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">القارئ المحدد:</span>
              <h2 className="text-base font-bold text-[var(--gold-light)]">{selectedReciter.name}</h2>
              <p className="text-xs text-[var(--gold-soft)]">{selectedReciter.rewaya}</p>
            </div>

            <div className="relative w-48">
              <input
                type="text"
                placeholder="ابحث عن سورة..."
                value={searchSurah}
                onChange={(e) => setSearchSurah(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1">
            {filteredSurahs.map((s) => {
              const audioUrl = getAudioUrl(selectedReciter.serverUrl, s.num);

              return (
                <div
                  key={s.num}
                  className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        onPlayAudioTrack(
                          `سورة ${s.name}`,
                          `تلاوة القارئ: ${selectedReciter.name}`,
                          audioUrl
                        )
                      }
                      className="w-9 h-9 rounded-xl bg-[var(--gold-primary)] text-black flex items-center justify-center font-bold hover:scale-105 transition shadow-md shadow-[var(--gold-primary)]/20"
                      title="تشغيل السورة"
                    >
                      <Play className="w-4 h-4 fill-black mr-0.5" />
                    </button>

                    <div>
                      <h4 className="text-sm font-bold text-[var(--gold-light)]">سورة {s.name}</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {s.type} • {s.ayahsCount} آية
                      </p>
                    </div>
                  </div>

                  <a
                    href={audioUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition"
                    title="تحميل الملف الصوتي"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

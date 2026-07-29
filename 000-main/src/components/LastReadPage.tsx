import React from 'react';
import { PageId } from '../types';
import { History, BookOpen, ArrowLeft } from 'lucide-react';

interface LastReadPageProps {
  lastReadData: any;
  onSelectPage: (page: PageId) => void;
}

export const LastReadPage: React.FC<LastReadPageProps> = ({ lastReadData, onSelectPage }) => {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <History className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>سجل آخر القراءات والعلامات المرجعية</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">تابع قراءتك من حيث توقفت في القرآن الكريم والكتب والتفاسير</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quran Bookmark Card */}
        <div className="glass-panel p-6 rounded-3xl border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--gold-light)]">القرآن الكريم</h3>
              <p className="text-xs text-[var(--text-muted)]">علامة القراءة الأخيرة</p>
            </div>
          </div>

          {lastReadData?.quran ? (
            <div className="bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2">
              <h4 className="text-lg font-bold text-[var(--gold-light)]">
                سورة {lastReadData.quran.surahName}
              </h4>
              <p className="text-xs text-[var(--gold-soft)] font-medium">الآية رقم: {lastReadData.quran.ayahNum}</p>
              <p className="text-[10px] text-[var(--text-muted)]">آخر حفظ: {lastReadData.quran.timestamp}</p>

              <button
                onClick={() => onSelectPage('quran')}
                className="w-full mt-3 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition flex items-center justify-center gap-2"
              >
                <span>الذهاب إلى الآية الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-[var(--text-muted)]">لم تقم بحفظ علامة قراءة للقرآن بعد.</p>
              <button
                onClick={() => onSelectPage('quran')}
                className="px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold"
              >
                المصحف الشريف
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

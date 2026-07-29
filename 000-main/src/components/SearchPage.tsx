import React, { useState } from 'react';
import { ALL_SURAHS } from '../data/quranData';
import { ALL_HADITHS } from '../data/hadithData';
import { ALL_99_NAMES } from '../data/namesOfAllahData';
import { ALL_DUAS } from '../data/duasData';
import { AZKAR_CATEGORIES } from '../data/azkarData';
import { INITIAL_STORIES } from '../data/storiesData';
import { LIBRARY_BOOKS } from '../data/libraryData';
import { Search, BookOpen, Layers, UserCheck, Heart, Sparkles, Library, ArrowLeft } from 'lucide-react';
import { PageId } from '../types';

interface SearchPageProps {
  onSelectPage: (page: PageId) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectPage }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'quran' | 'hadith' | 'names' | 'duas' | 'azkar' | 'stories' | 'library'>('all');

  // Search aggregations
  const quranResults = query.trim()
    ? ALL_SURAHS.filter(
        (s) => s.name.includes(query) || s.englishName.toLowerCase().includes(query.toLowerCase()) || s.num.toString() === query
      )
    : [];

  const hadithResults = query.trim()
    ? ALL_HADITHS.filter((h) => h.text.includes(query) || h.narrator.includes(query) || h.chapter.includes(query))
    : [];

  const namesResults = query.trim()
    ? ALL_99_NAMES.filter((n) => n.name.includes(query) || n.meaning.includes(query))
    : [];

  const duaResults = query.trim()
    ? ALL_DUAS.filter((d) => d.text.includes(query) || d.title.includes(query))
    : [];

  const azkarResults = query.trim()
    ? AZKAR_CATEGORIES.flatMap((c) => c.items).filter((a) => a.text.includes(query))
    : [];

  const storyResults = query.trim()
    ? INITIAL_STORIES.filter((s) => s.title.includes(query) || s.description.includes(query) || s.fullStory.includes(query))
    : [];

  const bookResults = query.trim()
    ? LIBRARY_BOOKS.filter((b) => b.title.includes(query) || b.author.includes(query) || b.description.includes(query))
    : [];

  const totalResultsCount =
    quranResults.length +
    hadithResults.length +
    namesResults.length +
    duaResults.length +
    azkarResults.length +
    storyResults.length +
    bookResults.length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <Search className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>الباحث الشامل في المحتوى الإسلامي</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">ابحث كلميًا وفوريًا في السور القرآنية، الأحاديث، الأسماء الحسنى، الأدعية، الأذكار، والكتب</p>
      </div>

      {/* Input Box */}
      <div className="relative max-w-2xl">
        <Search className="w-6 h-6 absolute right-4 top-4 text-[var(--gold-primary)]" />
        <input
          type="text"
          autoFocus
          placeholder="اكتب كلمة أو آية أو عنواناً للبحث المباشر..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-14 pl-4 py-4 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--gold-primary)]/40 focus:border-[var(--gold-primary)] text-base text-[var(--text-main)] focus:outline-none transition shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-4 top-4 text-xs text-[var(--text-muted)] hover:text-red-400 font-bold"
          >
            مسح ✕
          </button>
        )}
      </div>

      {/* Results Count Bar */}
      {query && (
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3">
          <span>نتائج البحث عن: « <strong className="text-[var(--gold-light)]">{query}</strong> »</span>
          <span className="font-bold text-[var(--gold-primary)]">{totalResultsCount} نتيجة متبقية</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          الكل ({totalResultsCount})
        </button>
        <button
          onClick={() => setActiveTab('quran')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'quran'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          القرآن ({quranResults.length})
        </button>
        <button
          onClick={() => setActiveTab('hadith')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'hadith'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          الأحاديث ({hadithResults.length})
        </button>
        <button
          onClick={() => setActiveTab('names')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'names'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          أسماء الله ({namesResults.length})
        </button>
        <button
          onClick={() => setActiveTab('duas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'duas'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          الأدعية ({duaResults.length})
        </button>
      </div>

      {/* Results Rendering */}
      {!query ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-[var(--border-color)] space-y-3">
          <Search className="w-12 h-12 text-[var(--gold-primary)] mx-auto opacity-40 animate-pulse" />
          <p className="text-sm text-[var(--text-muted)]">ادخل الكلمة المراد البحث عنها لتظهر النتائج فوراً</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Quran Results */}
          {(activeTab === 'all' || activeTab === 'quran') && quranResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>نتائج القرآن الكريم ({quranResults.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {quranResults.map((s) => (
                  <div
                    key={s.num}
                    onClick={() => onSelectPage('quran')}
                    className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[var(--gold-light)]">سورة {s.name}</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">{s.type} • {s.ayahsCount} آية</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-[var(--gold-primary)]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hadith Results */}
          {(activeTab === 'all' || activeTab === 'hadith') && hadithResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>نتائج الأحاديث النبوية ({hadithResults.length})</span>
              </h3>
              <div className="space-y-3">
                {hadithResults.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onSelectPage('hadith')}
                    className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] cursor-pointer space-y-1"
                  >
                    <span className="text-[10px] text-[var(--gold-soft)] font-bold">{h.bookName} - {h.chapter}</span>
                    <p className="font-['Amiri'] text-base text-[var(--gold-light)]">« {h.text} »</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Names Results */}
          {(activeTab === 'all' || activeTab === 'names') && namesResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>نتائج أسماء الله الحسنى ({namesResults.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {namesResults.map((n) => (
                  <div
                    key={n.number}
                    onClick={() => onSelectPage('names')}
                    className="p-4 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] cursor-pointer text-center"
                  >
                    <h4 className="font-['Amiri'] text-2xl font-bold text-[var(--gold-light)]">{n.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{n.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

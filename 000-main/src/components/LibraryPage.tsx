import React, { useState } from 'react';
import { LIBRARY_BOOKS } from '../data/libraryData';
import { LibraryBook } from '../types';
import { Library, Search, BookOpen, Download, ExternalLink, X } from 'lucide-react';

interface LibraryPageProps {
  books?: LibraryBook[];
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ books = LIBRARY_BOOKS }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookReader, setActiveBookReader] = useState<LibraryBook | null>(null);

  const filteredBooks = books.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' || b.title.includes(searchQuery) || b.author.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <Library className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>المكتبة الإسلامية الرقمية وقراءة الكتب PDF</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">تصفح وقراءة أهم أمهات الكتب الإسلامية في التفسير والسيرة والحديث والفقه والعقيدة</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          جميع الكتب
        </button>
        <button
          onClick={() => setSelectedCategory('التفسير')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'التفسير'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          التفسير
        </button>
        <button
          onClick={() => setSelectedCategory('السيرة')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'السيرة'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          السيرة
        </button>
        <button
          onClick={() => setSelectedCategory('الحديث')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'الحديث'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          الحديث
        </button>
        <button
          onClick={() => setSelectedCategory('الفقه')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === 'الفقه'
              ? 'bg-[var(--gold-primary)] text-black shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
          }`}
        >
          الفقه
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-[var(--gold-primary)]" />
        <input
          type="text"
          placeholder="ابحث في عنوان الكتاب أو اسم المؤلف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold-primary)] transition"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-black/40 border border-[var(--border-color)] flex-shrink-0 group-hover:scale-105 transition duration-300">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] px-2.5 py-0.5 rounded-md inline-block">
                    {book.category}
                  </span>
                  <h3 className="text-base font-bold text-[var(--gold-light)] group-hover:text-[var(--gold-primary)] transition leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[var(--gold-soft)] font-medium">{book.author}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">{book.pagesCount} صفحة</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                {book.description}
              </p>
            </div>

            <div className="px-6 pb-6 pt-3 border-t border-[var(--border-color)]/30 flex items-center justify-between">
              <button
                onClick={() => setActiveBookReader(book)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>قراءة الكتاب</span>
              </button>

              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--gold-soft)] hover:bg-[var(--bg-card-hover)] transition"
                title="تحميل PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Reader Modal */}
      {activeBookReader && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="glass-panel max-w-4xl w-full h-[85vh] rounded-3xl p-6 border border-[var(--border-color)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--gold-light)]">{activeBookReader.title}</h3>
                <p className="text-xs text-[var(--gold-soft)]">{activeBookReader.author}</p>
              </div>

              <button
                onClick={() => setActiveBookReader(null)}
                className="p-2 rounded-xl bg-[var(--bg-card)] text-red-400 hover:bg-red-500/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black/60">
              <iframe
                src={activeBookReader.pdfUrl}
                title={activeBookReader.title}
                className="w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
              <span>{activeBookReader.pagesCount} صفحة متوفرة</span>
              <a
                href={activeBookReader.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[var(--gold-primary)] font-bold hover:underline"
              >
                <span>فتح في نافذة جديدة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

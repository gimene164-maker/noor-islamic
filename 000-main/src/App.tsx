import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, ThemeMode, FavoriteItem, StoryItem, HadithItem, Reciter, LibraryBook } from './types';
import { INITIAL_STORIES } from './data/storiesData';
import { ALL_HADITHS } from './data/hadithData';
import { RECITERS_LIST } from './data/recitersData';
import { LIBRARY_BOOKS } from './data/libraryData';

import { Navbar } from './components/Navbar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { HomePage } from './components/HomePage';
import { QuranPage } from './components/QuranPage';
import { TafsirPage } from './components/TafsirPage';
import { HadithPage } from './components/HadithPage';
import { StoriesPage } from './components/StoriesPage';
import { RecitationsPage } from './components/RecitationsPage';
import { RuqyaPage } from './components/RuqyaPage';
import { NamesPage } from './components/NamesPage';
import { AzkarPage } from './components/AzkarPage';
import { DuasPage } from './components/DuasPage';
import { LibraryPage } from './components/LibraryPage';
import { SiraPage } from './components/SiraPage';
import { QiblaPage } from './components/QiblaPage';
import { SearchPage } from './components/SearchPage';
import { FavoritesPage } from './components/FavoritesPage';
import { LastReadPage } from './components/LastReadPage';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminPanel } from './components/AdminPanel';
import { startNotificationScheduler } from './services/notificationService';
import { db, collection, doc, setDoc, deleteDoc, getDocs } from './lib/firebase';

export function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Audio Player State
  const [currentAudioTrack, setCurrentAudioTrack] = useState<{
    title: string;
    subtitle: string;
    audioUrl: string;
  } | null>(null);

  // Favorites State with localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Last Read State with localStorage
  const [lastReadData, setLastReadData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('noor_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Stories State with localStorage
  const [stories, setStories] = useState<StoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_stories');
      return saved ? JSON.parse(saved) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });

  // Hadiths State with localStorage
  const [hadiths, setHadiths] = useState<HadithItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_hadiths');
      return saved ? JSON.parse(saved) : ALL_HADITHS;
    } catch {
      return ALL_HADITHS;
    }
  });

  // Reciters State with localStorage
  const [reciters, setReciters] = useState<Reciter[]>(() => {
    try {
      const saved = localStorage.getItem('noor_reciters');
      return saved ? JSON.parse(saved) : RECITERS_LIST;
    } catch {
      return RECITERS_LIST;
    }
  });

  // Library Books State with localStorage
  const [books, setBooks] = useState<LibraryBook[]>(() => {
    try {
      const saved = localStorage.getItem('noor_books');
      return saved ? JSON.parse(saved) : LIBRARY_BOOKS;
    } catch {
      return LIBRARY_BOOKS;
    }
  });

  // Tasbih Count with localStorage
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('noor_tasbih_count');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // Start Background Push Notification Scheduler
  useEffect(() => {
    const cleanup = startNotificationScheduler();
    return () => cleanup();
  }, []);

  // Fetch collections from Firestore on initial mount if available
  useEffect(() => {
    const syncFromFirestore = async () => {
      try {
        const storiesSnap = await getDocs(collection(db, 'stories'));
        if (!storiesSnap.empty) {
          setStories(storiesSnap.docs.map((d) => d.data() as StoryItem));
        }

        const hadithsSnap = await getDocs(collection(db, 'hadiths'));
        if (!hadithsSnap.empty) {
          setHadiths(hadithsSnap.docs.map((d) => d.data() as HadithItem));
        }

        const recitersSnap = await getDocs(collection(db, 'reciters'));
        if (!recitersSnap.empty) {
          setReciters(recitersSnap.docs.map((d) => d.data() as Reciter));
        }

        const booksSnap = await getDocs(collection(db, 'books'));
        if (!booksSnap.empty) {
          setBooks(booksSnap.docs.map((d) => d.data() as LibraryBook));
        }
      } catch (err) {
        console.warn('Firestore initial fetch fallback to local state:', err);
      }
    };

    syncFromFirestore();
  }, []);

  // Persists to LocalStorage as fast offline fallback
  useEffect(() => {
    localStorage.setItem('noor_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('noor_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('noor_hadiths', JSON.stringify(hadiths));
  }, [hadiths]);

  useEffect(() => {
    localStorage.setItem('noor_reciters', JSON.stringify(reciters));
  }, [reciters]);

  useEffect(() => {
    localStorage.setItem('noor_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('noor_tasbih_count', tasbihCount.toString());
  }, [tasbihCount]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const handleSaveLastRead = (surahNum: number, surahName: string, ayahNum: number) => {
    const data = {
      quran: {
        surahNum,
        surahName,
        ayahNum,
        timestamp: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };
    setLastReadData(data);
    localStorage.setItem('noor_last_read', JSON.stringify(data));
  };

  // Story Handlers (Synced with Firestore)
  const handleAddStory = async (newStory: StoryItem) => {
    setStories((prev) => [newStory, ...prev]);
    try {
      await setDoc(doc(db, 'stories', newStory.id), newStory);
    } catch (e) {
      console.error('Error adding story to Firestore:', e);
    }
  };
  const handleEditStory = async (updatedStory: StoryItem) => {
    setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
    try {
      await setDoc(doc(db, 'stories', updatedStory.id), updatedStory);
    } catch (e) {
      console.error('Error updating story in Firestore:', e);
    }
  };
  const handleDeleteStory = async (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    try {
      await deleteDoc(doc(db, 'stories', storyId));
    } catch (e) {
      console.error('Error deleting story from Firestore:', e);
    }
  };

  // Hadith Handlers (Synced with Firestore)
  const handleAddHadith = async (newHadith: HadithItem) => {
    setHadiths((prev) => [newHadith, ...prev]);
    try {
      await setDoc(doc(db, 'hadiths', newHadith.id), newHadith);
    } catch (e) {
      console.error('Error adding hadith to Firestore:', e);
    }
  };
  const handleEditHadith = async (updatedHadith: HadithItem) => {
    setHadiths((prev) => prev.map((h) => (h.id === updatedHadith.id ? updatedHadith : h)));
    try {
      await setDoc(doc(db, 'hadiths', updatedHadith.id), updatedHadith);
    } catch (e) {
      console.error('Error updating hadith in Firestore:', e);
    }
  };
  const handleDeleteHadith = async (hadithId: string) => {
    setHadiths((prev) => prev.filter((h) => h.id !== hadithId));
    try {
      await deleteDoc(doc(db, 'hadiths', hadithId));
    } catch (e) {
      console.error('Error deleting hadith from Firestore:', e);
    }
  };

  // Reciter Handlers (Synced with Firestore)
  const handleAddReciter = async (newReciter: Reciter) => {
    setReciters((prev) => [newReciter, ...prev]);
    try {
      await setDoc(doc(db, 'reciters', newReciter.id), newReciter);
    } catch (e) {
      console.error('Error adding reciter to Firestore:', e);
    }
  };
  const handleEditReciter = async (updatedReciter: Reciter) => {
    setReciters((prev) => prev.map((r) => (r.id === updatedReciter.id ? updatedReciter : r)));
    try {
      await setDoc(doc(db, 'reciters', updatedReciter.id), updatedReciter);
    } catch (e) {
      console.error('Error updating reciter in Firestore:', e);
    }
  };
  const handleDeleteReciter = async (reciterId: string) => {
    setReciters((prev) => prev.filter((r) => r.id !== reciterId));
    try {
      await deleteDoc(doc(db, 'reciters', reciterId));
    } catch (e) {
      console.error('Error deleting reciter from Firestore:', e);
    }
  };

  // Book Handlers (Synced with Firestore)
  const handleAddBook = async (newBook: LibraryBook) => {
    setBooks((prev) => [newBook, ...prev]);
    try {
      await setDoc(doc(db, 'books', newBook.id), newBook);
    } catch (e) {
      console.error('Error adding book to Firestore:', e);
    }
  };
  const handleEditBook = async (updatedBook: LibraryBook) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    try {
      await setDoc(doc(db, 'books', updatedBook.id), updatedBook);
    } catch (e) {
      console.error('Error updating book in Firestore:', e);
    }
  };
  const handleDeleteBook = async (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      await deleteDoc(doc(db, 'books', bookId));
    } catch (e) {
      console.error('Error deleting book from Firestore:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Cairo'] flex flex-col justify-between selection:bg-[var(--gold-primary)] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onSelectPage={setActivePage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenNotifications={() => setNotificationsOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activePage === 'home' && (
              <HomePage
                onSelectPage={setActivePage}
                tasbihCount={tasbihCount}
                onIncrementTasbih={() => setTasbihCount((c) => c + 1)}
                onResetTasbih={() => setTasbihCount(0)}
                lastReadData={lastReadData}
              />
            )}

            {activePage === 'quran' && (
              <QuranPage
                onPlayAudioTrack={(title, subtitle, audioUrl) =>
                  setCurrentAudioTrack({ title, subtitle, audioUrl })
                }
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                onSaveLastRead={handleSaveLastRead}
              />
            )}

            {activePage === 'tafsir' && (
              <TafsirPage
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activePage === 'hadith' && (
              <HadithPage
                hadiths={hadiths}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activePage === 'stories' && (
              <StoriesPage
                stories={stories}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activePage === 'recitations' && (
              <RecitationsPage
                reciters={reciters}
                onPlayAudioTrack={(title, subtitle, audioUrl) =>
                  setCurrentAudioTrack({ title, subtitle, audioUrl })
                }
              />
            )}

            {activePage === 'ruqya' && (
              <RuqyaPage
                onPlayAudioTrack={(title, subtitle, audioUrl) =>
                  setCurrentAudioTrack({ title, subtitle, audioUrl })
                }
              />
            )}

            {activePage === 'names' && (
              <NamesPage
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activePage === 'azkar' && <AzkarPage />}

            {activePage === 'duas' && (
              <DuasPage
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            )}

            {activePage === 'library' && <LibraryPage books={books} />}

            {activePage === 'sira' && <SiraPage />}

            {activePage === 'qibla' && <QiblaPage />}

            {activePage === 'search' && <SearchPage onSelectPage={setActivePage} />}

            {activePage === 'favorites' && (
              <FavoritesPage
                favorites={favorites}
                onRemoveFavorite={(id) => setFavorites((prev) => prev.filter((f) => f.id !== id))}
                onClearFavorites={() => setFavorites([])}
              />
            )}

            {activePage === 'lastRead' && (
              <LastReadPage lastReadData={lastReadData} onSelectPage={setActivePage} />
            )}

            {activePage === 'admin' && (
              <AdminPanel
                stories={stories}
                onAddStory={handleAddStory}
                onEditStory={handleEditStory}
                onDeleteStory={handleDeleteStory}
                hadiths={hadiths}
                onAddHadith={handleAddHadith}
                onEditHadith={handleEditHadith}
                onDeleteHadith={handleDeleteHadith}
                reciters={reciters}
                onAddReciter={handleAddReciter}
                onEditReciter={handleEditReciter}
                onDeleteReciter={handleDeleteReciter}
                books={books}
                onAddBook={handleAddBook}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Audio Player Bar */}
      <AudioPlayerBar
        currentTrack={currentAudioTrack}
        onCloseTrack={() => setCurrentAudioTrack(null)}
      />

      {/* Notifications Modal */}
      {notificationsOpen && (
        <NotificationsModal onClose={() => setNotificationsOpen(false)} />
      )}

      {/* Modern Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#99751e] flex items-center justify-center text-black font-['Amiri'] font-bold text-lg shadow-md">
              ن
            </div>
            <span className="font-['Amiri'] text-xl font-bold text-[var(--gold-light)]">
              منصة نُور الإسلامية الشاملة
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            منصة إسلامية متكاملة تهدف إلى نشر القرآن الكريم والتفاسير المعتمدة والأحاديث الصحيحة والأذكار والسيرة النبوية بتصميم عصري وأدوات تفاعلية.
          </p>

          <p className="text-[11px] text-[var(--gold-soft)] font-medium pt-2">
            جميع الحقوق محفوظة © {new Date().getFullYear()} — نُور (Noor Platform)
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;

export type ThemeMode = 'dark' | 'light';

export type PageId =
  | 'home'
  | 'quran'
  | 'tafsir'
  | 'hadith'
  | 'stories'
  | 'recitations'
  | 'ruqya'
  | 'names'
  | 'azkar'
  | 'duas'
  | 'library'
  | 'search'
  | 'favorites'
  | 'lastRead'
  | 'notifications'
  | 'admin'
  | 'sira'
  | 'qibla';

export interface SurahHeader {
  num: number;
  name: string;
  englishName: string;
  type: 'مكية' | 'مدنية';
  ayahsCount: number;
  revelationOrder: number;
}

export interface Ayah {
  numberInSurah: number;
  globalNumber: number;
  text: string;
  audioUrl?: string;
  juz?: number;
  page?: number;
}

export interface TafsirOption {
  id: string;
  name: string;
  author: string;
}

export interface HadithBook {
  id: string;
  name: string;
  author: string;
  count: number;
  description?: string;
}

export interface HadithItem {
  id: string;
  bookId: string;
  bookName: string;
  number: number;
  chapter: string;
  narrator: string;
  text: string;
  grade?: string;
}

export interface StoryItem {
  id: string;
  category: 'prophets' | 'companions' | 'quran';
  categoryLabel: string;
  title: string;
  description: string;
  fullStory: string;
  ayahs: string[];
  hadiths: string[];
  lessons: string[];
  youtubeUrl?: string;
  imageUrl?: string;
}

export interface Reciter {
  id: string;
  name: string;
  rewaya: string;
  serverUrl: string;
  photoUrl?: string;
}

export interface RuqyaWrittenItem {
  id: string;
  title: string;
  category: 'eye' | 'magic' | 'touch' | 'protection';
  categoryLabel: string;
  verses: { text: string; count: number; note?: string }[];
}

export interface RuqyaAudioItem {
  id: string;
  title: string;
  reciter: string;
  duration: string;
  audioUrl: string;
}

export interface NameOfAllah {
  number: number;
  name: string;
  transliteration: string;
  meaning: string;
  explanation: string;
  quranProof: string;
  sunnahProof: string;
  benefits: string;
}

export interface ZikrItem {
  id: string;
  text: string;
  count: number;
  reward?: string;
}

export interface AzkarCategory {
  id: string;
  title: string;
  icon: string;
  items: ZikrItem[];
}

export interface DuaItem {
  id: string;
  title: string;
  text: string;
  reference: string;
  category: 'quran' | 'sunnah' | 'prophets' | 'daily';
  categoryLabel: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: 'التفسير' | 'الحديث' | 'العقيدة' | 'الفقه' | 'السيرة' | 'اللغة العربية';
  description: string;
  pdfUrl?: string;
  coverUrl?: string;
  pagesCount?: number;
}

export interface FavoriteItem {
  id: string;
  type: 'ayah' | 'hadith' | 'story' | 'tafsir' | 'azkar' | 'dua' | 'name' | 'book';
  title: string;
  subtitle: string;
  content: string;
  dateAdded: string;
  meta?: any;
}

export interface LastReadState {
  quran?: { surahNum: number; surahName: string; ayahNum: number; date: string };
  tafsir?: { surahNum: number; surahName: string; ayahNum: number; tafsirId: string; date: string };
  hadith?: { bookId: string; bookName: string; hadithId: string; title: string; date: string };
  story?: { storyId: string; title: string; date: string };
  book?: { bookId: string; title: string; date: string };
}

export interface SeerahEvent {
  year: string;
  title: string;
  desc: string;
  category: string;
}

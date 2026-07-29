import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoryItem } from '../types';
import { Sparkles, BookOpen, Layers, CheckCircle2, Youtube, ArrowRight, Heart } from 'lucide-react';

interface StoriesPageProps {
  stories: StoryItem[];
  onToggleFavorite: (item: any) => void;
  isFavorite: (id: string) => boolean;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({ stories, onToggleFavorite, isFavorite }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prophets' | 'companions' | 'quran'>('all');
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);

  const filteredStories = stories.filter((s) => selectedCategory === 'all' || s.category === selectedCategory);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--gold-primary)]" />
            <span>قصص الأنبياء والصحابة والقرآن الكريم</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            قصص مليئة بالعبر والدروس والآيات والأحاديث الموثقة والفيديوهات
          </p>
        </div>

        {selectedStory && (
          <button
            onClick={() => setSelectedStory(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--gold-primary)] hover:bg-[var(--bg-card-hover)] transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لجميع القصص</span>
          </button>
        )}
      </div>

      {!selectedStory ? (
        <div className="space-y-6">
          
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
              جميع القصص
            </button>
            <button
              onClick={() => setSelectedCategory('prophets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'prophets'
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              قصص الأنبياء
            </button>
            <button
              onClick={() => setSelectedCategory('companions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'companions'
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              قصص الصحابة
            </button>
            <button
              onClick={() => setSelectedCategory('quran')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'quran'
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
              }`}
            >
              قصص القرآن
            </button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map((story, idx) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedStory(story)}
                className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition duration-300 cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-black/40">
                    <img
                      src={story.imageUrl || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-[var(--gold-primary)] text-black px-3 py-1 rounded-full shadow-md">
                      {story.categoryLabel}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-[var(--gold-light)] group-hover:text-[var(--gold-primary)] transition">
                      {story.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-[var(--gold-soft)] font-bold border-t border-[var(--border-color)]/30 mt-2">
                  <span>اقرأ القصة والدروس ↵</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{story.lessons.length} دروس مستفادة</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      ) : (

        /* Full Story View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--border-color)] space-y-8"
        >
          
          {/* Header & Hero Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] px-3 py-1 rounded-lg">
                {selectedStory.categoryLabel}
              </span>

              <button
                onClick={() =>
                  onToggleFavorite({
                    id: selectedStory.id,
                    type: 'story',
                    title: selectedStory.title,
                    subtitle: selectedStory.categoryLabel,
                    content: selectedStory.description,
                    dateAdded: new Date().toLocaleDateString('ar-EG')
                  })
                }
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition"
              >
                <Heart className={`w-4 h-4 ${isFavorite(selectedStory.id) ? 'text-red-500 fill-red-500' : ''}`} />
              </button>
            </div>

            <h2 className="font-['Amiri'] text-3xl sm:text-4xl font-bold text-[var(--gold-light)] leading-tight">
              {selectedStory.title}
            </h2>

            {selectedStory.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-72 w-full border border-[var(--border-color)]">
                <img src={selectedStory.imageUrl} alt={selectedStory.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Full Narrative Text */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>تفاصيل أحداث القصة:</span>
            </h3>
            <p className="font-['Amiri'] text-xl text-[var(--text-main)] leading-loose text-justify dir-rtl whitespace-pre-line">
              {selectedStory.fullStory}
            </p>
          </div>

          {/* Related Ayahs */}
          {selectedStory.ayahs.length > 0 && (
            <div className="space-y-3 bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>الآيات القرآنية المتعلقة بالقصة:</span>
              </h3>
              <div className="space-y-2">
                {selectedStory.ayahs.map((a, i) => (
                  <p key={i} className="font-['Amiri'] text-lg text-[var(--gold-light)]">
                    {a}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Related Hadiths */}
          {selectedStory.hadiths.length > 0 && (
            <div className="space-y-3 bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>الأحاديث النبوية المتعلقة:</span>
              </h3>
              <div className="space-y-2">
                {selectedStory.hadiths.map((h, i) => (
                  <p key={i} className="text-sm text-[var(--text-main)]">
                    {h}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {selectedStory.lessons.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--gold-primary)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>الدروس والحكم المستفادة:</span>
              </h3>
              <ul className="space-y-2">
                {selectedStory.lessons.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-main)] leading-relaxed">
                    <span className="text-[var(--gold-primary)] font-bold">•</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Embedded YouTube Video Section (Editable in Admin Panel) */}
          {selectedStory.youtubeUrl && (
            <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <span>فيديو توثيقي للقصة (YouTube):</span>
              </h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border-color)]">
                <iframe
                  src={selectedStory.youtubeUrl}
                  title={selectedStory.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
};

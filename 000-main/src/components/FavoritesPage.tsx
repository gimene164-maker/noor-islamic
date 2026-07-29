import React from 'react';
import { FavoriteItem } from '../types';
import { Heart, Trash2, Copy, Share2 } from 'lucide-react';

interface FavoritesPageProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onRemoveFavorite,
  onClearFavorites
}) => {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span>قائمة العناصر المفضلة المحفوظة</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">آيات، أحاديث، قصص، وتفاسير قمت بحفظها للرجوع إليها لاحقاً</p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={onClearFavorites}
            className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-500/20 px-3 py-1.5 rounded-xl bg-red-500/10 transition"
          >
            مسح الكل 🗑️
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-[var(--border-color)] space-y-3">
          <Heart className="w-12 h-12 text-red-500/40 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--gold-light)]">لا توجد عناصر في المفضلة حالياً</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            انقر على أيقونة القلب ❤️ عند قراءة القرآن أو الأحاديث أو الأدعية لحفظها هنا.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--gold-light)]">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-[var(--gold-soft)]">{item.subtitle}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-muted)]">{item.dateAdded}</span>
                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="font-['Amiri'] text-xl text-[var(--text-main)] leading-relaxed dir-rtl text-justify">
                « {item.content} »
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

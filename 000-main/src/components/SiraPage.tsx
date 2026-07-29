import React, { useState } from 'react';
import { SEERAH_TIMELINE } from '../data/siraData';
import { BookText, Sparkles, Clock } from 'lucide-react';

export const SiraPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'المولد والنشأة', 'الشباب والنبوة', 'البعثة والدعوة', 'الابتلاء والهجرة', 'الدولة والجهاد', 'الفتح والتمكين', 'الكمال والوفاة'];

  const filteredTimeline = SEERAH_TIMELINE.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center gap-2">
          <BookText className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>السيرة النبوية الشريفة والخط الزمني الخالد</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">تتبع محطات حياة النبي محمد ﷺ من المولد الشريف حتى الرفيق الأعلى</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === c
                ? 'bg-[var(--gold-primary)] text-black shadow-md'
                : 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]'
            }`}
          >
            {c === 'all' ? 'جميع المحطات' : c}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative border-r-2 border-[var(--gold-primary)]/40 mr-4 space-y-8 pr-6">
        {filteredTimeline.map((item, idx) => (
          <div key={idx} className="relative group">
            
            {/* Timeline Dot */}
            <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--gold-primary)] border-4 border-[var(--bg-main)] shadow-md group-hover:scale-125 transition duration-300" />

            {/* Event Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] hover:border-[var(--gold-primary)] transition duration-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--gold-primary)] font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.year}
                </span>
                <span className="text-[10px] bg-[var(--gold-primary)]/10 text-[var(--gold-soft)] px-2.5 py-0.5 rounded-md font-semibold">
                  {item.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--gold-light)]">{item.title}</h3>

              <p className="text-xs text-[var(--text-main)] leading-relaxed text-justify dir-rtl">
                {item.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

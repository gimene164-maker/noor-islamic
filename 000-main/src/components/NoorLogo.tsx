import React from 'react';

const logoPath = "/src/assets/images/noor_app_logo_1785303687503.jpg";

interface NoorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const NoorLogo: React.FC<NoorLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { img: 'w-9 h-9', title: 'text-xl', sub: 'text-[9px]' },
    md: { img: 'w-11 h-11', title: 'text-2xl', sub: 'text-[10px]' },
    lg: { img: 'w-16 h-16', title: 'text-3xl', sub: 'text-xs' },
    xl: { img: 'w-24 h-24 md:w-32 md:h-32', title: 'text-4xl md:text-5xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden Glowing Frame Around Official Logo Image */}
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[var(--gold-primary)] to-amber-200 blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className={`relative ${currentSize.img} rounded-2xl overflow-hidden border border-[var(--gold-primary)]/40 bg-[#06080d] p-0.5 shadow-md flex items-center justify-center shrink-0`}>
          <img
            src={logoPath}
            alt="شعار منصة نور الإسلامية"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Brand Name & Subtitle */}
      {showSubtitle && (
        <div className="flex flex-col text-right">
          <span className={`font-['Amiri'] font-bold tracking-wide text-[var(--gold-primary)] leading-none drop-shadow-sm ${currentSize.title}`}>
            نُور
          </span>
          <span className={`text-[var(--text-muted)] tracking-widest block mt-0.5 font-medium ${currentSize.sub}`}>
            منصة إسلامية متكاملة
          </span>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin } from 'lucide-react';

export const QiblaPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState({ name: 'القاهرة (مصر)', lat: 30.0444, lng: 31.2357, qiblaDegree: 136.8 });
  const [heading, setHeading] = useState(0);

  const CITIES = [
    { name: 'القاهرة (مصر)', lat: 30.0444, lng: 31.2357, qiblaDegree: 136.8 },
    { name: 'الرياض (السعودية)', lat: 24.7136, lng: 46.6753, qiblaDegree: 242.0 },
    { name: 'مكة المكرمة (السعودية)', lat: 21.4225, lng: 39.8262, qiblaDegree: 0 },
    { name: 'المدينة المنورة (السعودية)', lat: 24.5247, lng: 39.5692, qiblaDegree: 175.5 },
    { name: 'عمان (الأردن)', lat: 31.9454, lng: 35.9284, qiblaDegree: 161.2 },
    { name: 'الرباط (المغرب)', lat: 34.0209, lng: -6.8416, qiblaDegree: 98.4 },
    { name: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588, qiblaDegree: 112.9 },
    { name: 'تونس العاصمة', lat: 36.8065, lng: 10.1815, qiblaDegree: 128.7 },
    { name: 'إسطنبول (تركيا)', lat: 41.0082, lng: 28.9784, qiblaDegree: 151.7 },
    { name: 'لندن (المملكة المتحدة)', lat: 51.5074, lng: -0.1278, qiblaDegree: 118.9 }
  ];

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(e.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="space-y-6 pb-20 max-w-xl mx-auto text-center">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gold-light)] flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-[var(--gold-primary)]" />
          <span>بوصلة تحديد اتجاه القبلة</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">حدد اتجاه الكعبة المشرفة بدقة حسب موقعك الحالي</p>
      </div>

      {/* City Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] space-y-2 text-right">
        <label className="text-xs font-bold text-[var(--gold-light)] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
          <span>اختر المدينة الحالية:</span>
        </label>
        <select
          value={selectedCity.name}
          onChange={(e) => {
            const found = CITIES.find((c) => c.name === e.target.value);
            if (found) setSelectedCity(found);
          }}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} (زاوية القبلة: {c.qiblaDegree}°)
            </option>
          ))}
        </select>
      </div>

      {/* Compass Interactive Dial */}
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] flex flex-col items-center justify-center space-y-6">
        
        <div className="relative w-64 h-64 rounded-full border-4 border-[var(--gold-primary)] bg-[var(--bg-main)] flex items-center justify-center shadow-2xl">
          
          {/* North Pointer */}
          <div className="absolute top-2 text-xs font-bold text-red-500 font-mono">N</div>
          <div className="absolute bottom-2 text-xs font-bold text-[var(--text-muted)] font-mono">S</div>
          <div className="absolute left-2 text-xs font-bold text-[var(--text-muted)] font-mono">W</div>
          <div className="absolute right-2 text-xs font-bold text-[var(--text-muted)] font-mono">E</div>

          {/* Kaaba Direction Arrow */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${selectedCity.qiblaDegree - heading}deg)` }}
          >
            <div className="flex flex-col items-center -mt-20">
              <span className="text-3xl mb-1">🕋</span>
              <Navigation className="w-8 h-8 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
            </div>
          </div>

          <div className="w-6 h-6 rounded-full bg-[var(--gold-primary)] border-2 border-black" />
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[var(--text-muted)] font-mono block">الدرجة الزاوية من الشمال:</span>
          <span className="text-3xl font-extrabold text-[var(--gold-primary)] font-mono">
            {selectedCity.qiblaDegree}°
          </span>
          <p className="text-[11px] text-[var(--gold-soft)] font-medium mt-1">
            وجّه جهازك نحو الرمز 🕋 للحصول على القبلة الصحيحة لصصلاتك.
          </p>
        </div>

      </div>

    </div>
  );
};

export interface NotificationSchedule {
  morningAzkar: { enabled: boolean; time: string };
  eveningAzkar: { enabled: boolean; time: string };
  quranWird: { enabled: boolean; time: string; quota: string };
  fridayKahf: { enabled: boolean; time: string };
  soundEnabled: boolean;
}

export const DEFAULT_SCHEDULE: NotificationSchedule = {
  morningAzkar: { enabled: true, time: '06:00' },
  eveningAzkar: { enabled: true, time: '17:30' },
  quranWird: { enabled: true, time: '08:00', quota: 'صفحتان يومياً' },
  fridayKahf: { enabled: true, time: '09:00' },
  soundEnabled: true,
};

const STORAGE_KEY = 'noor_notification_schedule_v2';
const LAST_FIRE_KEY = 'noor_notification_last_fired';

export const getNotificationSchedule = (): NotificationSchedule => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_SCHEDULE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error reading notification schedule', e);
  }
  return DEFAULT_SCHEDULE;
};

export const saveNotificationSchedule = (schedule: NotificationSchedule): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  } catch (e) {
    console.error('Error saving notification schedule', e);
  }
};

export const getNotificationPermission = (): NotificationPermission => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendPushNotification('منصة نُور الإسلامية 🌙', {
        body: 'تم تفعيل إشعارات الدفع بنجاح! سنقوم بتذكيرك بأذكار الصباح والمساء وورد القرآن الكريم في الأوقات التي حددتها.',
        icon: '/src/assets/images/noor_app_logo_1785303687503.jpg',
        tag: 'noor-welcome'
      });
    }
    return permission;
  }
  return 'denied';
};

export const sendPushNotification = (title: string, options?: NotificationOptions): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      // Try service worker notification first for full push capabilities
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: '/src/assets/images/noor_app_logo_1785303687503.jpg',
            badge: '/src/assets/images/noor_app_logo_1785303687503.jpg',
            dir: 'rtl',
            lang: 'ar',
            ...options,
          } as any);
        });
      } else {
        // Fallback to standard Browser Notification constructor
        new Notification(title, {
          icon: '/src/assets/images/noor_app_logo_1785303687503.jpg',
          dir: 'rtl',
          lang: 'ar',
          ...options,
        });
      }

      // Audio notification feedback if supported
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      return true;
    } catch (err) {
      console.error('Failed to dispatch push notification', err);
    }
  }
  return false;
};

// Background Interval Scheduler Engine
export const startNotificationScheduler = (
  onNotificationFired?: (title: string, body: string) => void
): (() => void) => {
  const checkAndTrigger = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const schedule = getNotificationSchedule();
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    const currentDateStr = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay(); // 5 = Friday

    let lastFired: Record<string, string> = {};
    try {
      const saved = localStorage.getItem(LAST_FIRE_KEY);
      if (saved) lastFired = JSON.parse(saved);
    } catch (e) {
      lastFired = {};
    }

    const fireOnceToday = (key: string, title: string, body: string) => {
      const fireId = `${currentDateStr}_${key}_${currentTimeStr}`;
      if (lastFired[key] === fireId) return; // Already fired at this minute today

      const success = sendPushNotification(title, {
        body,
        tag: `noor-${key}`,
        requireInteraction: true
      });

      if (success) {
        lastFired[key] = fireId;
        try {
          localStorage.setItem(LAST_FIRE_KEY, JSON.stringify(lastFired));
        } catch (e) {}
        if (onNotificationFired) {
          onNotificationFired(title, body);
        }
      }
    };

    // 1. Morning Azkar Check
    if (schedule.morningAzkar.enabled && schedule.morningAzkar.time === currentTimeStr) {
      fireOnceToday(
        'morning',
        'أذكار الصباح - منصة نُور 🌅',
        '«أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — حان الآن موعد أذكار الصباح لبدء يومك بالبركة والسكينة.'
      );
    }

    // 2. Evening Azkar Check
    if (schedule.eveningAzkar.enabled && schedule.eveningAzkar.time === currentTimeStr) {
      fireOnceToday(
        'evening',
        'أذكار المساء - منصة نُور 🌆',
        '«فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ» — حان موعد أذكار المساء لتحصين نفسك وأهلك.'
      );
    }

    // 3. Quran Daily Wird Check
    if (schedule.quranWird.enabled && schedule.quranWird.time === currentTimeStr) {
      const quotaText = schedule.quranWird.quota ? ` (${schedule.quranWird.quota})` : '';
      fireOnceToday(
        'quran_wird',
        'تذكير الورد القرآني اليومي 📖',
        `«وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا» — حان موعد وردك القرآني اليومي${quotaText}. لا تدع يومك يمر دون التزود بكلام الله.`
      );
    }

    // 4. Friday Surah Al-Kahf Check (Day 5 = Friday)
    if (dayOfWeek === 5 && schedule.fridayKahf.enabled && schedule.fridayKahf.time === currentTimeStr) {
      fireOnceToday(
        'friday_kahf',
        'سورة الكهف - نور ما بين الجمعتين 🕌',
        '«مَنْ قَرَأَ سُورَةَ الْكَهْفِ فِي يَوْمِ الْجُمُعَةِ أَضَاءَ لَهُ مِنَ النُّورِ مَا بَيْنَ الْجُمُعَتَيْنِ» — تذكير بقراءة سورة الكهف المباركة.'
      );
    }
  };

  // Run initial check
  checkAndTrigger();

  // Run check every 30 seconds
  const intervalId = setInterval(checkAndTrigger, 30000);

  return () => {
    clearInterval(intervalId);
  };
};

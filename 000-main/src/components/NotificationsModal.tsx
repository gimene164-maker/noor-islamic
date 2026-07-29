import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Sparkles,
  BookOpen,
  Clock,
  X,
  CheckCircle2,
  Send,
  Volume2,
  VolumeX,
  Calendar,
  Sun,
  Moon,
  BookmarkCheck,
  Check
} from 'lucide-react';
import {
  NotificationSchedule,
  getNotificationSchedule,
  saveNotificationSchedule,
  getNotificationPermission,
  requestNotificationPermission,
  sendPushNotification
} from '../services/notificationService';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const [schedule, setSchedule] = useState<NotificationSchedule>(() => getNotificationSchedule());
  const [permissionState, setPermissionState] = useState<NotificationPermission>(() => getNotificationPermission());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setPermissionState(getNotificationPermission());
  }, []);

  const handlePermissionRequest = async () => {
    const perm = await requestNotificationPermission();
    setPermissionState(perm);
  };

  const handleSendTestNotification = () => {
    if (permissionState !== 'granted') {
      handlePermissionRequest();
      return;
    }

    const sent = sendPushNotification('تنبيه تجريبي - منصة نُور 🌙', {
      body: '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — إشعار الدفع المباشر يعمل بنجاح! ستصلك التنبيهات في الأوقات المحددة.',
      tag: 'noor-test-notification'
    });

    if (sent) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const handleSave = () => {
    saveNotificationSchedule(schedule);

    if (permissionState === 'default') {
      handlePermissionRequest();
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel max-w-xl w-full rounded-3xl p-6 md:p-8 border border-[var(--border-color)] space-y-6 my-8 shadow-2xl text-right"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--gold-primary)]/15 border border-[var(--gold-primary)]/30 flex items-center justify-center text-[var(--gold-primary)] shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--gold-light)]">نظام إشعارات الدفع والتذكيرات اليومية</h3>
              <p className="text-xs text-[var(--text-muted)]">حدد أوقاتك الخاصة لتنبيهات الورد القرآني والأذكار</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-red-400 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Status Banner */}
        <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--gold-light)]">حالة إشعارات المتصفح:</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                permissionState === 'granted'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : permissionState === 'denied'
                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {permissionState === 'granted' ? 'مميّزة ومفعلة ✓' : permissionState === 'denied' ? 'محظورة في إعدادات المتصفح' : 'بانتظار الإذن'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {permissionState === 'granted'
                ? 'إشعارات الدفع المباشرة نشطة وسيقوم المتصفح بتنبيهك حتى أثناء تصفحك'
                : 'يتطلب النظام تفعيل إذن الإشعارات من المتصفح لإرسال التنبيهات في وقتها'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {permissionState !== 'granted' ? (
              <button
                onClick={handlePermissionRequest}
                className="px-4 py-2 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition shadow-md whitespace-nowrap"
              >
                تفعيل الإشعارات الآن
              </button>
            ) : (
              <button
                onClick={handleSendTestNotification}
                className="px-3.5 py-2 rounded-xl bg-white/10 text-[var(--gold-light)] text-xs font-semibold hover:bg-white/20 transition flex items-center gap-1.5 whitespace-nowrap border border-white/15"
              >
                <Send className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>{testSent ? 'تم إرسال الإشعار!' : 'تجربة إشعار دفع'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Schedule Controls */}
        <div className="space-y-4">
          
          {/* 1. Quran Ward Schedule */}
          <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--gold-light)]">تذكير الورد القرآني اليومي</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">إشعار دفع يومي لمتابعة القراءة والتدبر</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schedule.quranWird.enabled}
                onChange={(e) => setSchedule({
                  ...schedule,
                  quranWird: { ...schedule.quranWird, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-[var(--gold-primary)] cursor-pointer rounded"
              />
            </div>

            {schedule.quranWird.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]/60">
                <div className="flex items-center justify-between bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">وقت التنبيه:</span>
                  <input
                    type="time"
                    value={schedule.quranWird.time}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      quranWird: { ...schedule.quranWird, time: e.target.value }
                    })}
                    className="bg-transparent text-xs font-bold text-[var(--gold-light)] text-center focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">مقدرا الورد:</span>
                  <select
                    value={schedule.quranWird.quota}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      quranWird: { ...schedule.quranWird, quota: e.target.value }
                    })}
                    className="bg-transparent text-xs font-bold text-[var(--gold-light)] focus:outline-none text-left cursor-pointer"
                  >
                    <option value="صفحة واحدة" className="bg-[#0f1420] text-white">صفحة واحدة</option>
                    <option value="صفحتان يومياً" className="bg-[#0f1420] text-white">صفحتان يومياً</option>
                    <option value="5 صفحات" className="bg-[#0f1420] text-white">5 صفحات</option>
                    <option value="نصف جزء" className="bg-[#0f1420] text-white">نصف جزء</option>
                    <option value="جزء كامل" className="bg-[#0f1420] text-white">جزء كامل</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 2. Morning Azkar Schedule */}
          <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-yellow-400" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--gold-light)]">تذكير أذكار الصباح</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">إشعار دفع صباحي لبدء اليوم بالحصن الحصين</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schedule.morningAzkar.enabled}
                onChange={(e) => setSchedule({
                  ...schedule,
                  morningAzkar: { ...schedule.morningAzkar, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-[var(--gold-primary)] cursor-pointer rounded"
              />
            </div>

            {schedule.morningAzkar.enabled && (
              <div className="flex items-center justify-between bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                <span className="text-[11px] text-[var(--text-muted)] font-medium">وقت تنبيه الصباح:</span>
                <input
                  type="time"
                  value={schedule.morningAzkar.time}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    morningAzkar: { ...schedule.morningAzkar, time: e.target.value }
                  })}
                  className="bg-transparent text-xs font-bold text-[var(--gold-light)] text-center focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 3. Evening Azkar Schedule */}
          <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--gold-light)]">تذكير أذكار المساء</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">إشعار دفع مسائي قبيل غروب الشمس</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schedule.eveningAzkar.enabled}
                onChange={(e) => setSchedule({
                  ...schedule,
                  eveningAzkar: { ...schedule.eveningAzkar, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-[var(--gold-primary)] cursor-pointer rounded"
              />
            </div>

            {schedule.eveningAzkar.enabled && (
              <div className="flex items-center justify-between bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                <span className="text-[11px] text-[var(--text-muted)] font-medium">وقت تنبيه المساء:</span>
                <input
                  type="time"
                  value={schedule.eveningAzkar.time}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    eveningAzkar: { ...schedule.eveningAzkar, time: e.target.value }
                  })}
                  className="bg-transparent text-xs font-bold text-[var(--gold-light)] text-center focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 4. Friday Surah Al-Kahf Schedule */}
          <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--gold-light)]">تذكير سورة الكهف يوم الجمعة</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">إشعار أسبوعي صباح كل يوم جمعة مباركة</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schedule.fridayKahf.enabled}
                onChange={(e) => setSchedule({
                  ...schedule,
                  fridayKahf: { ...schedule.fridayKahf, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-[var(--gold-primary)] cursor-pointer rounded"
              />
            </div>

            {schedule.fridayKahf.enabled && (
              <div className="flex items-center justify-between bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)]">
                <span className="text-[11px] text-[var(--text-muted)] font-medium">وقت تنبيه الجمعة:</span>
                <input
                  type="time"
                  value={schedule.fridayKahf.time}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    fridayKahf: { ...schedule.fridayKahf, time: e.target.value }
                  })}
                  className="bg-transparent text-xs font-bold text-[var(--gold-light)] text-center focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Sound Effect Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              {schedule.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[var(--gold-primary)]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
              )}
              <span className="text-xs font-bold text-[var(--gold-light)]">تفعيل نغمة التنبيه الصوتية</span>
            </div>
            <input
              type="checkbox"
              checked={schedule.soundEnabled}
              onChange={(e) => setSchedule({ ...schedule, soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-[var(--gold-primary)] cursor-pointer rounded"
            />
          </div>

        </div>

        {/* Footer & Actions */}
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> تم حفظ مواعيد التنبيهات وتفعيل النظام بنجاح!
            </span>
          ) : (
            <span className="text-[10px] text-[var(--text-muted)]">يتم العمل تلقائياً في الخلفية بناءً على ساعاتك المفضلة</span>
          )}

          <button
            onClick={handleSave}
            className="mr-auto px-6 py-2.5 rounded-xl bg-[var(--gold-primary)] text-black text-xs font-bold hover:bg-[var(--gold-soft)] transition shadow-lg flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>حفظ المواعيد والتفعيل</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};

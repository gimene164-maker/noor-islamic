# 🌙 نور — Noor Islamic Platform (TWA/APK)

## ⚠️ المشكلة: PWA يتثبت كـ "اختصار" مش "تطبيق"

Google Chrome على Android بيثبت PWA بطريقتين:
1. **WebAPK** (تطبيق حقيقي) — بس بيفشل كتير في مصر/المنطقة العربية
2. **Shortcut** (اختصار) — ده اللي بيحصل غالباً

## ✅ الحل: Trusted Web Activity (TWA)

TWA بيخلّي التطبيق:
- ✅ **APK حقيقي** — يثبت زي أي تطبيق Android
- ✅ **App Drawer** — يظهر في قائمة التطبيقات
- ✅ **Settings** — يظهر في إعدادات الجهاز
- ✅ **Google Play** — ممكن ترفعه على المتجر
- ✅ **بدون شريط عنوان** — يفتح في Chrome بدون UI

---

## 🚀 الطريقة 1: Build APK باستخدام Android Studio (الأسهل)

### الخطوات:

**1. حمّل Android Studio:**
- من [developer.android.com/studio](https://developer.android.com/studio)
- سجّل بالـ Google Account

**2. افتح المشروع:**
- File → Open → اختار مجلد `noor-twa`
- استنى Gradle يعمل sync (ممكن ياخد وقت)

**3. عدّل الرابط (مهم!):**
- افتح `app/src/main/res/values/strings.xml`
- غيّر `https://noor-islamic.netlify.app` للرابط الحقيقي بتاعك
- افتح `app/src/main/AndroidManifest.xml`
- غيّر `android:host` في الـ intent-filter للرابط بتاعك

**4. Build الـ APK:**
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- أو: Build → Generate Signed Bundle/APK

**5. هتحصل على:**
- `app-debug.apk` — للاختبار
- `app-release.apk` — للنشر (لو عملت sign)

**6. بعت الـ APK:**
- بعت الملف للناس على WhatsApp/Telegram
- أو ارفعه على Google Drive
- لما يحملوه — يثبت زي أي تطبيق Android!

---

## 🚀 الطريقة 2: Build بدون Android Studio (Command Line)

### متطلبات:
- Java JDK 17+
- Android SDK
- Gradle 8.2+

### الخطوات:

```bash
# 1. حمّل Android SDK Command Line Tools
# 2. فك الضغط في ~/android-sdk
# 3. شغل:

export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 4. نزّل المكونات المطلوبة
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"

# 5. Build
./gradlew assembleRelease

# 6. هتلاقي الـ APK في:
# app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 🔐 Sign الـ APK (مهم للنشر)

لو عايز ترفعه على Google Play أو تبعته للناس:

```bash
# 1. أنشئ Keystore
keytool -genkey -v -keystore noor.keystore -alias noor -keyalg RSA -keysize 2048 -validity 10000

# 2. Sign الـ APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore noor.keystore app-release-unsigned.apk noor

# 3. Align
zipalign -v 4 app-release-unsigned.apk noor-islamic.apk
```

---

## 📱 بعد التثبيت — هتلاقي التطبيق:

| المكان | الشكل |
|--------|-------|
| **App Drawer** | ✅ أيقونة "نور" مع باقي التطبيقات |
| **Home Screen** | ✅ ممكن تضيف shortcut |
| **Settings → Apps** | ✅ يظهر كـ "نور — المنصة الإسلامية" |
| **Recent Apps** | ✅ يظهر باسم التطبيق |
| **Chrome** | ❌ **ما بيفتحش في Chrome** — يفتح في TWA |

---

## 🌐 الرابط اللازم يكون شغال (HTTPS)

التطبيق بيفتح الرابط ده مباشرة:
```
https://noor-islamic.netlify.app
```

لازم:
- ✅ الموقع يكون على **HTTPS**
- ✅ يكون فيه **manifest.json** صحيح
- ✅ يكون فيه **service-worker.js** شغال
- ✅ الرابط يكون **متاح** (مش localhost)

---

## 🔄 التحديثات

لما تعدّل الموقع:
- التطبيق هيتحدث **تلقائياً** (بيفتح الرابط الجديد)
- مفيش حاجة اسمها "update" — كل حاجة من الموقع
- لو عايز تغيّر الأيقونة أو الاسم — لازم تعمل **rebuild**

---

## 📦 هيكل المشروع

```
noor-twa/
├── build.gradle                    # Project build config
├── settings.gradle                 # Project settings
├── gradle.properties              # Gradle config
├── gradlew / gradlew.bat          # Gradle wrapper
├── gradle/wrapper/                # Gradle wrapper files
└── app/
    ├── build.gradle               # App build config
    ├── proguard-rules.pro         # ProGuard rules
    └── src/main/
        ├── AndroidManifest.xml    # App manifest
        ├── java/com/noor/islamic/ # Java/Kotlin code (TWA handles this)
        └── res/
            ├── values/
            │   ├── strings.xml    # App name, URL
            │   ├── themes.xml     # Colors, styles
            │   └── colors.xml     # Color definitions
            ├── drawable/
            │   └── splash_background.xml
            ├── mipmap-*/          # App icons (all densities)
            │   ├── ic_launcher.png
            │   ├── ic_launcher_round.png
            │   └── ic_launcher_foreground.png
            └── xml/
                └── file_paths.xml
```

---

## 🆘 المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| "App not installed" | فعل "Unknown sources" في إعدادات الجهاز |
| "URL not found" | تأكد من الرابط في strings.xml |
| White screen | تأكد من HTTPS + الرابط شغال |
| Chrome toolbar showing | تأكد من asset_statements صحيح |
| Slow first launch | عادي — بيحمل الموقع الأول مرة |

---

## 🎯 الخلاصة

**TWA = تطبيق Android حقيقي** بيفتح موقعك في Chrome بدون UI.

الناس هتثبته زي أي تطبيق — من APK — ويفتح في **نافذة منفصلة**.

مش اختصار. مش PWA. **تطبيق حقيقي.** ✅

---

## 📞 دعم

لو واجهت مشكلة في Build:
1. تأكد من Java 17+ مثبت
2. تأكد من Android SDK موجود
3. شغل `./gradlew --version` للتأكد
4. لو فشل — شغل `./gradlew assembleDebug` الأول

بالتوفيق! 🌙

#!/bin/bash
# Noor Islamic Platform - Build Script
# URL: https://al-islam-nour.netlify.app/

echo "🌙 Building Noor Islamic Platform APK..."
echo "🔗 URL: https://al-islam-nour.netlify.app/"

# Check if Android SDK is set
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set!"
    echo "Please set it to your Android SDK path"
    exit 1
fi

# Clean and build
./gradlew clean assembleDebug

echo "✅ Build complete!"
echo "📱 APK: app/build/outputs/apk/debug/app-debug.apk"

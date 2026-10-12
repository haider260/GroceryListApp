# Validation — 12 October 2026

This report describes the restored source in the current checkout.

- Strict TypeScript check passed.
- All 4 Jest suites passed: 12 tests covering CRUD, validation, combined filters/search, persistence recovery, and item-form submission.
- ESLint completed without errors. Inline-style and explicit `void` style warnings remain.
- Android Debug build succeeded for arm64-v8a, armeabi-v7a, x86, and x86_64. Development APK: `android/app/build/outputs/apk/debug/app-debug.apk`; this build requires Metro.
- Android production JavaScript bundling passed.
- iOS Release simulator build succeeded for arm64 with Xcode 26.4.1. Its JavaScript is bundled for operation without Metro.

Native dependencies report deprecation warnings. The local Node executable reported v25.2.1; use Node 24 LTS as documented because Node 25 is outside React Native's supported engine range.

Android emulator/device interaction, physical-device haptics, store signing, and all accessibility font sizes have not been verified.

The checked-in native XCTest passed against the restored Release app on iPhone 17 Pro / iOS 26.4: create a list, add an item, mark it purchased, terminate and relaunch, verify persistence, and confirm list deletion. The test operates without Metro.

The final smoke test also explicitly verified that the deleted list stayed absent after another app relaunch.

Visual checks: [light dashboard](screenshots/home-light.png) and [dark dashboard](screenshots/home-dark.png). These simulator screenshots contain test-created lists; fresh installations start empty.

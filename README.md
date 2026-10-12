# Freshlist

An offline grocery companion for iOS and Android, built with React Native CLI 0.87.1, React 19, and strict TypeScript. No accounts, Firebase, backend, or network access are needed for shopping.

## Run locally

Use Node 24 LTS (`nvm use`), npm, and the platform toolchains below. Node 25 is outside React Native 0.87's supported engine range.

```sh
npm ci
```

### iOS (macOS)

Install Xcode with an iOS simulator and Ruby/Bundler compatible with the included Gemfile.

```sh
bundle install
cd ios
bundle exec pod install
cd ..
npm start
```

In another terminal:

```sh
npm run ios
```

You can also open `ios/GroceryListApp.xcworkspace` in Xcode and select the `GroceryListApp` scheme. Configure your own signing team for a physical iPhone. If Xcode cannot find Node, set `NODE_BINARY` in the ignored `ios/.xcode.env.local` to your installed Node 24 executable.

### Android

Install Android Studio, JDK 17, Android SDK platform 37, Build Tools 37.0.0, and NDK 27.1.12297006. Set `JAVA_HOME` and `ANDROID_HOME`, accept SDK licenses, and start an emulator or connect a USB-debugging device. The Gradle wrapper downloads Gradle 9.4.1 on first use.

```sh
npm start
```

In another terminal:

```sh
npm run android
```

On a Mac with Homebrew JDK 17, a typical setup is:

```sh
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

Native build checks:

```sh
cd android
./gradlew assembleDebug
cd ..
xcodebuild -workspace ios/GroceryListApp.xcworkspace \
  -scheme GroceryListApp -configuration Release -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath /tmp/freshlist-ios-build CODE_SIGNING_ALLOWED=NO build
```

Debug builds use Metro. Release builds bundle JavaScript and work independently of Metro. Android's template release signing configuration is for local testing; configure your own upload key before store distribution.

## Using the app

- Create a list with the green plus button. New installations start empty.
- Open a list to add items, select quantities and categories, and optionally record an item's total price.
- Tap a checkbox to mark an item purchased. Search and All / Pending / Purchased filters combine.
- Tap an item or its pencil to edit. Swipe left or tap its trash icon to remove it, with confirmation.
- Use a list's options menu to rename or delete it. Deleting a list requires confirmation.
- Share exports a readable checklist through the native share sheet. It does not sync or collaborate.
- Appearance follows the device's light/dark setting. Progress animations honor reduced motion. Haptics honor platform support and system preferences.

Prices are optional numeric amounts in the user's preferred currency; no currency conversion is performed.

## Architecture

```text
App.tsx                      Hydration gate and save-error recovery
src/navigation/              Typed native stack and navigation theme
src/components/              Shared cards, item rows, forms, category chips, progress
src/screens/                 Home, list detail, add/edit item
src/store/useGroceryStore.ts  Zustand actions and search/filter state
src/services/storageService.ts  Validated, versioned AsyncStorage boundary
src/types/                   Domain models and navigation types
src/constants/               Category icons and colors
src/theme/                   Light/dark semantic colors
src/utils/                   Validation, selection, progress, sharing, IDs
__tests__/                   Domain, storage, store, and form tests
```

Storage uses `@freshlist/lists/v1`. Writes are serialized so rapid edits cannot overwrite newer snapshots. Read failures block editing and offer retry, preserving the original data. Write failures retain edits in memory and show a retry control. Unsaved edits cannot survive force-closing the app after a persistent storage failure. The storage service can be replaced or extended for future backend integration without putting network logic into UI components. Search and filters are transient; grocery data is persisted.

## Checks

```sh
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

Tests cover CRUD, purchased-state preservation when editing, combined search and filters, numeric validation, formatted sharing, hydration failure safety, queued write recovery, and submitting the item form.

Before distribution, verify on physical iOS and Android devices: keyboard handling, large accessibility text, swipe gestures, native sharing, haptics, dark mode, airplane-mode use, and persistence after restarting. Simulator compilation does not verify App Store signing or device-only haptics.

## Dependency notes

Reanimated 4 uses the New Architecture and the Worklets Babel plugin, configured last in `babel.config.js`. Gesture Handler wraps the application root, and native dependencies autolink through CocoaPods/Gradle. Setup references: [React Native releases](https://reactnative.dev/releases/) and [Reanimated CLI installation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/).

## Native iOS interaction test

With the Release app installed in a booted simulator, the standalone XCTest checks list creation, item entry, purchase marking, persistence after termination/relaunch, and confirmed list deletion. It creates a uniquely named test list and removes it after success.

```sh
bundle exec ruby e2e/ios/create-project.rb /tmp/FreshlistSmoke.xcodeproj
xcodebuild -project /tmp/FreshlistSmoke.xcodeproj -scheme Smoke \
  -destination 'platform=iOS Simulator,id=YOUR-SIMULATOR-UUID' \
  -derivedDataPath /tmp/FreshlistSmoke-build CODE_SIGNING_ALLOWED=NO test
```

Use `xcrun simctl list devices booted` to find the simulator UUID. See [validation results](docs/VALIDATION.md) for checks performed on this checkout.

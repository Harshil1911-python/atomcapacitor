# Atom Bills — Capacitor Android APK (100% Offline)

Offline-first POS / billing app packaged with **Capacitor** for Android.

- Data lives in **IndexedDB** (already offline-first)
- Web assets are bundled inside the APK → **works with no internet** after install
- Camera (BarcodeDetector + getUserMedia) for barcode scanner
- Native Share sheet via `@capacitor/share`
- **White status bar** (battery/time area) and **white navigation bar** (home/gesture area)

## Quick start (GitHub Actions – recommended)

1. Create a **new empty GitHub repository**.
2. Upload / push the contents of this folder (the whole Capacitor project) to that repo.
3. Go to **Actions** → **Build Atom Bills APK** → **Run workflow**.
4. When finished, download the artifact **AtomBills-debug-apk**.
5. Install the APK on your Android phone (enable “Install from unknown sources” if needed).

No local Android Studio required for the debug APK.

## Local development (optional)

```bash
npm install
npx cap add android          # only first time
npx cap sync android
npx cap open android         # opens Android Studio
# or build debug APK:
cd android && ./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Native packages included

| Package | Purpose |
|---------|---------|
| `@capacitor/core` + `@capacitor/android` | Core runtime |
| `@capacitor/status-bar` | White status bar + dark icons |
| `@capawesome/capacitor-navigation-bar` | White Android navigation bar |
| `@capawesome/capacitor-android-edge-to-edge-support` | Consistent system bars |
| `@capacitor/share` | Native share sheet (fallback to Web Share API) |
| `@capacitor/camera` | Extra camera helpers / permission surface |
| `@capacitor/app` | App lifecycle |

## Android permissions (auto-applied by workflow)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

- **CAMERA** → barcode scanner (getUserMedia + BarcodeDetector)
- INTERNET is kept so Google Fonts can still load when online; the app itself does **not** require network for billing/inventory.

## White system bars

- `theme-color` / manifest → `#ffffff`
- Capacitor StatusBar plugin → background `#ffffff`, style `LIGHT` (dark icons)
- NavigationBar plugin → `#ffffff`
- Android theme (`styles.xml`) sets `statusBarColor` + `navigationBarColor` to white and enables light icons.

## File layout

```
atom-capacitor/
├── www/                    ← all web assets (entry: index.html / billing.html)
├── capacitor.config.json
├── package.json
├── .github/workflows/build-apk.yml
└── README.md
```

## Notes

- Original Flask backend is **not** needed for the APK. Everything runs from local `www/` + IndexedDB.
- Scanner uses the browser **BarcodeDetector** API (supported on modern Chrome/WebView). If a device lacks it, the manual barcode input still works.
- First launch will ask for Camera permission when you open the scanner.
- To produce a **release/signed** APK or AAB for Play Store you will need to add a keystore and signing steps (not included in the debug workflow).

## Updating the web UI later

1. Edit files under `www/`.
2. Commit & push (or re-run the workflow).
3. Download the new APK.

---

Built for the repo: https://github.com/Harshil1911-python/atomdemo2  
Live web version was at atomdemo2.onrender.com (not required for the offline APK).

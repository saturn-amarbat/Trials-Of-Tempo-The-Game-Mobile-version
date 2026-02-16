# Trials of Tempo - Mobile Build Instructions

## ✅ Build Successful!
The Android APK has been generated and is ready for testing.

**APK Location:**
`android/app/build/outputs/apk/debug/app-debug.apk`

## 📲 How to Install on Your Android Device

### Option 1: Via USB (ADB) - Recommended
1.  Enable **Developer Options** and **USB Debugging** on your Android phone.
2.  Connect your phone to your computer via USB.
3.  Run the following command in your terminal:
    ```bash
    adb install android/app/build/outputs/apk/debug/app-debug.apk
    ```

### Option 2: Direct Copy
1.  Connect your phone to your computer.
2.  Copy the `app-debug.apk` file to your phone's storage (e.g., in the `Downloads` folder).
3.  On your phone, open a File Manager, navigate to `Downloads`, and tap the APK to install.
    *   *Note: You may need to allow "Install from Unknown Sources".*

## ⚠️ Known Mobile Issues & Considerations
*   **Audio Latency:** Android devices vary significantly in audio latency. Rhythm games are sensitive to this. If you notice the beat is "off," it might be a hardware limitation of the web-view wrapper.
*   **Performance:** Ensure your device is in "High Performance" mode if available.
*   **Sleep Mode:** The game might pause if the screen turns off.

## 🛠️ Development Notes
*   **Capacitor Version:** Downgraded to v6 to support Java 17 environment.
*   **Audio Sync:** Logic is in place to handle song looping, but extensive playtesting is required to confirm long-term sync stability.

## 🚀 Next Steps
1.  Play 3-4 full songs on the device.
2.  Test the "Swipe to Dash" vs "Joystick" controls.
3.  Report any lag or sync issues.

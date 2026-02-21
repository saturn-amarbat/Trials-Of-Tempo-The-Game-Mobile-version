# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.9.1] - 2026-02-15
### Added
- **Audio Configuration**: Implemented a robust `SettingsManager` for handling volume, haptics, and latency.
- **Settings Menu**: New UI accessible from the title screen to control Master Volume and Haptics.
- **Calibration Mode**: Interactive tool to measure and apply audio latency compensation for perfect rhythm sync on Android.
- **Mobile Deployment**: Integrated Capacitor (v6) for Android builds, supporting Java 17 environments.
- **Build Artifacts**: Generated debug APK (`android/app/build/outputs/apk/debug/app-debug.apk`).
- **Documentation**: Added `README_MOBILE.md` with installation instructions and known issues.
- **Config**: Added `vite.config.js` with relative base path (`./`) to fix asset loading on mobile.

### Fixed
- **Audio Sync**: Patched `playLoopSegment` in `sketch.js` to reset `lastMusicBeatTime` on loop restart, ensuring consistent beat detection.

### Removed
- **Credits Screen**: Completely removed the credits state, menu option, and "made by" text from Game Over/Title screens for cleaner UI.

## [0.9.0] - 2026-01-29
### Added
- **Mobile Controls**: Implemented a virtual joystick for movement.
- **Action Buttons**: Added dedicated touch buttons for Dash and Powerups.
- **Economy**: Basic credit accumulation system (credits saved to local storage).
- **Strategy**: Detailed mobile roadmap in `MOBILE_STRATEGY.md`.

### Changed
- Updated `sketch.js` to handle touch events for the new control scheme.
- Refactored `MOBILE_STRATEGY.md` to reflect completed "Phase 1" tasks.

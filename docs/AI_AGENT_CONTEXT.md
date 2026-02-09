# AI Agent Context & Developer Documentation
*Last Updated: February 2026*

## 1. Project Overview
**Name:** Trials of Tempo (Mobile Version)
**Genre:** Endless Rhythm-Action Runner
**Goal:** Transition a web-based p5.js prototype into a polished, high-retention mobile application.
**Core Loop:** Move and dash to the beat of the music. As the song loops, the BPM (speed) increases, making the game harder.

## 2. Technical Architecture & Stack
This project is a **hybrid** application using modern bundling (Vite) with legacy-style library injection.

*   **Runtime:** Browser (Mobile-first focus).
*   **Build Tool:** Vite (`npm run dev`, `npm run build`).
*   **Core Libraries:**
    *   `p5.js`: Rendering and main loop.
    *   `p5.sound`: Audio playback and analysis.
    *   `p5play` / `planck.js`: Physics engine (used lightly).
    *   *Note:* Libraries are loaded via `<script>` tags in `index.html` (located in `public/lib/`), NOT via npm imports.
*   **Code Structure:** ES6 Modules (`type="module"`), but crucial p5 functions (`setup`, `draw`) are manually bound to the `window` object to work with p5's global mode.

## 3. Codebase Map
### `src/sketch.js` (The Monolith)
This is the entry point and contains 90% of the game logic.
*   **State Machine:** A switch statement in `draw()` handles states: `waitingForInput`, `intro`, `title`, `playing`, `gameOver`, etc.
*   **Game Loop:** `updateGame()` handles physics/logic, `drawGame()` handles rendering.
*   **Input Handling:** Contains the `touchStarted`, `touchMoved`, `touchEnded` overrides.

### `src/Config.js`
Contains global constants. **ALWAYS** check this file before hardcoding numbers.
*   `LOGICAL_WIDTH` / `LOGICAL_HEIGHT`: The fixed internal resolution (960x540) which is scaled to fit the screen.
*   `GAME_CONSTANTS`: Physics values, speeds, cooldowns.

### `public/`
*   `assets/`: Audio and visual assets.
*   `lib/`: Local copies of p5 libraries.

## 4. Key Systems (Technical Detail)

### 🎮 Input System (Mobile Optimized)
The input system handles both Keyboard (Desktop debug) and Touch (Mobile).
*   **Dynamic Joystick:** Implemented in `VirtualJoystick` class. It is invisible by default and activates anywhere on the **left half** of the screen where the user touches.
*   **Gestures (Swipes):** A custom swipe detection logic exists in `touchEnded`.
    *   Threshold: >30px distance, <400ms duration.
    *   Action: Triggers `performDash()` in the swipe direction.
*   **Haptics:** Uses `navigator.vibrate()` via `triggerHaptic()`.

### 🎵 Rhythm Engine
*   **BPM Scaling:** The variable `musicSpeed` increases slightly every frame. `bpm` is derived from this.
*   **Beat Detection:** `framesPerBeat(bpm)` calculates frames between beats. The `onBeat()` function is called when `activeSong.currentTime()` passes a calculated threshold.
*   **Audio Lag:** We use the actual audio time (`currentTime()`) rather than frame counting for synchronization to avoid drift.

### 📱 Resolution & Scaling
The game uses a "Logical Resolution" strategy.
*   `calculateGameScale()` determines a `gameScale` factor to fit 960x540 into the window while maintaining aspect ratio.
*   Inputs (`mouseX`, `touches`) are transformed via `getLogicalMouseX/Y()` to match the game logic coordinates.

## 5. Directives for Future Agents
1.  **Respect Global Bindings:** When editing `sketch.js`, ensure `window.setup`, `window.draw`, etc., remain bound at the bottom of the file. Removing them breaks the game.
2.  **Mobile First:** Any gameplay change must be tested against touch controls. Do not rely solely on keyboard mappings.
3.  **Performance:** Avoid creating objects in `draw()`. Use object pooling (currently implemented for particles) where possible.
4.  **Style:** Follow the existing ES6 module pattern. Use `const`/`let`, not `var`.
5.  **Documentation:** Update this file if you add a new major system (e.g., Shop, Quests).

## 6. Current Status & Roadmap
Refer to `MOBILE_STRATEGY.md` for the active product roadmap.
*   **Current Phase:** Phase 1 (Technology & Input) - *Mostly Complete*.
*   **Next Steps:**
    *   Testing on real devices (Capacitor/Cordova wrapper).
    *   Phase 2: Metagame (Shop, upgrades, persistent currency).

## 7. Useful Commands
*   `npm install`: Setup dependencies.
*   `npm run dev`: Start local server.
*   `npm run lint`: Check code quality.

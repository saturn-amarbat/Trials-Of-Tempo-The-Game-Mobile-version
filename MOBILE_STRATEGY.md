# Trials of Tempo - Mobile Transition Strategy & Roadmap

## 🎯 Core Objective
Transition "Trials of Tempo" from a web prototype to a high-retention, profitable mobile application.

## 🔑 Key Focus Areas for Profitability
To succeed in the mobile market, you must move beyond "fun gameplay" to "systems that drive engagement and revenue."

1.  **Audio Latency & Input Precision:** The #1 killer of mobile rhythm games is lag.
2.  **The "Metagame" (Progression):** Players need a reason to play *tomorrow*, not just today.
3.  **Monetization Integration:** Ads and purchases must feel natural, not intrusive.

---

## 📅 Phased Roadmap

### Phase 1: Technology & Input (The Foundation)
*Decision: Wrap current JS code or Port?*
*   **Immediate Action:** Test the current p5.js game in a **Capacitor** or **Cordova** wrapper on a real Android device.
    *   *Risk Check:* Is the audio sync tight? If yes, stick with JS. If no, you **must** port to Unity, Godot, or Flutter (Flame Engine).
*   **Control Overhaul:**
    *   ✅ Replace Arrow Keys with **Touch Gestures**.
    *   ✅ *Swipe:* Move lanes / Dash. (Implemented as Joystick + Dash Button)
    *   ✅ *Tap:* Activate Powerup. (Implemented as Button)
    *   ✅ *Virtual Joystick:* Optional, but swipes feel more "native" for lane changers. (Implemented Visual Joystick)

### Phase 2: The Metagame (Retention Loop)
*Why play again?*
*   **Soft Currency (Credits):** Earned during runs. ✅ (Implemented basic saving)
*   **Shop System:**
    *   **Upgrades:** Permanent boosts (Start with Shield, Longer Dash, Magnet Radius).
    *   **Cosmetics:** New Ship skins, Trail colors (Visuals = high monetization potential).
*   **Quest System:** "Dodge 50 obstacles", "Reach 500m". Rewards Credits.

### Phase 3: Monetization Design (Revenue)
*   **Rewarded Ads (High Priority):**
    *   "Watch to Revive" (Once per run).
    *   "Watch to Double Credits" (End of run).
    *   *Why:* Players *choose* these, making them less annoying.
*   **In-App Purchases (IAP):**
    *   "No Ads" (One-time purchase).
    *   "Coin Doubler".
    *   "Song Packs" (Unlock new BGM tracks).

### Phase 4: Juice & Polish (User Experience)
*   **Haptic Feedback:** Vibrate on beat, damage, and menu clicks.
*   **Visual Clarity:** Ensure fingers don't cover the player/obstacles.
*   **Performance:** consistent 60 FPS is mandatory.

### Phase 5: Launch & ASO
*   **App Store Optimization:** Keywords ("Rhythm", "Cyberpunk", "Reflex"), Screenshots.
*   **Analytics:** Integrate Firebase/Unity Analytics to track where players quit.

---

## 📝 Daily Action Plan (Backlog)

### Day 1-3: Feasibility
- [ ] Set up a Capacitor.js project with the current build.
- [ ] Deploy to a phone.
- [ ] **Crucial Test:** Does the audio drift after 2 minutes?

### Day 4-7: Controls
- [ ] Implement `touchStarted`, `touchMoved`, `touchEnded` in p5.js.
- [ ] Create a "Mobile Mode" flag in code to toggle between Keyboard/Touch.

### Day 8-14: Progression Prototype
- [ ] Create a `PlayerData` object (coins, unlocked_items).
- [ ] Save/Load this data to `localStorage` (or native storage).
- [ ] Build a simple "Shop" screen (separate `gameState`).

### Day 15+: Monetization
- [ ] Sketch out the "Revive" screen UI.
- [ ] Research AdMob integration.

---
*Created: Jan 24, 2026*

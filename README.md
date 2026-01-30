# Trials of Tempo

An endless rhythm-action runner built with p5.js where music difficulty scales dynamically with BPM.

[**Play Now**](https://saturn-amarbat.github.io/Trials-Of-Tempo-The-Game/) | [View Source](https://github.com/saturn-amarbat/Trials-Of-Tempo-The-Game)

## Overview

This project started as a final assignment for ART151 exploring rhythm-based game mechanics. Players navigate a jetpack-equipped character through procedurally-spawned obstacles synchronized to an EDM soundtrack. The core challenge comes from escalating difficulty—each music loop increases BPM and obstacle density, requiring tighter timing and faster reflexes.

Built entirely with vanilla JavaScript and p5.js libraries with no build system required.

## Gameplay Preview

<p align="center">
  <img src="assets/visuals/gameplay.gif" alt="Gameplay demonstration" width="640">
</p>

## Key Features

- Dynamic difficulty scaling tied to music tempo and loop count
- Beat-synchronized obstacle spawning and screen effects
- Dash mechanic with visual cooldown tracking
- Powerup system (speed boost, screen-clearing shockwave)
- Parallax background layers for depth
- Local high score persistence
- Four playable characters with animated sprites

## Technical Implementation

- **JavaScript + p5.js** for rendering and game loop
- **p5.sound** for audio playback and timing synchronization
- **p5play/Planck.js** for collision detection
- No build tools or bundlers—runs directly in browser

## Running Locally

**Requirements:** Python 3 (or any local HTTP server)

```bash
git clone https://github.com/saturn-amarbat/Trials-Of-Tempo-The-Game.git
cd Trials-Of-Tempo-The-Game
python3 -m http.server 8000
```

Navigate to `http://localhost:8000`. Click once to enable audio, then press any key to skip the intro.

Alternative servers: `npx serve` or `php -S localhost:8000`

## Controls

### Desktop (Keyboard)
| Input             | Action           |
| ----------------- | ---------------- |
| WASD / Arrow Keys | Movement         |
| Shift             | Dash             |
| Space             | Activate powerup |
| P                 | Pause            |

### Mobile (Touch)
| Input             | Action           |
| ----------------- | ---------------- |
| Virtual Joystick  | Movement         |
| DASH Button       | Dash             |
| PWR Button        | Activate powerup |

## Development Status

Current version is a functional prototype (v0.8). Planned improvements include mobile controls, online leaderboards, additional boss mechanics, and difficulty selection UI.

## Team

- **Saturn Amarbat** — Lead developer (game loop, rhythm systems, audio sync, deployment)
- **Tsuyoshi Harayama** — Developer (code refactoring, optimization)
- **Frankie Salud** — Artist (character sprites, level design)
- **Cacola** — Original music

Built with p5.js, p5.sound, p5play, and Planck.js.

## License

MIT License (see [LICENSE](LICENSE)). Music rights reserved by Cacola.

## Documentation

Additional project docs:

- [Game Design Document](docs/GAME_DESIGN.md)
- [Development Roadmap](docs/ROADMAP.md)
- [Git Workflow Guide](docs/GIT_GUIDE.md)

---

**ART151 Final Project — Winter 2025**

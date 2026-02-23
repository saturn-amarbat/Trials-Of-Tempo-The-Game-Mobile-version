export const LOGICAL_WIDTH = 960;
export const LOGICAL_HEIGHT = 540;

export const GAME_CONSTANTS = {
  PLAYER_BASE_SPEED: 10,
  ACCEL: 1,
  MAX_VEL: 20,
  DRAG: 0.9,
  DASH_POWER: 8,
  DASH_COOLDOWN_MAX: 90,
  DASH_DURATION_MAX: 12,
};

export const UPGRADES = {
  dashCooldown: {
    name: 'Dash Cool',
    baseCost: 100,
    costMult: 1.5,
    // Lower is better (frames)
    values: [90, 80, 70, 60, 50],
    maxLevel: 4,
  },
  shieldDuration: {
    name: 'Shield Time',
    baseCost: 150,
    costMult: 1.5,
    // Higher is better (frames)
    values: [300, 450, 600, 750, 900],
    maxLevel: 4,
  },
  magnetRadius: {
    name: 'Magnet',
    baseCost: 200,
    costMult: 1.5,
    // Radius in pixels
    values: [0, 150, 250, 350, 500],
    maxLevel: 4,
  },
};

export const DIFFICULTIES = {
  easy: { damage: 15, dashCooldownMax: 70 },
  normal: { damage: 25, dashCooldownMax: 90 },
  hard: { damage: 35, dashCooldownMax: 110 },
};

export const ASSETS = {
  AUDIO: {
    GAME_OVER: '/assets/audio/GameOver.mp3',
    // Add others if needed
  },
  VISUALS: {
    INTRO: '/assets/visuals/Opening.mp4',
    // Add others if needed
  },
};

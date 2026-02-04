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

//Final Project

//Members of team: Saturn, Yoshi, Frankie

//Beta version

// Trials of Tempo - Endless Ramping Version last revised by Saturn on Yoshi's beat implementation

// ─── RESOLUTION SETTINGS ───
const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
let gameScale = 1;
let offsetX = 0;
let offsetY = 0;

let lastDir = "right";
let frameIndex = 0;
let frameTimer = 0;
let frameDelay = 6;
let playerSheets = [];
let sheet;
let goalY;

// ─── ASSETS ───
let playerSprites = [];
let coinSprites = [];
let powerupShield, powerupSpeed;
let explosionSprite, smokeFX;
let shadowSprite, highlightSprite;

let sfxButton, sfxJet, sfxJetPower, sfxPowerUp, sfxDamage, sfxGameOver;

// ─── GAME STATE ───
let gameState = "intro";
let introVideo;
let autoScrollSpeed = 2;
let songDuration = 236;

// ─── PLAYER ───
let player;
let playerHealth = 100;
let playerMaxHealth = 100;
let playerSpeed = 10;
const basePlayerSpeed = 10;
let playerInvincible = 0;
let hurtTimer = 0;

// PHYSICS
let accel = 1;
let maxVel = 20;
let drag = 0.9;

// DASH
let dashCooldown = 0;
let dashDuration = 0;
let dashPower = 8;
let dashCooldownMax = 90;
let dashDurationMax = 12;

// SHOCKWAVE VARIABLES
let shockwaveActive = false;
let shockwaveRadius = 0;

// ─── CUSTOMIZATION ───
let selectedCharacter = 0;
let useOriginalCharacter = true;

// ─── RHYTHM ───
let loopTimer = null;
let beatThreshold = 0.25;
let titleSong;
let gameIntroSong; // Yellow-and-Purple(first).mp3
let gameLoopSong; // Yellow-and-Purple(loop).mp3
let musicSpeed = 1.0; // this will increase every loop
let loopCount = 0;
let bpm = 90;
let beatInterval;
let lastBeatFrame = 0;
let bgPulse = 0;
let lastMusicBeatTime = 0;
let musicSessionID = 0; // ✅ invalidates all old music loops

// ─── DIFFICULTY ───
let difficulty = "normal";
const difficulties = {
  easy: { damage: 15, dashCooldownMax: 70 },
  normal: { damage: 25, dashCooldownMax: 90 },
  hard: { damage: 35, dashCooldownMax: 110 },
};

function framesPerBeat(bpmValue) {
  return floor(3600 / bpmValue);
}

function applyDifficultyFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const d = (params.get("difficulty") || "").toLowerCase();
    if (d && difficulties[d]) {
      difficulty = d;
    }
  } catch (e) {
    console.warn("Difficulty parse failed", e);
  }
}
applyDifficultyFromURL();

// ─── SYSTEM ARRAYS ───
let obstacles = [];
let powerups = [];
let activePowerup = null;
let powerupDuration = 0;
let queuedPowerup = null;
let collectibles = [];

// ─── CAMERA & STAGE ───
let cameraY = 0;
let parallaxLayers = [];
let stageStartY = 0;
let sessionStartFrame = 0;

// ─── EFFECTS ───
let screenShake = 0;
let flashAlpha = 0;
let rgbHue = 0;
let pulseScale = 1;
let particles = [];

// ─── BOSS ───
let boss = null;
let bossPhase = 1;
let bossHealth = 100;

// ─── UI / SCORE ───
let score = 0;
let comboMultiplier = 1;
let comboTimer = 0;
let displayedHealth = 100;

// ─── HIGH SCORE SYSTEM ───
let highScore = 0;
let bestTime = 0;

function preload() {
  titleSong = loadSound(
    "assets/audio/Unused-Assets.mp3",
    () => {},
    () => console.warn("Title missing"),
  );
  // gameSong = loadSound("Yellow-and-Purple.mp3", () => {}, () => console.warn("Main music missing"));
  gameIntroSong = loadSound(
    "assets/audio/Yellow-and-Purple1.mp3",
    () => {},
    () => console.warn("First music missing"),
  );
  gameLoopSong = loadSound(
    "assets/audio/Yellow-and-Purple2.mp3",
    () => {},
    () => console.warn("Loop music missing"),
  );
  // gameIntroSong = loadSound("Yellow-and-Purple(first).mp3");
  // gameLoopSong  = loadSound("Yellow-and-Purple(loop).mp3");

  sfxButton = loadSound(
    "assets/audio/ButtonPress.mp3",
    () => {},
    () => console.warn("ButtonPress missing"),
  );
  sfxJet = loadSound(
    "assets/audio/JetEngine.mp3",
    () => {},
    () => console.warn("JetEngine missing"),
  );
  sfxJetPower = loadSound(
    "assets/audio/JetEnginePoweredUp.mp3",
    () => {},
    () => console.warn("JetPower missing"),
  );
  sfxPowerUp = loadSound(
    "assets/audio/PowerUp.mp3",
    () => {},
    () => console.warn("PowerUp missing"),
  );
  sfxDamage = loadSound(
    "assets/audio/Damage.mp3",
    () => {},
    () => console.warn("Damage missing"),
  );
  sfxGameOver = loadSound(
    "assets/audio/GameOver.mp3",
    () => {},
    () => console.warn("GameOver missing"),
  );

  playerSheets[0] = loadImage("assets/visuals/Player1.gif");
  playerSheets[1] = loadImage("assets/visuals/Player2.gif");
  playerSheets[2] = loadImage("assets/visuals/Player3.gif");
  playerSheets[3] = loadImage("assets/visuals/Player4.gif");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGameScale();
  loadHighScore();
  colorMode(HSB, 360, 100, 100, 255);
  textFont("Rajdhani");
  beatInterval = framesPerBeat(bpm);
  initParallax();
  resetPlayer();

  // Hide loading screen
  const loadingScreen = document.getElementById('loading');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.remove(), 500);
  }

  introVideo = createVideo("assets/visuals/Opening.mp4");
  introVideo.size(LOGICAL_WIDTH, LOGICAL_HEIGHT);
  introVideo.hide(); // draw manually
  introVideo.volume(0.6);
  introVideo.play();

  // setupMusicLoopSpeeding();
}

// ─── DYNAMIC SCALING LOGIC ───
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGameScale();
}

function calculateGameScale() {
  let scaleX = windowWidth / LOGICAL_WIDTH;
  let scaleY = windowHeight / LOGICAL_HEIGHT;
  gameScale = min(scaleX, scaleY);
  offsetX = (windowWidth - LOGICAL_WIDTH * gameScale) / 2;
  offsetY = (windowHeight - LOGICAL_HEIGHT * gameScale) / 2;
}

function getLogicalMouseX() {
  return (mouseX - offsetX) / gameScale;
}

function getLogicalMouseY() {
  return (mouseY - offsetY) / gameScale;
}

function draw() {
  background(0);

  push();
  translate(offsetX, offsetY);
  scale(gameScale);

  if (gameState === "playing") {
    let activeSong = null;

    if (gameIntroSong && gameIntroSong.isPlaying()) {
      activeSong = gameIntroSong;
    } else if (gameLoopSong && gameLoopSong.isPlaying()) {
      activeSong = gameLoopSong;
    }

    if (activeSong) {
      let musicTime = activeSong.currentTime();
      let secondsPerBeat = 60 / bpm;

      if (musicTime >= lastMusicBeatTime + secondsPerBeat) {
        onBeat();
        lastMusicBeatTime += secondsPerBeat; // ✅ ACCUMULATE, DO NOT RESET
        lastBeatFrame = frameCount;
      }
    }
  }

  let beatProgress = (frameCount - lastBeatFrame) / beatInterval;
  pulseScale = 1 + sin(beatProgress * PI) * 0.05;
  rgbHue = (rgbHue + 0.5) % 360;
  if (screenShake > 0) screenShake *= 0.7;

  push();
  if (screenShake > 0) {
    translate(
      random(-screenShake, screenShake),
      random(-screenShake, screenShake),
    );
  }

  switch (gameState) {
    case "intro":
      drawIntro();
      break;
    case "title":
      drawTitle();
      break;
    case "levelSelect":
      gameState = "playing";
      break;

    case "customize":
      drawCustomize();
      break;
    case "instructions":
      drawInstructions();
      break;
    case "playing":
      updateGame();
      drawGame();
      break;
    case "paused":
      drawGame();
      drawPausedOverlay();
      break;
    case "gameOver":
      drawGameOver();
      break;
    case "victory":
      drawVictory();
      break;
    case "credits":
      drawCredits();
      break;
  }
  pop();

  if (flashAlpha > 0) {
    noStroke();
    fill(0, 0, 100, flashAlpha * 0.3);
    rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    fill(60, 90, 100, flashAlpha * 0.1);
    rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    flashAlpha *= 0.85;
  }

  drawScanlines();

  pop();
}

// ─── TITLE ───
function drawTitle() {
  // Dynamic Background
  let bgHue = (frameCount * 0.2) % 360;
  background(bgHue, 40, 10); // Dark shifting background

  drawParallaxBG();
  drawAnimatedGrid();
  
  if (titleSong && titleSong.isLoaded() && !titleSong.isPlaying())
    titleSong.loop();
  if (gameIntroSong && gameIntroSong.isPlaying()) gameIntroSong.stop();
  if (gameLoopSong && gameLoopSong.isPlaying()) gameLoopSong.stop();

  push();
  translate(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 3);
  
  // Floating Title
  let floatY = sin(frameCount * 0.05) * 10;
  translate(0, floatY);
  
  scale(pulseScale);
  
  // Shadow
  fill(bgHue, 90, 50);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("TRIALS OF TEMPO", 4, 4);
  
  // Main Text
  fill(rgbHue, 90, 100);
  text("TRIALS OF TEMPO", 0, 0);
  
  // Glitch effect on title
  if (frameCount % 60 < 5) {
      fill(255);
      text("TRIALS OF TEMPO", random(-2, 2), random(-2, 2));
  }
  pop();

  fill(0, 0, 90);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Endless Rhythm Adventure", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 30);

  let mx = getLogicalMouseX();
  let my = getLogicalMouseY();

  drawMenuButton(
    "START",
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2 + 40,
    220,
    50,
    mx,
    my,
  );
  drawMenuButton(
    "CUSTOMIZE",
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2 + 100,
    220,
    50,
    mx,
    my,
  );
  drawMenuButton(
    "INSTRUCTIONS",
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2 + 160,
    220,
    50,
    mx,
    my,
  );

  fill(0, 0, 90);
  textSize(24);
  text("HIGH SCORE: " + highScore, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT - 70);

  fill(0, 0, 60);
  textSize(12);
  text("Music by Cacola", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT - 30);

  drawBeatIndicator();
}

function drawMenuButton(label, x, y, w, h, mx, my) {
  let hover =
    mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2;
  push();
  rectMode(CENTER);
  noStroke();
  fill(hover ? rgbHue : rgbHue, hover ? 80 : 60, hover ? 90 : 40);
  rect(x, y, hover ? w + 10 : w, hover ? h + 4 : h, 8);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(label, x, y);
  pop();
}

// ─── CUSTOMIZE ───
function drawCustomize() {
  fill(240, 80, 10);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawParallaxBG();
  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("CUSTOMIZE", LOGICAL_WIDTH / 2, 80);

  let startX = LOGICAL_WIDTH / 2 - 180;
  let mx = getLogicalMouseX();
  let my = getLogicalMouseY();

  for (let i = 0; i < 4; i++) {
    let x = startX + i * 120;
    let y = LOGICAL_HEIGHT / 2;
    let selected = i === selectedCharacter;
    let hover = dist(mx, my, x, y) < 50;
    drawCharacterPreview(i, x, y, selected || hover);
  }
  drawMenuButton(
    "BACK",
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT - 80,
    160,
    36,
    mx,
    my,
  );
}

function drawCharacterPreview(charIndex, x, y, highlighted) {
  let sheet = playerSheets[charIndex];
  if (!sheet) return;
  let frameW = sheet.width / 4;
  let frameH = sheet.height / 2;
  push();
  translate(x, y);
  if (highlighted) {
    noFill();
    stroke(rgbHue, 90, 100);
    strokeWeight(3);
    ellipse(0, 0, 90, 90);
  }
  imageMode(CENTER);
  image(sheet, 0, 0, 48, 80, frameW * 2, 0, frameW, frameH);
  pop();
}

function drawInstructions() {
  fill(240, 80, 10);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawParallaxBG();

  fill(rgbHue, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("HOW TO PLAY", LOGICAL_WIDTH / 2, 80);

  fill(0, 0, 90);
  textSize(16);
  textAlign(LEFT, TOP);

  let x = LOGICAL_WIDTH / 2 - 250;
  let y = 150;
  let lineHeight = 34;

  text("CONTROLS:", x, y);
  y += lineHeight;

  fill(0, 0, 80);
  text("UP / W  - Fly Up", x + 20, y);
  y += lineHeight;
  text("LEFT / A  - Move Left", x + 20, y);
  y += lineHeight;
  text("RIGHT / D - Move Right", x + 20, y);
  y += lineHeight;
  text("DOWN / S - Move Down", x + 20, y);
  y += lineHeight;
  text("SHIFT - Dash", x + 20, y);
  y += lineHeight + 10;
  text("SPACE - Use Powerup", x + 20, y);
  y += lineHeight + 10;

  fill(0, 0, 90);
  text("OBJECTIVE:", x, y);
  y += lineHeight;

  fill(0, 0, 80);
  text("- Dodge obstacles to the beat", x + 20, y);
  y += lineHeight;
  text("- Collect powerups & gems", x + 20, y);
  y += lineHeight;
  text("- Survive as long as possible", x + 20, y);
  y += lineHeight + 10;

  fill(0, 0, 90);
  text("TIPS:", x, y);
  y += lineHeight;

  fill(0, 0, 80);
  text("- Stay moving to avoid traps", x + 20, y);
  y += lineHeight;
  text("- Use dash to escape tight gaps", x + 20, y);

  let mx = getLogicalMouseX();
  let my = getLogicalMouseY();
  drawMenuButton(
    "BACK",
    LOGICAL_WIDTH - 100,
    LOGICAL_HEIGHT - 50,
    160,
    36,
    mx,
    my,
  );
}

// ─── UPDATE & DRAW GAME ───
function updateGame() {
  // ✅ BPM & scroll are now driven ONLY by music loops
  autoScrollSpeed = constrain(autoScrollSpeed, 2, 12);
  bpm = constrain(bpm, 90, 200);
  beatInterval = framesPerBeat(bpm);

  cameraY -= autoScrollSpeed;

  // PHYSICS SCALING
  let bpmFactor = map(bpm, 90, 200, 1.0, 2.0);
  accel = bpmFactor;
  maxVel = 20 * bpmFactor;

  let targetSpeed = basePlayerSpeed + autoScrollSpeed * 1.5;
  if (activePowerup === "speed") targetSpeed += 5;
  playerSpeed = lerp(playerSpeed, targetSpeed, 0.05);

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) player.vy -= accel;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) player.vy += accel;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) player.vx -= accel;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.vx += accel;

  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && sfxJet && sfxJet.isLoaded()) {
    if (!sfxJet.isPlaying()) sfxJet.loop();
  } else {
    if (sfxJet && sfxJet.isPlaying()) sfxJet.stop();
  }

  // Dash Logic
  if (dashDuration > 0) {
    dashDuration--;
    player.vx *= 1.08;
    player.vy *= 1.08;
  }
  if (dashCooldown > 0) dashCooldown--;

  // Physics Application
  player.vx = constrain(player.vx, -maxVel, maxVel);
  player.vy = constrain(player.vy, -maxVel, maxVel);
  player.vx *= drag;
  player.vy *= drag;
  player.x += player.vx;
  player.y += player.vy;

  player.x = constrain(player.x, 30, LOGICAL_WIDTH - 30);
  player.y = constrain(player.y, cameraY + 20, cameraY + LOGICAL_HEIGHT - 20);

  if (playerInvincible > 0) playerInvincible--;
  if (hurtTimer > 0) hurtTimer--;

  // Shockwave
  if (shockwaveActive) {
    shockwaveRadius += 40;
    if (shockwaveRadius > LOGICAL_WIDTH * 1.5) {
      shockwaveActive = false;
      shockwaveRadius = 0;
    }
  }

  // Obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();
    if (obs.y > cameraY + LOGICAL_HEIGHT + 120) {
      obstacles.splice(i, 1);
      score += 10 * comboMultiplier;
      continue;
    }
    if (playerInvincible === 0 && checkCollision(player, obs)) {
      if (activePowerup === "shield") {
        activePowerup = null;
        powerupDuration = 0;
        flashAlpha = 100;
        score += 50;
      } else {
        onPlayerHit();
      }
      obstacles.splice(i, 1);
    }
  }

  // Powerups (Delete if below screen)
  for (let i = powerups.length - 1; i >= 0; i--) {
    let pow = powerups[i];
    pow.rotation += 3;

    if (pow.y > cameraY + LOGICAL_HEIGHT + 120) {
      powerups.splice(i, 1);
      continue;
    }

    if (dist(player.x, player.y, pow.x, pow.y) < 30) {
      if (!queuedPowerup && !activePowerup) queuedPowerup = pow.type;
      else score += 150;
      powerups.splice(i, 1);
      score += 100;
    }
  }

  // Collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    let gem = collectibles[i];
    gem.spin += 5;

    if (gem.y > cameraY + LOGICAL_HEIGHT + 120) {
      collectibles.splice(i, 1);
      continue;
    }

    let d = dist(player.x, player.y, gem.x, gem.y);
    if (d < 120) {
      gem.x += (player.x - gem.x) * 0.03;
      gem.y += (player.y - gem.y) * 0.03;
    }
    if (d < 26) {
      score += 50 * comboMultiplier;
      comboMultiplier = min(comboMultiplier + 0.05, 5);
      comboTimer = 180;
      collectibles.splice(i, 1);
      for (let k = 0; k < 6; k++)
        spawnParticle(player.x, player.y, color(50, 90, 100));
    }
  }

  if (powerupDuration > 0) {
    powerupDuration--;
    if (powerupDuration === 0) {
      activePowerup = null;
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) comboMultiplier = max(1, comboMultiplier - 0.25);
  }

  displayedHealth = lerp(displayedHealth, playerHealth, 0.15);
  if (particles.length > 200) particles.splice(0, particles.length - 200);
}

function drawGame() {
  fill(240, 80, 10);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  drawParallaxBG();
  drawAnimatedGrid();
  push();
  translate(0, -cameraY);

  for (let obs of obstacles) obs.draw();
  for (let pow of powerups) drawPowerup(pow);
  for (let gem of collectibles) drawCollectible(gem);

  drawPlayer();
  for (let p of particles) p.draw();

  if (shockwaveActive) {
    noFill();
    stroke(180, 0, 100, 150);
    strokeWeight(20);
    ellipse(player.x, player.y, shockwaveRadius, shockwaveRadius);
  }

  pop();
  drawGameUI();
}

function drawCollectible(gem) {
  let coinIndex = floor((frameCount / 8) % 4);
  push();
  translate(gem.x, gem.y);
  if (shadowSprite) {
    imageMode(CENTER);
    tint(0, 0, 0, 80);
    image(shadowSprite, 2, 2, 32, 32);
    noTint();
  }
  if (coinSprites[coinIndex]) {
    imageMode(CENTER);
    rotate(radians(gem.spin * 0.5));
    image(coinSprites[coinIndex], 0, 0, 28, 28);
  } else {
    rotate(radians(gem.spin));
    noStroke();
    fill(50, 90, 100);
    quad(-10, 0, 0, -14, 10, 0, 0, 14);
  }
  pop();
}

function drawPlayer() {
  let movingLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
  let movingRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);

  if (movingLeft || movingRight) {
    frameIndex = frameIndex === 0 ? 1 : 0;
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    lastDir = "left";
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    lastDir = "right";
  }

  let frameW = sheet.width / 4;
  let frameH = sheet.height / 2;
  let row = activePowerup === "speed" ? 1 : 0;
  let col = lastDir === "left" ? frameIndex : frameIndex + 2;

  let sx = col * frameW;
  let sy = row * frameH;

  push();
  translate(player.x, player.y);

  if (playerInvincible > 0 && frameCount % 6 < 3) {
    pop();
    return;
  }

  if (hurtTimer > 0) tint(255, 100, 100);

  imageMode(CENTER);
  image(sheet, 0, 0, 48, 80, sx, sy, frameW, frameH);

  noTint();
  pop();
}

function drawGameUI() {
  push();
  fill(0, 0, 0, 120);
  noStroke();
  rect(0, 0, LOGICAL_WIDTH, 100);
  fill(0, 0, 90);
  textAlign(LEFT, TOP);
  textSize(14);
  text("HEALTH", 20, 18);
  noFill();
  stroke(0, 0, 60);
  strokeWeight(2);
  rect(20, 40, 200, 12, 6);
  noStroke();
  fill(0, 90, 100);
  let healthWidth = map(displayedHealth, 0, playerMaxHealth, 0, 200);
  rect(20, 40, healthWidth, 12, 6);
  fill(50, 90, 100);
  textAlign(RIGHT, TOP);
  textSize(18);
  text("SCORE: " + floor(score), LOGICAL_WIDTH - 20, 18);
  if (comboMultiplier > 1) {
    fill(320, 90, 100);
    textSize(16);
    text("x" + comboMultiplier.toFixed(1) + " COMBO!", LOGICAL_WIDTH - 20, 44);
  }

  // Stats
  fill(0, 0, 90);
  textAlign(CENTER, TOP);
  textSize(16);
  let timeAlive = floor((frameCount - sessionStartFrame) / 60);
  text(
    "TIME: " + timeAlive + "s  |  BPM: " + floor(bpm),
    LOGICAL_WIDTH / 2,
    18,
  );

  // Powerup Bar
  if (activePowerup) {
    fill(0, 0, 90);
    textAlign(LEFT, TOP);
    textSize(14);
    text("POWERUP: " + activePowerup.toUpperCase(), 20, 72);
    noFill();
    stroke(180, 80, 100);
    strokeWeight(2);
    rect(120, 72, 100, 8, 4);
    noStroke();
    fill(180, 80, 100);
    rect(120, 72, (powerupDuration / 300) * 100, 8, 4);
  } else if (queuedPowerup) {
    fill(0, 0, 90);
    textAlign(LEFT, TOP);
    textSize(14);
    text("READY: " + queuedPowerup.toUpperCase() + " (SPACE)", 20, 72);
  }

  // Dash Bar
  noFill();
  stroke(300, 60, 80);
  strokeWeight(2);
  rect(LOGICAL_WIDTH - 140, 72, 120, 8, 4);
  noStroke();
  fill(300, 60, 80);
  let dashMax = difficulties[difficulty].dashCooldownMax;
  let dashReady = 1 - dashCooldown / dashMax;
  rect(LOGICAL_WIDTH - 140, 72, dashReady * 120, 8, 4);
  fill(0, 0, 80);
  textAlign(RIGHT, TOP);
  textSize(10);
  text(
    dashCooldown === 0 ? "Dash Ready (Shift)" : "Dash",
    LOGICAL_WIDTH - 16,
    58,
  );

  fill(0, 0, 75);
  textAlign(LEFT, TOP);
  textSize(12);
  text("DIFFICULTY: " + difficulty.toUpperCase(), 20, 4);
  pop();
  drawBeatIndicator();

  let sessionTime = (frameCount - sessionStartFrame) / 60;
  if (sessionTime < 10) {
    push();
    fill(0, 0, 90, map(sessionTime, 8, 10, 200, 0));
    textAlign(RIGHT, BOTTOM);
    textSize(12);
    text("WASD/ARROWS: Move", LOGICAL_WIDTH - 20, LOGICAL_HEIGHT - 40);
    text("SPACE: Use Powerup", LOGICAL_WIDTH - 20, LOGICAL_HEIGHT - 25);
    text("P: Pause", LOGICAL_WIDTH - 20, LOGICAL_HEIGHT - 10);
    pop();
  }
}

// ─── OBSTACLES ───
class Obstacle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 40;
    this.height = 40;
    this.rotation = 0;
    this.baseSize = this.width;
    this.pulseSize = this.width;
    this.jitterX = 0;
    this.jitterY = 0;
    if (type === "laser") {
      this.width = 10;
      this.height = LOGICAL_HEIGHT;
      this.y = LOGICAL_HEIGHT / 2;
    } else if (type === "barrier") {
      this.width = 20;
      this.height = 200;
    }
  }
  update() {
    this.rotation += 2;
    this.pulseSize = lerp(this.pulseSize, this.baseSize, 0.1);
    this.x += this.jitterX;
    this.y += this.jitterY;
    this.jitterX *= 0.9;
    this.jitterY *= 0.9;
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    rectMode(CENTER);
    noStroke();
    if (this.type === "single") {
      fill(0, 90, 100);
      let s = this.pulseSize / this.baseSize;
      scale(s);
      rect(0, 0, this.width, this.height, 5);
    } else if (this.type === "double") {
      fill(30, 90, 100);
      rect(0, -30, this.width, this.height, 5);
      rect(0, 30, this.width, this.height, 5);
    } else if (this.type === "triple") {
      fill(60, 90, 100);
      rect(0, -60, 35, 35, 5);
      rect(0, 0, 35, 35, 5);
      rect(0, 60, 35, 35, 5);
    } else if (this.type === "wave") {
      fill(180, 90, 100);
      for (let i = 0; i < 5; i++) {
        let offsetY = sin((frameCount + i * 20) * 0.1) * 40;
        ellipse(0, -80 + i * 40 + offsetY, 30, 30);
      }
    } else if (this.type === "laser") {
      fill(320, 90, 100);
      rect(0, 0, this.width, this.height);
      if (frameCount % 20 < 10) {
        fill(320, 90, 100, 100);
        rect(0, 0, this.width + 10, this.height);
      }
    } else if (this.type === "barrier") {
      fill(280, 90, 100);
      rect(0, 0, this.width, this.height, 5);
    }
    pop();
  }
}

function spawnObstacle(type) {
  let y = cameraY - 120;
  let x = type === "laser" ? LOGICAL_WIDTH / 2 : random(60, LOGICAL_WIDTH - 60);
  obstacles.push(new Obstacle(x, y, type));
}

function spawnPowerup() {
  // RANDOM POOL: Speed (50%) or Shockwave (50%)
  // Shield is removed.
  let type = random() < 0.5 ? "speed" : "shockwave";

  powerups.push({
    x: random(60, LOGICAL_WIDTH - 60),
    y: cameraY - 140,
    type,
    rotation: 0,
  });
}

function spawnGem() {
  collectibles.push({
    x: random(60, LOGICAL_WIDTH - 60),
    y: cameraY - 100,
    spin: 0,
  });
}

function drawPowerup(pow) {
  push();
  translate(pow.x, pow.y);
  let pulseSize = 36 + sin(frameCount * 0.1) * 4;

  if (pow.type === "shield" && powerupShield) {
    // Shield Logic Removed/Hidden
  } else if (pow.type === "speed" && powerupSpeed) {
    imageMode(CENTER);
    tint(255, 255, 100, 150);
    image(powerupSpeed, 0, 0, pulseSize, pulseSize);
    noTint();
    image(powerupSpeed, 0, 0, 32, 32);
  } else {
    rotate(radians(pow.rotation));
    rectMode(CENTER);
    noStroke();

    if (pow.type === "speed") {
      fill(60, 90, 100);
      triangle(-12, 12, 12, 12, 0, -12);
    } else if (pow.type === "shockwave") {
      // SHOCKWAVE ICON
      noStroke();
      fill(180, 0, 100);
      let coreSize = 25 + sin(frameCount * 0.2) * 5;
      ellipse(0, 0, coreSize, coreSize);

      noFill();
      stroke(180, 0, 100, 200);
      strokeWeight(2);
      let ringSize = 35 - sin(frameCount * 0.2) * 5;
      ellipse(0, 0, ringSize, ringSize);

      push();
      rotate(frameCount * 0.1);
      for (let i = 0; i < 4; i++) {
        rotate(HALF_PI);
        line(20, 0, 25, 0);
      }
      pop();
    }
  }
  pop();
}

function activatePowerup(type) {
  if (sfxPowerUp && sfxPowerUp.isLoaded()) sfxPowerUp.play();

  // FIX: Clear queuedPowerup immediately to prevent infinite reuse
  queuedPowerup = null;

  if (type === "shockwave") {
    shockwaveActive = true;
    shockwaveRadius = 1;
    obstacles = [];
    flashAlpha = 200;
    screenShake = 30;
    score += 200;
    if (sfxDamage && sfxDamage.isLoaded()) sfxDamage.play();
    return;
  }

  activePowerup = type;
  powerupDuration = 300;
  if (type === "speed") {
    if (sfxJetPower && sfxJetPower.isLoaded()) sfxJetPower.play();
  }
  flashAlpha = 120;
  comboMultiplier++;
  comboTimer = 180;
}

// ─── BEAT ───
function onBeat() {
  if (gameState !== "playing") return;
  flashAlpha = max(flashAlpha, 15);
  screenShake = max(screenShake, 5 + (bpm - 90) / 10);

  let availableObstacles = ["single", "double", "gap"];

  // ✅ UNLOCK BASED ON LOOP COUNT (NOT BPM)
  if (loopCount >= 1) availableObstacles.push("wave");
  if (loopCount >= 2) availableObstacles.push("laser", "barrier");
  if (loopCount >= 3) availableObstacles.push("triple");

  let type = random(availableObstacles);
  if (type !== "gap") spawnObstacle(type);

  // Spawn Rates (Powerups appear 20% of the time on beat)
  if (random() < 0.2) spawnPowerup();
  if (random() < 0.25) spawnGem();

  for (let obs of obstacles) {
    obs.pulseSize = obs.baseSize * random(1.8, 2.6);
    let jitterForce = map(bpm, 90, 180, 6, 25);
    obs.jitterX = random([-1, 1]) * random(jitterForce / 2, jitterForce);
    obs.jitterY = random([-1, 1]) * random(jitterForce / 2, jitterForce);
    obs.rotation += random(20, 60);
  }
}

function drawBeatIndicator() {
  let beatProgress = (frameCount - lastBeatFrame) / beatInterval;
  let size = 20 + sin(beatProgress * PI) * 15;
  push();
  noStroke();
  fill(rgbHue, 90, 100, 150);
  ellipse(LOGICAL_WIDTH - 50, LOGICAL_HEIGHT - 50, size, size);
  noFill();
  stroke(rgbHue, 90, 100);
  strokeWeight(2);
  ellipse(LOGICAL_WIDTH - 50, LOGICAL_HEIGHT - 50, 40, 40);
  let pulseAlpha = 40 + 40 * sin(beatProgress * PI);
  stroke(rgbHue, 60, 80, pulseAlpha);
  strokeWeight(4);
  rect(4, 4, LOGICAL_WIDTH - 8, LOGICAL_HEIGHT - 8, 10);
  pop();
}

// ─── COLLISION ───
function checkCollision(p, obs) {
  return (
    abs(p.x - obs.x) < (p.width + obs.width) / 2 &&
    abs(p.y - obs.y) < (p.height + obs.height) / 2
  );
}

function onPlayerHit() {
  if (sfxDamage && sfxDamage.isLoaded()) sfxDamage.play();

  playerHealth -= difficulties[difficulty].damage;
  playerInvincible = 60;
  hurtTimer = 15;
  flashAlpha = 255;
  screenShake = 25;
  comboMultiplier = 1;
  comboTimer = 0;

  for (let i = 0; i < 12; i++) {
    spawnExplosionParticle(player.x, player.y);
  }

  // ─── GAME OVER TRIGGER ───
  if (playerHealth <= 0) {
    // ✅ HARD KILL ALL MUSIC
    if (gameIntroSong) gameIntroSong.stop();
    if (gameLoopSong) gameLoopSong.stop();
    if (titleSong) titleSong.stop();

    // ✅ HARD KILL ALL LOOP SYSTEMS
    clearTimeout(loopTimer);
    loopTimer = null;
    musicSessionID++; // ✅ INVALIDATE ALL FUTURE LOOP CALLS

    // ✅ SAVE SCORE + TIME
    let survivedTime = floor((frameCount - sessionStartFrame) / 60);

    if (score > highScore) {
      highScore = floor(score);
    }

    if (survivedTime > bestTime) {
      bestTime = survivedTime;
    }

    saveHighScore();

    // ✅ LOCK GAME STATE
    gameState = "gameOver";
    // ✅ FORCE RESET DIFFICULTY ENGINE
    musicSpeed = 1.0;
    bpm = 90;
    autoScrollSpeed = 2;
  }
}

// ─── PARTICLES ───
function spawnParticle(x, y, colorStr) {
  particles.push({
    x,
    y,
    vx: random(-2, 2),
    vy: random(2, 4),
    life: 30,
    maxLife: 30,
    color: colorStr,
    update: function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2;
      this.life--;
    },
    draw: function () {
      push();
      noStroke();
      let alpha = map(this.life, 0, this.maxLife, 0, 200);
      fill(red(this.color), green(this.color), blue(this.color), alpha);
      ellipse(this.x, this.y, 6, 6);
      pop();
    },
  });
}

function spawnExplosionParticle(x, y) {
  particles.push({
    x,
    y,
    vx: random(-4, 4),
    vy: random(-4, 4),
    life: 25,
    maxLife: 25,
    sprite: explosionSprite,
    frame: floor(random(4)),
    update: function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life--;
    },
    draw: function () {
      if (this.sprite) {
        push();
        let alpha = map(this.life, 0, this.maxLife, 0, 255);
        tint(255, 255, 255, alpha);
        imageMode(CENTER);
        image(this.sprite, this.x, this.y, 24, 24);
        noTint();
        pop();
      } else {
        push();
        noStroke();
        let alpha = map(this.life, 0, this.maxLife, 0, 200);
        fill(0, 90, 100, alpha);
        ellipse(this.x, this.y, 10, 10);
        pop();
      }
    },
  });
}

// ─── BACKGROUND ───
function drawParallaxBG() {
  for (let layer of parallaxLayers) {
    push();
    noStroke();
    fill(layer.color[0], layer.color[1], layer.color[2], 50);
    let offsetY = (cameraY * layer.speed) % 200;
    for (let y = -200; y < LOGICAL_HEIGHT + 200; y += 200) {
      rect(layer.x || 0, y - offsetY, LOGICAL_WIDTH, 180, 20);
    }
    pop();
  }
}

function initParallax() {
  parallaxLayers = [
    { speed: 0.15, color: [rgbHue, 30, 15], x: 0 },
    { speed: 0.3, color: [rgbHue, 40, 20], x: 0 },
    { speed: 0.5, color: [rgbHue, 60, 25], x: 0 },
  ];
}

function drawAnimatedGrid() {
  push();
  stroke(rgbHue, 40, 60, 80);
  strokeWeight(1);
  let gridSize = 60;
  let offset = (frameCount * 2 + cameraY * 0.3) % gridSize;
  for (let y = -gridSize; y < LOGICAL_HEIGHT + gridSize; y += gridSize)
    line(0, y - offset, LOGICAL_WIDTH, y - offset);
  for (let x = 0; x < LOGICAL_WIDTH; x += gridSize)
    line(x, 0, x, LOGICAL_HEIGHT);
  pop();
}

function resetPlayer() {
  player = {
    x: LOGICAL_WIDTH / 2,
    y: cameraY + LOGICAL_HEIGHT - 120,
    vx: 0,
    vy: 0,
    width: 26,
    height: 34,
  };
  playerHealth = playerMaxHealth;
  playerInvincible = 60;
  hurtTimer = 0;
  shockwaveActive = false;
}

// ─── END SCREENS ───
function drawGameOver() {
  if (sfxGameOver && sfxGameOver.isLoaded() && !sfxGameOver.isPlaying()) {
    sfxGameOver.play();
  }

  fill(240, 80, 10);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  bgPulse = lerp(bgPulse, 0, 0.15);
  drawParallaxBG();

  let cx = LOGICAL_WIDTH / 2;
  let cy = LOGICAL_HEIGHT / 2;
  let timeSurvived = floor((frameCount - sessionStartFrame) / 60);

  textAlign(CENTER, CENTER);

  // ─── HIGH SCORE (TOP) ───
  fill(60, 90, 100);
  textSize(22);
  text("HIGH SCORE: " + highScore, cx, cy - 140);

  // ─── MAIN GAME OVER TITLE ───
  push();
  translate(cx, cy - 60);
  scale(pulseScale);
  fill(0, 90, 100);
  textSize(64);
  textStyle(BOLD);
  text("TRIAL FAILED", 0, 0);
  pop();

  // ─── CURRENT SCORE ───
  fill(0, 0, 90);
  textSize(24);
  text("SCORE: " + floor(score), cx, cy + 30);

  // ─── TIME (RIGHT UNDER SCORE) ───
  fill(0, 0, 80);
  textSize(20);
  // text("TIME: " + timeSurvived + "s", cx, cy + 65);

  // ─── CONTROLS ───
  fill(0, 0, 60);
  textSize(16);
  text("Press R to Retry | Press M for Menu", cx, cy + 110);

  // ─── CREDITS ───
  fill(0, 0, 90);
  textSize(12);
  text("Final project by Saturn, Yoshi, Frankie", cx, LOGICAL_HEIGHT - 40);
}

function drawVictory() {
  fill(120, 80, 20);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  drawParallaxBG();
  push();
  translate(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 3);
  scale(pulseScale);
  fill(60, 90, 100);
  textAlign(CENTER, CENTER);
  textSize(64);
  textStyle(BOLD);
  text("COMPLETE!", 0, 0);
  pop();
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Final Score: " + floor(score), LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
  fill(0, 0, 60);
  textSize(14);
  text("Press M for menu", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 100);
}

function drawCredits() {
  fill(280, 60, 15);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  let scrollY = LOGICAL_HEIGHT - (frameCount - creditStartFrame) * 2;
  push();
  translate(0, scrollY);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("TRIALS OF TEMPO", LOGICAL_WIDTH / 2, 100);
  textSize(24);
  text("Endless Mode", LOGICAL_WIDTH / 2, 180);
  textSize(18);
  fill(0, 0, 80);
  text("━━━ CREDITS ━━━", LOGICAL_WIDTH / 2, 280);
  text("Saturn - Project Lead", LOGICAL_WIDTH / 2, 320);
  text("Yoshi - Developer", LOGICAL_WIDTH / 2, 350);
  text("Frankie - Artist", LOGICAL_WIDTH / 2, 380);
  text("Music by Cacola", LOGICAL_WIDTH / 2, 540);
  textSize(16);
  fill(0, 0, 60);
  text("Press M to return to menu", LOGICAL_WIDTH / 2, 1120);
  pop();
}
let creditStartFrame = 0;

// ─── INPUT ───
function mousePressed() {
  let mx = getLogicalMouseX();
  let my = getLogicalMouseY();

  if (gameState === "intro") {
    skipIntro();
    return;
  }
  if (gameState === "title") {
    if (mx > LOGICAL_WIDTH / 2 - 110 && mx < LOGICAL_WIDTH / 2 + 110) { // Width 220
      if (sfxButton) sfxButton.play();
      
      // START Button (Center H/2 + 40, Height 50) -> Range approx 15 to 65
      if (my > LOGICAL_HEIGHT / 2 + 15 && my < LOGICAL_HEIGHT / 2 + 65)
        startGame();
      
      // CUSTOMIZE Button (Center H/2 + 100, Height 50) -> Range approx 75 to 125
      else if (my > LOGICAL_HEIGHT / 2 + 75 && my < LOGICAL_HEIGHT / 2 + 125)
        gameState = "customize";
      
      // INSTRUCTIONS Button (Center H/2 + 160, Height 50) -> Range approx 135 to 185
      else if (my > LOGICAL_HEIGHT / 2 + 135 && my < LOGICAL_HEIGHT / 2 + 185)
        gameState = "instructions";
    }
  } else if (gameState === "customize") {
    let startX = LOGICAL_WIDTH / 2 - 180;
    for (let i = 0; i < 4; i++) {
      let x = startX + i * 120;
      if (dist(mx, my, x, LOGICAL_HEIGHT / 2) < 50) {
        selectedCharacter = i;
        if (sfxButton && sfxButton.isLoaded()) sfxButton.play();
      }
    }
    if (
      mx > LOGICAL_WIDTH / 2 - 80 &&
      mx < LOGICAL_WIDTH / 2 + 80 &&
      my > LOGICAL_HEIGHT - 98 &&
      my < LOGICAL_HEIGHT - 62
    ) {
      if (sfxButton && sfxButton.isLoaded()) sfxButton.play();
      gameState = "title";
    }
  } else if (gameState === "instructions") {
    if (
      mx > LOGICAL_WIDTH - 180 &&
      mx < LOGICAL_WIDTH - 20 &&
      my > LOGICAL_HEIGHT - 68 &&
      my < LOGICAL_HEIGHT - 32
    ) {
      gameState = "title";
      if (sfxButton && sfxButton.isLoaded()) sfxButton.play();
    }
  }
}

function hardRestartGame() {
  // ✅ HARD KILL ALL MUSIC
  if (gameIntroSong) gameIntroSong.stop();
  if (gameLoopSong) gameLoopSong.stop();
  if (titleSong) titleSong.stop();

  // ✅ HARD KILL ALL LOOP TIMERS
  clearTimeout(loopTimer);
  loopTimer = null;

  // ✅ INVALIDATE ALL OLD LOOP CALLBACKS
  musicSessionID++;

  // ✅ HARD RESET DIFFICULTY ENGINE
  musicSpeed = 1.0;
  bpm = 90;
  autoScrollSpeed = 2;

  // ✅ HARD RESET BEAT SYSTEM
  lastMusicBeatTime = 0;
  beatInterval = framesPerBeat(bpm);

  // ✅ HARD RESET GAME DATA
  score = 0;
  comboMultiplier = 1;
  comboTimer = 0;
  obstacles = [];
  powerups = [];
  collectibles = [];
  particles = [];
  activePowerup = null;
  powerupDuration = 0;
  queuedPowerup = null;
  boss = null;

  cameraY = 0;
  sessionStartFrame = frameCount;

  resetPlayer();
  sheet = playerSheets[selectedCharacter];
  playerSpeed = basePlayerSpeed;
  displayedHealth = playerMaxHealth;

  // ✅ NOW START CLEAN
  startGame();
}

function keyPressed() {
  // ─── INTRO ───
  if (gameState === "intro") {
    skipIntro();
    return;
  }

  // ─── GAME OVER ───
  if (gameState === "gameOver") {
    if (key.toLowerCase() === "r") {
      hardRestartGame();
    } else if (key.toLowerCase() === "m") {
      clearTimeout(loopTimer);
      loopTimer = null;

      if (gameIntroSong) gameIntroSong.stop();
      if (gameLoopSong) gameLoopSong.stop();
      musicSessionID++;

      gameState = "title";
    }
  }

  // ─── VICTORY ───
  else if (gameState === "victory") {
    if (key.toLowerCase() === "r") {
      hardRestartGame();
    } else if (key.toLowerCase() === "c") {
      gameState = "credits";
      creditStartFrame = frameCount;
    } else if (key.toLowerCase() === "m") {
      clearTimeout(loopTimer);
      loopTimer = null;

      if (gameIntroSong) gameIntroSong.stop();
      if (gameLoopSong) gameLoopSong.stop();
      musicSessionID++;

      gameState = "title";
    }
  }

  // ─── CREDITS ───
  else if (gameState === "credits") {
    if (key.toLowerCase() === "m") {
      gameState = "title";
      musicSessionID++;
    }
  }

  // ─── PLAYING ───
  else if (gameState === "playing") {
    // Pause
    if (key.toLowerCase() === "p") {
      gameState = "paused";
    }

    // Use Powerup
    else if (keyCode === 32) {
      // Space
      if (queuedPowerup) {
        activatePowerup(queuedPowerup);
      }
    }

    // DASH
    else if (keyCode === SHIFT) {
      if (dashCooldown === 0) {
        dashDuration = dashDurationMax;
        dashCooldown = difficulties[difficulty].dashCooldownMax;

        let ix = 0,
          iy = 0;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) ix -= 1;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) ix += 1;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) iy -= 1;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) iy += 1;

        if (ix !== 0 || iy !== 0) {
          let mag = sqrt(ix * ix + iy * iy);
          ix /= mag;
          iy /= mag;

          // ✅ FIXED DASH (NO *2 TELEPORT)
          player.vx += ix * dashPower;
          player.vy += iy * dashPower;
        }

        flashAlpha = 120;
        screenShake = max(screenShake, 8);
      }
    }

    // Restart
    else if (key.toLowerCase() === "r") {
      hardRestartGame();
    }

    // Menu
    else if (key.toLowerCase() === "m") {
      clearTimeout(loopTimer);
      loopTimer = null;

      if (gameIntroSong) gameIntroSong.stop();
      if (gameLoopSong) gameLoopSong.stop();
      musicSessionID++;

      gameState = "title";
    }
  }

  // ─── PAUSED ───
  else if (gameState === "paused") {
    // Resume
    if (key.toLowerCase() === "p") {
      gameState = "playing";
    }

    // Menu
    else if (key.toLowerCase() === "m") {
      clearTimeout(loopTimer);
      loopTimer = null;

      if (gameIntroSong) gameIntroSong.stop();
      if (gameLoopSong) gameLoopSong.stop();
      musicSessionID++;

      gameState = "title";
    }

    // Restart
    else if (key.toLowerCase() === "r") {
      hardRestartGame();
    }
  }
}

function startGame() {
  // ✅ HARD STOP EVERYTHING
  clearTimeout(loopTimer);
  loopTimer = null;

  if (gameIntroSong) {
    gameIntroSong.stop();
    gameIntroSong.onended(() => {});
  }

  if (gameLoopSong) gameLoopSong.stop();
  if (titleSong) titleSong.stop();

  lastMusicBeatTime = 0;
  lastBeatFrame = frameCount;

  // ─── GAME STATE RESET ───
  gameState = "playing";
  goalY = cameraY - 999999;

  score = 0;
  comboMultiplier = 1;
  comboTimer = 0;
  cameraY = 0;
  sessionStartFrame = frameCount;

  bpm = 90;
  autoScrollSpeed = 2;
  beatInterval = framesPerBeat(bpm);

  obstacles = [];
  powerups = [];
  collectibles = [];
  particles = [];
  activePowerup = null;
  powerupDuration = 0;
  queuedPowerup = null;
  boss = null;

  resetPlayer();
  sheet = playerSheets[selectedCharacter];
  playerSpeed = basePlayerSpeed;

  // ─── MUSIC RESET VALUES ───
  musicSpeed = 1.0;
  loopCount = 0;

  // ✅ PLAY INTRO ONCE (guarded)
  if (gameIntroSong && gameIntroSong.isLoaded()) {
    gameIntroSong.rate(musicSpeed);
    gameIntroSong.play();
  }

  // ✅ SAFE INTRO → LOOP BINDING
  const mySession = musicSessionID;

  if (gameIntroSong) {
    gameIntroSong.onended(() => {
      if (gameState !== "playing") return;
      if (mySession !== musicSessionID) return; // ✅ kills ghost loops
      setupMusicLoopSpeeding(mySession);
    });
  }

  lastBeatFrame = frameCount;
  displayedHealth = playerMaxHealth;
  lastMusicBeatTime = 0;
}

function drawPausedOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("PAUSED", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 20);
  textSize(16);
  fill(0, 0, 80);
  text(
    "Press P to resume | R to restart | M for menu",
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2 + 20,
  );
  pop();
}

function loadHighScore() {
  let savedScore = localStorage.getItem("tot_highscore");
  let savedTime = localStorage.getItem("tot_besttime");

  if (savedScore !== null) highScore = parseInt(savedScore);
  if (savedTime !== null) bestTime = parseInt(savedTime);
}

function saveHighScore() {
  localStorage.setItem("tot_highscore", highScore);
  localStorage.setItem("tot_besttime", bestTime);
}

function drawIntro() {
  background(0);

  // Draw the video
  image(introVideo, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // Skip message
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Press any key to skip", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT - 28);

  if (introVideo.time() >= introVideo.duration() - 0.1) {
    skipIntro();
  }
}

function skipIntro() {
  if (introVideo) introVideo.stop();

  if (titleSong?.isPlaying()) titleSong.stop();
  if (gameIntroSong?.isPlaying()) gameIntroSong.stop();
  if (gameLoopSong?.isPlaying()) gameLoopSong.stop();

  gameState = "title";
}

function setupMusicLoopSpeeding(sessionID) {
  if (!gameLoopSong) return;

  function playLoopSegment() {
    if (gameLoopSong.isPlaying()) {
      gameLoopSong.stop();
    }

    // ✅ KILL IF THIS IS AN OLD RUN
    if (sessionID !== musicSessionID || gameState !== "playing") {
      clearTimeout(loopTimer);
      loopTimer = null;
      return;
    }

    loopCount++;

    // ✅ SCALE DIFFICULTY
    musicSpeed = min(musicSpeed * 1.03, 1.6);
    autoScrollSpeed = min(autoScrollSpeed * 1.05, 12);
    bpm = min(bpm * 1.03, 200);
    beatInterval = framesPerBeat(bpm);

    console.log("Loop:", loopCount, "MusicSpeed:", musicSpeed);

    gameLoopSong.stop();
    gameLoopSong.disconnect(); // ✅ clears audio nodes
    gameLoopSong.connect(); // ✅ reconnect fresh
    gameLoopSong.rate(musicSpeed);
    gameLoopSong.play();

    lastBeatFrame = frameCount;
    lastMusicBeatTime = 0;

    onBeat();

    gameLoopSong.onended(() => {
      playLoopSegment();
    });
  }

  playLoopSegment();
}

function drawScanlines() {
  push();
  // Scanlines
  noStroke();
  fill(0, 0, 0, 50);
  for (let y = 0; y < LOGICAL_HEIGHT; y += 4) {
    rect(0, y, LOGICAL_WIDTH, 2);
  }
  
  // Vignette
  let ctx = drawingContext;
  let gradient = ctx.createRadialGradient(
    LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, LOGICAL_HEIGHT * 0.4,
    LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, LOGICAL_HEIGHT * 0.8
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.5)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
  
  // RGB Split (Chromatic Aberration) at edges
  if (gameState === 'playing' && frameCount % 4 === 0) {
      // Very subtle random twitch
      translate(random(-1, 1), 0);
  }
  pop();
}

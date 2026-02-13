class PlayerData {
  constructor() {
    this.credits = 0;
    this.highScore = 0;
    this.bestTime = 0;
    this.unlockedItems = ['character_0']; // Default character
    this.upgrades = {
      dashCooldown: 0, // Level 0
      shieldDuration: 0,
      magnetRadius: 0,
    };
  }

  load() {
    const data = localStorage.getItem('trials_of_tempo_save');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.credits = parsed.credits || 0;
        this.highScore = parsed.highScore || 0;
        this.bestTime = parsed.bestTime || 0;
        this.unlockedItems = parsed.unlockedItems || ['character_0'];
        this.upgrades = parsed.upgrades || {
          dashCooldown: 0,
          shieldDuration: 0,
          magnetRadius: 0,
        };
        console.log('Data loaded successfully');
      } catch (e) {
        console.error('Failed to parse save data', e);
      }
    }
  }

  save() {
    const data = {
      credits: this.credits,
      highScore: this.highScore,
      bestTime: this.bestTime,
      unlockedItems: this.unlockedItems,
      upgrades: this.upgrades,
    };
    localStorage.setItem('trials_of_tempo_save', JSON.stringify(data));
    console.log('Data saved');
  }

  addCredits(amount) {
    this.credits += amount;
    this.save();
  }

  spendCredits(amount) {
    if (this.credits >= amount) {
      this.credits -= amount;
      this.save();
      return true;
    }
    return false;
  }

  updateHighScore(score) {
    if (score > this.highScore) {
      this.highScore = Math.floor(score);
      this.save();
      return true;
    }
    return false;
  }

  updateBestTime(time) {
    if (time > this.bestTime) {
      this.bestTime = time;
      this.save();
      return true;
    }
    return false;
  }

  unlockItem(itemId) {
    if (!this.unlockedItems.includes(itemId)) {
      this.unlockedItems.push(itemId);
      this.save();
    }
  }

  upgradeStat(statName) {
    if (this.upgrades[statName] !== undefined) {
      this.upgrades[statName]++;
      this.save();
    }
  }

  getUpgradeLevel(statName) {
    return this.upgrades[statName] || 0;
  }
}

// Export a singleton instance if using modules, but for p5.js global scope we might just attach it to window or use a global var.
// Since sketch.js uses ES6 imports (import { ... } from './Config.js'), we can export this class.
export { PlayerData };

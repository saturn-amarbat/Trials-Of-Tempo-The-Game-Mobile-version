export class SettingsManager {
  constructor() {
    this.storageKey = 'tot_settings';
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const defaultSettings = {
      masterVolume: 0.8,
      musicVolume: 1.0,
      sfxVolume: 1.0,
      hapticsEnabled: true,
      audioOffset: 0, // in seconds (positive = early input compensation)
    };
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      console.error('Failed to load settings', e);
      return defaultSettings;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  // ─── VOLUME ───
  setMasterVolume(val) {
    this.settings.masterVolume = Math.max(0, Math.min(1, val));
    this.applyVolume();
    this.saveSettings();
  }

  getMasterVolume() {
    return this.settings.masterVolume;
  }

  toggleMute() {
    if (this.settings.masterVolume > 0) {
      this.previousVolume = this.settings.masterVolume;
      this.setMasterVolume(0);
    } else {
      this.setMasterVolume(this.previousVolume || 0.8);
    }
  }

  applyVolume() {
    // p5.sound global function
    if (typeof outputVolume === 'function') {
      outputVolume(this.settings.masterVolume);
    }
  }

  // ─── HAPTICS ───
  toggleHaptics() {
    this.settings.hapticsEnabled = !this.settings.hapticsEnabled;
    this.saveSettings();
    return this.settings.hapticsEnabled;
  }

  triggerHaptic(ms) {
    if (this.settings.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  }

  // ─── AUDIO LATENCY ───
  setAudioOffset(seconds) {
    this.settings.audioOffset = seconds;
    this.saveSettings();
  }

  getAudioOffset() {
    return this.settings.audioOffset;
  }
}

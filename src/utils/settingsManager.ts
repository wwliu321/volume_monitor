import type { Settings } from '../types';
import { audioContextManager } from './audioContext';

const DEFAULT_SETTINGS: Settings = {
  textAlertEnabled: true,
  soundAlertEnabled: true,
  soundAlerts: true,
  isCompact: false,
  alertInterval: 15000,
  threshold: 30,
  alertVolume: 0.5,
  lowVolumeDuration: 3000
};

class SettingsManager {
  private settings: Settings;

  constructor() {
    const savedSettings = localStorage.getItem('volumeMonitorSettings');
    this.settings = savedSettings 
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
      : DEFAULT_SETTINGS;
  }

  public getSettings(): Settings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('volumeMonitorSettings', JSON.stringify(this.settings));
  }

  public async calibrate(durationMs: number = 10000): Promise<number> {
    const samples: number[] = [];
    const startTime = Date.now();

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const currentVolume = audioContextManager.getVolume();
        samples.push(currentVolume);

        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          const average = samples.reduce((a, b) => a + b, 0) / samples.length;
          const threshold = Math.round(average * 0.6);
          this.updateSettings({ threshold });
          resolve(threshold);
        }
      }, 100);
    });
  }

  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    localStorage.removeItem('volumeMonitorSettings');
  }
}

export const settingsManager = new SettingsManager(); 
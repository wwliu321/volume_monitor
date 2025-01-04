import { Settings } from '../types';

interface AlertSettings {
  soundAlerts: boolean;
  textAlerts: boolean;
  alertVolume: number;
  threshold: number;
  lowVolumeDuration: number;
  alertInterval: number;
}

interface Window {
  webkitAudioContext: typeof AudioContext;
}

class AlertManager {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private settings: AlertSettings = {
    soundAlerts: true,
    textAlerts: true,
    alertVolume: 0.5,
    threshold: 30,
    lowVolumeDuration: 3000,
    alertInterval: 15000
  };

  private async initAudio() {
    if (!this.audioContext) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.audioContext = new AudioContextClass();
    }

    if (!this.oscillator) {
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      this.oscillator.start();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private async playSound() {
    console.log('Attempting to play sound:', {
      soundAlerts: this.settings.soundAlerts,
      volume: this.settings.alertVolume
    });

    if (!this.settings.soundAlerts) {
      console.log('Sound alerts disabled, skipping playback');
      return;
    }

    try {
      await this.initAudio();
      if (this.gainNode && this.audioContext) {
        const now = this.audioContext.currentTime;
        const volume = this.settings.alertVolume;
        
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

        console.log('Sound played successfully with volume:', volume);
      }
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  }

  public trigger(type: string) {
    console.log('Alert triggered:', {
      type,
      settings: this.settings,
      currentTime: Date.now()
    });

    if (type === 'low-volume' && this.settings.soundAlerts) {
      this.playSound().catch(console.error);
    }
  }

  updateConfig(newConfig: Partial<AlertSettings>) {
    this.settings = {
      ...this.settings,
      ...newConfig
    };
    console.log('Alert manager settings updated:', this.settings);
  }

  getSettings(): AlertSettings {
    return { ...this.settings };
  }

  private cleanup() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.oscillator = null;
    this.gainNode = null;
    this.audioContext = null;
  }

  dispose() {
    this.cleanup();
  }
}

export const alertManager = new AlertManager(); 
export interface Settings {
  textAlertEnabled: boolean;
  soundAlertEnabled: boolean;
  soundAlerts: boolean;
  isCompact: boolean;
  alertInterval: number;
  threshold: number;
  alertVolume: number;
  lowVolumeDuration: number;
}

export interface AnalysisResult {
  currentStats: {
    average: number;
    min: number;
    max: number;
    samples: number[];
    timestamp: number;
  };
  trend: 'rising' | 'falling' | 'stable';
}

export interface VolumeVisualizerProps {
  volume: number;
  threshold: number;
  isCompact?: boolean;
}

export interface UseAudioMonitorOptions {
  threshold?: number;
  onVolumeLow?: (volume: number) => void;
  sampleInterval?: number;
}

export interface TestPanelProps {
  onTest: (type: string) => void;
  currentVolume?: number;
  threshold?: number;
}

export interface AlertOptions {
  textEnabled: boolean;
  soundEnabled: boolean;
  minInterval?: number;
  silentPeriod?: number;
  threshold?: number;
}

export interface AlertState {
  lastAlertTime: number;
  consecutiveLowVolume: number;
  currentLevel: 'none' | 'visual' | 'text' | 'sound';
} 
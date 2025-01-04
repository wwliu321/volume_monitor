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
interface VolumeStats {
  average: number;
  min: number;
  max: number;
  samples: number[];
  timestamp: number;
}

interface AnalysisResult {
  currentStats: VolumeStats;
  trend: 'rising' | 'falling' | 'stable';
  recommendation: string | null;
}

class VolumeAnalyzer {
  private readonly SAMPLE_WINDOW = 100; // 保存最近100个样本
  private samples: number[] = [];
  private lastAnalysis: AnalysisResult | null = null;

  public addSample(volume: number, threshold: number): AnalysisResult {
    const now = Date.now();
    this.samples.push(volume);
    
    // 保持样本窗口大小
    if (this.samples.length > this.SAMPLE_WINDOW) {
      this.samples.shift();
    }

    const currentStats = this.calculateStats();
    const trend = this.analyzeTrend();
    const recommendation = this.generateRecommendation(currentStats, threshold);

    this.lastAnalysis = {
      currentStats,
      trend,
      recommendation
    };

    return this.lastAnalysis;
  }

  private calculateStats(): VolumeStats {
    const values = this.samples;
    return {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      samples: [...values],
      timestamp: Date.now()
    };
  }

  private analyzeTrend(): 'rising' | 'falling' | 'stable' {
    if (this.samples.length < 10) return 'stable';

    const recentSamples = this.samples.slice(-10);
    const firstHalf = recentSamples.slice(0, 5);
    const secondHalf = recentSamples.slice(-5);

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / 5;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / 5;

    const difference = secondAvg - firstAvg;
    if (difference > 5) return 'rising';
    if (difference < -5) return 'falling';
    return 'stable';
  }

  private generateRecommendation(stats: VolumeStats, threshold: number): string | null {
    const { average, max, min } = stats;

    if (average < threshold) {
      if (max < threshold) {
        return '您的说话音量持续偏低，建议提高音量';
      }
      return '说话音量不够稳定，请保持适当音量';
    }

    if (max - min > 50) {
      return '音量波动较大，建议保持稳定的说话音量';
    }

    if (average > threshold * 2) {
      return '当前音量可能过高，建议适当降低';
    }

    return null;
  }

  public getLastAnalysis(): AnalysisResult | null {
    return this.lastAnalysis;
  }

  public reset(): void {
    this.samples = [];
    this.lastAnalysis = null;
  }
}

export const volumeAnalyzer = new VolumeAnalyzer(); 
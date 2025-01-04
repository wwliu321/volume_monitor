/// <reference lib="webworker" />

export interface VolumeAnalysisConfig {
  dataArray: Float32Array;
  minDecibels: number;
  maxDecibels: number;
}

function calculateRMSVolume(dataArray: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  return Math.sqrt(sum / dataArray.length);
}

function convertToPercentage(rms: number): number {
  return Math.min(100, Math.max(0, rms * 100));
}

// 添加 TypeScript 的 Worker 上下文类型
declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (e: MessageEvent<{ dataArray: Float32Array }>) => {
  const { dataArray } = e.data;
  
  try {
    const rms = calculateRMSVolume(dataArray);
    const volume = convertToPercentage(rms);

    self.postMessage({
      type: 'volume',
      data: {
        volume,
        raw: { rms }
      }
    });
  } catch (error: unknown) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

self.onerror = (error: ErrorEvent) => {
  self.postMessage({
    type: 'error',
    error: error.message
  });
};

export {}; 
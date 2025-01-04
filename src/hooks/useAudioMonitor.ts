import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioMonitorProps {
  threshold: number;
  lowVolumeDuration: number;
  onVolumeLow: () => void;
  onLowVolumeDurationUpdate: (duration: number) => void;
}

export const useAudioMonitor = ({
  threshold,
  lowVolumeDuration,
  onVolumeLow,
  onLowVolumeDurationUpdate,
}: AudioMonitorProps) => {
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRunningRef = useRef(false);
  const lowVolumeStartTimeRef = useRef<number | null>(null);
  const configuredDurationRef = useRef(lowVolumeDuration);
  const analyzeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 确保配置更新时立即更新 ref 值
  useEffect(() => {
    const oldDuration = configuredDurationRef.current;
    configuredDurationRef.current = lowVolumeDuration;
    console.log('配置更新:', {
      旧配置: oldDuration,
      新配置: lowVolumeDuration,
      实际更新后的值: configuredDurationRef.current
    });
  }, [lowVolumeDuration]);

  const analyze = useCallback(() => {
    if (!analyserRef.current || !isRunningRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedVolume = Math.round((average / 255) * 100);
    setVolume(normalizedVolume);

    const now = Date.now();
    if (normalizedVolume < threshold) {
      if (lowVolumeStartTimeRef.current === null) {
        console.log('开始新的低音量计时 - 当前配置:', {
          目标持续时间: configuredDurationRef.current,
          实际配置值: lowVolumeDuration
        });
        lowVolumeStartTimeRef.current = now;
      }

      const duration = now - lowVolumeStartTimeRef.current;
      onLowVolumeDurationUpdate(duration);

      // 详细的调试信息
      console.log('检查触发条件:', {
        当前持续时间: duration,
        目标持续时间: configuredDurationRef.current,
        原始配置值: lowVolumeDuration,
        差值: Math.abs(duration - configuredDurationRef.current)
      });

      // 严格判断：只有当持续时间达到配置值时才触发
      if (duration >= configuredDurationRef.current) {
        console.log('触发提醒:', {
          触发时的持续时间: duration,
          目标持续时间: configuredDurationRef.current,
          原始配置值: lowVolumeDuration
        });
        onVolumeLow();
        lowVolumeStartTimeRef.current = now;
        onLowVolumeDurationUpdate(0);
      }
    } else {
      if (lowVolumeStartTimeRef.current !== null) {
        console.log('音量恢复正常，重置计时器');
        lowVolumeStartTimeRef.current = null;
        onLowVolumeDurationUpdate(0);
      }
    }

    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }
    analyzeTimeoutRef.current = setTimeout(analyze, 100);
  }, [threshold, onVolumeLow, onLowVolumeDurationUpdate, lowVolumeDuration]); // 添加 lowVolumeDuration 到依赖

  const stopMonitoring = useCallback(() => {
    console.log('Stopping monitoring');
    isRunningRef.current = false;
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    lowVolumeStartTimeRef.current = null;
    onLowVolumeDurationUpdate(0);
  }, [onLowVolumeDurationUpdate]);

  const startMonitoring = useCallback(async () => {
    try {
      if (!navigator.mediaDevices) {
        throw new Error('浏览器不支持音频输入');
      }

      console.log('Starting monitoring with duration:', lowVolumeDuration);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      lowVolumeStartTimeRef.current = null;
      isRunningRef.current = true;
      analyze();
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    }
  }, [analyze]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    volume,
    error,
    startMonitoring,
    stopMonitoring,
  };
};
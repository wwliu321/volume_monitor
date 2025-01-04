import { useState, useEffect } from 'react';
import { Settings } from '../types';

export const useAudioMonitor = (settings: Settings) => {
  const [volume, setVolume] = useState<number>(0);
  const [isLowVolume, setIsLowVolume] = useState<boolean>(false);
  const [lowVolumeTimer, setLowVolumeTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(new MediaStream());
    microphone.connect(analyser);

    const updateVolume = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const volume = Math.round(average * 100) / 100;
      setVolume(volume);

      if (volume < settings.threshold) {
        if (!lowVolumeTimer) {
          const timer = setTimeout(() => {
            setIsLowVolume(true);
          }, settings.lowVolumeDuration);
          setLowVolumeTimer(timer);
        }
      } else {
        if (lowVolumeTimer) {
          clearTimeout(lowVolumeTimer);
          setLowVolumeTimer(null);
          setIsLowVolume(false);
        }
      }
    };

    const interval = setInterval(updateVolume, 100);

    return () => {
      clearInterval(interval);
      audioContext.close();
    };
  }, [settings.threshold, settings.lowVolumeDuration]);

  return { volume, isLowVolume };
};

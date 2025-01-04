export const percentToDecibel = (percentage: number): number => {
  return Math.round((percentage / 100) * 200);
};

export const decibelToPercent = (decibel: number): number => {
  return Math.round((decibel / 200) * 100);
};

export type VolumeConverter = {
  percentToDecibel: (percentage: number) => number;
  decibelToPercent: (decibel: number) => number;
}; 
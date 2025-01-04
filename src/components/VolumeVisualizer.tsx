import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { VolumeVisualizerProps } from '../types';

const Container = styled.div<{ isCompact?: boolean }>`
  background: #f5f5f5;
  border-radius: ${props => props.isCompact ? '4px' : '8px'};
  padding: ${props => props.isCompact ? '10px' : '20px'};
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressBar = styled.div<{ 
  percentage: number; 
  threshold: number;
  warning?: boolean;
}>`
  height: 20px;
  background: ${props => {
    if (props.warning) {
      return '#ff9800';
    }
    return props.percentage < props.threshold ? '#f44336' : '#4caf50';
  }};
  width: ${props => props.percentage}%;
  transition: width 0.1s ease-out;
  border-radius: 4px;
  position: relative;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const VolumeText = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  z-index: 1;
`;

// 添加音量转换函数
const percentToDecibel = (percentage: number): number => {
  // 将0-100的百分比映射到0-120分贝范围
  return Math.round((percentage / 100) * 200);
};

export const VolumeVisualizer: React.FC<VolumeVisualizerProps> = ({
  volume,
  threshold,
  isCompact = false
}) => {
  const prevVolume = useRef(volume);

  useEffect(() => {
    prevVolume.current = volume;
  }, [volume]);

  const volumeInDb = percentToDecibel(volume);
  const thresholdInDb = percentToDecibel(threshold);

  return (
    <Container isCompact={isCompact}>
      <ProgressContainer>
        <ProgressBar 
          percentage={volume} 
          threshold={threshold}
          warning={volume < threshold}
        />
        <VolumeText>
          {volumeInDb} 分贝
        </VolumeText>
      </ProgressContainer>
    </Container>
  );
}; 
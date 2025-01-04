import React from 'react';
import styled from 'styled-components';

interface VolumeAnalyzerProps {
  volume: number;
  threshold: number;
  lowVolumeDuration: number;
  currentLowVolumeDuration: number;
}

const Container = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const AnalysisItem = styled.div`
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
`;

const Label = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Value = styled.div<{ warning?: boolean }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.warning ? '#f44336' : '#2196f3'};
`;

const ProgressBackground = styled.div`
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 8px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 4px;
  background: #2196f3;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 2px;
`;

const percentToDecibel = (percentage: number): number => {
  return Math.round((percentage / 100) * 120);
};

const VolumeAnalyzer: React.FC<VolumeAnalyzerProps> = ({
  volume,
  threshold,
  lowVolumeDuration,
  currentLowVolumeDuration
}) => {
  const getDeviation = (volume: number) => {
    const idealVolume = 60;
    const deviation = Math.abs(volume - idealVolume);
    return Math.round(deviation);
  };

  const getLowVolumeProgress = () => {
    if (volume >= threshold) return 0;
    return Math.min((currentLowVolumeDuration / lowVolumeDuration) * 100, 100);
  };

  return (
    <Container>
      <Title>音量分析</Title>
      
      <AnalysisGrid>
        <AnalysisItem>
          <Label>低音量持续时间</Label>
          <Value warning={volume < threshold}>
            {(currentLowVolumeDuration / 1000).toFixed(1)}秒 / {(lowVolumeDuration / 1000).toFixed(1)}秒
          </Value>
          <ProgressBackground>
            <ProgressBar progress={getLowVolumeProgress()} />
          </ProgressBackground>
        </AnalysisItem>
        
      </AnalysisGrid>
    </Container>
  );
};

export { VolumeAnalyzer };
export type { VolumeAnalyzerProps }; 
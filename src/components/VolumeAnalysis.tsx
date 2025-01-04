import React from 'react';
import styled from 'styled-components';
import type { AnalysisResult } from '../types';

interface VolumeAnalysisProps {
  analysis: AnalysisResult;
  isCompact?: boolean;
}

const Container = styled.div<{ isCompact?: boolean }>`
  background: white;
  border-radius: ${props => props.isCompact ? '4px' : '8px'};
  padding: ${props => props.isCompact ? '10px' : '20px'};
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ trend?: 'rising' | 'falling' | 'stable' }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => {
    switch (props.trend) {
      case 'rising': return '#4caf50';
      case 'falling': return '#f44336';
      default: return '#2196f3';
    }
  }};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

export const VolumeAnalysis: React.FC<VolumeAnalysisProps> = ({
  analysis,
  isCompact = false
}) => {
  const { currentStats, trend } = analysis;

  return (
    <Container isCompact={isCompact}>
      <Title>音量分析</Title>
      <StatGrid>
        <StatItem>
          <StatValue>{currentStats.average.toFixed(1)}%</StatValue>
          <StatLabel>平均音量</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{currentStats.min.toFixed(1)}%</StatValue>
          <StatLabel>最小音量</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{currentStats.max.toFixed(1)}%</StatValue>
          <StatLabel>最大音量</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue trend={trend}>
            {trend === 'rising' ? '↑' : trend === 'falling' ? '↓' : '→'}
          </StatValue>
          <StatLabel>变化趋势</StatLabel>
        </StatItem>
      </StatGrid>
    </Container>
  );
}; 
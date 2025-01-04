import React from 'react';
import styled from 'styled-components';
import { alertManager } from '../utils/alertManager';

interface ConfigPanelProps {
  threshold: number;
  duration: number;
  alertVolume: number;
  onThresholdChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onAlertVolumeChange: (value: number) => void;
}

const Panel = styled.div`
  position: fixed;
  left: 240px;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
  z-index: 90;
`;

const Title = styled.h3`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const ConfigItem = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
`;

const Slider = styled.input`
  width: 100%;
  margin: 8px 0;
`;

const ValueDisplay = styled.span`
  font-weight: bold;
  color: #2196f3;
`;

const TestButton = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976d2;
  }

  &:active {
    background-color: #1565c0;
  }
`;

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  threshold,
  duration,
  alertVolume,
  onThresholdChange,
  onDurationChange,
  onAlertVolumeChange
}) => {
  return (
    <Panel>
      <Title>监控配置</Title>
      
      <ConfigItem>
        <Label>
          <span>音量阈值</span>
          <ValueDisplay>{threshold}%</ValueDisplay>
        </Label>
        <Slider
          type="range"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
        />
      </ConfigItem>

      <ConfigItem>
        <Label>
          <span>低音量持续时间</span>
          <ValueDisplay>{(duration / 1000).toFixed(1)}秒</ValueDisplay>
        </Label>
        <Slider
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
        />
      </ConfigItem>

      <ConfigItem>
        <Label>
          <span>提示音量</span>
          <ValueDisplay>{Math.round(alertVolume * 100)}%</ValueDisplay>
        </Label>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={alertVolume}
          onChange={(e) => onAlertVolumeChange(Number(e.target.value))}
        />
        <TestButton onClick={() => alertManager.trigger('sound')}>
          测试提示音
        </TestButton>
      </ConfigItem>
    </Panel>
  );
}; 
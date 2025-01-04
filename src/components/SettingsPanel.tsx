import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Settings } from '../types';
import { alertManager } from '../utils/alertManager';
import { percentToDecibel } from '../utils/volumeConverter';

interface SettingsPanelProps {
  settings: {
    threshold: number;
    lowVolumeDuration: number;
    textAlerts: boolean;
    soundAlerts: boolean;
    alertVolume: number;
  };
  onSettingsChange: (newSettings: Partial<Settings>) => void;
}

const Panel = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 20px;
  overflow-y: auto;
  z-index: 100;
`;

const Title = styled.h3`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
`;

const SettingItem = styled.div`
  margin-bottom: 20px;
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
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #ddd;
  outline: none;
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #2196f3;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #1976d2;
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #2196f3;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #1976d2;
    }
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 8px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
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
    background-color: #1976f3;
  }

  &:active {
    background-color: #1565c0;
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  margin-bottom: 8px;
`;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const decibelValue = Number(e.target.value);
    const percentValue = (decibelValue / 200) * 100;
    onSettingsChange({ threshold: percentValue });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    console.log('Duration changing to:', newValue);
    onSettingsChange({ lowVolumeDuration: newValue });
  };

  return (
    <Panel>
      <Title>个性化设置</Title>

      <Section>
        <SectionTitle>提醒方式</SectionTitle>
        <SettingItem>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={(e) => onSettingsChange({ 
                soundAlertEnabled: e.target.checked,
                soundAlerts: e.target.checked 
              })}
            />
            <span>提示音</span>
          </Toggle>
          <HelpText>当音量需要调整时，通过轻柔的提示音来提醒</HelpText>
        </SettingItem>

        {settings.soundAlerts && (
          <SettingItem>
            <Label>
              <span>提示音大小</span>
              <span>{Math.round(settings.alertVolume * 100)}%</span>
            </Label>
            <Slider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.alertVolume}
              onChange={(e) => onSettingsChange({ 
                alertVolume: Number(e.target.value) 
              })}
            />
          </SettingItem>
        )}
      </Section>

      <Section>
        <SectionTitle>音量目标设置</SectionTitle>
        <SettingItem>
          <Label>
            <span>目标音量</span>
            <span>{percentToDecibel(settings.threshold)} 分贝</span>
          </Label>
          <HelpText>
            建议保持在60分贝左右
          </HelpText>
          <Slider
            type="range"
            min="0"
            max="200"
            step="20"
            value={percentToDecibel(settings.threshold)}
            onChange={handleThresholdChange}
          />
        </SettingItem>
        
        <SettingItem>
          <Label>
            <span>提醒间隔</span>
            <span>{(settings.lowVolumeDuration / 1000).toFixed(1)}秒</span>
          </Label>
          <HelpText>
            当音量持续偏低时，多久提醒一次
          </HelpText>
          <Slider
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={settings.lowVolumeDuration}
            onChange={handleDurationChange}
          />
        </SettingItem>
      </Section>
    </Panel>
  );
}; 
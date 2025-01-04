import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { VolumeVisualizer } from './VolumeVisualizer';
import { VolumeAnalyzer } from './VolumeAnalyzer';
import { SettingsPanel } from './SettingsPanel';
import { useAudioMonitor } from '../hooks/useAudioMonitor';
import { Settings } from '../types';
import { alertManager } from '../utils/alertManager';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const WelcomeTitle = styled.h1`
  color: #2196f3;
  font-size: 24px;
  margin-bottom: 20px;
`;

const WelcomeText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 16px;
`;

const MainContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
`;

const SettingsWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VolumeSection = styled.div`
  margin-bottom: 30px;
`;

const AnalysisSection = styled.div`
  margin-bottom: 30px;
`;

const VolumeDisplay = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #2196f3;
  text-align: center;
  margin-bottom: 10px;
`;

const StatusText = styled.div`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  background: #fff3e0;
  color: #f57c00;
  padding: 12px 20px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
  line-height: 1.5;
`;

export const AudioTest: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    textAlertEnabled: true,
    soundAlertEnabled: true,
    soundAlerts: true,
    isCompact: false,
    alertInterval: 1000,
    threshold: 30,
    alertVolume: 0.5,
    lowVolumeDuration: 3000
  });
  const [threshold, setThreshold] = useState(settings.threshold);
  const [lowVolumeDuration, setLowVolumeDuration] = useState(settings.lowVolumeDuration);
  const [currentLowVolumeDuration, setCurrentLowVolumeDuration] = useState(0);

  useEffect(() => {
    // 初始化时同步设置到 alertManager
    alertManager.updateConfig({
      soundAlerts: settings.soundAlertEnabled,
      alertVolume: settings.alertVolume
    });
  }, []); // 仅在组件挂载时执行一次

  const handleSettingsChange = useCallback((newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // 同步声音相关的设置到 alertManager
    if (newSettings.soundAlertEnabled !== undefined) {
      updatedSettings.soundAlerts = newSettings.soundAlertEnabled;
      alertManager.updateConfig({
        soundAlerts: newSettings.soundAlertEnabled,
        // 同时确保音量设置也被同步
        alertVolume: updatedSettings.alertVolume
      });
    }
    
    if (newSettings.alertVolume !== undefined) {
      alertManager.updateConfig({
        alertVolume: newSettings.alertVolume,
        // 确保声音开关状态也被同步
        soundAlerts: updatedSettings.soundAlertEnabled
      });
    }
    
    setSettings(updatedSettings);

    if (newSettings.threshold !== undefined) {
      setThreshold(newSettings.threshold);
    }
    if (newSettings.lowVolumeDuration !== undefined) {
      setLowVolumeDuration(newSettings.lowVolumeDuration);
    }
  }, [settings]);

  const { volume, error, startMonitoring } = useAudioMonitor({
    threshold,
    lowVolumeDuration,
    onVolumeLow: useCallback(() => {
      alertManager.trigger('low-volume');
    }, []),
    onLowVolumeDurationUpdate: useCallback((duration: number) => {
      setCurrentLowVolumeDuration(duration);
    }, [])
  });

  useEffect(() => {
    startMonitoring();
  }, [startMonitoring]);

  const getVolumeStatus = (volume: number) => {
    const roundedVolume = Math.round(volume * 100) / 100;
    if (roundedVolume < threshold) {
      return '继续加油，让我们的声音更清晰一些';
    } else if (roundedVolume < 50) {
      return '不错！声音清晰可闻';
    } else if (roundedVolume < 80) {
      return '太棒了！这个音量正好';
    } else {
      return '充满活力！如果感觉累可以稍微放松些';
    }
  };

  return (
    <>
      <Container>
        <WelcomeSection>
          <WelcomeTitle>欢迎使用声音助手</WelcomeTitle>
          <WelcomeText>
            每个人的声音都值得被倾听。这个小工具将帮助你找到最舒适的说话音量，
            让你的想法更好地传达给每一个听众。
          </WelcomeText>
          <WelcomeText>

          </WelcomeText>
        </WelcomeSection>

        <MainContent>
          <VolumeSection>
            <VolumeDisplay>
              {(Math.round(volume * 200) / 100)}分贝
            </VolumeDisplay>
            
            <StatusText>
              {getVolumeStatus(volume)}
            </StatusText>

            <VolumeVisualizer
              volume={volume}
              threshold={threshold}
              isCompact={settings.isCompact}
            />
          </VolumeSection>
          
          <AnalysisSection>
            <VolumeAnalyzer
              volume={volume}
              threshold={threshold}
              lowVolumeDuration={lowVolumeDuration}
              currentLowVolumeDuration={currentLowVolumeDuration}
            />
          </AnalysisSection>

          {error && (
            <ErrorMessage>
              需要麦克风权限才能开始练习。
              点击浏览器地址栏的麦克风图标，允许访问即可。
            </ErrorMessage>
          )}
        </MainContent>
        
        <SettingsWrapper>
          <SettingsPanel
            settings={{
              threshold,
              lowVolumeDuration,
              textAlerts: settings.textAlertEnabled,
              soundAlerts: settings.soundAlertEnabled,
              alertVolume: settings.alertVolume
            }}
            onSettingsChange={handleSettingsChange}
          />
        </SettingsWrapper>
      </Container>
    </>
  );
}; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { settingsManager } from '../utils/settingsManager';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (threshold: number) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Progress = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin: 16px 0;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #2196f3;
    transition: width 0.1s linear;
  }
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #2196f3;
  text-align: center;
`;

const MessageContainer = styled.div`
  margin: 20px 0;
  line-height: 1.6;
  color: #666;
  white-space: pre-line;
  text-align: center;
`;

const ProgressContainer = styled.div`
  margin: 20px 0;
`;

const TimeRemaining = styled.div`
  text-align: center;
  color: #666;
  margin-top: 10px;
  font-size: 14px;
`;

const CompleteButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 auto;
  display: block;

  &:hover {
    background: #1976d2;
  }
`;

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'ready' | 'calibrating' | 'complete'>('ready');

  useEffect(() => {
    if (isOpen && status === 'ready') {
      setStatus('calibrating');
      const startTime = Date.now();
      const duration = 10000; // 10秒

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;

        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('complete');
          setProgress(100);
          // 这里调用 settingsManager.calibrate() 获取新的阈值
          settingsManager.calibrate().then(onComplete);
        } else {
          setProgress(newProgress);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, status, onComplete]);

  if (!isOpen) return null;

  const getStatusContent = () => {
    switch (status) {
      case 'ready':
        return {
          title: '开始音量校准',
          message: '让我们花一点时间找到最适合你的说话音量。准备好了吗？'
        };
      case 'calibrating':
        return {
          title: '正在校准',
          message: `
            请用你平时交谈的语气朗读下面的文字：
            "今天是个好天气，阳光明媚，微风轻拂。
            我相信每个人都有属于自己的精彩故事要讲述。"
          `
        };
      case 'complete':
        return {
          title: '校准完成！',
          message: '太棒了！我们已经找到了适合你的音量范围。记住，这个设置随时可以调整，重要的是让你感觉舒适自然。'
        };
      default:
        return { title: '', message: '' };
    }
  };

  const content = getStatusContent();

  return (
    <Overlay onClick={status === 'complete' ? onClose : undefined}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>{content.title}</Title>
        
        <MessageContainer>
          {content.message}
        </MessageContainer>

        <ProgressContainer>
          <Progress progress={progress} />
          {status === 'calibrating' && (
            <TimeRemaining>
              还需要 {Math.ceil((10000 - progress * 100) / 1000)} 秒
            </TimeRemaining>
          )}
        </ProgressContainer>

        {status === 'complete' && (
          <CompleteButton onClick={onClose}>
            开始练习
          </CompleteButton>
        )}
      </Modal>
    </Overlay>
  );
}; 
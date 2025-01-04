import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Warning, Error, Info } from '@styled-icons/material';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const shrinkAnimation = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

const Container = styled.div<{
  isVisible: boolean;
  type: string;
  isExiting: boolean;
}>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.type) {
      case 'warning': return '#ff9800';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#4caf50';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
  cursor: pointer;
  z-index: 1000;
`;

const IconContainer = styled.div<{ type: string }>`
  width: 24px;
  height: 24px;
  color: white;
`;

const MessageText = styled.div`
  margin: 0 10px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Progress = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  transform-origin: left;
  animation: ${props => css`
    ${shrinkAnimation} ${props.duration}ms linear
  `};
`;

interface AlertNotificationProps {
  isVisible: boolean;
  message: string;
  type: 'warning' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
  showProgress?: boolean;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({
  isVisible,
  message,
  type,
  duration = 5000,
  onClose,
  showIcon = true,
  showProgress = true
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        if (onClose) setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <Warning size={24} />;
      case 'error':
        return <Error size={24} />;
      case 'info':
        return <Info size={24} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <Container
      isVisible={isVisible}
      type={type}
      isExiting={isExiting}
      onClick={onClose}
    >
      {showIcon && <IconContainer type={type}>{getIcon()}</IconContainer>}
      <MessageText>{message}</MessageText>
      <CloseBtn onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExiting(true);
        if (onClose) setTimeout(onClose, 300);
      }}>
        ✕
      </CloseBtn>
      {showProgress && <Progress duration={duration} />}
    </Container>
  );
}; 
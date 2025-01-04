import React from 'react';
import styled from 'styled-components';

interface SideMenuProps {
  onOpenSettings: () => void;
}

const Menu = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 20px;
  z-index: 100;
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  font-size: 18px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #2196f3;
  }
`;

export const SideMenu: React.FC<SideMenuProps> = ({
  onOpenSettings
}) => {
  return (
    <Menu>
      <Title>音量监控</Title>
      <MenuItem onClick={onOpenSettings}>
        设置
      </MenuItem>
    </Menu>
  );
}; 
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

// 在每个测试后进行清理
afterEach(() => {
  cleanup();
  // 清理任何可能的定时器
  jest.clearAllTimers();
});

describe('App Component', () => {
  test('renders welcome message', () => {
    render(<App />);
    const titleElement = screen.getByText(/欢迎使用声音助手/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders volume settings section', () => {
    render(<App />);
    const settingsTitle = screen.getByText(/个性化设置/i);
    expect(settingsTitle).toBeInTheDocument();
  });

  test('renders volume target settings', () => {
    render(<App />);
    const volumeTarget = screen.getByText(/目标音量/i);
    expect(volumeTarget).toBeInTheDocument();
  });
});

// 确保在所有测试结束后进行清理
afterAll(() => {
  cleanup();
  jest.clearAllTimers();
});

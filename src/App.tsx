import React from 'react';
import { AudioTest } from './components/AudioTest';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <AudioTest />
    </AppContainer>
  );
}

export default App;
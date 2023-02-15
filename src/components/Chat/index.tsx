import React from 'react';
import MessageForm from '../MessageForm';
import { Container } from './styles';
import Sidebar from '../Sidebar';

const App: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <MessageForm />
    </Container>
  );
};

export default App;

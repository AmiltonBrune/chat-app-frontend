import { lazy } from 'react';

const Container = lazy(() => import('../../common/Container'));
const ChatComponent = lazy(() => import('../../components/Chat'));

const Chat = () => {
  return (
    <Container>
      <ChatComponent />
    </Container>
  );
};

export default Chat;

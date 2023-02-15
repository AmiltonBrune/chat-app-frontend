import { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroContent from '../../content/IntroContent.json';

const Container = lazy(() => import('../../common/Container'));
const ContentBlock = lazy(() => import('../../components/ContentBlock'));

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <ContentBlock
        type='right'
        title={IntroContent.title}
        content={IntroContent.text}
        button={IntroContent.button}
        icon='developer.svg'
        onClick={() => navigate('/login')}
      />
    </Container>
  );
};

export default Home;

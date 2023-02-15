import { lazy } from 'react';

const Container = lazy(() => import('../../common/Container'));
const LoginForm = lazy(() => import('../../components/LoginForm'));

const Login = () => {
  return (
    <Container>
      <LoginForm id='contact' icon='login.svg' />
    </Container>
  );
};

export default Login;

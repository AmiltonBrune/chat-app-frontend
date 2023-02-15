import { lazy } from 'react';

const Container = lazy(() => import('../../common/Container'));
const RegisterForm = lazy(() => import('../../components/RegisterForm'));

const Login = () => {
  return (
    <Container>
      <RegisterForm id='contact' icon='signup.svg' />
    </Container>
  );
};

export default Login;

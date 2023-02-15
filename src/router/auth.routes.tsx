import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Chat from '../pages/Chat';

const AuthRoutes: React.FC = () => (
  <Suspense fallback={null}>
    <Header />
    <Routes>
      <Route path='/chat' element={<Chat />} />
    </Routes>
  </Suspense>
);

export default AuthRoutes;

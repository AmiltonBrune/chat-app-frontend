import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Styles } from '../styles/styles';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const AppRoutes: React.FC = () => (
  <Suspense fallback={null}>
    <Styles />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;

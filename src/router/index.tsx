import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket } from '../context/appContext';
import i18n from '../translation';

import App from './app.routes';
import AuthRoutes from './auth.routes';

const Routes: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state: any) => state.user);

  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        messages,
        setMessages,
        members,
        setMembers,
        privateMessages,
        setPrivateMessages,
        newMessages,
        setNewMessages,
        rooms,
        setRooms,
      }}
    >
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          {user ? <AuthRoutes /> : <App />}
        </I18nextProvider>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default Routes;

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Divider } from 'antd';
import { SmileOutlined, SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { AppContext } from '../../context/appContext';
import {
  Button,
  ChatInput,
  ContainerInput,
  ContainerMessageForm,
  FooterContainer,
  Input,
  TextInfo,
} from './styles';

import userDefautImage from '../../assets/user.png';

const MessageForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const { socket, currentRoom, messages, setMessages } = useContext(AppContext);
  const messageEndRef: any = useRef(null);

  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormartDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    let day = date.getDate().toString();

    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
  }

  const todayDate = getFormartDate();

  socket.off('room-messages').on('room-messages', (roomMessages: any) => {
    setMessages(roomMessages);
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!message) return;

    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ':' + minutes;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage('');
  };

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleEmoticon = (event: any) => {
    setMessage(message + event.emoji);
    setShowEmojis(!showEmojis);
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  return (
    <ContainerMessageForm>
      <div className='messages-output'>
        {!user && <div className='alert alert-danger'>Please login</div>}
        {user &&
          messages.map(({ _id: date, messagesByDate }: any, idx: any) => (
            <div key={idx}>
              <Divider>
                <span className='message-date-indicator'>{date}</span>
              </Divider>

              {messagesByDate?.map(
                ({ content, time, from: sender }: any, msgIdx: any) => (
                  <div
                    className={
                      sender?.email === user?.email
                        ? 'message'
                        : 'incoming-message'
                    }
                    key={msgIdx}
                  >
                    <div className='message-inner'>
                      {sender?.email === user?.email ? (
                        <>
                          <img
                            src={sender.picture || userDefautImage}
                            style={{
                              width: 35,
                              height: 35,
                              objectFit: 'cover',
                              borderRadius: '50%',
                              marginRight: 10,
                            }}
                            alt='sender'
                          />

                          <div>
                            <p className='message-sender'>
                              {sender._id === user?._id ? 'You' : sender.name}
                              <span className='message-timestamp-left'>
                                {time}
                              </span>
                            </p>
                            <p className='message-content'>{content}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className='message-sender'>
                              <span className='message-timestamp-left'>
                                {time}
                              </span>
                              {sender._id === user?._id ? 'You' : sender.name}
                            </p>
                            <p className='message-content'>{content}</p>
                          </div>

                          <img
                            src={sender.picture || userDefautImage}
                            style={{
                              width: 35,
                              height: 35,
                              objectFit: 'cover',
                              borderRadius: '50%',
                              marginRight: 10,
                            }}
                            alt='sender'
                          />
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
      </div>

      <FooterContainer>
        {showEmojis && <EmojiPicker onEmojiClick={handleEmoticon} />}
        <div ref={messageEndRef}></div>
        <ChatInput>
          <ContainerInput>
            <Input
              type='text'
              placeholder='Your message'
              disabled={!user}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={() => setShowEmojis(!showEmojis)}>
              <SmileOutlined />
            </Button>
            <Button onClick={handleSubmit}>
              <TextInfo>
                <SendOutlined />
              </TextInfo>
            </Button>
          </ContainerInput>
        </ChatInput>
      </FooterContainer>
    </ContainerMessageForm>
  );
};

export default MessageForm;

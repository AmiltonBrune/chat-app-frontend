import { useContext, useEffect } from 'react';
import { Badge, Col, Row, Menu, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { AppContext } from '../../context/appContext';
import { addNotification, resetNotification } from '../../features/userSlive';
import { Container } from './styles';

import userDefautImage from '../../assets/user.png';

function Sidebar() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const {
    socket,
    rooms,
    setRooms,
    members,
    setMembers,
    currentRoom,
    setCurrentRoom,
    setPrivateMessages,
  } = useContext(AppContext);

  function joinRoom(room: any, isPublic = true) {
    if (!user) {
      return notification['error']({
        message: 'Error',
        description: 'Please login',
      });
    }
    socket.emit('join-room', room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMessages(null);
    }

    dispatch(resetNotification(room));
  }

  socket.off('new-user').on('new-user', (payload: any) => {
    setMembers(payload);
  });

  socket.off('notifications').on('notifications', (room: any) => {
    if (currentRoom !== room) dispatch(addNotification(room));
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom('General');
      getRooms();
      socket.emit('join-room', 'General');
      socket.emit('new-user');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getRooms() {
    fetch('https://chat-backend.herokuapp.com/rooms')
      .then((res) => res.json())
      .then((data) => {
        return setRooms(data);
      });
  }

  function orderIds(id1: any, id2: any) {
    return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }

  function handlerPrivateMemberMsg(member: any) {
    if (member._id === user._id) return;
    setPrivateMessages(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  return (
    <Container>
      <Menu
        mode='inline'
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['menu1']}
        style={{ height: '100%', width: 300, borderRight: 0 }}
        items={[
          {
            key: 'menu1',
            label: 'Channels',
            children: rooms.map((room: any, idx: any) => {
              return {
                key: idx,
                label: (
                  <div
                    key={idx}
                    onClick={() => joinRoom(room)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {room}
                    {user.newMessages &&
                      currentRoom !== room &&
                      user.newMessages[room] !== undefined && (
                        <Badge
                          // count={user.newMessages[room]}
                          count={3}
                          showZero={false}
                          color='#FF577F'
                          style={{}}
                        />
                      )}
                  </div>
                ),
              };
            }),
          },
          {
            key: 'menu2',
            label: 'Members',
            children: members.map((member: any) => {
              return {
                key: member._id,
                label: (
                  <div
                    key={member.id}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handlerPrivateMemberMsg(member)}
                  >
                    <img
                      src={member.picture || userDefautImage}
                      className='member-status-img'
                      alt='member_picture'
                    />

                    {member.status === 'online' ? (
                      <CheckCircleOutlined className='sidebar-online-status' />
                    ) : (
                      <MinusCircleOutlined className='sidebar-offline-status' />
                    )}
                    <Row style={{ width: 200 }}>
                      <Col xs={2} className='member-status'></Col>
                      <Col xs={9}>
                        {member.name}
                        {member._id === user?._id && ' (You)'}
                        {member.status === 'offline' && ' (Offline)'}
                      </Col>
                    </Row>
                    {user.newMessages &&
                      user.newMessages[orderIds(member._id, user._id)] && (
                        <Badge
                          count={
                            user.newMessages[orderIds(member._id, user._id)]
                          }
                          showZero={false}
                          color='#FF577F'
                          style={{}}
                        />
                      )}
                  </div>
                ),
              };
            }),
          },
        ]}
      />
    </Container>
  );
}

export default Sidebar;

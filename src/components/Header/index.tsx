import { useState } from 'react';
import { Row, Col, Drawer, Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import Container from '../../common/Container';
import { SvgIcon } from '../../common/SvgIcon';
import { Button } from '../../common/Button';
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
  User,
} from './styles';
import { useSelector } from 'react-redux';
import { useLogoutUserMutation } from '../../services/appApi';

import userDefautImage from '../../assets/user.png';

const Header = ({ t }: any) => {
  const [visible, setVisibility] = useState(false);

  const user = useSelector((state: any) => state.user);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async (e: any) => {
    e.preventDefault();
    await logoutUser(user);
    window.location.replace('/');
  };

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    return (
      <>
        <Avatar
          size={40}
          icon={
            <img
              src={user.picture || userDefautImage}
              style={{
                objectFit: 'cover',
                borderRadius: '50%',
              }}
              alt='user_image'
            />
          }
        />

        {user && <User>{user.name}</User>}
        <CustomNavLinkSmall style={{ width: '130px' }} onClick={handleLogout}>
          <Span>
            <Button>
              {t('Logout')} <LogoutOutlined />
            </Button>
          </Span>
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify='space-between'>
          <LogoContainer to='/chat' aria-label='homepage'>
            <SvgIcon src='logo.svg' width='101px' height='64px' />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} visible={visible} onClose={onClose}>
          <Col style={{ marginBottom: '2.5rem' }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);

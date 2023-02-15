import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import { SvgIcon } from '../../common/SvgIcon';
import Container from '../../common/Container';

import i18n from 'i18next';
import {
  NavLink,
  Extra,
  LogoContainer,
  FooterContainer,
  Label,
  LanguageSwitch,
  LanguageSwitchContainer,
} from './styles';

interface SocialLinkProps {
  href: string;
  src: string;
}

const Footer = ({ t }: any) => {
  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const SocialLink = ({ href, src }: SocialLinkProps) => {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        key={src}
        aria-label={src}
      >
        <SvgIcon src={src} width='25px' height='25px' />
      </a>
    );
  };

  return (
    <>
      <Extra>
        <Container border={true}>
          <Row
            justify='space-between'
            align='middle'
            style={{ paddingTop: '3rem' }}
          >
            <NavLink to='/'>
              <LogoContainer>
                <SvgIcon
                  src='logo.svg'
                  aria-label='homepage'
                  width='101px'
                  height='64px'
                />
              </LogoContainer>
            </NavLink>
            <Col lg={6} md={6} sm={12} xs={12}>
              <div
                style={{
                  display: 'flex',
                  gap: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Label htmlFor='select-lang'>{t('Language')}</Label>
                <LanguageSwitchContainer>
                  <LanguageSwitch onClick={() => handleChange('en')}>
                    <SvgIcon
                      src='united-states.svg'
                      aria-label='homepage'
                      width='30px'
                      height='30px'
                    />
                  </LanguageSwitch>
                  <LanguageSwitch onClick={() => handleChange('es')}>
                    <SvgIcon
                      src='spain.svg'
                      aria-label='homepage'
                      width='30px'
                      height='30px'
                    />
                  </LanguageSwitch>
                </LanguageSwitchContainer>
              </div>
            </Col>
            <FooterContainer>
              <SocialLink
                href='https://github.com/Adrinlol/create-react-app-adrinlol'
                src='github.svg'
              />
              <SocialLink
                href='https://www.linkedin.com/in/lasha-kakabadze/'
                src='linkedin.svg'
              />
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default withTranslation()(Footer);

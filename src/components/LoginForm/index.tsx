import { Col } from 'antd';
import { withTranslation } from 'react-i18next';
import { Slide, Zoom } from 'react-awesome-reveal';
import { ContactProps, ValidationTypeProps } from './types';
import { SvgIcon } from '../../common/SvgIcon';
import { useForm } from '../../common/utils/useForm';
import validate from '../../common/utils/validationRules';
import { Button } from '../../common/Button';
import Input from '../../common/Input';
import {
  ContactContainer,
  FormGroup,
  Span,
  ButtonContainer,
  FooterContainer,
  FooterLink,
  RowContainer,
} from './styles';
import { Link } from 'react-router-dom';

const Contact = ({ id, t, icon }: ContactProps) => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    validate
  ) as any;

  const ValidationType = ({ type }: ValidationTypeProps) => {
    const ErrorMessage = errors[type];
    return (
      <Zoom direction='left'>
        <Span erros={errors[type]}>{ErrorMessage}</Span>
      </Zoom>
    );
  };

  return (
    <ContactContainer id={id}>
      <RowContainer>
        <Col lg={12} md={11} sm={24} xs={24}>
          <Slide direction='left'>
            {icon && <SvgIcon src={icon} width='100%' height='100%' />}
          </Slide>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Slide direction='right'>
            <FormGroup autoComplete='off' onSubmit={handleSubmit}>
              <Col span={24}>
                <Input
                  type='text'
                  name='email'
                  placeholder='Your Email'
                  value={values.email || ''}
                  onChange={handleChange}
                />
                <ValidationType type='email' />
              </Col>
              <Col span={24}>
                <Input
                  type='password'
                  name='password'
                  placeholder='********'
                  value={values.password || ''}
                  onChange={handleChange}
                />
                <ValidationType type='password' />
              </Col>
              <ButtonContainer>
                <Button name='submit'>{t('Submit')}</Button>
              </ButtonContainer>
            </FormGroup>
            <FooterContainer>
              <p>
                Don't have an account?{' '}
                <Link to='/signup'>
                  <FooterLink> Sign Up</FooterLink>
                </Link>
              </p>
            </FooterContainer>
          </Slide>
        </Col>
      </RowContainer>
    </ContactContainer>
  );
};

export default withTranslation()(Contact);

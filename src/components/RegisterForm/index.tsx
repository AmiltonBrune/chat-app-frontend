import { Col } from 'antd';
import { withTranslation } from 'react-i18next';
import { Slide, Zoom } from 'react-awesome-reveal';
import { FaPlusCircle } from 'react-icons/fa';
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
  ImageContainer,
  Image,
  Label,
  Icon,
  RowContainer,
} from './styles';
import { Link } from 'react-router-dom';
import { notification } from 'antd';

import botLogo from '../../assets/robot.png';
import { useState } from 'react';

const Contact = ({ id, t, icon }: ContactProps) => {
  const [image, setImage] = useState('');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const { values, errors, handleChange, handleSubmitRegister } = useForm(
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

  const validateImg = (e: any) => {
    const file: any = e.target.files[0];
    if (file.size > 1048576) {
      return openNotificationError('Error', 'Max file size is 1mb');
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openNotificationError = (message: string, description: string) => {
    notification['error']({
      message,
      description,
    });
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
            <FormGroup
              autoComplete='off'
              onSubmit={(event) =>
                handleSubmitRegister(event, setUploading, image)
              }
            >
              <Col span={24}>
                <ImageContainer>
                  <Label htmlFor='image-upload'>
                    <Image src={imagePreview || botLogo} />
                    <Icon htmlFor='image-upload'>
                      <FaPlusCircle />
                    </Icon>
                  </Label>
                  <input
                    type='file'
                    id='image-upload'
                    hidden
                    accept='image/png, image/jpeg'
                    onChange={validateImg}
                  />
                </ImageContainer>
              </Col>
              <Col span={24}>
                <Input
                  type='text'
                  name='name'
                  placeholder='Your name'
                  value={values.name || ''}
                  onChange={handleChange}
                />
                <ValidationType type='name' />
              </Col>
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
                Already have an account?
                <Link to='/login'>
                  <FooterLink> Login </FooterLink>
                </Link>
                or return home
                <Link to='/'>
                  <FooterLink> Home</FooterLink>
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

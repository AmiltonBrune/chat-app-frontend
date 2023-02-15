import { useState, useEffect, useContext } from 'react';
import { notification } from 'antd';
import { AppContext } from '../../context/appContext';
import { useNavigate } from 'react-router-dom';
import {
  useLoginUserMutation,
  useSignupUserMutation,
} from '../../services/appApi';

export const useForm = (validate: any) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const { socket } = useContext(AppContext);
  const [loginUser] = useLoginUserMutation();
  const [signupUser] = useSignupUserMutation();
  const navigate = useNavigate();

  const openNotificationWithIcon = () => {
    notification['success']({
      message: 'Success',
      description: 'Your message has been sent!',
    });
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(validate(values));

    loginUser({ ...values }).then(({ data }: any) => {
      if (data) {
        socket.emit('new-user');
        navigate('/chat');
        setShouldSubmit(true);
      }
    });
  };

  const handleSubmitRegister = async (
    event: React.ChangeEvent<HTMLFormElement>,
    setUploading: any,
    image: any
  ) => {
    event.preventDefault();
    setErrors(validate(values));

    const url = await uploadImage(image, setUploading);
    signupUser({ ...values, picture: url }).then(async ({ data }: any) => {
      if (data) {
        socket.emit('new-user');
        socket.emit('logout');
        navigate('/chat');
        setShouldSubmit(true);
      }
    });
  };

  const uploadImage = async (image: any, setUploading: any) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'o88vdxxv');
    data.append('cloud_name', 'dafzdcct2');

    try {
      setUploading(true);
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dafzdcct2/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      const urlData = await res.json();
      return urlData.url;
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && shouldSubmit) {
      setValues('');
      openNotificationWithIcon();
    }
  }, [errors, shouldSubmit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
    setErrors((errors) => ({ ...errors, [event.target.name]: '' }));
  };

  return {
    handleChange,
    handleSubmit,
    handleSubmitRegister,
    values,
    errors,
  };
};

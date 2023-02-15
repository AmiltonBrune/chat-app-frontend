import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';
import { Row } from 'antd';

export const ContainerMessageForm = styled.div`
  grid-area: CT;
  overflow-y: scroll;
  height: calc(100vh - 80px);
  position: relative;

  .messages-output {
    padding: 20px;
  }
  .message-inner {
    margin-left: 20px;
    margin-bottom: 10px;
    padding: 10px;
    min-width: 200px;
    max-width: 90%;
    font: 400 1em, sans-serif;
    display: inline-flex;
    border-radius: 10px;
    flex-direction: row;
  }
  .message-content {
    background-color: #26292e;
    border-radius: 0px 30px 30px 30px;
    padding: 10px 20px 15px 20px;
    min-width: 80px;
    color: #fff;
  }

  .incoming-message .message-content {
    background-color: #3572ee;
    border-radius: 30px 0px 30px 30px;
  }

  .incoming-message {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }

  .incoming-message .message-timestamp-left {
    margin-left: 0;
    margin-right: 10px;
  }

  .message-timestamp-left {
    font-size: 0.75em;
    font-weight: 300;
    margin-left: 10px;
    color: #383a3b;
  }

  .incoming-message .message-sender {
    margin-left: 0;
    margin-right: 10px;
    text-align: end;
  }

  .message-sender {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .message-date-indicator {
    width: 150px;
    height: 30px;
    margin: 0 auto;
    text-align: center;
    line-height: 26px;
    font-size: 0.75em;
    font-weight: 300;
    color: #383a3b;
  }

  .conversation-info {
    padding: 0;
    margin: 0 auto;
    text-align: center;
    height: 100px;
    position: absolute;
  }
  .conversation-profile-picture {
    width: 60px;
    height: 60px;
    object-fit: cover;
    margin: 10px auto;
    border-radius: 50%;
    margin-bottom: 30px;
    border-radius: 50%;
    margin-left: 10px;
  }
`;

export const RowContainer = styled(Row)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  width: calc(100% - 300px);
  height: calc(100vh - 70px);
  overflow-y: hidden;
  margin-bottom: 20px;
`;

export const ContainerInput = styled.div`
  position: relative;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 12px 20px;
  background-color: #f9fafb;
  border-color: #f8f9fa;

  *:first-child {
    margin-left: 0;
  }

  > * {
    margin: 0 8px;
  }
`;

export const Input = styled.input`
  -webkit-box-flex: 1;
  flex-grow: 1;
  border: none;
  outline: none !important;
  background-color: transparent;
`;

export const Button = styled.a`
  background-color: transparent;
  border: none;
  color: #cac7c7;
  font-size: 25px;
  cursor: pointer;
  overflow: -moz-hidden-unscrollable;
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;
`;

export const TextInfo = styled.i`
  color: #48b0f7;
`;

export const Image = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
`;

export const UserOutlinedIcon = styled(UserOutlined)`
  font-size: 25px;
  background: rgba(0, 0, 0, 0.25);
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

export const FooterContainer = styled.div``;

export const ChatInput = styled.div`
  text-align: center;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
`;

export const Data = styled.p`
  width: 150px;
  height: 30px;
  margin: 0 auto;
  text-align: center;
  line-height: 26px;
  font-size: 0.75em;
  font-weight: 300;
  color: #383a3b;
`;

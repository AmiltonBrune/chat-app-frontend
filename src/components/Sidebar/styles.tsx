import styled from 'styled-components';

export const Container = styled.div`
  grid-area: AS;
  position: fixed;
  margin-top: 100px;

  .member-status-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }

  .member-status {
    margin-bottom: 0;
    position: relative;
  }

  .sidebar-online-status {
    color: #54d497;
  }

  .sidebar-offline-status {
    color: #e3b505;
  }

  .sidebar-online-status,
  .sidebar-offline-status {
    position: absolute;
    z-index: 99;
    bottom: 0;
    right: 5;
    background: #fff;
    border-radius: 50%;
  }
`;

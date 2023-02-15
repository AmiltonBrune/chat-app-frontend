import styled from "styled-components";
import { Row } from 'antd';

export const ContactContainer = styled("div")`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RowContainer = styled(Row)`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const FormGroup = styled("form")`
  width: 100%;
  max-width: 520px;

  @media only screen and (max-width: 1045px) {
    max-width: 100%;
    margin-top: 2rem;
  }
`;

export const Span = styled("span") <any>`
  display: block;
  font-weight: 600;
  color: #FF577F;
  height: 0.775rem;
  padding: 0 0.675rem;
`;

export const ButtonContainer = styled("div")`
  text-align: start;
  position: relative;

  @media only screen and (max-width: 414px) {
    padding-top: 0.75rem;
  }
`;

export const FooterContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
export const FooterLink = styled('span')`
  color: #FF577F;
`
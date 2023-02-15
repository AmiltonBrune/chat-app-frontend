import { Row } from "antd";
import styled from "styled-components";

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

export const ImageContainer = styled('div')`
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 20px;
`

export const Image = styled('img')`
  width: 100px;
  border-radius: 50%;
  border: 2px solid gray;
  object-fit: cover;
  height: 100px;
`

export const Label = styled('label')`
 cursor: pointer;
 `

export const Icon = styled('label')`
  position: absolute;
  bottom: 0;
  right: 5px;
  color: green;
  cursor: pointer;
  z-index: 99;
  font-size: 25px;
`
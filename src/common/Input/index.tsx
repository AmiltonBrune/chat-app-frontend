import { withTranslation } from 'react-i18next';
import { Container, StyledInput } from './styles';
import { Label } from '../TextArea/styles';
import { InputProps } from '../types';

const Input = ({ name, placeholder, onChange, t, type }: InputProps) => (
  <Container>
    <Label htmlFor={name}>{t(name)}</Label>
    <StyledInput
      placeholder={t(placeholder)}
      name={name}
      id={name}
      onChange={onChange}
      type={type}
    />
  </Container>
);

export default withTranslation()(Input);

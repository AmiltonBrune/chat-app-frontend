import { IsString } from 'class-validator';

export class ParticipantCleanDto {
  @IsString()
  nome: string;

  @IsString()
  cnpjLoja: string;

  @IsString()
  email: string;

  @IsString()
  rede: string;
}

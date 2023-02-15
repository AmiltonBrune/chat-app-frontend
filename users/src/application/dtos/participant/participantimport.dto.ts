import { IsString } from 'class-validator';

export class ParticipantImportDto {
  @IsString()
  reference: string;

  @IsString()
  pdvId: string;

  @IsString()
  archive: string;

  @IsString()
  items: RegisterParticipantImportDto[];
}

export class RegisterParticipantImportDto {
  @IsString()
  rede: string;

  @IsString()
  nomeLoja: string;

  @IsString()
  cnpjLoja: string;

  @IsString()
  userClientCode: string;

  @IsString()
  nome: string;

  @IsString()
  cpfParticipante: string;

  @IsString()
  telefoneCelular: string;

  @IsString()
  cargo: string;

  @IsString()
  email: string;

  @IsString()
  status: string;
}

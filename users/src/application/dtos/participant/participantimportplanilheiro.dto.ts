import { IsString } from 'class-validator';

export class ParticipantImportPlanilheiroDto {
  @IsString()
  reference: string;

  @IsString()
  pdvGroupId: string;

  @IsString()
  archive: string;

  @IsString()
  items: RegisterImportDto[];
}

export class RegisterImportDto {
  @IsString()
  rede: string;

  @IsString()
  cnpjLoja: string;

  @IsString()
  cargo: string;

  @IsString()
  cpfParticipante: string;

  @IsString()
  nomeParticipante: string;

  @IsString()
  telefoneCelular: string;

  @IsString()
  email: string;
}

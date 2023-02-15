import { IsDate, IsNumber, IsString } from 'class-validator';
import { ParticipantAddress } from 'src/domain/entities';
import { ParticipantAddressDto } from './participant';
export class ParticipantDto {
  @IsString()
  id: string;

  @IsString()
  readonly name: string;

  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  email2: string;

  @IsString()
  username: string;

  @IsNumber()
  age: number;

  @IsDate()
  dob: Date;

  @IsString()
  instagram: string;

  @IsString()
  phone: string;

  @IsString()
  mobile: string;

  @IsString()
  mobile2: string;

  addresses?: ParticipantAddress[];

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsString()
  jobTitle: string;

  @IsString()
  photoUrl: string;

  @IsNumber()
  status?: number;
}

import { IsDate, IsObject, IsString } from "class-validator";
import { User } from "src/domain/entities";

export class ParticipantReadDto {
   @IsString()
   id: string;

   @IsString()
   readonly name: string;

   @IsString()
   cpf: string;

   @IsDate()
   dob: Date;

   @IsString()
   instagram: string;

   @IsString()
   phone: string;

   @IsString()
   mobile: string;

   @IsString()
   photoUrl: string;

   @IsObject()
   user?: User;
}
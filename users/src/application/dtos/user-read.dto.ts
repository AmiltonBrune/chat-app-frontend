import { IsNumber, IsString } from "class-validator";
import { Participant } from "src/domain/entities"

export class UserReadDto {

   @IsString()
   readonly id: string;

   @IsString()
   readonly name: string;

   @IsString()
   readonly login: string;

   @IsString()
   readonly email: string;

   @IsNumber()
   status: number;

   participant: Participant;
}
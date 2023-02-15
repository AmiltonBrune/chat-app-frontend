import { IsString } from "class-validator";

export class UserCheckCodeDto {
   @IsString()
   email: string;

   @IsString()
   code: string;
}
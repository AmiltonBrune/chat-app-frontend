import { IsString } from "class-validator";

export class UserPasswordDto {
    @IsString()
    id: string;

    @IsString()
    email?: string;

    @IsString()
    passwordOld?: string;

    @IsString()
    password: string;

    @IsString()
    code: string;

}
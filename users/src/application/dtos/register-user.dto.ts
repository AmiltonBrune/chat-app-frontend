import { plainToClass } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { User } from "src/domain/entities/";
export class RegisterUserDTO {
    @IsString()
    id: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly login: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly emailVerifiedAt: string;

    @IsString()
    password: string;

    @IsNumber()
    status: number;

    @IsString()
    role: string;

    inactivatedAt?: Date;

    @IsString()
    jobTitle: string;

    static Update(user: User, modification: Partial<User>, loggedUserId: string): User {
        user.userUpdated = plainToClass(User, { id: loggedUserId });
        user.updatedAt = new Date();

        (modification.email) && (user.username = modification.email);
        (modification.email) && (user.email = modification.email);
        (modification.email) && (user.emailVerifiedAt = modification.email);

        return user;
    }
}

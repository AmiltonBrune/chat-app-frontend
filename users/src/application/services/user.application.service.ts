import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

import { ResultModel } from 'src/core/result.mode';
import { User, UserReadDto } from 'src/domain/entities';
import { UserService } from 'src/domain/services/user.service';
import { UserCheckCodeDto } from '../dtos/check-code.dto';
// import { CreateUserAndParticipantDTO } from '../dtos/create-user-and-participant.dto';
import { FindByEmailUserDTO } from '../dtos/find-by-email-user.dto';
import { ListUserDTO } from '../dtos/list-user.dto';
import { RegisterUserDTO } from '../dtos/register-user.dto';
import { UserPasswordDto } from '../dtos/user-password.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserApplicationService {
    constructor(private readonly userService: UserService) { }

    async list(): Promise<ResultModel<ListUserDTO[]>> {
        const listUsers = await this.userService.list();

        if (!listUsers.success)
            return new ResultModel<ListUserDTO[]>(false, listUsers.errors);

        const usersListMapped = UserMapper.userToListUserDTO(listUsers.data);

        return new ResultModel<ListUserDTO[]>(true, null, usersListMapped);
    }

    async findAll(
        optionsPage: IPaginationOptions,
        options?: {
            pdvGroupIds: string[];
            email: string;
            name: string;
            cpf: string;
        },): Promise<ResultModel<Pagination<any[]>>> {
        const findAll = await this.userService.find(optionsPage, options);

        if (!findAll.success)
            return new ResultModel<Pagination<any[]>>(false, findAll.errors);

        return new ResultModel<Pagination<any[]>>(true, null, findAll.data);
    }

    async verifyExistsById(data: object): Promise<ResultModel<boolean>> {
        const verifyExistsByIdResult = await this.userService.verifyExistsById(data);

        return verifyExistsByIdResult;
    }

    async findById(data: { id: string }): Promise<ResultModel<User>> {
        const findById = await this.userService.findById(data);

        if (!findById.success)
            return new ResultModel<User>(false, findById.errors);


        return new ResultModel<User>(true, null, findById.data);
    }

    async findByIdAndRelations(data: { id: string, relations: Array<string> }): Promise<ResultModel<User>> {
        const findByIdAndRelations = await this.userService.findByIdAndRelations(data);

        if (!findByIdAndRelations.success)
            return new ResultModel<User>(false, findByIdAndRelations.errors);

        return new ResultModel<User>(true, null, findByIdAndRelations.data);
    }

    async findByIdAndSelectSpecificFields(data: { id: string, select: Array<string> }): Promise<ResultModel<User>> {
        const findByIdAndSelectSpecificFields = await this.userService.findByIdAndSelectSpecificField(data);

        if (!findByIdAndSelectSpecificFields.success)
            return new ResultModel<User>(false, findByIdAndSelectSpecificFields.errors);

        return new ResultModel<User>(true, null, findByIdAndSelectSpecificFields.data);
    }

    async findByEmail(email: string): Promise<ResultModel<FindByEmailUserDTO>> {
        const findByEmail = await this.userService.findByEmail(email['email'], email['password']);

        if (!findByEmail.success)
            return new ResultModel<FindByEmailUserDTO>(false, findByEmail.errors);

        const mappedFindByEmail = UserMapper.userToFindByEmailUserDTO(findByEmail.data);

        return new ResultModel<FindByEmailUserDTO>(true, null, mappedFindByEmail);
    }

    async register(registerUserDTO: RegisterUserDTO): Promise<ResultModel<void>> {
        const user = UserMapper.registerUserDTOToUser(registerUserDTO);

        const registerUser = await this.userService.register(user);

        if (!registerUser.success)
            return new ResultModel<void>(false, registerUser.errors);

        return new ResultModel<void>(true);
    }

    async forgotPassword(email: string): Promise<ResultModel<void>> {
        const forgotPassword = await this.userService.forgotPassword(email);

        if (!forgotPassword.success)
            return new ResultModel<void>(false, forgotPassword.errors);

        return new ResultModel<void>(true);
    }

    async checkCodePassword(userCheckCodeDto: UserCheckCodeDto): Promise<ResultModel<boolean>> {
        const checkCodePassword = await this.userService.checkUserCodeEmail(userCheckCodeDto);

        if (!checkCodePassword.success)
            return new ResultModel<boolean>(false, checkCodePassword.errors);

        return new ResultModel<boolean>(true);
    }

    async resetPasswordWithCode(data: { userPasswordDTO: UserPasswordDto }): Promise<ResultModel<void>> {
        const resetPasswordWithCode = await this.userService.resetPasswordWithCode(data.userPasswordDTO);

        if (!resetPasswordWithCode.success)
            return new ResultModel<void>(false, resetPasswordWithCode.errors);

        return new ResultModel<void>(true);
    }

    async resetPassword(data: { userPasswordDTO: UserPasswordDto }): Promise<ResultModel<void>> {
        const resetPassword = await this.userService.prepareResetPassword(data.userPasswordDTO);

        if (!resetPassword.success)
            return new ResultModel<void>(false, resetPassword.errors);

        return new ResultModel<void>(true);
    }

    async edit(data: { userId: string, dto: any }): Promise<ResultModel<UserReadDto>> {
        const edit = await this.userService.edit(data.userId, data.dto);

        if (!edit.success)
            return new ResultModel<UserReadDto>(false, edit.errors);

        return new ResultModel<UserReadDto>(true);
    }
}

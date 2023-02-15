import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';


import { FindByEmailUserDTO } from 'src/application/dtos/find-by-email-user.dto';
import { UserPasswordDto } from './../../application/dtos/user-password.dto';
import { ListUserDTO } from 'src/application/dtos/list-user.dto';
import { RegisterUserDTO } from 'src/application/dtos/register-user.dto';
import { UserApplicationService } from 'src/application/services/user.application.service';
import { ResultModel } from 'src/core/result.mode';
import { UserReadDto } from 'src/domain/entities';

@Controller()
export class UserController {
    constructor(private readonly userApplicationService: UserApplicationService) { }

    @MessagePattern({ cmd: 'list' })
    async list(): Promise<ResultModel<ListUserDTO[]>> {
        return await this.userApplicationService.list();
    }

    @MessagePattern({ cmd: 'find-all-user' })
    async findAllUser(data: {
        optionsPage: IPaginationOptions,
        options?: {
            pdvGroupIds: string[];
            email: string;
            name: string;
            cpf: string;
        }
    }): Promise<ResultModel<Pagination<any[]>>> {
        return await this.userApplicationService.findAll(data.optionsPage, data.options);
    }

    @MessagePattern({ cmd: 'verify-exists-by-id' })
    async verifyExistsById(data: object): Promise<ResultModel<boolean>> {
        return await this.userApplicationService.verifyExistsById(data);
    }

    @MessagePattern({ cmd: 'user-update' })
    async update(data: { userId: string, dto: any }): Promise<ResultModel<UserReadDto>> {
        return await this.userApplicationService.edit(data)
    }

    @MessagePattern({ cmd: 'find-user-by-id' })
    async findById(data: { id: string, tenantId: string }): Promise<ResultModel<FindByEmailUserDTO>> {
        return await this.userApplicationService.findById(data);
    }

    @MessagePattern({ cmd: 'find-by-email' })
    async findByEmail(email: string): Promise<ResultModel<FindByEmailUserDTO>> {
        return await this.userApplicationService.findByEmail(email);
    }

    @MessagePattern({ cmd: 'register' })
    async register(registerUserDTo: RegisterUserDTO): Promise<ResultModel<void>> {
        return await this.userApplicationService.register(registerUserDTo);
    }

    @MessagePattern({ cmd: 'forgot-password' })
    async forgotPassword(data: { userPasswordDTO: { email: string }, tenantId: string }): Promise<ResultModel<void>> {
        console.log('forgotPassword controller', data);

        return await this.userApplicationService.forgotPassword(data.userPasswordDTO.email);
    }

    @MessagePattern({ cmd: 'check-code' })
    async checkCode(data: { userPasswordDTO: { email: string, code: string }, tenantId: string }): Promise<ResultModel<boolean>> {
        return await this.userApplicationService.checkCodePassword(data.userPasswordDTO);
    }

    @MessagePattern({ cmd: 'renew-password' })
    async renewPassword(data: { userPasswordDTO: UserPasswordDto, tenantId: string }): Promise<ResultModel<void>> {
        return await this.userApplicationService.resetPasswordWithCode(data);
    }

    @MessagePattern({ cmd: 'reset-password' })
    async resetPassword(data: { userPasswordDTO: UserPasswordDto, tenantId: string }): Promise<ResultModel<void>> {
        return await this.userApplicationService.resetPassword(data);
    }

    @MessagePattern({ cmd: 'find-user-by-id-and-relations' })
    async findByIdAndRelations(data: { id: string, relations: Array<string>, tenantId: string }): Promise<ResultModel<FindByEmailUserDTO>> {
        return await this.userApplicationService.findByIdAndRelations(data);
    }

    @MessagePattern({ cmd: 'find-user-by-id-and-select-specific-field' })
    async findByIdAndSelectSpecificField(data: { id: string, select: Array<string>, tenantId: string }): Promise<ResultModel<FindByEmailUserDTO>> {
        return await this.userApplicationService.findByIdAndSelectSpecificFields(data);
    }
}

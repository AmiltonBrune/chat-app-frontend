import { Inject } from '@nestjs/common';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';

import { ResultModel } from 'src/core/result.mode';
import { User } from '../entities/user/user.entity';
import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { ConfigService } from '@nestjs/config';
import { UserPasswordDto } from 'src/application/dtos/user-password.dto';
import { MailProviderService } from 'src/infra/data/providers/client-service/mail.provider.service'
import { EmailDto, ParticipantDto } from 'src/application/dtos';
import { Participant, Role } from '../entities';
import { UserCheckCodeDto } from 'src/application/dtos/check-code.dto';
import { UserEnum } from 'src/application/enum/user.enum';
import { In, Like, Repository } from 'typeorm';
import { UserReadDto } from '../../application/dtos/userread.dto';
import { plainToClass } from 'class-transformer';

@TenantService()
export class UserService {
    private readonly saltOrRounds = 10;
    private repository: Repository<User>;
    private roleRepository: Repository<Role>
    constructor(
        @Inject(TENANT_CONNECTION) private connection,
        private mailProviderService: MailProviderService,
        private configService: ConfigService
    ) {
        this.repository = this.connection.getRepository(User);
        this.roleRepository = this.connection.getRepository(Role);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<any>> {
        const queryBuilder = this.repository
            .createQueryBuilder('u')
            .innerJoinAndSelect('u.participant', 'p')
            .innerJoinAndSelect('u.role', 'r')
            .innerJoinAndSelect('p.jobTitle', 'j')
            .innerJoinAndSelect('p.pdvGroup', 'pg')
            .orderBy('u.name');
        return paginate<any>(queryBuilder, options);
    }

    async list(): Promise<ResultModel<User[]>> {
        const users = await this.connection.getRepository(User).find();

        return new ResultModel<User[]>(true, null, users);
    }

    async find(
        optionsPage: IPaginationOptions,
        options?: {
            pdvGroupIds: string[];
            email: string;
            name: string;
            cpf: string;
        },
    ): Promise<ResultModel<Pagination<any[]>>> {
        const where: any = {};

        options?.email && (where.email = Like(`%${options?.email}%`));
        options?.name && (where.name = Like(`%${options?.name}%`));
        options?.cpf &&
            (where.participant = {
                ...where.participant,
                cpf: Like(`%${options?.cpf}%`),
            });
        options?.pdvGroupIds &&
            (where.participant = {
                ...where.participant,
                pdvGroup: { id: In(options?.pdvGroupIds) },
            });

        const list = await paginate<any>(this.repository, optionsPage, {
            where,
            relations: [
                'participant',
                'role',
                'participant.jobTitle',
                'participant.pdvGroup',
            ],
        });

        return new ResultModel<Pagination<any[]>>(true, null, list);
    }

    async findOne(id: string): Promise<any> {
        const obj = await this.repository.findOne({
            where: { id },
            relations: ['participant', 'role', 'participant.pdvGroup', 'participant.jobTitle'],
        });

        return obj;
    }

    async edit(userId: string, dto: any): Promise<ResultModel<UserReadDto>> {
        const entity = await this.repository.findOne(dto.id);

        const user = plainToClass(User, dto);

        if (user.password != null)
            user.password = await this.generatePassword(user.password);

        user.updatedAt = new Date();
        user.userUpdated = plainToClass(User, await this.findOne(userId));
        user.role = plainToClass(
            Role,
            await this.roleRepository.findOne({ where: { name: dto.role } }),
        );


        if (!entity.password && entity.status === 3)
            this.sendMailPreCadastro(entity);

        const obj = await this.repository.save(user);
        return new ResultModel<UserReadDto>(true, null, plainToClass(UserReadDto, obj));
    }


    async findByEmail(email: string, pass: string): Promise<ResultModel<User>> {
        const user = await this.connection.getRepository(User).findOne({ where: { email } })

        if (!user)
            return new ResultModel<User>(false, ['user doens\'t exists']);

        return new ResultModel<User>(true, null, user);
    }

    async findById(data: { id: string }): Promise<ResultModel<User>> {
        const user = await this.connection.getRepository(User).findOne({ where: { id: data.id }, relations: ['participant', 'role', 'participant.pdvGroup', 'participant.jobTitle'], })

        if (!user)
            return new ResultModel<User>(false, ['user doens\'t exists']);

        return new ResultModel<User>(true, null, user);
    }

    async findByIdAndRelations(data: { id: string, relations: Array<string> }): Promise<ResultModel<User>> {
        const user = await this.connection.getRepository(User).findOne({ where: { id: data.id }, relations: data.relations })

        if (!user)
            return new ResultModel<User>(false, ['user doens\'t exists']);

        return new ResultModel<User>(true, null, user);
    }

    async findByIdAndSelectSpecificField(data: { id: string, select: Array<string> }): Promise<ResultModel<User>> {
        const user = await this.connection.getRepository(User).findOne({ where: { id: data.id }, select: data.select });

        if (!user)
            return new ResultModel<User>(false, ['user doens\'t exists']);

        return new ResultModel<User>(true, null, user);
    }

    async verifyExistsById(data: object): Promise<ResultModel<boolean>> {
        if (!await this.connection.getRepository(User).find({ where: { id: data['id'] } }))
            return new ResultModel<boolean>(false, ['user doesn\'t exists']);

        return new ResultModel<boolean>(true, null, true);
    }

    async register(user: User): Promise<ResultModel<void>> {
        user.password = await this.generatePassword(user.password);

        // if (await this.connection.getRepository(User).findOne({where: {email: user.email}}))
        //     return new ResultModel(false, ['creator doens\'t exists']);
        const userExists = await this.connection.getRepository(User).findOne({ where: { email: user.email } });

        if (userExists)
            return new ResultModel(false, ['user doens\'t exists']);

        const newUser = new User();
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = user.password;
        newUser.username = user.name;
        newUser.emailVerifiedAt = user.email;
        newUser.externalPushNotificationCode = user.id;
        newUser.createdAt = user.createdAt;
        newUser.status = user.status;




        await this.connection.getRepository(User).save(newUser);

        return new ResultModel<void>(true);
    }

    async forgotPassword(email: string): Promise<ResultModel<User>> {
        const userExists = await this.connection.getRepository(User).findOne({ where: { email } });

        if (!userExists)
            return new ResultModel<User>(false, ['user doens\'t exists']);


        const code: string = uuid();
        userExists.codeForget = code.substring(0, 4);
        await this.connection.getRepository(User).save(userExists);

        await this.sendMail(userExists);
        return new ResultModel<User>(true, null);
    }

    async checkUserCodeEmail(user: UserCheckCodeDto): Promise<ResultModel<boolean>> {
        const userExists = await this.connection.getRepository(User).findOne({
            where: {
                email: user.email,
                codeForget: user.code,
            }
        });

        if (!userExists)
            return new ResultModel<boolean>(false, ['user doens\'t exists or code is invalid']);

        return new ResultModel<boolean>(true, null, true);
    }

    async sendMail(user: User): Promise<void> {
        const dto = new EmailDto();
        dto.to = user.email;
        dto.subject = 'Nova Senha';
        dto.template = 'codigo';
        dto.context = {
            NAME: user.name,
            EMAIL: user.email,
            CODE: user.codeForget,
            PROJECT_NAME: 'Usuário',
            BASE_URL: this.configService.get<string>('CHOCOLATE_PARTICIPANT_URL'),
        };
        await this.mailProviderService.sendEmail(dto);
    }

    async sendMailPreCadastro(user: User): Promise<void> {
        const name = process.env.CHOCOLATE_TENANT_NAME.split('_')[0].toLocaleUpperCase()
        const dto = new EmailDto();
        dto.to = user.email;
        dto.subject = `Bem-vindo ao ${name}!`;
        dto.template = 'cadastrocompleto';
        dto.context = {
            NAME: user.name,
            CODE: user.codeForget,
            PROJECT_NAME: name,
        };
        await this.mailProviderService.sendEmail(dto);
    }


    async prepareResetPassword(user: UserPasswordDto): Promise<ResultModel<void>> {
        const obj = await this.connection.getRepository(User).findOne({
            where: {
                email: user.email,
                codeForget: user.code,
            }
        });

        if (!obj)
            return new ResultModel<void>(false, ['user doens\'t exists']);

        obj.id = obj.id;
        obj.password = user.password;

        await this.resetPassword(obj)
        return new ResultModel<void>(true);
    }

    async resetPasswordWithCode(user: UserPasswordDto): Promise<ResultModel<void>> {
        const userExists = await this.connection.getRepository(User).findOne({
            where: {
                email: user.email,
                codeForget: user.code,
            }
        });

        if (!userExists)
            return new ResultModel<void>(false, ['user doens\'t exists']);

        if (
            userExists.status != UserEnum.PRECADASTRO ||
            (await bcrypt.compare(user.passwordOld, userExists.password))
        )
            return new ResultModel<void>(false, ['Error: Invalid informations']);

        userExists.id = userExists.id;

        await this.resetPassword(userExists)
        return new ResultModel<void>(true);
    }

    async resetPassword(user: UserPasswordDto): Promise<User> {
        const obj = await this.connection.getRepository(User).findOne({ where: { id: user.id } });

        if (obj.status == UserEnum.PRECADASTRO)
            obj.status = UserEnum.ATIVO

        obj.password = await this.generatePassword(user.password);
        obj.codeForget = null;
        return await this.connection.getRepository(User).save(obj);
    }

    async createUserAndParticipant(user: User, participant: Participant): Promise<ResultModel<void>> {
        if (!this.connection.getRepository(User).findById(user.id))
            return new ResultModel<void>(false, ['user creator doens\'t exists'])

        await this.connection.getRepository(User).create(user)
        await this.connection.getRepository(User).create(participant)

        return new ResultModel<void>(true)
    }

    private async generatePassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);

        return hashedPassword;
    }

    async createParticipant(
        userOperation: User,
        role: Role,
        participant: ParticipantDto,
    ): Promise<User> {
        let user = await this.connection.getRepository(User).findOne({
            where: { participant: { id: participant.id } },
        });

        if (!user) {
            user = new User();
            user.id = uuid();
            user.createdAt = new Date();
            user.userCreated = userOperation;
            user.status = participant?.status
                ? participant.status
                : UserEnum.PRECADASTRO;
        } else {
            user.updatedAt = new Date();
            user.userUpdated = userOperation;
        }

        user.participant = participant
        user.name = participant.name;
        user.email = participant.email;
        user.username = participant.username;
        user.role = role;

        const obj = await this.connection.getRepository(User).save(user);
        return obj
    }
}

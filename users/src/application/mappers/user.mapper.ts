// import { User, Participant, EUserStatus } from '@prisma/client';
import { Participant } from 'src/domain/entities/participant.entity';
import { Role } from 'src/domain/entities/role.entity';
import { User } from 'src/domain/entities/';
import { uuid } from 'uuidv4';
import { ParticipantDto } from '../dtos/create-user-and-participant.dto';

import { FindByEmailUserDTO } from '../dtos/find-by-email-user.dto';
import { ListUserDTO } from '../dtos/list-user.dto';
import { RegisterUserDTO } from '../dtos/register-user.dto';

export class UserMapper {
    static userToListUserDTO(users: User[]): ListUserDTO[] {
        const listUserDTO: ListUserDTO[] = users.map(u => ({ id: u.id, name: u.name, email: u.email, status: u.status }));

        return listUserDTO;
    }

    static userToFindByEmailUserDTO(user: User): FindByEmailUserDTO {
        const findByEmailUserDTO: FindByEmailUserDTO = {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            password: user.password,
        };

        return findByEmailUserDTO;
    }

    static registerUserDTOToUser(registerUserDTO: RegisterUserDTO): User {
        const registerUserData = registerUserDTO['registerUserDTO']
        const user: User = {
            id: uuid(),
            name: registerUserData.name,
            email: registerUserData.email,
            password: registerUserData.password,
            participant: null,
            createdAt: new Date(),
            role: null,
            username: null,
            emailVerifiedAt: null,
            status: 0,
            isModerator: 0,
            codeForget: null,
            // jobTitle: null,
            externalPushNotificationCode: null,
            userCreated: null,
            updatedAt: null,
            userUpdated: null,
            deletedAt: null,
            userDeleted: null,
            userCampaigns: [],
            pushNotificationCodes: [],
            userPdvs: [],
            operationAt: undefined,
            obsOperation: '',
            userOperation: null,
            regulationAccepts: [],
            userReferences: []
        };


        return user;
    }

    // static createParticipantDTOToUserAndParticipant(createUserAndParticipantDTO: ParticipantDto): { user: User, participant: Participant } {
    //     const user: User = {
    //         id: uuid(),
    //         name: createUserAndParticipantDTO.name,
    //         email: createUserAndParticipantDTO.email,
    //         password: createUserAndParticipantDTO.password,
    //         emailVerifiedAt: createUserAndParticipantDTO.email,
    //         username: null,
    //         status: 0,
    //         createdAt: new Date(),
    //         isModerator: 0,
    //         codeForget: null,
    //         participant: null,
    //         participantId: null,
    //         role: null,
    //         externalPushNotificationCode: null,
    //         userCreated: null,
    //         updatedAt: undefined,
    //         userUpdated: null,
    //         deletedAt: undefined,
    //         userDeleted: null
    //     }

    //     const participant: Participant = {
    //         id: uuid(),
    //         cpf: createUserAndParticipantDTO.cpf,
    //         name: user.name,
    //         createdAt: new Date(),
    //         updatedAt: null,
    //         deletedAt: null,
    //         nickname: createUserAndParticipantDTO.nickname,
    //         codeSap: null,
    //         dob: null,
    //         genre: createUserAndParticipantDTO.genre,
    //         age: createUserAndParticipantDTO.age,
    //         jobTitle: createUserAndParticipantDTO.jobTitle,
    //         type: createUserAndParticipantDTO.type,
    //         regional: createUserAndParticipantDTO.regional,
    //         branch: createUserAndParticipantDTO.branch,
    //         instagram: createUserAndParticipantDTO.instagram,
    //         phone: createUserAndParticipantDTO.phone,
    //         mobile: createUserAndParticipantDTO.mobile,
    //         photoUrl: createUserAndParticipantDTO.photoUrl,
    //         userCreated: null,
    //         userUpdated: null,
    //         userDeleted: null,
    //         user: user,
    //         childrenCount: 0,
    //         civilStatus: null,
    //         role: null
    //     }

    //     return { user, participant };
    // }
}

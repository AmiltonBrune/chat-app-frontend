import { Inject } from '@nestjs/common';
import { uuid } from 'uuidv4';


import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { Repository } from 'typeorm';
import { User, UserPdv, Pdv } from '../entities/';
import { UserCampaignReadDto } from 'src/application/dtos/usercampaignread.dto';

@TenantService()
export class UserPdvService {
  private repository: Repository<UserPdv>
  private userRepository: Repository<User>
  constructor(
    @Inject(TENANT_CONNECTION) private connection,
  ) {
    this.repository = this.connection.getRepository(UserPdv);
    this.userRepository = this.connection.getRepository(User);
  }

  async findOne(id: string): Promise<UserCampaignReadDto> {
    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: string, userId: string): Promise<void> {
    const obj = await this.repository.findOne({ where: { id } });
    obj.deletedAt = new Date();
    obj.userDeleted.id = userId;
    await this.repository.save(obj);
  }

  async create(
    user: User,
    reference: string,
    pdv: Pdv,
    isActive: boolean,
    userId: string,
  ): Promise<UserPdv> {
    let userPdv = await this.repository.findOne({
      where: { user: { email: user.email }, reference: reference },
      relations: ['user'],
    });

    const getUser = await this.userRepository.findOne({ where: { id: userId } })

    if (!userPdv) {
      userPdv = new UserPdv();
      userPdv.id = uuid();
      userPdv.createdAt = new Date();
      userPdv.userCreated = getUser;
    } else {
      userPdv.updatedAt = new Date();
      userPdv.userUpdated = getUser;
    }

    userPdv.reference = reference;
    userPdv.active = isActive;
    userPdv.pdv = pdv;
    userPdv.user = user;
    return await this.repository.save(userPdv);
  }
}
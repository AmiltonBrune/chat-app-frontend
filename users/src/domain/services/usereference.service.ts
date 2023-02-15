import { Inject } from '@nestjs/common';
import { uuid } from 'uuidv4';


import { User } from '../entities/user/user.entity';
import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { Repository } from 'typeorm';
import { UserReference } from '../entities';
import { JobTitle, Pdv, UserImport } from '../entities';

@TenantService()
export class UserReferenceService {
  private repository: Repository<UserReference>;
  private userRepository: Repository<User>
  constructor(
    @Inject(TENANT_CONNECTION) private connection,
  ) {
    this.repository = this.connection.getRepository(UserReference);
    this.userRepository = this.connection.getRepository(User);
  }

  async create(
    userImport: UserImport,
    reference: string,
    participant: any,
    user: User,
    pdv: Pdv,
    jobTitle: JobTitle,
    userId: string,
  ): Promise<void> {
    try {
      const userReference = new UserReference();
      userReference.id = uuid();
      userReference.createdAt = new Date();
      userReference.userCreated = await this.userRepository.findOne({ where: { id: userId } });

      userReference.reference = reference;
      userReference.user = user;
      userReference.jobTitle = jobTitle;
      userReference.pdvGroup = pdv.pdvGroup;
      userReference.pdv = pdv;
      userReference.userImport = userImport;
      userReference.userClientCode = participant.userClientCode;
      userReference.active = true;

      await this.repository.save(userReference);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteByReference(
    reference: string,
    userId: string,
    pdvGroupId: string,
  ): Promise<void> {
    const list = await this.repository.find({
      where: { reference: reference, pdvGroup: { id: pdvGroupId } },
    });

    for (const item of list) {
      item.deletedAt = new Date();
      item.userDeleted = await this.userRepository.findOne({
        where: { id: userId },
      });
      this.repository.save(item);
    }
  }
}
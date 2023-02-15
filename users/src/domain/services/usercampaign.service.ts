import { Inject } from '@nestjs/common';
import { uuid } from 'uuidv4';


import { User } from '../entities/user/user.entity';
import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { Repository } from 'typeorm';
import { Campaign, Pdv, UserCampaign } from '../entities';
import { UserCampaignReadDto } from '../../application/dtos/usercampaignread.dto';
import { UserCampaignDto } from 'src/application/dtos/usercampaign.dto';

@TenantService()
export class UserCampaignService {
   private repository: Repository<UserCampaign>;
   private userRepository: Repository<User>
   private campaignRepository: Repository<Campaign>
   constructor(
      @Inject(TENANT_CONNECTION) private connection,
   ) {
      this.repository = this.connection.getRepository(UserCampaign);
      this.userRepository = this.connection.getRepository(User);
      this.campaignRepository = this.connection.getRepository(Campaign);
   }


   async findOne(id: string): Promise<UserCampaignReadDto> {
      return await this.repository.findOne({ where: { id } });
   }

   async delete(id: string, userId: string): Promise<void> {
      const obj = await this.repository.findOne({ where: { id } });
      obj.deletedAt = new Date();
      obj.userDeleted.id = userId;
      await this.repository.delete(id);
   }

   async create(user: UserCampaignReadDto, userId: string, campaignId: string, pdv: Pdv, isActive: boolean): Promise<UserCampaignReadDto> {

      let userCampaign = await this.repository.findOne({ where: { user: { id: user.id }, campaign: { id: campaignId } } });
      const getUser = await this.userRepository.findOne({ where: { id: userId } })

      if (!userCampaign) {
         userCampaign = new UserCampaign();
         userCampaign.id = uuid();
         userCampaign.createdAt = new Date();
         userCampaign.userCreated = getUser;
      }
      else {
         userCampaign.updatedAt = new Date();
         userCampaign.userUpdated = getUser;
      }

      userCampaign.active = isActive;
      userCampaign.campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });
      userCampaign.user = await this.userRepository.findOne({ where: { id: user.id } });
      userCampaign.pdv = pdv;

      return await this.repository.save(userCampaign);

   }

   async edit(user: UserCampaignDto): Promise<UserCampaignReadDto> {
      return await this.repository.save(user);
   }
}
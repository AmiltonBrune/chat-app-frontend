import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ResultModel } from 'src/core/result.mode';

@Injectable()
export class ClientProviderService {
   constructor(@Inject('client-service') private readonly campaignService: ClientProxy) { }

   async findById(id: string, tenantId: string): Promise<ResultModel<object>> {
      return await this.campaignService
         .connect()
         .then(async () => {
            const findCampaignByIdResult = await this.campaignService
               .send<ResultModel<object>, { id: string, tenantId: string }>({ cmd: 'find-by-id-campaign' }, { id, tenantId })
               .toPromise();

            return new ResultModel<object>(true, null, findCampaignByIdResult.data)
         },
            (e) => {
               console.log('====================================');
               console.log('findById campaign error: ', e);
               console.log('====================================');
               return new ResultModel<object>(false, ['campaign service unavaible']);
            });
   }

   async create(campaign: object): Promise<ResultModel<void>> {
      return await this.campaignService
         .connect()
         .then(async () => {
            const createCampaignResult = await this.campaignService
               .send<ResultModel<void>, { campaign: object }>({ cmd: 'create-campaign' }, { campaign })
               .toPromise();

            return new ResultModel<void>(true, null, createCampaignResult.data)
         },
            (e) => {
               console.log('====================================');
               console.log('create campaign error: ', e);
               console.log('====================================');
               return new ResultModel<void>(false, ['campaign service unavaible']);
            });
   }
}
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ResultModel } from 'src/core/result.mode';
import { FindByTenantNameDto } from 'src/application/dtos/find-by-tenant-name.dto';

@Injectable()
export class TenantService {
   constructor(
      @Inject('tenants-service')
      private readonly tenantService: ClientProxy,
   ) { }

   async findByTenantName(tenantName: string): Promise<ResultModel<FindByTenantNameDto>> {
      return await this.tenantService.connect().then(async () => {
         const findByTenantNameResult = await this.tenantService
            .send<ResultModel<FindByTenantNameDto>, string>({ cmd: 'find-by-tenant-name' }, tenantName)
            .toPromise();

         return findByTenantNameResult;
      }, () => {
         return new ResultModel<FindByTenantNameDto>(false, ['tenant service unavaible']);
      })
   }
}


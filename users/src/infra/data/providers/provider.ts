import { Connection, createConnection, getConnectionManager } from 'typeorm';

import { decryptPassword } from './../../../core/helpers/encryptation';
import { BadRequestException } from '@nestjs/common';
import { Tenants } from 'src/domain/entities';
import { Request } from 'express';

export const getTenantConnection = async (request: Request, connection: Connection, entities: any[]) => {
   const tenant: Tenants = await connection.getRepository(Tenants).findOne(({ where: { name: request['data']['tenantId'] } }));
   !tenant && new BadRequestException('Tenant not found');

   const connectionManager = getConnectionManager();

   if (connectionManager.has(tenant.name)) {
      const connection = connectionManager.get(tenant.name);
      return Promise.resolve(connection.isConnected ? connection : connection.connect());
   }

   process.env.CHOCOLATE_PARTICIPANT_URL = `https://${tenant.participantUrl}`;
   process.env.CHOCOLATE_TENANT_NAME = tenant.name;

   tenant.password = await decryptPassword(tenant.password);

   return await createConnection({
      name: tenant.name,
      type: "mysql",
      host: tenant.host.split(':')[0],
      port: Number(tenant.host.split(':')[1]),
      username: tenant.user,
      password: tenant.password,
      database: tenant.name,
      entities: entities,
      synchronize: tenant.isNew,
   })
}
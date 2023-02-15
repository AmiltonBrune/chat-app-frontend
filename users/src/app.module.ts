import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './domain/services/user.service';
import { UserApplicationService } from './application/services/user.application.service';
import { UserController } from './presentation/controllers/user.controller';
import { ParticipantAppService } from './application/services/participant.application.service'
import { ParticipantController } from './presentation/controllers/participant.controller';
import { ParticipantService } from './domain/services/participant.service';
import { UserCampaignService } from './domain/services/usercampaign.service'
import { UserReferenceService } from './domain/services/usereference.service'
import { UserPdvService } from './domain/services/userpdv.service'
import { ReconheceService } from './domain/services/reconhece.service'
import { ReconheceController } from './presentation/controllers/reconhece.controller';
import { Tenants } from './domain/entities';


import { TenantModule } from './tenant/tenant.module';
import { MailProviderService } from './infra/data/providers/client-service/mail.provider.service';
import { ClientProviderService } from './infra/data/providers/client-service/client.provider.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: '@AgorEQXuZdjiFuhS#D1g1',
      signOptions: { expiresIn: '365d' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: false,
      entities: [Tenants],
      synchronize: true,
    }),
    ClientsModule.register([
      {
        name: 'tenants-service',
        transport: Transport.TCP,
        options: {
          host: process.env.TENANT_HOST,
          port: parseInt(process.env.TENANT_PORT),
        },
      },
      {
        name: 'notification-service',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_HOST,
          port: parseInt(process.env.NOTIFICATION_PORT),
        },
      },
      {
        name: 'client-service',
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: parseInt(process.env.CLIENT_PORT),
        },
      }
    ]),
    TenantModule,
  ],
  controllers: [UserController, ParticipantController, ReconheceController],
  providers: [
    UserService, UserApplicationService, MailProviderService, ParticipantAppService, ParticipantService, ClientProviderService, UserCampaignService, UserReferenceService, UserPdvService, ReconheceService],
})
export class AppModule {

}

import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Tenants, User, Participant, ParticipantAddress, Role, Campaign, Client, UserCampaign, UserPushNotification, BusinessCategory, JobTitle, PdvGroup, Pdv, PdvGroupBusinessCategory, UserImport, Regulation, RegulationAccept, Term, TermAccept, UserPdv, UserReference, UserRegulationAccept, UserTermAccept, Account, AccountMoviment } from 'src/domain/entities';
import { getTenantConnection } from 'src/infra/data/providers/provider';
import { Request } from 'express';
import { ConfigModule } from '@nestjs/config';


export const TENANT_CONNECTION = 'TENANT_CONNECTION';

const connectionFactory = {
  provide: TENANT_CONNECTION,
  inject: [
    REQUEST,
    Connection,
  ],
  scope: Scope.REQUEST,
  useFactory: async (request: Request, connection: Connection) => {

    return getTenantConnection(request, connection, [User, Participant, ParticipantAddress, Role, Campaign, Client, UserCampaign, UserPushNotification, BusinessCategory, JobTitle, PdvGroup, Pdv, PdvGroupBusinessCategory, UserImport, Regulation, RegulationAccept, Term, TermAccept, UserPdv, UserReference, UserRegulationAccept, UserTermAccept, Account, AccountMoviment])

  }
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Tenants]),
  ],
  providers: [
    connectionFactory
  ],
  exports: [
    TENANT_CONNECTION
  ]
})
export class TenantModule { }


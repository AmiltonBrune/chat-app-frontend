import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ParticipantVerificationDto, ParticipantDto, ParticipantImportDto, ParticipantReadDto } from 'src/application/dtos';
import { ResultModel } from 'src/core/result.mode';
import { ParticipantAppService } from 'src/application/services/participant.application.service';
import { ParticipantService } from 'src/domain/services/participant.service'



@Controller('participant')
export class ParticipantController {
   constructor(
      private participantAppService: ParticipantAppService
   ) { }

   @MessagePattern({ cmd: 'find-all-participant' })
   async findAll(): Promise<ResultModel<ParticipantReadDto[]>> {
      return await this.participantAppService.findAll();
   }

   @MessagePattern({ cmd: 'find-participant-by-id' })
   async findOne(data: { id: string, tenantId: string }): Promise<ResultModel<ParticipantReadDto>> {
      return await this.participantAppService.findOne(data.id);
   }

   @MessagePattern({ cmd: 'find-participant-by-cpf' })
   async findByCpf(data: { cpf: string, tenantId: string }): Promise<ResultModel<ParticipantVerificationDto>> {
      return await this.participantAppService.findByCpf(data.cpf);
   }

   @MessagePattern({ cmd: 'find-participant-by-cpf-exists-participant' })
   async findByCpfExistParticipant(data: { cpf: string, tenantId: string }): Promise<ResultModel<ParticipantReadDto>> {
      return await this.participantAppService.findByCpfExistParticipant(data.cpf);
   }

   @MessagePattern({ cmd: 'edit-participant' })
   async edit(data: { userId: string, dto: ParticipantDto, tenantId: string }): Promise<ResultModel<void>> {
      return await this.participantAppService.edit(data.userId, data.dto);
   }

   @MessagePattern({ cmd: 'create-multiple-participant' })
   async createMultiple(data: { dto: ParticipantImportDto, tenantId: string, userId: string, campaignId: string, }): Promise<ResultModel<void>> {
      return await this.participantAppService.createMultiple(data.dto, data.userId, data.campaignId);
   }
}
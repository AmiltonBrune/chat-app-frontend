import { Injectable } from '@nestjs/common';

import { ResultModel } from 'src/core/result.mode';
import { ParticipantImportDto, ParticipantReadDto, ParticipantVerificationDto } from 'src/application/dtos';
import { ParticipantService } from 'src/domain/services/participant.service';
import { ParticipantMapper } from '../mappers/participant.mapper'
import { ParticipantDto } from '../dtos/create-user-and-participant.dto';

@Injectable()
export class ParticipantAppService {
   constructor(
      private participantService: ParticipantService,
   ) { }

   async findAll(): Promise<ResultModel<ParticipantReadDto[]>> {
      const result = await this.participantService.findAll();

      if (!result.success)
         return new ResultModel<ParticipantReadDto[]>(false, result.errors);

      return new ResultModel<ParticipantReadDto[]>(true, null, result.data);
   }

   async findOne(id: string) {
      const result = await this.participantService.getById(id);

      if (!result.success)
         return new ResultModel<ParticipantReadDto>(false, result.errors);

      return new ResultModel<ParticipantReadDto>(true, null, result.data);
   }

   async findByCpf(cpf: string): Promise<ResultModel<ParticipantVerificationDto>> {
      const result = await this.participantService.findByCpf(cpf);

      if (!result.success)
         return new ResultModel<ParticipantVerificationDto>(false, result.errors);

      const participantReadDto = ParticipantMapper.participantToParticipantVerificationDto(result.data);
      return new ResultModel<ParticipantVerificationDto>(true, null, participantReadDto);
   }

   async findByCpfExistParticipant(cpf: string): Promise<ResultModel<ParticipantReadDto>> {
      const result = await this.participantService.findByCpfExistParticipant(cpf);

      if (!result.success)
         return new ResultModel<ParticipantReadDto>(false, result.errors);

      return new ResultModel<ParticipantReadDto>(true, null, result.data);
   }

   async edit(userId: string, dto: ParticipantDto): Promise<ResultModel<void>> {
      const result = await this.participantService.edit(userId, dto);

      if (!result.success)
         return new ResultModel<void>(false, result.errors);

      return new ResultModel<void>(true, null);

   }

   async createMultiple(participantImport: ParticipantImportDto, userId: string, campaignId: string,): Promise<ResultModel<void>> {
      const result = await this.participantService.createMultiples(participantImport, userId, campaignId);

      if (!result.success)
         return new ResultModel<void>(false, result.errors);

      return new ResultModel<void>(true, null);
   }
}
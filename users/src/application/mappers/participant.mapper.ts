import { Participant } from 'src/domain/entities/participant.entity';
import { ParticipantVerificationDto } from '../dtos';

export class ParticipantMapper {
   static participantToParticipantVerificationDto(participant: Participant): ParticipantVerificationDto {
      const participantReadDto: ParticipantVerificationDto = {
         userId: participant.user.id,
         id: participant.id,
         name: participant.name,
         phone: participant.phone,
         email: participant.user.email,
      };

      return participantReadDto;
   }
}
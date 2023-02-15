import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ReconheceService } from 'src/domain/services/reconhece.service'

@Controller()
export class ReconheceController {
   constructor(private readonly reconheceService: ReconheceService) { }

   @MessagePattern({ cmd: 'get-user-reconhece' })
   async reconhece(data: { userId: string }): Promise<any> {
      return await this.reconheceService.getUserReconhece(data.userId)
   }


   @MessagePattern({ cmd: 'get-saldo-reconhece' })
   async getSaldoReconhece(data: { userId: string }): Promise<any> {
      return await this.reconheceService.getSaldoReconhece(data.userId);
   }

   @MessagePattern({ cmd: 'reservar-pontos-reconhece' })
   async reservarPontosReconhece(data: { userId: string, body: any }): Promise<any> {
      return await this.reconheceService.reservarPontosReconhece(data.userId, data.body);
   }

   @MessagePattern({ cmd: 'debitar-pontos-reconhece' })
   async debitarPontosReconhece(data: { userId: string, body: any }): Promise<any> {
      return await this.reconheceService.debitarPontosReconhece(data.userId, data.body);
   }

   @MessagePattern({ cmd: 'liberar-pontos-reconhece' })
   async liberarPontosReconhece(data: { userId: string, body: any }): Promise<any> {
      return await this.reconheceService.liberarPontosReconhece(data.userId, data.body);
   }

   @MessagePattern({ cmd: 'estornar-pontos-reconhece' })
   async estornarPontosReconhece(data: { userId: string, body: any }): Promise<any> {
      return await this.reconheceService.estornarPontosReconhece(data.userId, data.body);
   }
}
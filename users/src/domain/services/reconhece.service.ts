import { Inject, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { uuid } from 'uuidv4';

import { User } from '../entities/user/user.entity';
import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { ResultReconheceDto } from 'src/application/dtos';
import { Account, AccountMoviment, Participant } from '../entities';
import { Repository } from 'typeorm';

@TenantService()
export class ReconheceService {
   private repository: Repository<User>;
   private participantRepository: Repository<Participant>;
   private accountRepository: Repository<Account>;
   private accountMovimentRepository: Repository<AccountMoviment>;
   constructor(
      @Inject(TENANT_CONNECTION) private connection
   ) {
      this.repository = this.connection.getRepository(User);
      this.participantRepository = this.connection.getRepository(Participant);
      this.accountRepository = this.connection.getRepository(Account);
      this.accountMovimentRepository = this.connection.getRepository(AccountMoviment);
   }

   async getMovimentSUM(order, type) {
      return await this.accountMovimentRepository.createQueryBuilder("accountmoviment")
         .select("SUM(value)", "sum")
         .where('orderNumber = :orderNumber', { orderNumber: order })
         .andWhere('type = :type', { type: type })
         .andWhere('deletedAt IS NULL')
         .getRawOne();
   }


   async getUserReconhece(userId: string): Promise<ResultReconheceDto> {
      const user = !!userId
         ? await this.repository.findOne({
            where: { id: userId },
            relations: ['participant'],
         })
         : null;

      if (!user) throw new NotFoundException('user not found');
      if (!user.participant)
         return ResultReconheceDto.Error('Usuário não pode resgatar pontos');

      const participant = await this.participantRepository.findOne({
         where: { id: user.participant.id },
         relations: ['addresses'],
      });

      const account = await this.accountRepository.findOne({
         where: { user: { id: user.id } },
      });
      const address = !!participant?.addresses?.length
         ? participant.addresses[0]
         : null;

      return ResultReconheceDto.Success({
         nome: user.name,
         cpf: user.participant.cpf,
         dataNascimento: '',
         email: participant.email2 ? participant.email2 : user.email,
         telefone: user.participant.phone,
         celular: participant.mobile2 ? participant.mobile2 : user.participant.mobile,
         endereco: address?.address,
         numero: address?.number,
         complemento: address?.complement,
         bairro: address?.district,
         cidade: address?.city,
         uf: address?.state,
         cep: address?.zipCode,
         saldo: account?.balance || 0,
      });
   }

   async getSaldoReconhece(userId: string): Promise<ResultReconheceDto> {
      const user = await this.repository.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException('user not found');

      const account = await this.accountRepository.findOne({
         where: { user: { id: user.id } },
      });

      if (!account) return ResultReconheceDto.Error('Usuário sem pontos');

      return ResultReconheceDto.Success({
         saldo: account.balance,
      });
   }

   async reservarPontosReconhece(
      userId: string,
      body: any,
   ): Promise<ResultReconheceDto> {
      if (!body.pontos)
         throw new NotFoundException(
            'Pontos para bloqueio não encontrado. Campo Pontos Obrigatório',
         );
      if (isNaN(body.pontos) || parseFloat(body.pontos) <= 0)
         throw new NotFoundException(
            'Pontos para bloqueio não encontrado. Campo Pontos inválido',
         );

      const user = await this.repository.findOne({
         where: { id: userId },
         relations: ['participant'],
      });
      if (!user) throw new NotFoundException('user not found');

      const account = await this.accountRepository.findOne({
         where: { user: { id: userId } },
      });
      if (!account) throw new NotFoundException('account not found');

      let balance: number = parseFloat(`${account?.balance ?? 0}`);

      if (balance < parseFloat(body.pontos))
         return ResultReconheceDto.Error(
            'Usuário não tem a quantidade de pontos suficientes para a reserva',
         );

      balance -= parseFloat(body.pontos);

      const entity = new AccountMoviment();
      entity.id = uuid();
      entity.userCreated = plainToClass(User, user);
      entity.account = plainToClass(Account, account);
      entity.createdAt = new Date();
      entity.active = true;
      entity.value = parseFloat(body.pontos);
      entity.balance = balance;
      entity.type = 'D';
      entity.description = 'Reserva de pontos';

      const obj = await this.accountMovimentRepository.save(entity);

      account.balance = balance;
      account.updatedAt = new Date();
      account.userUpdated = plainToClass(User, user);
      await this.accountRepository.save(account);

      return ResultReconheceDto.Success({
         extratoId: obj.id,
      });
   }

   async debitarPontosReconhece(
      userId: string,
      body: any,
   ): Promise<ResultReconheceDto> {
      if (!body.extratoId)
         throw new NotFoundException(
            'Extrato para estorno não encontrado. Campo ExtratoId Obrigatório',
         );
      if (!body.numeropedido)
         throw new NotFoundException(
            'Número de pedido para estorno não encontrado. Campo NumeroPedido Obrigatório',
         );

      const user = await this.repository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('user not found');

      const account = await this.accountRepository.findOne({
         where: { user: { id: userId } },
      });
      if (!account) throw new NotFoundException('account not found');

      const accountMoviment = await this.accountMovimentRepository.findOne(
         { where: { id: body.extratoId } }
      );
      if (!accountMoviment)
         throw new NotFoundException('accountMoviment not found');

      if (accountMoviment?.deletedAt != null)
         throw new NotFoundException('Extrato para débito já foi excluído');

      accountMoviment.deletedAt = new Date();
      accountMoviment.userDeleted = plainToClass(User, user);
      this.accountMovimentRepository.save(accountMoviment);

      const entity = new AccountMoviment();
      entity.id = uuid();
      entity.userCreated = plainToClass(User, user);
      entity.account = plainToClass(Account, account);
      entity.createdAt = new Date();
      entity.active = true;

      // se o valor de saldo atual for diferente do movimento de reserva
      entity.balance = account.balance;
      entity.value = accountMoviment.value;

      entity.type = 'D';
      entity.description = `Débito de pontos - ${body.numeropedido}`;
      entity.orderNumber = body.numeropedido;
      const obj = await this.accountMovimentRepository.save(entity);

      return ResultReconheceDto.Success({
         extratoId: obj.id,
      });
   }

   async liberarPontosReconhece(
      userId: string,
      body: any,
   ): Promise<ResultReconheceDto> {
      if (!body.extratoId)
         throw new NotFoundException(
            'Extrato para estorno não encontrado. Campo ExtratoId Obrigatório',
         );

      const user = await this.repository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('user not found');

      const account = await this.accountRepository.findOne({
         where: { user: { id: userId } },
      });
      if (!account) throw new NotFoundException('account not found');

      const accountMoviment = await this.accountMovimentRepository.findOne({
         where: { id: body.extratoId },
      });
      if (!accountMoviment)
         throw new NotFoundException('accountMoviment not found');

      if (accountMoviment?.deletedAt != null)
         throw new NotFoundException('Extrato para estorno já foi excluído');

      accountMoviment.deletedAt = new Date();
      accountMoviment.userDeleted = plainToClass(User, user);
      await this.accountMovimentRepository.save(accountMoviment);

      account.balance =
         parseFloat(`${account.balance}`) + parseFloat(`${accountMoviment.value}`);
      account.updatedAt = new Date();
      account.userUpdated = plainToClass(User, user);
      this.accountRepository.save(account);

      return ResultReconheceDto.Success({
         extratoId: accountMoviment.id,
      });
   }

   async estornarPontosReconhece(
      userId: string,
      body: any,
   ): Promise<ResultReconheceDto> {
      if (!body.points)
         throw new NotFoundException(
            'Pontos para bloqueio não encontrado. Campo Points Obrigatório',
         );
      if (!body.requestNumber)
         throw new NotFoundException(
            'Pontos para bloqueio não encontrado. Campo RequestNumber Obrigatório',
         );
      if (isNaN(body.points) || parseFloat(body.points) <= 0)
         throw new NotFoundException(
            'Pontos para bloqueio não encontrado. Campo Pontos inválido',
         );

      const user = await this.repository.findOne({
         where: { id: userId },
         relations: ['participant'],
      });
      if (!user) throw new NotFoundException('user not found');

      let account = undefined;

      if (user.email === 'contato@reconhece.vc') {
         account = await this.accountRepository.createQueryBuilder('account')
            .innerJoin('accountmoviment', 'moviment', 'account.id = moviment.accountId')
            .where('moviment.orderNumber = :orderNumber', { orderNumber: body.requestNumber })
            .getOne();
      } else {
         account = await this.accountRepository.findOne({
            where: { user: { id: userId } }
         });
      }
      if (!account) throw new NotFoundException('account not found');

      let moviment_debit = await this.getMovimentSUM(body.requestNumber, 'D');
      moviment_debit = parseFloat(moviment_debit.sum);

      if (!moviment_debit)
         throw new NotFoundException('Extrato para estorno não foi encontrado');

      let moviment_credit = await this.getMovimentSUM(body.requestNumber, 'C');
      moviment_credit = parseFloat(moviment_credit.sum);

      if (moviment_credit >= moviment_debit) {
         throw new NotFoundException('Estorno já atingiu o valor máximo do extrato');
      }

      if (body.points > (moviment_debit - moviment_credit)) {
         throw new NotFoundException('Valor requerido excede o valor máximo do extrato');
      }

      const entity = new AccountMoviment();
      entity.id = uuid();
      entity.userCreated = plainToClass(User, user);
      entity.account = plainToClass(Account, account);
      entity.createdAt = new Date();
      entity.active = true;
      entity.value = body.points;
      entity.balance = parseFloat(`${account.balance}`) + parseFloat(body.points);
      entity.type = 'C';
      entity.description = `Estorno de pontos - ${body.requestNumber}`;
      entity.orderNumber = body.requestNumber;
      await this.accountMovimentRepository.save(entity);

      account.balance = entity.balance;
      account.userUpdated = plainToClass(User, user);
      account.updatedAt = new Date();
      await this.accountRepository.save(account);

      return ResultReconheceDto.Success(true);
   }
}
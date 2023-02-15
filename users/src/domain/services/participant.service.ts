import { BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';

import { ResultModel } from 'src/core/result.mode';
import { TenantService } from './tenant-service.decorator';
import { TENANT_CONNECTION } from '../../tenant/tenant.module';
import { Participant, Role, User, ParticipantAddress, Pdv, PdvGroup, JobTitle, Campaign } from '../entities';
import { normalizeCpf } from 'src/core/helpers';
import { UserEnum } from 'src/application/enum/user.enum';
import { UserReadDto } from 'src/application/dtos/user-read.dto';
import { ParticipantDto } from 'src/application/dtos/create-user-and-participant.dto';
import { ClientProviderService } from 'src/infra/data/providers/client-service/client.provider.service';
import { UserService } from './user.service';
import { UserImport } from '../entities/user/userimport.entity';
import { ParticipantImportDto, ParticipantReadDto } from 'src/application/dtos';
import { UserCampaignService } from './usercampaign.service';
import { UserReferenceService } from './usereference.service';
import { UserPdvService } from './userpdv.service';

@TenantService()
export class ParticipantService {
   private repository: Repository<Participant>;
   private userRepository: Repository<User>;
   private roleRepository: Repository<Role>;
   private participantAddressRepository: Repository<ParticipantAddress>;
   private pdvRepository: Repository<Pdv>;
   private pdvGroupRepository: Repository<PdvGroup>;
   private userImportRepository: Repository<UserImport>;
   private jobTitleRepository: Repository<JobTitle>;
   private campaignRepository: Repository<Campaign>;
   constructor(
      @Inject(TENANT_CONNECTION) private connection,
      private userService: UserService,
      private readonly userCampaignService: UserCampaignService,
      private readonly userReferenceService: UserReferenceService,
      private readonly userPdvService: UserPdvService,
   ) {
      this.repository = this.connection.getRepository(Participant);
      this.userRepository = this.connection.getRepository(User);
      this.roleRepository = this.connection.getRepository(Role);
      this.participantAddressRepository = this.connection.getRepository(ParticipantAddress)
      this.pdvRepository = this.connection.getRepository(Pdv);
      this.pdvGroupRepository = this.connection.getRepository(PdvGroup);
      this.userImportRepository = this.connection.getRepository(UserImport);
      this.jobTitleRepository = this.connection.getRepository(JobTitle);
      this.campaignRepository = this.connection.getRepository(Campaign);
   }

   async findAll(): Promise<ResultModel<ParticipantReadDto[]>> {
      const list = await this.repository.find({
         relations: ['addresses', 'pdvGroup'],
      });

      return new ResultModel<ParticipantReadDto[]>(true, null, list.map((l) => ({
         id: l.id,
         name: l.name,
         cpf: l.cpf,
         phone: l.phone,
         dob: l.dob,
         instagram: l.instagram,
         mobile: l.mobile,
         photoUrl: l.photoUrl,
         user: l?.user
      })));
   }

   async findByCpf(cpf: string): Promise<ResultModel<Participant>> {
      const normalizedCpf = normalizeCpf(cpf);
      const obj = await this.repository.findOne(
         {
            where: { cpf: normalizedCpf, user: { status: UserEnum.PRECADASTRO } }, relations: [
               'addresses',
               'user',
            ],
            select: ['id', 'name', 'cpf', 'phone', 'addresses', 'user']
         },
      );

      if (!obj)
         return new ResultModel<Participant>(false, ['participant not found']);


      return new ResultModel<Participant>(true, null, obj);
   }

   async findByCpfExistParticipant(cpf: string): Promise<ResultModel<Participant>> {
      const normalizedCpf = normalizeCpf(cpf);
      const obj = await this.repository.findOne(
         {
            where: { cpf: normalizedCpf }, relations: [
               'addresses',
               'user',
            ]
         },
      );

      if (!obj)
         return new ResultModel<Participant>(false, ['participant not found']);


      return new ResultModel<Participant>(true, null, obj);
   }

   async getById(id: string): Promise<ResultModel<Participant>> {
      const obj = await this.repository.findOne(
         {
            where: { id }, relations: ['addresses', 'pdvGroup', 'user']
         },
      );

      if (!obj) return new ResultModel<Participant>(false, ['participant not found']);

      return new ResultModel<Participant>(true, null, obj);
   }

   async createMultiples(
      participantImport: ParticipantImportDto,
      userId: string,
      campaignId: string,
   ): Promise<ResultModel<ParticipantReadDto[]>> {
      const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });

      if (!campaign) throw new BadRequestException('campaign not found');

      const userImport = await this.createUserImport(participantImport, userId);

      const list: ParticipantReadDto[] = [];

      const jobTitles = await this.jobTitleRepository.find();

      const groups = await this.pdvGroupRepository.find();

      const roles = await this.roleRepository.find();

      const userImp = await this.userRepository.findOne({
         where: { id: userId },
      });

      const pdvs = await this.pdvRepository.find({
         relations: ['pdvGroup'],
      });

      this.connection.transaction(async () => {
         for (const item of participantImport.items) {
            let pdv = pdvs.find((x) => x.registrationNumber === item.cnpjLoja);

            let group = groups.find((x) => x.name === item.rede);

            if (!group && item.rede != '' && item.rede != null) {
               group = new PdvGroup();
               group.id = uuid();
               group.name = item.rede;
               group.createdAt = new Date();
               group.userCreated = userImp;
               group = await this.pdvGroupRepository.save(group);
               groups.push(group);
            }

            if (!pdv && item.nomeLoja != '' && item.nomeLoja != null) {
               pdv = new Pdv();
               pdv.id = uuid();
               pdv.name = item.nomeLoja;
               pdv.registrationNumber = item.cnpjLoja;
               pdv.pdvGroup = group;
               pdv.createdAt = new Date();
               pdv.userCreated = userImp;
               pdv = await this.pdvRepository.save(pdv);
               pdvs.push(pdv);
            }

            const userP = await this.userRepository.findOne({
               where: { email: item.email },
               relations: ['participant'],
            });

            let participant = null;

            if (userP) {
               participant = await this.repository.findOne({
                  where: { id: userP.participant.id },
               });

            }

            if (!participant) {
               participant = new Participant();
               participant.id = uuid();
               participant.createdAt = new Date();
               participant.userCreated = userImp;
            } else {
               participant.updatedAt = new Date();
               participant.userUpdated = userImp;
            }

            participant.name = item.nome;
            participant.nickname = item.nome;
            participant.cpf = normalizeCpf(item.cpfParticipante);
            participant.mobile = item.telefoneCelular;
            participant.pdvGroup = group;
            participant.role = roles.find((x) => x.name === 'PARTICIPANTE');
            participant.jobTitle = jobTitles.find((x) => x.name === item.cargo);

            const obj = await this.repository.save(participant);

            const dto = obj
            dto.username = item.email;
            dto.email = item.email;

            const userDto = await this.userService.createParticipant(
               userImp,
               participant.role,
               dto,
            );

            await this.userCampaignService.create(
               userDto,
               userId,
               campaignId,
               pdv,
               true,
            );

            await this.userReferenceService.create(
               userImport,
               participantImport.reference,
               item,
               userDto,
               pdv,
               participant.jobTitle,
               userId,
            );

            await this.userPdvService.create(
               userDto,
               participantImport.reference,
               pdv,
               true,
               userId,
            );

            // await this.accountService.save(userDto.id, userId, campaignId);
            list.push(obj);
         }
      });

      return new ResultModel<ParticipantReadDto[]>(true, null, list);
   }

   async edit(userId: string, dto: ParticipantDto): Promise<ResultModel<void>> {
      const getParticipant = await this.getById(dto.id)
      const user = await this.userService.findById({ id: userId })

      if (!getParticipant) return new ResultModel<void>(false, ['participant not found']);

      const participant = getParticipant.data

      participant.name = dto.name;
      participant.phone = dto.phone;
      participant.mobile = dto.mobile;
      participant.nickname = dto.nickname;
      participant.dob = dto.dob;
      participant.updatedAt = new Date();
      participant.userUpdated = user.data
      participant.photoUrl = dto.photoUrl

      const obj = await this.repository.save(participant);

      if (dto.password) {
         await this.userService.resetPassword({
            id: user.data.id,
            password: dto.password,
            code: null
         })
      }

      if (dto.addresses) {
         for (const itemAddress of dto.addresses) {

            if (!itemAddress.id) {
               const address = new ParticipantAddress()

               address.id = uuid();
               address.city = itemAddress.address
               address.complement = itemAddress.complement
               address.district = itemAddress.district
               address.number = itemAddress.number
               address.country = itemAddress.country
               address.state = itemAddress.state
               address.zipCode = itemAddress.zipCode
               address.address = itemAddress.address
               address.description = itemAddress.description
               address.participant = obj;
               address.createdAt = new Date();
               address.userCreated = user.data

               const newAddress = await this.participantAddressRepository.save(address);
               dto.addresses.push(newAddress)

            } else {
               itemAddress.updatedAt = new Date();
               itemAddress.userUpdated = user.data

               await this.participantAddressRepository.save(itemAddress)
            }


         }
      }

      participant.addresses = dto.addresses
      await this.repository.save(participant)
      return new ResultModel<void>(true);
   }

   async createUserImport(
      participantImport: any,
      userId: string,
   ): Promise<UserImport> {

      const user = await this.userService.findById({ id: userId })

      const userImport = new UserImport();
      userImport.id = uuid();
      userImport.archive = participantImport.archive;
      userImport.pdv = await this.pdvRepository.findOne({
         where: { id: participantImport.pdvId },
      });
      if (participantImport.pdvId)
         userImport.pdv = await this.pdvRepository.findOne({
            where: { id: participantImport.pdvId },
         });
      if (participantImport.pdvGroupId)
         userImport.pdvGroup = await this.pdvGroupRepository.findOne({
            where: { id: participantImport.pdvGroupId },
         });

      userImport.reference = participantImport.reference;

      userImport.createdAt = new Date();
      userImport.userCreated = user.data

      return await this.userImportRepository.save(userImport);
   }

   async findByDates(options: any): Promise<ResultModel<any[]>> {
      const { dataInicial, dataFinal } = options;

      const query = this.repository
         .createQueryBuilder('p')
         .innerJoinAndSelect('p.user', 'u')
         .innerJoinAndSelect('p.pdvGroup', 'pg')
         .innerJoinAndSelect('u.userPdvs', 'up')
         .innerJoinAndSelect('u.userReferences', 'ur')
         .innerJoinAndSelect('up.pdv', 'pd')
         .innerJoinAndSelect('p.jobTitle', 'j')
         .innerJoinAndSelect('p.addresses', 'a')
         .leftJoinAndSelect('u.regulationAccepts', 'ra')
         .select('ur.reference', 'reference')
         .addSelect('pg.name', 'rede')
         .addSelect('pd.name', 'nomeLoja')
         .addSelect('pd.registrationNumber', 'cnpjLoja')
         .addSelect('p.id', 'IDParticipante')
         .addSelect('p.cpf', 'cpf')
         .addSelect('u.name', 'nome')
         .addSelect('j.name', 'cargo')
         .addSelect('u.email', 'email')
         .addSelect('p.email2', 'email2')
         .addSelect('u.status', 'status')
         .addSelect('p.mobile', 'mobile')
         .addSelect('p.mobile2', 'mobile2')
         .addSelect('a.zipCode', 'cep')
         .addSelect('a.address', 'endereco')
         .addSelect('a.number', 'numero')
         .addSelect('a.complement', 'complemento')
         .addSelect('a.district', 'bairro')
         .addSelect('a.city', 'cidade')
         .addSelect('a.state', 'estado')
         .addSelect('p.createdAt', 'cadastro')
         .addSelect('ra.createdAt', 'dataAceiteRegulamento')
         .where('p.deletedAt is null')
         .andWhere('ra.deletedAt is null')
         .andWhere('p.createdAt BETWEEN :dataInicial AND :dataFinal', {
            dataInicial,
            dataFinal,
         })
         .orderBy('ur.reference', 'DESC')
         .addOrderBy('u.name', 'ASC');

      return new ResultModel<any[]>(true, null, await query.getRawMany());
   }
}
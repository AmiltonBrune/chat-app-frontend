import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Participant, Role, UserCampaign, UserPushNotification } from '..';
import { UserPdv } from './userpdv.entity';
import { UserReference } from './userreference.entity';
import { UserRegulationAccept } from './userregulationaccept.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120, unique: true })
  username: string;

  @Column({ length: 120 })
  email: string;

  @Column({ length: 120 })
  emailVerifiedAt: string;

  @Column({ length: 100 })
  password: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  isModerator: number;

  @Column({ length: 100, nullable: true })
  codeForget: string;

  @OneToOne(() => Participant)
  @JoinColumn()
  participant: Participant;

  @OneToMany(() => UserCampaign, (userCampaign) => userCampaign.user)
  userCampaigns: UserCampaign[];

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @OneToMany(
    () => UserPushNotification,
    (pushNotificationCodes) => pushNotificationCodes.user,
  )
  pushNotificationCodes: UserPushNotification[];

  @OneToMany(() => UserPdv, (userPdvs) => userPdvs.user)
  userPdvs: UserPdv[];

  @Column({ length: 250 })
  externalPushNotificationCode: string;

  @Column()
  operationAt: Date;

  @Column({ length: 1000 })
  obsOperation: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userOperation: User;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userCreated: User;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userUpdated: User;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userDeleted: User;

  @OneToMany(
    () => UserRegulationAccept,
    (regulationAccept) => regulationAccept.user,
  )
  regulationAccepts: UserRegulationAccept[];

  @OneToMany(
    () => UserReference,
    (userReferences) => userReferences.user,
  )
  userReferences: UserReference[];
}

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../';

@Entity({ name: 'userpushnotification' })
export class UserPushNotification {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.userCampaigns)
  user: User;

  @Column()
  code: string;

  @Column()
  deviceAlias: string;

  @Column()
  createdAt: Date;

  @Column()
  userCreatedId: string;

  @ManyToOne(() => User, (user) => user.id)
  userCreated: User;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column()
  userUpdatedId: string;

  @ManyToOne(() => User, (user) => user.id)
  userUpdated: User;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column()
  userDeletedId: string;

  @ManyToOne(() => User, (user) => user.id)
  userDeleted: User;
}

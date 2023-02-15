import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User, Campaign } from '../';
import { AccountMoviment } from './accountmoviment.entity';

@Entity({ name: 'account' })
export class Account {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  campaign: Campaign;

  @Column()
  balance: number;

  @OneToMany(
    () => AccountMoviment,
    (accountMoviment) => accountMoviment.account,
  )
  accountMoviments: AccountMoviment[];

  @Column()
  active: boolean;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userCreated: User;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userUpdated: User;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userDeleted: User;
}

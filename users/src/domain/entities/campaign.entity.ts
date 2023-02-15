import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User, Client } from './';
// import { CampaignChannel } from './campaignchannel.entity';

@Entity({ name: 'campaign' })
export class Campaign {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @Column({ length: 60 })
  name: string;

  @Column({ length: 2000 })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  catalog: boolean;

  @Column({ default: true })
  checkout: boolean;

  @Column({ nullable: true })
  start: Date;

  @Column({ nullable: true })
  end: Date;

  // @OneToMany(
  //   () => CampaignChannel,
  //   (campaignChannel) => campaignChannel.campaign
  // )
  // campaignChannels: CampaignChannel[];

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  userCreated: User;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userUpdated: User;

  @Column({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  userDeleted: User;
}

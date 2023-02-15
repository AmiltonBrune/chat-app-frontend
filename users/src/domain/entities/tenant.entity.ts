import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Tenants {
  @PrimaryColumn()
  name: string;

  @Column()
  host: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  participantUrl?: string;

  @Column()
  user: string

  @Column()
  password: string

  @Column()
  isNew: boolean;
}

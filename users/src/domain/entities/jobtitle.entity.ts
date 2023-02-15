import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PdvGroup, User } from './';

@Entity({ name: 'jobtitle' })
export class JobTitle {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column()
  percentage: number;

  @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id)
  pdvGroup: PdvGroup;

  @Column()
  order: number;


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

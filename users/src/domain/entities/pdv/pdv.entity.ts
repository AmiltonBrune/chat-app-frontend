import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User, PdvGroup } from '../';

@Entity({ name: 'pdv' })
export class Pdv {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id)
  pdvGroup: PdvGroup;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120 })
  registrationNumber: string;

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

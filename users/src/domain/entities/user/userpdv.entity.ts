import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Pdv, User } from '../';

@Entity({ name: 'userpdv' })
export class UserPdv {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column()
  active: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Pdv, (pdv) => pdv.id)
  pdv: Pdv;

  @Column({ length: 6 })
  reference: string;

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

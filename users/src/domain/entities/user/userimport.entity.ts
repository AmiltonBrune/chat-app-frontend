import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Pdv, PdvGroup, User } from '..';

@Entity({ name: 'userimport' })
export class UserImport {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @ManyToOne(() => Pdv, (pdv) => pdv.id, { nullable: true })
  pdv: Pdv;

  @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id, { nullable: true })
  pdvGroup: PdvGroup;

  @Column({ length: 200, nullable: false })
  reference: string;

  @Column({ length: 200, nullable: false })
  archive: string;

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

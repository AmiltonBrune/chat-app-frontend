import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PdvGroup, Pdv, User, UserImport, JobTitle } from '../';

@Entity({ name: 'userreference' })
export class UserReference {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column({ nullable: true })
  reference: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.id)
  jobTitle: JobTitle;

  @ManyToOne(() => Pdv, (pdv) => pdv.id)
  pdv: Pdv;

  @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id)
  pdvGroup: PdvGroup;

  @ManyToOne(() => UserImport, (userImport) => userImport.id)
  userImport: UserImport;

  @Column({ nullable: true })
  userClientCode: string;

  @Column({ nullable: true })
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

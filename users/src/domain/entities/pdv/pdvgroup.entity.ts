import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User, PdvGroupBusinessCategory } from '../';

@Entity({ name: 'pdvgroup' })
export class PdvGroup {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 120 })
  corporateName: string;

  @Column({ length: 120 })
  socialSecurityNumber: string;

  @Column({ length: 60 })
  email: string;

  @ManyToOne(() => User, (user) => user.id)
  userSpreadsheet: User;

  @Column({ length: 60 })
  comercialPhone: string;

  @Column({ length: 60 })
  mobilePhone: string;

  @Column({ length: 120 })
  nameResponsibleTI: string;

  @Column({ length: 120 })
  phoneResponsibleTI: string;

  @Column({ length: 120 })
  mobilePhoneResponsibleTI: string;

  @Column({ length: 250 })
  registrationNumberResponsible: string;

  @Column({ length: 120 })
  nameResponsible: string;

  @Column()
  percDirector: number;

  @Column()
  percRegion: number;

  @Column()
  percManager: number;

  @Column()
  percSubManager: number;

  @OneToMany(
    () => PdvGroupBusinessCategory,
    (pdvGroupBusinessCategories) => pdvGroupBusinessCategories.pdvGroup,
  )
  pdvGroupBusinessCategories: PdvGroupBusinessCategory[];

  @Column({ length: 250, nullable: true })
  segment: string;

  @Column({ length: 1000, nullable: true })
  media: string;

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

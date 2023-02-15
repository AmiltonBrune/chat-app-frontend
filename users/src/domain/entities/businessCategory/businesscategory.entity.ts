import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User, PdvGroupBusinessCategory } from '../';

@Entity({ name: 'businesscategory' })
export class BusinessCategory {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @Column({ length: 250 })
  name: string;

  @Column({ length: 250 })
  icon: string;

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

  @OneToMany(
    () => PdvGroupBusinessCategory,
    (pdvGroupBusinessCategory) => pdvGroupBusinessCategory.businessCategory,
  )
  pdvGroups: PdvGroupBusinessCategory[];
}

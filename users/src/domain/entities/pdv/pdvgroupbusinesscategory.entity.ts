import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PdvGroup } from './pdvgroup.entity';
import { User, BusinessCategory } from '../';

@Entity({ name: 'pdvgroupbusinesscategory' })
export class PdvGroupBusinessCategory {
  @PrimaryColumn({ type: 'uuid', length: 120 })
  id: string;

  @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id)
  pdvGroup: PdvGroup;

  @ManyToOne(() => BusinessCategory, (businessCategory) => businessCategory.id)
  businessCategory: BusinessCategory;

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

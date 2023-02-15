import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User, Campaign, Pdv } from "../";

@Entity({ name: 'usercampaign' })
export class UserCampaign {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @Column()
    active: boolean;

    @ManyToOne(() => User, user => user.userCampaigns)
    user: User;

    @ManyToOne(() => Campaign, campaign => campaign.id)
    campaign: Campaign;

    @ManyToOne(() => Pdv, pdv => pdv.id, { nullable: true })
    pdv: Pdv;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.id)
    userCreated: User;

    @Column({ nullable: true })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.id)
    userUpdated: User;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.id)
    userDeleted: User;
}
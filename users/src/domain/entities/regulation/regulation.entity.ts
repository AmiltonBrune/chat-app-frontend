import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { RegulationAccept } from "./regulationaccept.entity";
import { User, Campaign } from "../";

@Entity({ name: 'regulation' })
export class Regulation {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Campaign, campaign => campaign.id)
    campaign: Campaign;

    @Column({ length: 200, nullable: true })
    description: string;

    @Column()
    text: string;

    @OneToMany(() => RegulationAccept, regulationAccept => regulationAccept.regulation)
    regulationAccepts: RegulationAccept[];

    // BASE 
    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.id)
    userCreated: User;

    @Column({ nullable: true })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.id, { nullable: true })
    userUpdated: User;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToOne(() => User, user => user.id, { nullable: true })
    userDeleted: User;

}
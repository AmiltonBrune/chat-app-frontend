import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { TermAccept } from "./termaccept.entity";
import { User, Campaign } from "../";

@Entity({ name: 'term' })
export class Term {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Campaign, campaign => campaign.id)
    campaign: Campaign;

    @Column({ length: 1 })
    type: string;

    @Column()
    text: string;

    @OneToMany(() => TermAccept, termAccept => termAccept.term)
    termAccepts: TermAccept[];

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
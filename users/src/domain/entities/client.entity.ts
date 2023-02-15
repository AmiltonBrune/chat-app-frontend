import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Campaign, User } from "./";

@Entity({ name: 'client' })
export class Client {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @Column({ length: 120 })
    name: string;

    @Column({ length: 20 })
    cnpj: string;

    @Column({ default: true })
    active: boolean;

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

    @OneToMany(() => Campaign, campaign => campaign.client)
    campaigns: Campaign[];

}

import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../";
import { Regulation } from "./regulation.entity";

@Entity({ name: 'regulationaccept' })
export class RegulationAccept {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Regulation, regulation => regulation.id)
    regulation: Regulation;

    @Column({ length: 200 })
    text: string;

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
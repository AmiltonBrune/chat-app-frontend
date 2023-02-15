import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "../";
import { Term } from "./term.entity";

@Entity({ name: 'termaccept' })
export class TermAccept {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Term, term => term.id)
    term: Term;

    @Column({ length: 200 })
    text: string;

    @Column({ length: 10 })
    opcional: string;

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

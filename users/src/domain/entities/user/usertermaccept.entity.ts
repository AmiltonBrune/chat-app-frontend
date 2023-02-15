import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User, TermAccept } from "../";

@Entity({ name: 'usertermaccept' })
export class UserTermAccept {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @ManyToOne(() => TermAccept, termAccept => termAccept.id)
    termAccept: TermAccept;

    @Column()
    status: boolean;

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
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User, RegulationAccept } from "../";

@Entity({ name: 'userregulationaccept' })
export class UserRegulationAccept {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @ManyToOne(() => RegulationAccept, regulationAccept => regulationAccept.id)
    regulationAccept: RegulationAccept;

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
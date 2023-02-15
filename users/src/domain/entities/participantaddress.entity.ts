import { Participant } from "./participant.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user/user.entity";

@Entity({ name: 'participantaddress' })
export class ParticipantAddress {

    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => Participant, participant => participant.id)
    participant: Participant;

    @Column({ length: 120 })
    description: string;

    @Column({ length: 20 })
    zipCode: string;

    @Column({ length: 120 })
    address: string;

    @Column({ length: 40 })
    number: string;

    @Column({ length: 80 })
    complement: string;

    @Column({ length: 80 })
    district: string;

    @Column({ length: 80 })
    city: string;

    @Column({ length: 80 })
    state: string;

    @Column({ length: 80 })
    country: string;

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
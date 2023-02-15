import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { User, PdvGroup, JobTitle, ParticipantAddress, Role } from "./";

@Entity({ name: 'participant' })
export class Participant {
    @PrimaryColumn({ type: 'uuid', length: 120 })
    id: string;

    @ManyToOne(() => PdvGroup, (pdvGroup) => pdvGroup.id)
    pdvGroup: PdvGroup;

    @ManyToOne(() => JobTitle, (jobTitle) => jobTitle.id)
    jobTitle: JobTitle;

    @Column({ length: 120 })
    name: string;

    @Column({ length: 120 })
    nickname: string;

    @Column({ length: 20, nullable: true })
    cpf: string;

    @Column({ length: 120, nullable: true })
    email2: string;

    @Column({ nullable: true })
    age: number;

    @Column({ length: 120, nullable: true })
    instagram: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ nullable: true })
    mobile2: string;

    @ManyToOne(() => Role, (role) => role.id)
    role: Role;

    @Column({ length: 100, nullable: true })
    photoUrl: string;

    @OneToMany(
        () => ParticipantAddress,
        (participantAddress) => participantAddress.participant,
    )
    addresses?: ParticipantAddress[];

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    dob: Date;

    @OneToOne(() => User, (user) => user.participant)
    user: User;

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